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

// Normalize sizes — if DB has a single string like `3", 4", 5"` split it into array
const normalizeSizes = (sizes) => {
  if (!sizes || sizes.length === 0) return [];
  // If array has only 1 element and it contains commas, it's a string stored as array
  if (sizes.length === 1 && sizes[0].includes(',')) {
    return sizes[0].split(',').map(s => s.trim()).filter(Boolean);
  }
  return sizes;
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
    
    // Always normalize sizes regardless of auth status
    productData.sizes = normalizeSizes(productData.sizes || []);
    
    if (!isAuthenticated) {
      // For non-authenticated users, show basic info but INCLUDE video360
      productData = {
        _id: product._id,
        name: product.name,
        code: product.code,
        thumbnail: product.thumbnail,
        images: product.images ? product.images.slice(0, 2) : [], // Only first 2 images
        video360: product.video360, // ✅ INCLUDE VIDEO for non-authenticated users
        category: product.category,
        subCategory: product.subCategory,
        price: product.price,
        moq: product.moq,
        minimumOrderQuantity: product.minimumOrderQuantity,
        finish: product.finish,
        productType: product.productType,
        availability: product.availability,
        sizes: normalizeSizes(product.sizes), // ✅ INCLUDE SIZES for non-authenticated users
        shortDescription: product.shortDescription || "Login to view detailed product information",
        // Hide detailed information
        longDescription: undefined,
        features: undefined,
        services: undefined,
        godName: undefined,
        color: undefined,
        material: undefined,
        size: undefined,
        suitableFor: undefined,
        usage: undefined,
        posture: undefined,
        baseShape: undefined,
        appearance: undefined,
        careInstruction: undefined,
        assemblyRequired: undefined,
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