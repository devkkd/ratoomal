import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    console.log("🔐 ADMIN LOGIN ATTEMPT:", email);

    // Find user by businessEmail (admin users use businessEmail field)
    const user = await User.findOne({ businessEmail: email });
    if (!user) {
      console.log("❌ USER NOT FOUND:", email);
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (user.role !== "admin") {
      console.log("❌ NOT AN ADMIN:", email, "Role:", user.role);
      return NextResponse.json(
        { success: false, error: "Only admins can login here" },
        { status: 403 }
      );
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ INVALID PASSWORD:", email);
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.businessEmail,
        role: user.role,
        isAdmin: true 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ ADMIN LOGIN SUCCESS:", email);

    // Create response with token in cookie AND return token in body
    const res = NextResponse.json({ 
      success: true, 
      message: "Admin login successful",
      token: token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

    // Set HTTP-only cookies for security (both adminToken and token for compatibility)
    res.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Also set token cookie for backward compatibility
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return res;

  } catch (error) {
    console.error("❌ ADMIN LOGIN ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
