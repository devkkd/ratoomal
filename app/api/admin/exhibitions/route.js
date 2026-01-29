import connectDB from "@/lib/db";
import Exhibition from "@/models/Exhibition";
import { NextResponse } from "next/server";
import { adminAuth } from "../middleware/adminAuth";

export async function GET(req) {
  // Check admin authentication
  const authResult = await adminAuth();
  if (authResult.error) {
    return authResult.error;
  }

  await connectDB();
  
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Get exhibitions with pagination
    const exhibitions = await Exhibition.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Exhibition.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Get statistics
    const stats = await Exhibition.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          published: { $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] } },
          draft: { $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] } },
          upcoming: { $sum: { $cond: ["$isUpcoming", 1, 0] } },
          featured: { $sum: { $cond: ["$featured", 1, 0] } }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: exhibitions,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats: stats[0] || {
        total: 0,
        published: 0,
        draft: 0,
        upcoming: 0,
        featured: 0
      }
    });

  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch exhibitions" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  // Check admin authentication
  const authResult = await adminAuth();
  if (authResult.error) {
    return authResult.error;
  }

  await connectDB();
  
  try {
    const body = await req.json();
    
    // Validate required fields
    const { title, description, startDate, endDate, location, address, mainImage } = body;
    
    if (!title || !description || !startDate || !endDate || !location || !address || !mainImage) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check date validity
    if (new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json(
        { success: false, error: "End date must be after start date" },
        { status: 400 }
      );
    }

    // Set isUpcoming based on start date
    const isUpcoming = new Date(startDate) > new Date();

    const exhibition = new Exhibition({
      ...body,
      isUpcoming,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    });

    await exhibition.save();

    return NextResponse.json({
      success: true,
      data: exhibition,
      message: "Exhibition created successfully"
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating exhibition:', error);
    return NextResponse.json(
      { success: false, error: "Failed to create exhibition" },
      { status: 500 }
    );
  }
}