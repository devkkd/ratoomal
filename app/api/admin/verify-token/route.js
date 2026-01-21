import { adminAuthMiddleware } from "@/lib/adminAuth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    console.log('🔍 Verifying admin token...');
    
    const auth = adminAuthMiddleware(req);
    
    console.log('📋 Auth result:', {
      isAuthorized: auth.isAuthorized,
      error: auth.error,
      hasDecoded: !!auth.decoded
    });

    if (!auth.isAuthorized) {
      console.log(`❌ Token verification failed: ${auth.error}`);
      return NextResponse.json(
        { success: false, error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log("✅ ADMIN TOKEN VERIFIED:", auth.decoded?.id);

    return NextResponse.json({
      success: true,
      message: "Token is valid",
      user: {
        id: auth.decoded.id,
        role: auth.decoded.role,
      },
    });
  } catch (error) {
    console.error("❌ TOKEN VERIFICATION ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
