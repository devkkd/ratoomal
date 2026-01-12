import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");

  const buffer = Buffer.from(await file.arrayBuffer());

  const upload = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "products" },
      (err, res) => (err ? reject(err) : resolve(res))
    ).end(buffer);
  });

  return NextResponse.json({
    success: true,
    url: upload.secure_url,
  });
}
