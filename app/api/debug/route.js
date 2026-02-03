import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    // Test database connection
    await connectDB();
    
    // Test user count
    const userCount = await User.countDocuments();
    const pendingUsers = await User.countDocuments({ status: 'pending' });
    
    // Test email config
    const emailConfigured = !!(
      process.env.EMAIL_HOST && 
      process.env.EMAIL_USER && 
      process.env.EMAIL_PASS && 
      process.env.ADMIN_EMAIL
    );
    
    // Get current URL info
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    return NextResponse.json({
      success: true,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        isProduction,
        baseUrl,
        port: process.env.PORT || 'not set'
      },
      database: {
        status: 'connected',
        userCount,
        pendingUsers,
        mongoConfigured: !!process.env.MONGODB_URI
      },
      email: {
        configured: emailConfigured,
        host: process.env.EMAIL_HOST,
        user: process.env.EMAIL_USER ? 'configured' : 'missing',
        adminEmail: process.env.ADMIN_EMAIL ? 'configured' : 'missing'
      },
      security: {
        jwtSecret: process.env.JWT_SECRET ? 'configured' : 'missing',
        r2Configured: !!(process.env.CLOUDFLARE_R2_ENDPOINT && process.env.CLOUDFLARE_R2_ACCESS_KEY_ID)
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
        port: process.env.PORT || 'not set'
      }
    }, { status: 500 });
  }
}