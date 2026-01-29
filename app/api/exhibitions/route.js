import connectDB from "@/lib/db";
import Exhibition from "@/models/Exhibition";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();
  
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const status = searchParams.get('status') || 'published';
    const upcoming = searchParams.get('upcoming');
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    // Build query
    let query = { status };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (upcoming === 'true') {
      query.isUpcoming = true;
      query.startDate = { $gte: new Date() };
    } else if (upcoming === 'false') {
      query.isUpcoming = false;
    }

    // Get exhibitions with pagination
    const exhibitions = await Exhibition.find(query)
      .sort({ startDate: upcoming === 'true' ? 1 : -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Exhibition.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: exhibitions,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
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