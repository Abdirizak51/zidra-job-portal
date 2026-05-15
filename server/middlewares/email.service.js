const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const emailTemplates = {
  welcome: (name) => ({
    subject: '🎉 Welcome to Zidra Job Portal!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px; border-radius: 8px;">
        <div style="background: linear-gradient(135deg, #1e40af, #7c3aed); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Zidra Job Portal</h1>
          <p style="color: #bfdbfe; margin: 5px 0 0;">Connecting Talent with Opportunity</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1e40af;">Welcome, ${name}! 👋</h2>
          <p style="color: #4b5563; line-height: 1.6;">Your account has been successfully created on Zidra Job Portal. We're excited to have you on board!</p>
          <p style="color: #4b5563; line-height: 1.6;">Start exploring thousands of job opportunities tailored just for you.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}" style="background: #1e40af; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold;">Explore Jobs →</a>
          </div>
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">© 2024 Zidra Job Portal. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  applicationConfirmation: (applicantName, jobTitle, companyName) => ({
    subject: `✅ Application Submitted - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px; border-radius: 8px;">
        <div style="background: linear-gradient(135deg, #1e40af, #7c3aed); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Application Submitted!</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1e40af;">Hi ${applicantName},</h2>
          <p style="color: #4b5563; line-height: 1.6;">Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been successfully submitted.</p>
          <div style="background: #eff6ff; border-left: 4px solid #1e40af; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af; font-weight: bold;">What's next?</p>
            <p style="margin: 5px 0 0; color: #4b5563;">The employer will review your application and reach out if you're selected for the next step.</p>
          </div>
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">© 2024 Zidra Job Portal.</p>
        </div>
      </div>
    `
  }),

  applicationStatus: (applicantName, jobTitle, status, notes) => ({
    subject: `📋 Application Update - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px; border-radius: 8px;">
        <div style="background: ${status === 'accepted' ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #dc2626, #ef4444)'}; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">${status === 'accepted' ? '🎉 Congratulations!' : '📋 Application Update'}</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1f2937;">Hi ${applicantName},</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Your application for <strong>${jobTitle}</strong> has been 
            <strong style="color: ${status === 'accepted' ? '#059669' : '#dc2626'}">${status}</strong>.
          </p>
          ${notes ? `<div style="background: #f9fafb; padding: 15px; border-radius: 4px; margin: 20px 0;"><p style="margin: 0; color: #4b5563;"><strong>Message from employer:</strong> ${notes}</p></div>` : ''}
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">© 2024 Zidra Job Portal.</p>
        </div>
      </div>
    `
  })
};

const sendEmail = async (to, template) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('📧 Email not configured, skipping email send');
    return { success: false, message: 'Email not configured' };
  }

  try {
    const transporter = createTransporter();
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `Zidra Job Portal <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: template.html
    });
    console.log(`✅ Email sent to ${to}: ${result.messageId}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail, emailTemplates };
