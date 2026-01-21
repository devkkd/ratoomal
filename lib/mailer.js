import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, html }) {
  try {
    // Validate email configuration
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email configuration is incomplete. Check environment variables.");
    }

    // Validate recipient email
    if (!to || !to.includes("@")) {
      throw new Error(`Invalid recipient email: ${to}`);
    }

    console.log(`📧 Attempting to send email to: ${to}`);

    const result = await transporter.sendMail({
      from: `"Business Access" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent successfully:`, {
      messageId: result.messageId,
      to: to,
      subject: subject,
    });

    return result;
  } catch (error) {
    console.error("❌ Email sending failed:", {
      error: error.message,
      to: to,
      subject: subject,
      stack: error.stack,
    });
    throw error;
  }
}
