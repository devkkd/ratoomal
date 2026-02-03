import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/cloudflare-r2";

export async function POST(req) {
  await connectDB();

  try {
    const formData = await req.formData();
    
    // Extract form fields
    const userData = {
      companyName: formData.get("companyName"),
      contactName: formData.get("contactName"),
      businessEmail: formData.get("businessEmail"),
      country: formData.get("country"),
      phone: formData.get("phone"),
      businessType: formData.get("businessType"),
      purpose: formData.get("purpose"),
      verificationProof: formData.get("verificationProof"),
    };

    // Validate required fields
    const requiredFields = [
      "companyName",
      "contactName",
      "businessEmail",
      "country",
      "phone",
      "businessType",
      "purpose",
      "verificationProof"
    ];

    const missingFields = requiredFields.filter(field => !userData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          message: "Please fill all required fields",
          missingFields 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(userData.businessEmail)) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ businessEmail: userData.businessEmail });
    if (existingUser) {
      return NextResponse.json(
        { message: "A business with this email is already registered" },
        { status: 409 }
      );
    }

    // Handle image upload to R2
    const verificationImage = formData.get("verificationImage");
    let r2Response = null;
    
    if (verificationImage && verificationImage.size > 0) {
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (verificationImage.size > maxSize) {
        return NextResponse.json(
          { message: "File size too large. Maximum size is 5MB." },
          { status: 400 }
        );
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(verificationImage.type)) {
        return NextResponse.json(
          { message: "Invalid file type. Only JPG, PNG, and PDF are allowed." },
          { status: 400 }
        );
      }

      try {
        // Convert file to buffer for R2 upload
        const bytes = await verificationImage.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate unique filename
        const timestamp = Date.now();
        const emailPrefix = userData.businessEmail.split('@')[0];
        const fileName = `verification_${timestamp}_${emailPrefix}.${verificationImage.name.split('.').pop()}`;

        // Upload to R2
        r2Response = await uploadToR2(buffer, fileName, verificationImage.type, "business-verifications");

        // Add R2 URL to userData
        userData.verificationImage = r2Response.secure_url;

      } catch (uploadError) {
        console.error("R2 upload error:", uploadError);
        return NextResponse.json(
          { message: "Failed to upload verification image. Please try again." },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "Verification image is required" },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({
      ...userData,
      role: "user",
      status: "pending",
    });

    // 📩 Send email notification to admin
    try {
      console.log("🔄 Attempting to send admin notification email...");
      console.log("📧 Admin email:", process.env.ADMIN_EMAIL);
      console.log("📧 Email user:", process.env.EMAIL_USER);
      console.log("📧 Email host:", process.env.EMAIL_HOST);
      
      const { sendEmail } = await import("@/lib/mailer");
      const { adminNewUserTemplate } = await import("@/lib/emailTemplates");
      
      const emailTemplate = adminNewUserTemplate(user);
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
      
      console.log("✅ Admin notification email sent successfully");
    } catch (emailError) {
      console.error("❌ Failed to send admin notification email:", {
        message: emailError.message,
        stack: emailError.stack,
        code: emailError.code,
        command: emailError.command
      });
      // Don't fail the signup if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Business verification request submitted successfully!",
      data: {
        id: user._id,
        companyName: user.companyName,
        email: user.businessEmail,
        status: user.status,
        submittedAt: user.createdAt,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Signup error:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "A business with this email is already registered" },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}