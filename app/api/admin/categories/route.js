import { NextResponse } from 'next/server';
import Category from '@/models/Category';
import connectDB from '@/lib/db';

// GET ALL
export async function GET() {
  await connectDB();
  const categories = await Category.find().sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: categories });
}

// CREATE
export async function POST(req) {
  await connectDB();
  const { name } = await req.json();

  const category = await Category.create({ name });
  return NextResponse.json({ success: true, data: category });
}
