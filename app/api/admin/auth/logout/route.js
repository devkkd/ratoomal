import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const res = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Clear both admin token cookies
    res.cookies.set("adminToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
      maxAge: 0,
      path: "/",
    });

    res.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
      maxAge: 0,
      path: "/",
    });

    console.log("✅ ADMIN LOGOUT SUCCESSFUL");

    return res;
  } catch (error) {
    console.error("❌ LOGOUT ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
