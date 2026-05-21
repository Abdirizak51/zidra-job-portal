const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sendEmail, emailTemplates } = require('../middlewares/email.service');

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // SECURITY: Strict input length limits
    if (!name || name.length > 100) {
      return res.status(400).json({ success: false, message: 'Invalid name.' });
    }
    if (!email || email.length > 150) {
      return res.status(400).json({ success: false, message: 'Invalid email.' });
    }
    if (!password || password.length > 128) {
      return res.status(400).json({ success: false, message: 'Invalid password.' });
    }

    // SECURITY: Only allow applicant or employer — never admin via API
    const allowedRoles = ['applicant', 'employer'];
    const userRole = allowedRoles.includes(role) ? role : 'applicant';

    // Check existing user
    const existingUser = await User.scope('withPassword').findOne({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: userRole
    });

    sendEmail(email, emailTemplates.welcome(name)).catch(() => {});

    const token = generateToken(user.id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // SECURITY: Input length limits
    if (!email || email.length > 150 || !password || password.length > 128) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = await User.scope('withPassword').findOne({
      where: { email: email.toLowerCase().trim() }
    });

    // SECURITY: Always run bcrypt even if user not found — prevents timing attacks
    // that could reveal whether an email exists in the system
    const dummyHash = '$2a$12$dummyhashfordummycompare.dummydummydummydummydummydumm';
    const passwordToCheck = user ? user.password : dummyHash;
    const isMatch = await bcrypt.compare(password, passwordToCheck);

    if (!user || !isMatch) {
      // SECURITY: Same message for both cases — no user enumeration
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Account deactivated. Contact support.' });
    }

    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar_url: user.avatar_url
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // SECURITY: Input validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both passwords are required.' });
    }
    if (newPassword.length < 6 || newPassword.length > 128) {
      return res.status(400).json({ success: false, message: 'New password must be 8-128 characters.' });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({ success: false, message: 'New password must be different.' });
    }

    const user = await User.scope('withPassword').findByPk(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.update({ password: hashedPassword }, { where: { id: req.user.id } });

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
};
