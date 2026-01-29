import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import connectDB from '@/lib/db';
import jwt from 'jsonwebtoken';

// Helper function to check authentication
const checkAuth = (request) => {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return false;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return !!decoded;
  } catch (error) {
    return false;
  }
};

// GET SINGLE PRODUCT (Public endpoint with restrictions for non-authenticated users)
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Check if user is authenticated
    const isAuthenticated = checkAuth(request);
    
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
    
    // For non-authenticated users, limit the information returned
    let productData = product.toObject();
    
    if (!isAuthenticated) {
      // Remove sensitive information for non-authenticated users
      productData = {
        _id: product._id,
        name: product.name,
        code: product.code, // Add product code
        thumbnail: product.thumbnail,
        images: product.images ? product.images.slice(0, 2) : [], // Only first 2 images
        category: product.category,
        subCategory: product.subCategory,
        price: product.price,
        minimumOrderQuantity: product.minimumOrderQuantity,
        finish: product.finish,
        // Hide detailed information
        description: "Login to view detailed product information",
        specifications: undefined,
        materials: undefined,
        dimensions: undefined,
        weight: undefined,
        services: undefined,
        isLimitedView: true
      };
    }
    
    return NextResponse.json({ 
      success: true, 
      data: productData,
      isAuthenticated: isAuthenticated,
      message: !isAuthenticated ? 'Limited product information. Login to view complete details.' : undefined
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