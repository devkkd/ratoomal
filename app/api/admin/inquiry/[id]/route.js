import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import { sendEmail } from "@/lib/mailer";
import {
  inquiryApprovedTemplate,
  inquiryRejectedTemplate,
} from "@/lib/emailTemplates";

// GET SINGLE
export async function GET(request, context) {
  await connectDB();

  const { id } = context.params; // ✅ same flow

  const inquiry = await Inquiry
    .findById(id)
    .populate("product");

  return NextResponse.json({
    success: true,
    data: inquiry,
  });
}

// UPDATE
export async function PATCH(request, context) {
  try {
    await connectDB();

    const { id } = context.params;
    const body = await request.json();

    console.log("📝 Updating inquiry:", id, "Status:", body.status);

    const updated = await Inquiry.findByIdAndUpdate(id, body, {
      new: true,
    }).populate("product");

    if (!updated) {
      return NextResponse.json({
        success: false,
        message: "Inquiry not found",
      }, { status: 404 });
    }

    console.log("✅ Inquiry updated. Email:", updated.email);

    // Send email notification to user when status is updated
    if (body.status === "approved" || body.status === "rejected") {
      try {
        if (!updated.email) {
          console.error("⚠️ EMAIL MISSING - Cannot send email without recipient");
          return NextResponse.json({
            success: true,
            data: updated,
            warning: "Email not sent - user email missing",
          });
        }

        const email = body.status === "approved" 
          ? inquiryApprovedTemplate(updated)
          : inquiryRejectedTemplate(updated);

        console.log(`📧 SENDING INQUIRY ${body.status.toUpperCase()} MAIL TO:`, updated.email);
        console.log("Subject:", email.subject);

        await sendEmail({
          to: updated.email,
          subject: email.subject,
          html: email.html,
        });

        console.log(`✅ INQUIRY ${body.status.toUpperCase()} MAIL SENT SUCCESSFULLY`);
      } catch (emailErr) {
        console.error("❌ EMAIL SEND ERROR:", {
          error: emailErr.message,
          stack: emailErr.stack,
          email: updated.email,
        });

        // Still return success but log the email error
        return NextResponse.json({
          success: true,
          data: updated,
          emailError: emailErr.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error("❌ PATCH REQUEST ERROR:", {
      error: err.message,
      stack: err.stack,
    });
    
    return NextResponse.json({
      success: false,
      message: err.message,
    }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request, context) {
  await connectDB();

  const { id } = context.params;

  await Inquiry.findByIdAndDelete(id);

  return NextResponse.json({
    success: true,
    message: "Inquiry deleted",
  });
}
    