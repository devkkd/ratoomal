import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const data = await req.json();

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await User.create({
    ...data,
    password: hashedPassword,
    role: "user",
    status: "pending",
  });

  return NextResponse.json({
    message: "Request submitted. Admin approval pending.",
  });
}
