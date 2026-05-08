/**
 * Run this once to set CORS policy on your R2 bucket:
 * node scripts/setR2Cors.js
 */

import { S3Client, PutBucketCorsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env.local") });

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const corsConfig = {
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  CORSConfiguration: {
    CORSRules: [
      {
        AllowedOrigins: [
          "https://www.ratoomals.com",
          "https://ratoomals.com",
          "http://localhost:3000",
          "http://localhost:3001",
        ],
        AllowedMethods: ["PUT", "GET", "HEAD"],
        AllowedHeaders: ["Content-Type", "Content-Length"],
        MaxAgeSeconds: 3600,
      },
    ],
  },
};

try {
  await r2Client.send(new PutBucketCorsCommand(corsConfig));
  console.log("✅ CORS policy set successfully on R2 bucket!");
} catch (err) {
  console.error("❌ Failed to set CORS:", err.message);
}
