import { NextResponse } from 'next/server';
import { adminAuth } from '../admin/middleware/adminAuth';

export async function GET() {
  console.log('🧪 Testing admin auth...');
  
  const authResult = await adminAuth();
  
  if (authResult.error) {
    console.log('❌ Auth failed');
    return NextResponse.json({
      success: false,
      message: 'Auth failed',
      error: 'Unauthorized'
    }, { status: 401 });
  }
  
  console.log('✅ Auth successful');
  return NextResponse.json({
    success: true,
    message: 'Admin auth working',
    user: authResult.user
  });
}