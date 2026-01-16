// app/api/admin/upload-video/route.js
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

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

    // Check file type
    const fileType = file.type;
    if (!fileType.startsWith('video/')) {
      return NextResponse.json(
        { success: false, message: "Only video files are allowed" },
        { status: 400 }
      );
    }

    // Check file size (15MB limit)
    const fileSize = file.size;
    const maxSize = 15 * 1024 * 1024; // 15MB
    if (fileSize > maxSize) {
      return NextResponse.json(
        { success: false, message: "Video size must be less than 15MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary with video optimization
    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: "product-videos",
          chunk_size: 6000000, // 6MB chunks for better upload
          timeout: 120000, // 2 minutes timeout
          transformation: [
            { quality: 'auto:good' }, // Auto optimize quality
            { fetch_format: 'mp4' }, // Convert to MP4
            { video_codec: 'h264' }, // Use H264 codec
            { bit_rate: '500k' } // Lower bitrate for smaller size
          ]
        },
        (err, res) => (err ? reject(err) : resolve(res))
      ).end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: upload.secure_url,
      duration: upload.duration,
      format: upload.format,
      size: upload.bytes,
      message: "Video uploaded successfully"
    });

  } catch (error) {
    console.error("VIDEO UPLOAD ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload video",
        error: error.message
      },
      { status: 500 }
    );
  }
}