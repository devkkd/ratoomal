// import { NextResponse } from "next/server";
// import cloudinary from "@/lib/cloudinary";

// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file");

//     if (!file) {
//       return NextResponse.json(
//         { success: false, message: "File missing" },
//         { status: 400 }
//       );
//     }

//     const buffer = Buffer.from(await file.arrayBuffer());

//     const uploadResult = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//         { folder: "custom-orders" },
//         (error, result) => {
//           if (error) reject(error);
//           resolve(result);
//         }
//       ).end(buffer);
//     });

//     return NextResponse.json({
//       success: true,
//       url: uploadResult.secure_url,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files"); // Changed to getAll for multiple files

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files uploaded" },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            folder: "custom-orders",
            resource_type: "auto" // auto-detect file type
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result.secure_url);
          }
        );
        
        uploadStream.end(buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      urls
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}