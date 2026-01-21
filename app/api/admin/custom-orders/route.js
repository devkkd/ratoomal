// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import CustomOrder from "@/models/CustomOrder";

// // CREATE Custom Order
// export async function POST(req) {
//   try {
//     await connectDB();
//     const data = await req.json();

//     const order = await CustomOrder.create(data);

//     return NextResponse.json(
//       { success: true, data: order },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

// // GET All Custom Orders (Admin)
// export async function GET() {
//   try {
//     await connectDB();

//     const orders = await CustomOrder.find().sort({ createdAt: -1 });

//     return NextResponse.json(
//       { success: true, data: orders },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }


// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import CustomOrder from "@/models/CustomOrder";

// // CREATE Custom Order
// export async function POST(req) {
//   try {
//     await connectDB();
//     const data = await req.json();

//     // Set default status
//     const orderData = {
//       ...data,
//       status: "pending" // Changed from "new" to "pending" to match frontend
//     };

//     const order = await CustomOrder.create(orderData);

//     return NextResponse.json(
//       { success: true, data: order },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

// // GET All Custom Orders (Admin) with filtering and pagination
// export async function GET(req) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const status = searchParams.get('status') || 'all';
//     const search = searchParams.get('search') || '';
//     const page = parseInt(searchParams.get('page')) || 1;
//     const limit = parseInt(searchParams.get('limit')) || 10;
//     const skip = (page - 1) * limit;

//     // Build query
//     let query = {};

//     // Filter by status
//     if (status !== 'all') {
//       query.status = status;
//     }

//     // Search filter
//     if (search) {
//       query.$or = [
//         { companyName: { $regex: search, $options: 'i' } },
//         { contactPersonName: { $regex: search, $options: 'i' } },
//         { businessEmail: { $regex: search, $options: 'i' } },
//         { phone: { $regex: search, $options: 'i' } }
//       ];
//     }

//     // Get total count for pagination
//     const total = await CustomOrder.countDocuments(query);
//     const pages = Math.ceil(total / limit);

//     // Get orders with pagination
//     const orders = await CustomOrder.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     return NextResponse.json({
//       success: true,
//       orders,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages
//       }
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CustomOrder from "@/models/CustomOrder";
import cloudinary from "@/lib/cloudinary";
import { sendEmail } from "@/lib/mailer";
import { adminNewCustomOrderTemplate } from "@/lib/emailTemplates";

// CREATE Custom Order (POST)
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const order = await CustomOrder.create({
      ...body,
      status: "pending",
    });

    // Send email to admin about new custom order
    try {
      const email = adminNewCustomOrderTemplate(order);

      console.log("SENDING NEW CUSTOM ORDER NOTIFICATION TO ADMIN");

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: email.subject,
        html: email.html,
      });

      console.log("CUSTOM ORDER ADMIN NOTIFICATION SENT ✅");
    } catch (err) {
      console.error("CUSTOM ORDER ADMIN EMAIL SEND FAILED ❌", err);
    }

    return NextResponse.json(
      { success: true, data: order },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// GET All Custom Orders (GET) with filtering and pagination
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Filter by status
    if (status !== 'all') {
      query.status = status;
    }

    // Search filter
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { contactPersonName: { $regex: search, $options: 'i' } },
        { businessEmail: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const total = await CustomOrder.countDocuments(query);
    const pages = Math.ceil(total / limit);

    // Get orders with pagination
    const orders = await CustomOrder.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}