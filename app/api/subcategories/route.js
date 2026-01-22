import { NextResponse } from 'next/server';
import SubCategory from '@/models/SubCategory';
import connectDB from '@/lib/db';

// GET ALL SUBCATEGORIES (Public endpoint for frontend)
export async function GET() {
  try {
    await connectDB();
    
    // Get subcategories with populated category info
    const subCategories = await SubCategory.find()
      .populate('category', 'name _id')
      .sort({ createdAt: -1 })
      .select('name _id category createdAt');
    
    return NextResponse.json({ 
      success: true, 
      data: subCategories,
      count: subCategories.length 
    });
    
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch subcategories',
        error: error.message 
      },
      { status: 500 }
    );
  }
}