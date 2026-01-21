import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const fixAdmin = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error("❌ MONGODB_URI not set");
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    // Delete all admin users
    await User.deleteMany({ role: "admin" });
    console.log("✅ Deleted existing admin users");

    // Create new admin
    const adminEmail = "admin@gmail.com";
    const adminPassword = "Admin@123";
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
      status: "approved"
    });

    console.log("✅ Admin created successfully!");
    console.log("📧 Email:", admin.businessEmail);
    console.log("🔐 Password: Admin@123");
    console.log("Verify password is set:", !!admin.password);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

fixAdmin();
