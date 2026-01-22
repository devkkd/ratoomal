import { NextResponse } from 'next/server';
import Category from '@/models/Category';
import connectDB from '@/lib/db';

// GET ALL CATEGORIES (Public endpoint for frontend)
export async function GET() {
  try {
    await connectDB();
    
    // Get only active categories
    const categories = await Category.find({ isActive: { $ne: false } })
      .sort({ createdAt: -1 })
      .select('name _id createdAt');
    
    return NextResponse.json({ 
      success: true, 
      data: categories,
      count: categories.length 
    });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch categories',
        error: error.message 
      },
      { status: 500 }
    );
  }
}