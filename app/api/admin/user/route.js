// // app/api/admin/users/route.js
// import  connectDB  from "@/lib/db";
// import User from "@/models/User";

// export async function PATCH(req) {
//   await connectDB();
//   const { userId, status } = await req.json();

//   await User.findByIdAndUpdate(userId, { status });
//   return Response.json({ message: "User updated" });
// }


import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/lib/mailer";
import {
  userApprovedTemplate,
  userRejectedTemplate,
} from "@/lib/emailTemplates";
import { adminAuth } from "../middleware/adminAuth";

export async function PATCH(req) {
  // ✅ AUTH CHECK
  const auth = adminAuth();
  if (auth.error) return auth.error;

  await connectDB();

  const { userId, status } = await req.json();

  const user = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true }
  );

  if (!user || !user.email) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  console.log("✅ USER UPDATED:", user.email, status);

  try {
    if (status === "approved") {
      const email = userApprovedTemplate(user);

      console.log("📧 SENDING APPROVAL EMAIL TO:", user.email);

      await sendEmail({
        to: user.email,
        subject: email.subject,
        html: email.html,
      });

      console.log("✅ APPROVAL EMAIL SENT");
    }

    if (status === "rejected") {
      const email = userRejectedTemplate();
      await sendEmail({
        to: user.email,
        subject: email.subject,
        html: email.html,
      });
    }
  } catch (err) {
    console.error("❌ EMAIL FAILED:", err.message);
  }

  return Response.json({ message: "User updated successfully" });
}

