import connectDB from "@/lib/db";
import Exhibition from "@/models/Exhibition";
import { NextResponse } from "next/server";
import { adminAuth } from "../../middleware/adminAuth";

export async function GET(req, { params }) {
  // Check admin authentication
  const authResult = await adminAuth();
  if (authResult.error) {
    return authResult.error;
  }

  await connectDB();
  
  try {
    const { id } = await params;
    
    const exhibition = await Exhibition.findById(id).lean();
    
    if (!exhibition) {
      return NextResponse.json(
        { success: false, error: "Exhibition not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: exhibition
    });

  } catch (error) {
    console.error('Error fetching exhibition:', error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch exhibition" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  // Check admin authentication
  const authResult = await adminAuth();
  if (authResult.error) {
    return authResult.error;
  }

  await connectDB();
  
  try {
    const { id } = await params;
    const body = await req.json();
    
    // Check date validity if dates are being updated
    if (body.startDate && body.endDate) {
      if (new Date(body.startDate) >= new Date(body.endDate)) {
        return NextResponse.json(
          { success: false, error: "End date must be after start date" },
          { status: 400 }
        );
      }
      
      // Update isUpcoming based on start date
      body.isUpcoming = new Date(body.startDate) > new Date();
      body.startDate = new Date(body.startDate);
      body.endDate = new Date(body.endDate);
    }

    const exhibition = await Exhibition.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!exhibition) {
      return NextResponse.json(
        { success: false, error: "Exhibition not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: exhibition,
      message: "Exhibition updated successfully"
    });

  } catch (error) {
    console.error('Error updating exhibition:', error);
    return NextResponse.json(
      { success: false, error: "Failed to update exhibition" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  // Check admin authentication
  const authResult = await adminAuth();
  if (authResult.error) {
    return authResult.error;
  }

  await connectDB();
  
  try {
    const { id } = await params;
    
    const exhibition = await Exhibition.findByIdAndDelete(id);
    
    if (!exhibition) {
      return NextResponse.json(
        { success: false, error: "Exhibition not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Exhibition deleted successfully"
    });

  } catch (error) {
    console.error('Error deleting exhibition:', error);
    return NextResponse.json(
      { success: false, error: "Failed to delete exhibition" },
      { status: 500 }
    );
  }
}