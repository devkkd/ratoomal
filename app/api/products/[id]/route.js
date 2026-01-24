import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import connectDB from '@/lib/db';

// GET SINGLE PRODUCT (Public endpoint for frontend)
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Get product with populated category and subcategory info
    const product = await Product.findById(id)
      .populate('category', 'name _id')
      .populate('subCategory', 'name _id');
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: product 
    });
    
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch product',
        error: error.message 
      },
      { status: 500 }
    );
  }
}