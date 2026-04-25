import { uploadToR2 } from "@/lib/cloudflare-r2";
import { NextResponse } from "next/server";

export const maxDuration = 120; // 2 minutes for large files
export const dynamic = "force-dynamic";

// Next.js App Router: disable body size limit by not using bodyParser
// The formData() API handles streaming natively
export async function POST(request) {
  try {
    // Validate R2 configuration
    if (
      !process.env.CLOUDFLARE_R2_ENDPOINT ||
      !process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ||
      !process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ||
      !process.env.CLOUDFLARE_R2_BUCKET_NAME
    ) {
      return NextResponse.json(
        { success: false, error: "Storage not configured on server. Add R2 env vars." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "products";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Stream the file as a buffer — works for large files in App Router
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const timestamp = Date.now();
    // Sanitize filename: remove spaces and special chars
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileName = `${timestamp}-${safeName}`;

    const resourceType = file.type.startsWith("video") ? "video" : "image";

    const upload = await uploadToR2(buffer, fileName, file.type, folder);

    return NextResponse.json({
      success: true,
      url: upload.secure_url,
      publicId: upload.public_id,
      type: resourceType,
      folder,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
