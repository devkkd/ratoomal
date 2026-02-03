import mongoose from 'mongoose';

// Global cache for mongoose connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  try {
    // Skip database connection during build process
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      console.log('⚠️ Skipping database connection during build');
      return null;
    }

    // Check MONGODB_URI at runtime, not at module load time
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error(
        'Please define the MONGODB_URI environment variable'
      );
    }

    console.log('🔄 Attempting MongoDB connection...');

    // If already connected, return
    if (cached.conn && mongoose.connection.readyState === 1) {
      console.log('✅ Using existing MongoDB connection');
      return cached.conn;
    }

    // If connection is in progress, wait for it
    if (cached.promise) {
      console.log('⏳ Waiting for existing connection promise...');
      try {
        return await cached.promise;
      } catch (error) {
        console.log('❌ Previous connection promise failed, creating new one');
        cached.promise = null;
      }
    }

    // Enhanced connection options for better stability
    const connectionOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Reduced to 10 seconds
      socketTimeoutMS: 20000, // Reduced to 20 seconds
      connectTimeoutMS: 10000, // Reduced to 10 seconds
      heartbeatFrequencyMS: 10000, // 10 seconds
      retryWrites: true,
      w: 'majority'
    };

    console.log('🔗 Connecting to MongoDB with enhanced options...');

    // Start new connection with retry logic
    cached.promise = connectWithRetry(MONGODB_URI, connectionOptions);

    cached.conn = await cached.promise;
    return cached.conn;
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    cached.promise = null; // Reset promise on error
    throw error;
  }
};

// Helper function for connection with retry logic
const connectWithRetry = async (uri, options, maxRetries = 2) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Connection attempt ${attempt}/${maxRetries}...`);
      
      const mongooseInstance = await mongoose.connect(uri, options);
      
      console.log('✅ MongoDB connected successfully');
      
      // Register models after successful connection
      try {
        await import('@/models/Product');
        await import('@/models/Category');
        await import('@/models/SubCategory');
        await import('@/models/User');
        await import('@/models/Inquiry');
        await import('@/models/CustomOrder');
        await import('@/models/Wishlist');
        console.log('✅ Models registered successfully');
      } catch (modelError) {
        console.log('⚠ Some models may not be registered:', modelError.message);
      }
      
      return mongooseInstance;
      
    } catch (error) {
      console.error(`❌ Connection attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retry (shorter wait time)
      const waitTime = 1000 * attempt; // 1s, 2s
      console.log(`⏳ Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

export default connectDB;
