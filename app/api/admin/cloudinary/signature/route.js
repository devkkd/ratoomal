// app/api/admin/cloudinary/signature/route.js
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  const timestamp = Math.round(Date.now() / 1000);

  const signature = cloudinary.v2.utils.api_sign_request(
    { timestamp, folder: "products" },
    process.env.CLOUDINARY_API_SECRET
  );

  return NextResponse.json({
    timestamp,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}
