// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import CustomOrder from "@/models/CustomOrder";

// // GET Single Order
// export async function GET(req, { params }) {
//   try {
//     await connectDB();
//     const order = await CustomOrder.findById(params.id);

//     if (!order) {
//       return NextResponse.json(
//         { success: false, message: "Order not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ success: true, data: order });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

// // UPDATE Order
// export async function PUT(req, { params }) {
//   try {
//     await connectDB();
//     const body = await req.json();

//     const updated = await CustomOrder.findByIdAndUpdate(
//       params.id,
//       body,
//       { new: true }
//     );

//     return NextResponse.json({ success: true, data: updated });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

// // DELETE Order
// export async function DELETE(req, { params }) {
//   try {
//     await connectDB();
//     await CustomOrder.findByIdAndDelete(params.id);

//     return NextResponse.json({
//       success: true,
//       message: "Custom order deleted successfully",
//     });
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

// // GET Single Order
// export async function GET(req, { params }) {
//   try {
//     await connectDB();
//     const { id } = params;
    
//     const order = await CustomOrder.findById(id);

//     if (!order) {
//       return NextResponse.json(
//         { success: false, message: "Order not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ success: true, data: order });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

// // UPDATE Order Status
// export async function PUT(req, { params }) {
//   try {
//     await connectDB();
//     const { id } = params;
//     const body = await req.json();
    
//     // Only allow status updates and admin notes
//     const allowedUpdates = ['status'];
//     const updates = {};
    
//     Object.keys(body).forEach(key => {
//       if (allowedUpdates.includes(key)) {
//         updates[key] = body[key];
//       }
//     });

//     const updated = await CustomOrder.findByIdAndUpdate(
//       id,
//       updates,
//       { new: true, runValidators: true }
//     );

//     if (!updated) {
//       return NextResponse.json(
//         { success: false, message: "Order not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ success: true, data: updated });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

// // DELETE Order
// export async function DELETE(req, { params }) {
//   try {
//     await connectDB();
//     const { id } = params;
    
//     const deleted = await CustomOrder.findByIdAndDelete(id);

//     if (!deleted) {
//       return NextResponse.json(
//         { success: false, message: "Order not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Custom order deleted successfully",
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
import { sendEmail } from "@/lib/mailer";
import {
  customOrderApprovedTemplate,
  customOrderRejectedTemplate,
} from "@/lib/emailTemplates";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    const order = await CustomOrder.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    
    console.log("📝 Updating custom order:", id, "Status:", body.status);

    // Validate status if provided
    if (body.status) {
      const validStatuses = ["pending", "contacted", "in_progress", "completed", "rejected"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { success: false, message: "Invalid status" },
          { status: 400 }
        );
      }
    }

    const updated = await CustomOrder.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    console.log("✅ Custom order updated. Email:", updated.businessEmail);

    // Send email notification to user when status is updated
    if (body.status === "contacted" || body.status === "approved" || body.status === "rejected") {
      try {
        if (!updated.businessEmail) {
          console.error("⚠️ EMAIL MISSING - Cannot send email without recipient");
          return NextResponse.json({
            success: true,
            data: updated,
            warning: "Email not sent - user email missing",
          });
        }

        const email = (body.status === "contacted" || body.status === "approved")
          ? customOrderApprovedTemplate(updated)
          : customOrderRejectedTemplate(updated);

        console.log(`📧 SENDING CUSTOM ORDER ${body.status.toUpperCase()} MAIL TO:`, updated.businessEmail);
        console.log("Subject:", email.subject);

        await sendEmail({
          to: updated.businessEmail,
          subject: email.subject,
          html: email.html,
        });

        console.log(`✅ CUSTOM ORDER ${body.status.toUpperCase()} MAIL SENT SUCCESSFULLY`);
      } catch (emailErr) {
        console.error("❌ EMAIL SEND ERROR:", {
          error: emailErr.message,
          stack: emailErr.stack,
          email: updated.businessEmail,
        });

        // Still return success but log the email error
        return NextResponse.json({
          success: true,
          data: updated,
          emailError: emailErr.message,
        });
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("❌ PUT REQUEST ERROR:", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    const deleted = await CustomOrder.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Custom order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}