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

    // 📩 Send confirmation email to user
    try {
      console.log("🔄 Attempting to send user confirmation email...");
      console.log("📧 User email:", user.businessEmail);
      
      const { sendEmail } = await import("@/lib/mailer");
      
      const userEmailSubject = "Your Business Access Request is Being Processed - Ratoomal";
      const userEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #C18E4D; margin-bottom: 10px;">Thank You for Your Registration!</h1>
              <p style="color: #666; font-size: 16px;">Your business access request is being processed</p>
            </div>
            
            <div style="background-color: #FFF6EB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #2D2D2D; margin-bottom: 15px;">Registration Details</h3>
              <p><strong>Company Name:</strong> ${user.companyName}</p>
              <p><strong>Contact Person:</strong> ${user.contactName}</p>
              <p><strong>Business Email:</strong> ${user.businessEmail}</p>
              <p><strong>Country:</strong> ${user.country}</p>
              <p><strong>Business Type:</strong> ${user.businessType}</p>
              <p><strong>Purpose:</strong> ${user.purpose}</p>
            </div>
            
            <div style="background-color: #E8F4FD; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #2D2D2D; margin-bottom: 15px;">What Happens Next?</h3>
              <ul style="color: #333; line-height: 1.8; padding-left: 20px;">
                <li>Our team will review your business verification documents</li>
                <li>We'll verify your business credentials and requirements</li>
                <li>You'll receive an approval email within 24-48 hours</li>
                <li>Once approved, you can access our B2B portal and product catalog</li>
                <li>Our representative will contact you to discuss your business needs</li>
              </ul>
            </div>
            
            <div style="background-color: #FFF9E6; padding: 15px; border-left: 4px solid #C18E4D; margin-bottom: 20px;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                <strong>⏱️ Processing Time:</strong> Your request is currently under review. 
                Our team typically processes applications within 24-48 business hours.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
                Need immediate assistance? Contact us at:
              </p>
              <p style="color: #C18E4D; font-weight: bold; margin: 5px 0;">
                Email: ${process.env.ADMIN_EMAIL || 'info@ratoomal.com'}
              </p>
              <p style="color: #C18E4D; font-weight: bold; margin: 5px 0;">
                Website: https://ratoomal.com
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #999; font-size: 12px;">
                This is an automated confirmation email. Please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `;
      
      await sendEmail({
        to: user.businessEmail,
        subject: userEmailSubject,
        html: userEmailHtml,
      });
      
      console.log("✅ User confirmation email sent successfully to:", user.businessEmail);
    } catch (emailError) {
      console.error("❌ Failed to send user confirmation email:", {
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