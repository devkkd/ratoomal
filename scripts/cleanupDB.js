import 'dotenv/config';
import mongoose from 'mongoose';

const cleanupDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error("❌ MONGODB_URI not set");
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    // Get the collection
    const collection = mongoose.connection.collection('users');
    
    // Drop all indexes except _id
    try {
      const indexes = await collection.getIndexes();
      console.log("📋 Current indexes:", Object.keys(indexes));
      
      for (const indexName of Object.keys(indexes)) {
        if (indexName !== '_id_') {
          await collection.dropIndex(indexName);
          console.log(`✅ Dropped index: ${indexName}`);
        }
      }
    } catch (e) {
      console.log("ℹ️ Index cleanup skipped:", e.message);
    }

    // Drop the collection
    try {
      await mongoose.connection.dropCollection('users');
      console.log("✅ Dropped users collection");
    } catch (e) {
      console.log("ℹ️ Collection drop skipped:", e.message);
    }

    await mongoose.connection.close();
    console.log("✅ Database cleaned and ready");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

cleanupDB();
