// /lib/mailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(to, token) {
  const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verifyUrl = `${origin}/api/auth/verify/${token}`;

  const html = `
    <p>Bonjour,</p>
    <p>Cliquez sur le lien ci-dessous pour vérifier votre adresse email :</p>
    <p><a href="${verifyUrl}">${verifyUrl}</a></p>
    <p>Ce lien expire dans ${
      process.env.VERIFICATION_TOKEN_EXPIRES_HOURS || 24
    } heures.</p>
  `;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject: "Vérification de votre adresse email",
    html,
  });
}
