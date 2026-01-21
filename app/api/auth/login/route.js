// import  connectDB  from "@/lib/db";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   await connectDB();
//   const { email, password } = await req.json();

//   const user = await User.findOne({ email });
//   if (!user) {
//     return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
//   }

//   if (user.status !== "approved") {
//     return NextResponse.json({ error: "Account not approved" }, { status: 403 });
//   }

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
//   }

//   const token = jwt.sign(
//     { id: user._id, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );

//   const res = NextResponse.json({ success: true });

//   res.cookies.set("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     maxAge: 60 * 60 * 24 * 7,
//     path: "/",
//   });

//   return res;
// }


// app/api/auth/login/route.js
import connectDB  from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  
  try {
    const { email, password } = await req.json();

    // Find user by businessEmail (not email)
    const user = await User.findOne({ businessEmail: email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if account is approved
    if (user.status !== "approved") {
      return NextResponse.json(
        { error: "Account not approved" },
        { status: 403 }
      );
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Create response and set cookie
    const response = NextResponse.json(
      { 
        success: true, 
        user: {
          id: user._id,
          email: user.businessEmail,
          companyName: user.companyName,
          contactName: user.contactName,
          role: user.role
        }
      },
      { status: 200 }
    );

    // Set cookie with all necessary options
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Also set a client-readable flag
    response.cookies.set({
      name: "isLoggedIn",
      value: "true",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
    
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}