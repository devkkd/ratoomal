import { generatePresignedUrl } from "@/lib/cloudflare-r2";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Step 1: Client requests a presigned URL for direct R2 upload
export async function POST(request) {
  try {
    if (
      !process.env.CLOUDFLARE_R2_ENDPOINT ||
      !process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ||
      !process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ||
      !process.env.CLOUDFLARE_R2_BUCKET_NAME
    ) {
      return NextResponse.json(
        { success: false, error: "Storage not configured on server." },
        { status: 500 }
      );
    }

    const { fileName, fileType, folder = "products" } = await request.json();

    if (!fileName || !fileType) {
      return NextResponse.json(
        { success: false, error: "fileName and fileType are required" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueName = `${timestamp}-${safeName}`;

    const presignedUrl = await generatePresignedUrl(uniqueName, fileType, folder);

    const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${folder}/${uniqueName}`;

    return NextResponse.json({
      success: true,
      presignedUrl,
      publicUrl,
    });
  } catch (error) {
    console.error("Presigned URL error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
