// // lib/db.js
// import mongoose from "mongoose";

// export const connectDB = async () => {
//   if (mongoose.connections[0].readyState) return;
//   await mongoose.connect(process.env.MONGODB_URI);
// };


// // lib/db.js
// import mongoose from 'mongoose';

// const connectDB = async () => {
//   try {
//     if (mongoose.connection.readyState === 1) {
//       return;
//     }

//     await mongoose.connect(process.env.MONGODB_URI);

//     console.log('MongoDB connected successfully');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     throw error;
//   }
// };

// export default connectDB;

import mongoose from 'mongoose';

// Create a connection cache
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Global cache for mongoose connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  try {
    // If already connected, return
    if (cached.conn) {
      return cached.conn;
    }

    // If connection is in progress, wait for it
    if (cached.promise) {
      return await cached.promise;
    }

    // Start new connection
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then(async (mongooseInstance) => {
      console.log('✅ MongoDB connected successfully');
      
      // IMPORTANT: Register models after connection
      // This ensures all models are registered before using them
      try {
        // Dynamically import models to ensure they're registered
        await import('@/models/Product');
        await import('@/models/Category');
        await import('@/models/SubCategory');
        console.log('✅ Models registered successfully');
      } catch (modelError) {
        console.log('⚠ Some models may not be registered:', modelError.message);
      }
      
      return mongooseInstance;
    });

    cached.conn = await cached.promise;
    return cached.conn;
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    cached.promise = null; // Reset promise on error
    throw error;
  }
};

export default connectDB;
