// /lib/mailer.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // true pour 465, false pour 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Envoie un email de vérification
 * @param {string} to - email du destinataire
 * @param {string} token - token de vérification
 */
export async function sendVerificationEmail(to, token) {
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const verifyUrl = `${origin}/api/auth/verify/${token}`;

  const html = `
    <p>Hello,</p>
    <p>Click the link below to verify your email address:</p>
    <p><a href="${verifyUrl}">${verifyUrl}</a></p>
    <p>This link expires in ${process.env.VERIFICATION_TOKEN_EXPIRES_HOURS || 24} hours.</p>
  `;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject: 'Email Verification',
    html,
  });
}
