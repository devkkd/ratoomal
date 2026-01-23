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
    
    return NextResponse.json({
      success: true,
      database: 'connected',
      userCount,
      pendingUsers,
      emailConfigured,
      environment: process.env.NODE_ENV,
      mongoUri: process.env.MONGODB_URI ? 'configured' : 'missing',
      adminEmail: process.env.ADMIN_EMAIL ? 'configured' : 'missing'
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}