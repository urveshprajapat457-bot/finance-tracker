require('dotenv').config();
const nodemailer = require('nodemailer');

const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  if (!user || !pass) {
    throw new Error('Missing email configuration in environment variables: EMAIL_USER and EMAIL_PASS are required');
  }

  console.log('[Email Service] Creating Gmail transporter for user:', user);

  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    logger: true,
    debug: true,
  });
};

const sendResetEmail = async (user, token) => {
  const transporter = createTransporter();

  try {
    console.log('[Email Service] Verifying Gmail transporter configuration');
    await transporter.verify();
    console.log('[Email Service] Gmail transporter is ready');
  } catch (verifyError) {
    console.error('[Email Service] Transporter verification failed:', verifyError.code || verifyError.message || verifyError);
    throw new Error('Email transporter verification failed. Check your Gmail credentials and App Password.');
  }

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/reset-password/${token}`;
  console.log('[Email Service] Password reset URL:', resetUrl);

  const mailOptions = {
    from,
    to: user.email,
    subject: 'FinFlow Password Reset',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>Password reset request</h2>
        <p>Hello ${user.name || 'FinFlow user'},</p>
        <p>We received a request to reset your password. Click the button below to choose a new password.</p>
        <p><a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#2563eb;color:#ffffff;border-radius:8px;text-decoration:none;">Reset Password</a></p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all;"><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    console.log('[Email Service] Sending password reset email to', user.email);
    const result = await transporter.sendMail(mailOptions);
    console.log('[Email Service] Email send result:', result.response || result.messageId);
  } catch (sendError) {
    console.error('[Email Service] Failed to send reset email:', sendError.code || sendError.response || sendError.message || sendError);
    throw new Error('Failed to send password reset email. Check Gmail settings, App Password, and network connectivity.');
  }
};

module.exports = { sendResetEmail };
