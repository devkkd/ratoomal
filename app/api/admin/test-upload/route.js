import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("Test upload endpoint called");
  
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file received" },
        { status: 400 }
      );
    }
    
    console.log("File received:", file.name, file.type, file.size);
    
    return NextResponse.json({
      success: true,
      message: "File received successfully",
      filename: file.name,
      size: file.size,
      type: file.type
    });
    
  } catch (error) {
    console.error("Test error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}