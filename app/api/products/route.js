import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import connectDB from '@/lib/db';

// GET ALL PRODUCTS (Public endpoint for frontend)
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 100; // Default limit for performance
    const search = searchParams.get('search') || '';
    
    // Build query
    let query = {};
    
    // Add search functionality
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Get products with populated category info
    const products = await Product.find(query)
      .populate('category', 'name _id')
      .populate('subCategory', 'name _id')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name _id thumbnail images category subCategory price createdAt');
    
    return NextResponse.json({ 
      success: true, 
      data: products,
      count: products.length 
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch products',
        error: error.message 
      },
      { status: 500 }
    );
  }
}