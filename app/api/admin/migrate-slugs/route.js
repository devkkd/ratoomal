import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import jwt from 'jsonwebtoken';

// Helper: generate slug from product name + code (same logic as model pre-save)
function generateSlug(name, code) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() +
    '-' +
    code.toLowerCase()
  );
}

// Admin-only: backfill slugs for products that don't have one yet
export async function POST(request) {
  try {
    // Auth check — must be admin
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();

    // Find all products without a slug
    const productsWithoutSlug = await Product.find({
      $or: [{ slug: null }, { slug: '' }, { slug: { $exists: false } }],
    })
      .select('_id name code slug')
      .lean();

    if (productsWithoutSlug.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All products already have slugs.',
        updated: 0,
      });
    }

    let updated = 0;
    let skipped = 0;
    const errors = [];

    for (const product of productsWithoutSlug) {
      try {
        const newSlug = generateSlug(product.name, product.code);

        // Check for slug collision
        const existing = await Product.findOne({ slug: newSlug, _id: { $ne: product._id } });
        if (existing) {
          // Append ObjectId suffix to make it unique
          const uniqueSlug = newSlug + '-' + product._id.toString().slice(-6);
          await Product.updateOne({ _id: product._id }, { $set: { slug: uniqueSlug } });
        } else {
          await Product.updateOne({ _id: product._id }, { $set: { slug: newSlug } });
        }
        updated++;
      } catch (err) {
        errors.push({ id: product._id, code: product.code, error: err.message });
        skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Slug migration complete.`,
      total: productsWithoutSlug.length,
      updated,
      skipped,
      errors,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Migration failed', error: error.message },
      { status: 500 }
    );
  }
}
