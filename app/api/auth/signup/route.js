import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

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

    // Handle image upload to Cloudinary
    const verificationImage = formData.get("verificationImage");
    let cloudinaryResponse = null;
    
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
        // Convert file to base64 for Cloudinary upload
        const bytes = await verificationImage.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64String = buffer.toString('base64');
        const dataURI = `data:${verificationImage.type};base64,${base64String}`;

        // Upload to Cloudinary
        cloudinaryResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            dataURI,
            {
              folder: "business-verifications",
              resource_type: "auto",
              public_id: `verification_${Date.now()}_${userData.businessEmail.split('@')[0]}`,
              transformation: [
                { quality: "auto:good" },
                { fetch_format: "auto" }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
        });

        // Add Cloudinary URL to userData
        userData.verificationImage = cloudinaryResponse.secure_url;

      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
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

    // 📩 Send email notification to admin (optional)
    // await sendVerificationEmailToAdmin(user);

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