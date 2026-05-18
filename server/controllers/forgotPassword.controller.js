const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { sendEmail } = require('../middlewares/email.service');

// In-memory token store (production: use Redis or DB table)
const resetTokens = new Map();

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });

    // SECURITY: Always return same message — don't reveal if email exists
    const genericMessage = 'If that email exists, a reset link has been sent.';

    if (!user) return res.json({ success: true, message: genericMessage });

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 30 * 60 * 1000; // 30 minutes

    // Store token (keyed by email)
    resetTokens.set(token, { userId: user.id, email: user.email, expires });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    // Send email
    await sendEmail(user.email, {
      subject: '🔐 Reset Your Zidra Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px; border-radius: 8px;">
          <div style="background: linear-gradient(135deg, #1e40af, #7c3aed); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Reset Your Password</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="color: #4b5563;">Hi <strong>${user.name}</strong>,</p>
            <p style="color: #4b5563; line-height: 1.6;">You requested a password reset for your Zidra account. Click the button below to reset it.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background: #1e40af; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Reset Password →</a>
            </div>
            <p style="color: #9ca3af; font-size: 13px;">This link expires in <strong>30 minutes</strong>. If you didn't request this, ignore this email.</p>
            <p style="color: #d1d5db; font-size: 11px; word-break: break-all;">Or copy: ${resetLink}</p>
          </div>
        </div>
      `
    }).catch(() => {});

    res.json({ success: true, message: genericMessage });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required.' });
    }

    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({ success: false, message: 'Password must be 8-128 characters.' });
    }

    // Validate token
    const tokenData = resetTokens.get(token);
    if (!tokenData) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset link.' });
    }

    if (Date.now() > tokenData.expires) {
      resetTokens.delete(token);
      return res.status(400).json({ success: false, message: 'Reset link has expired. Please request a new one.' });
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.update({ password: hashedPassword }, { where: { id: tokenData.userId } });

    // Delete used token
    resetTokens.delete(token);

    res.json({ success: true, message: 'Password reset successfully! You can now log in.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/verify-reset-token?token=xxx
exports.verifyResetToken = async (req, res) => {
  const { token } = req.query;
  const tokenData = resetTokens.get(token);

  if (!tokenData || Date.now() > tokenData.expires) {
    return res.json({ success: false, valid: false, message: 'Invalid or expired token.' });
  }

  res.json({ success: true, valid: true });
};
