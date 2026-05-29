import nodemailer from "nodemailer";

/**
 * BigRock SMTP transporter — ratoomal@ratoomals.com
 * Used for BOTH admin notifications AND client confirmation emails
 */
function createTransporter() {
  const port = parseInt(process.env.EMAIL_PORT || "465");
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
}

/**
 * Send email to ADMIN — BigRock SMTP
 */
export async function sendEmail({ to, subject, html }) {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email config incomplete. Check EMAIL_HOST, EMAIL_USER, EMAIL_PASS");
  }
  if (!to || !to.includes("@")) {
    throw new Error(`Invalid recipient: ${to}`);
  }

  const transporter = createTransporter();
  console.log(`📧 [BigRock SMTP] Sending → ${to} | ${subject}`);

  const result = await transporter.sendMail({
    from: `"Ratoomal" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log(`✅ [BigRock SMTP] Sent | messageId: ${result.messageId}`);
  return result;
}

/**
 * Send confirmation email to CLIENT — also uses BigRock SMTP
 * ratoomal@ratoomals.com se client ke pass jayegi
 */
export async function sendClientEmail({ to, subject, html }) {
  if (!to || !to.includes("@")) {
    throw new Error(`Invalid recipient: ${to}`);
  }

  const transporter = createTransporter();
  console.log(`📧 [BigRock SMTP → Client] Sending → ${to} | ${subject}`);

  const result = await transporter.sendMail({
    from: `"Ratoomal" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log(`✅ [BigRock SMTP → Client] Sent | messageId: ${result.messageId}`);
  return result;
}
