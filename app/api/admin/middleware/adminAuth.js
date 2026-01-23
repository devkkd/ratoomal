import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function adminAuth() {
  const cookieStore = await cookies();
  
  // Try adminToken first, then fallback to token for backward compatibility
  const adminToken = cookieStore.get("adminToken")?.value;
  const token = cookieStore.get("token")?.value;
  const finalToken = adminToken || token;

  console.log('🔐 AdminAuth Debug:', {
    hasAdminToken: !!adminToken,
    hasToken: !!token,
    hasFinalToken: !!finalToken,
    allCookies: Array.from(cookieStore.getAll()).map(c => c.name)
  });

  if (!finalToken) {
    console.log('❌ No token found in cookies');
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  try {
    const decoded = jwt.verify(finalToken, process.env.JWT_SECRET);
    console.log('✅ Token decoded successfully, role:', decoded.role);

    if (decoded.role !== "admin") {
      console.log('❌ User is not admin, role:', decoded.role);
      return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }

    console.log('✅ Admin auth successful');
    return { user: decoded };
  } catch (err) {
    console.log('❌ Token verification failed:', err.message);
    return { error: NextResponse.json({ error: "Invalid token" }, { status: 401 }) };
  }
}
