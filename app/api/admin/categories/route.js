import { NextResponse } from 'next/server';
import Category from '@/models/Category';
import connectDB from '@/lib/db';
import { adminAuth } from '../middleware/adminAuth';

// GET ALL
export async function GET() {
  // Check admin authentication
  const authResult = await adminAuth();
  if (authResult.error) {
    return authResult.error;
  }

  await connectDB();
  const categories = await Category.find().sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: categories });
}

// CREATE
export async function POST(req) {
  // Check admin authentication
  const authResult = await adminAuth();
  if (authResult.error) {
    return authResult.error;
  }

  await connectDB();
  const { name } = await req.json();

  const category = await Category.create({ name });
  return NextResponse.json({ success: true, data: category });
}
