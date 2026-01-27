import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import User from "@/models/User";
import { sendEmail } from "@/lib/mailer";
import { adminNewInquiryTemplate } from "@/lib/emailTemplates";

// CREATE INQUIRY
export async function POST(request) {
  await connectDB();

  const body = await request.json();
  
  // Extract userEmail from body to fetch user details
  const { userEmail, products, ...inquiryData } = body;
  
  let userDetails = null;
  
  // If userEmail is provided, fetch user details
  if (userEmail) {
    try {
      userDetails = await User.findOne({ businessEmail: userEmail }).select('-password');
      console.log("User details found:", userDetails ? "Yes" : "No");
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }
  
  // Process products to combine same products with different sizes
  const processedProducts = [];
  
  if (products && products.length > 0) {
    const productMap = new Map();
    
    products.forEach(product => {
      const key = product.productId;
      
      if (productMap.has(key)) {
        // Product already exists, combine quantities and sizes
        const existing = productMap.get(key);
        existing.quantity += product.quantity;
        existing.selectedSizes = [...new Set([...existing.selectedSizes, ...product.selectedSizes])];
      } else {
        // New product
        productMap.set(key, {
          productId: product.productId,
          quantity: product.quantity,
          selectedSizes: [...product.selectedSizes]
        });
      }
    });
    
    // Convert map back to array
    processedProducts.push(...productMap.values());
  }
  
  // Create inquiry with user details if found
  const inquiryPayload = {
    ...inquiryData,
    products: processedProducts,
    // If user details found, store them
    ...(userDetails && {
      userDetails: {
        userId: userDetails._id,
        companyName: userDetails.companyName,
        contactName: userDetails.contactName,
        email: userDetails.businessEmail,
        country: userDetails.country,
        phone: userDetails.phone,
        businessType: userDetails.businessType,
        purpose: userDetails.purpose
      }
    })
  };

  const inquiry = await Inquiry.create(inquiryPayload);

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
