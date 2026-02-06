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

// GET ALL PRODUCTS (Public endpoint with restrictions for non-authenticated users)
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 1000; // Increased limit to show all products
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    
    // Check if user is authenticated
    const isAuthenticated = checkAuth(request);
    
    // Build query
    let query = {};
    
    // Add search functionality
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // For non-authenticated users, allow reasonable access but with some limits
    let actualLimit = limit;
    let actualPage = page;
    
    if (!isAuthenticated) {
      // Non-authenticated users can see more products but with pagination limits
      actualLimit = Math.min(limit, 500); // Allow up to 500 products for non-authenticated users
      // Remove the forced first page restriction to allow pagination
    }
    
    // Calculate skip for pagination
    const skip = (actualPage - 1) * actualLimit;
    
    // Get products with populated category info
    const products = await Product.find(query)
      .populate('category', 'name _id')
      .populate('subCategory', 'name _id')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(actualLimit)
      .select('name code _id thumbnail images category subCategory price createdAt minimumOrderQuantity finish productType services material size');
    
    // Get total count for pagination
    const totalCount = await Product.countDocuments(query);
    
    return NextResponse.json({ 
      success: true, 
      data: products,
      count: products.length,
      totalCount: totalCount,
      page: actualPage,
      totalPages: Math.ceil(totalCount / actualLimit),
      isAuthenticated: isAuthenticated,
      message: !isAuthenticated ? 'Limited results for non-authenticated users. Login to view all products.' : undefined
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