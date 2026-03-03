import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import User from '@/models/User';
import Inquiry from '@/models/Inquiry';

export async function GET(request) {
  try {
    await connectDB();

    // Get total products
    const totalProducts = await Product.countDocuments();

    // Get total users (customers)
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Get total inquiries
    const totalInquiries = await Inquiry.countDocuments();

    // Get pending inquiries
    const pendingInquiries = await Inquiry.countDocuments({ status: 'pending' });

    // Get inquiries from last 30 days for trend
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentInquiries = await Inquiry.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get previous 30 days inquiries for comparison
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const previousInquiries = await Inquiry.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });

    // Calculate inquiry trend
    const inquiryTrend = previousInquiries > 0 
      ? ((recentInquiries - previousInquiries) / previousInquiries * 100).toFixed(1)
      : 0;

    // Get recent users (last 30 days)
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      role: 'user'
    });

    const previousUsers = await User.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
      role: 'user'
    });

    const userTrend = previousUsers > 0
      ? ((recentUsers - previousUsers) / previousUsers * 100).toFixed(1)
      : 0;

    // Get pending users count
    const pendingUsers = await User.countDocuments({ 
      role: 'user', 
      status: 'pending' 
    });

    // Get approved users percentage
    const approvedUsers = await User.countDocuments({ 
      role: 'user', 
      status: 'approved' 
    });
    
    const approvalRate = totalUsers > 0
      ? ((approvedUsers / totalUsers) * 100).toFixed(1)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalUsers,
        totalInquiries,
        pendingInquiries,
        pendingUsers,
        recentInquiries,
        inquiryTrend: `${inquiryTrend >= 0 ? '+' : ''}${inquiryTrend}%`,
        inquiryTrendType: inquiryTrend >= 0 ? 'increase' : 'decrease',
        userTrend: `${userTrend >= 0 ? '+' : ''}${userTrend}%`,
        userTrendType: userTrend >= 0 ? 'increase' : 'decrease',
        approvalRate: `${approvalRate}%`,
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch dashboard stats'
    }, { status: 500 });
  }
}
