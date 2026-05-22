import { NextResponse } from "next/server";

export async function GET() {
  const config = {
    // Admin SMTP
    EMAIL_HOST: process.env.EMAIL_HOST || "❌ NOT SET",
    EMAIL_PORT: process.env.EMAIL_PORT || "❌ NOT SET",
    EMAIL_USER: process.env.EMAIL_USER || "❌ NOT SET",
    EMAIL_PASS: process.env.EMAIL_PASS ? "✅ SET (***" + process.env.EMAIL_PASS.slice(-3) + ")" : "❌ NOT SET",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "❌ NOT SET",
    // Client Gmail SMTP
    CLIENT_EMAIL_HOST: process.env.CLIENT_EMAIL_HOST || "❌ NOT SET",
    CLIENT_EMAIL_PORT: process.env.CLIENT_EMAIL_PORT || "❌ NOT SET",
    CLIENT_EMAIL_USER: process.env.CLIENT_EMAIL_USER || "❌ NOT SET",
    CLIENT_EMAIL_PASS: process.env.CLIENT_EMAIL_PASS ? "✅ SET (***" + process.env.CLIENT_EMAIL_PASS.slice(-3) + ")" : "❌ NOT SET",
  };

  // Try sending a test client email
  try {
    const { sendClientEmail } = await import("@/lib/mailer");
    await sendClientEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "✅ Client Email Test - " + new Date().toLocaleTimeString(),
      html: `<h2>Client Email Test</h2><p>Sent at ${new Date().toLocaleString()}</p><pre>${JSON.stringify(config, null, 2)}</pre>`,
    });
    return NextResponse.json({ success: true, message: "Client email sent!", config });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message, config }, { status: 500 });
  }
}
