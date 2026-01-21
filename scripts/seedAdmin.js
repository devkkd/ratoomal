import 'dotenv/config'; // Loads .env.local
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables explicitly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envLocalPath = path.resolve(__dirname, '../.env.local');

if (fs.existsSync(envLocalPath)) {
  const dotenv = await import('dotenv');
  dotenv.config({ path: envLocalPath });
}

import connectDB from "../lib/db.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const seedAdmin = async () => {
  await connectDB();

  const adminEmail = "admin@gmail.com";
  const adminPassword = "Admin@123";
  
  // Delete existing admin if any
  await User.deleteMany({ role: "admin" });

  const hashed = await bcrypt.hash(adminPassword, 10);

  const admin = await User.create({
    businessEmail: adminEmail,
    companyName: "Admin",
    contactName: "Administrator",
    country: "Admin",
    phone: "0000000000",
    businessType: "Admin",
    purpose: "Admin",
    verificationProof: "Admin",
    password: hashed,
    role: "admin",
  });

  console.log("✅ Admin created successfully!");
  console.log("📧 Email:", admin.businessEmail);
  console.log("🔐 Password: Admin@123");
  process.exit(0);
};

seedAdmin();
