import { NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/cloudflare-r2";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("video/")) {
      return NextResponse.json(
        { success: false, message: "Only video files allowed" },
        { status: 400 }
      );
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Max size 15MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;

    const uploadResult = await uploadToR2(buffer, fileName, file.type, "products/videos");

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      message: "Video uploaded successfully",
    });

  } catch (error) {
    console.error("VIDEO UPLOAD ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
