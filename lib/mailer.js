import nodemailer from "nodemailer";

/**
 * Admin transporter — BigRock SMTP (ratoomal@ratoomals.com)
 * Reliable for same-domain delivery to ADMIN_EMAIL
 */
function createAdminTransporter() {
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
 * Client transporter — Gmail SMTP (webratoomals@gmail.com)
 * Reliable for external delivery to client Gmail/Yahoo/etc.
 */
function createClientTransporter() {
  const port = parseInt(process.env.CLIENT_EMAIL_PORT || "587");
  return nodemailer.createTransport({
    host: process.env.CLIENT_EMAIL_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: {
      user: process.env.CLIENT_EMAIL_USER,
      pass: process.env.CLIENT_EMAIL_PASS,
    },
  });
}

/**
 * Send email to ADMIN — uses BigRock SMTP
 */
export async function sendEmail({ to, subject, html }) {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Admin email config incomplete. Check EMAIL_HOST, EMAIL_USER, EMAIL_PASS");
  }
  if (!to || !to.includes("@")) {
    throw new Error(`Invalid recipient: ${to}`);
  }

  const transporter = createAdminTransporter();
  console.log(`📧 [Admin SMTP] Sending → ${to} | ${subject}`);

  const result = await transporter.sendMail({
    from: `"Ratoomal" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log(`✅ [Admin SMTP] Sent | messageId: ${result.messageId}`);
  return result;
}

/**
 * Send confirmation email to CLIENT — uses Gmail SMTP
 * Falls back to admin SMTP if Gmail config is missing
 */
export async function sendClientEmail({ to, subject, html }) {
  if (!to || !to.includes("@")) {
    throw new Error(`Invalid recipient: ${to}`);
  }

  // Use Gmail if configured, otherwise fall back to BigRock
  const hasGmail = process.env.CLIENT_EMAIL_USER && process.env.CLIENT_EMAIL_PASS;
  const transporter = hasGmail ? createClientTransporter() : createAdminTransporter();
  const fromEmail = hasGmail ? process.env.CLIENT_EMAIL_USER : process.env.EMAIL_USER;
  const smtpLabel = hasGmail ? "Gmail SMTP" : "BigRock SMTP (fallback)";

  console.log(`📧 [${smtpLabel}] Sending → ${to} | ${subject}`);

  const result = await transporter.sendMail({
    from: `"Ratoomal" <${fromEmail}>`,
    to,
    subject,
    html,
  });

  console.log(`✅ [${smtpLabel}] Sent | messageId: ${result.messageId}`);
  return result;
}
