import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import { sendEmail } from "@/lib/mailer";
import { adminNewInquiryTemplate } from "@/lib/emailTemplates";

// CREATE INQUIRY
export async function POST(request) {
  await connectDB();

  const body = await request.json();

  const inquiry = await Inquiry.create(body);

  // Populate product details for email
  await inquiry.populate("product");

  // Send email to admin about new inquiry
  try {
    const email = adminNewInquiryTemplate(inquiry);

    console.log("SENDING NEW INQUIRY NOTIFICATION TO ADMIN");

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: email.subject,
      html: email.html,
    });

    console.log("INQUIRY ADMIN NOTIFICATION SENT ✅");
  } catch (err) {
    console.error("INQUIRY ADMIN EMAIL SEND FAILED ❌", err);
  }

  return NextResponse.json({
    success: true,
    data: inquiry,
  });
}

// GET ALL INQUIRIES (Admin)
export async function GET() {
  await connectDB();

  const inquiries = await Inquiry
    .find()
    .populate("product")
    .sort({ createdAt: -1 });

  return NextResponse.json({
    success: true,
    data: inquiries,
  });
}
