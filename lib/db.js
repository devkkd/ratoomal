import mongoose from 'mongoose';

// Global cache for mongoose connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  try {
    // Check MONGODB_URI at runtime, not at module load time
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
      );
    }

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
