import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const res = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Clear the admin token cookie
    res.cookies.set("adminToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
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
