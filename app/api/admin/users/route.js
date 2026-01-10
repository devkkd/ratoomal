// app/api/admin/users/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function PATCH(req) {
  await connectDB();
  const { userId, status } = await req.json();

  await User.findByIdAndUpdate(userId, { status });
  return Response.json({ message: "User updated" });
}
