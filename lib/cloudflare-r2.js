import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Cloudflare R2 configuration
const r2Client = new S3Client({
  region: "auto", // Cloudflare R2 uses "auto" as region
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME;
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL;

// Upload file to R2
export async function uploadToR2(buffer, fileName, contentType, folder = "") {
  try {
    const key = folder ? `${folder}/${fileName}` : fileName;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await r2Client.send(command);
    
    // Return the public URL
    const publicUrl = `${PUBLIC_URL}/${key}`;
    return {
      secure_url: publicUrl,
      public_id: key,
      url: publicUrl,
    };
  } catch (error) {
    console.error("R2 upload error:", error);
    throw new Error(`Failed to upload to R2: ${error.message}`);
  }
}

// Delete file from R2
export async function deleteFromR2(publicId) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: publicId,
    });

    await r2Client.send(command);
    return { result: "ok" };
  } catch (error) {
    console.error("R2 delete error:", error);
    throw new Error(`Failed to delete from R2: ${error.message}`);
  }
}

// Generate presigned URL for direct uploads (optional)
export async function generatePresignedUrl(fileName, contentType, folder = "") {
  try {
    const key = folder ? `${folder}/${fileName}` : fileName;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    return signedUrl;
  } catch (error) {
    console.error("R2 presigned URL error:", error);
    throw new Error(`Failed to generate presigned URL: ${error.message}`);
  }
}

export default {
  uploadToR2,
  deleteFromR2,
  generatePresignedUrl,
};