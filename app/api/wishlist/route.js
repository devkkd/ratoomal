import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Wishlist from '@/models/Wishlist';
import User from '@/models/User';
import { verifyToken } from '@/utils/adminAuth';

// GET user's wishlist
export async function GET(req) {
  try {
    await connectDB();
    
    // Get token from cookies (httpOnly)
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const wishlist = await Wishlist.find({ user: decoded.id })
      .populate('product')
      .sort({ addedAt: -1 });

    return NextResponse.json({ 
      success: true, 
      data: wishlist 
    });

  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ADD to wishlist
export async function POST(req) {
  try {
    await connectDB();
    
    // Get token from cookies (httpOnly)
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { productId } = await req.json();

    // Check if already in wishlist
    const existing = await Wishlist.findOne({ 
      user: decoded.id, 
      product: productId 
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Already in wishlist' },
        { status: 400 }
      );
    }

    const wishlistItem = await Wishlist.create({
      user: decoded.id,
      product: productId,
    });

    await wishlistItem.populate('product');

    return NextResponse.json(
      { success: true, data: wishlistItem },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// REMOVE from wishlist
export async function DELETE(req) {
  try {
    await connectDB();
    
    // Get token from cookies (httpOnly)
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { productId } = await req.json();

    await Wishlist.deleteOne({
      user: decoded.id,
      product: productId,
    });

    return NextResponse.json(
      { success: true, message: 'Removed from wishlist' }
    );

  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
