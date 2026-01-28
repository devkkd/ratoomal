#!/usr/bin/env node

// Test MongoDB connection
import mongoose from 'mongoose';

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    
    const MONGODB_URI = 'mongodb+srv://developmentkontentkraftdigital_db_user:kkd11001@cluster0.7tebl0z.mongodb.net/ratoomal?retryWrites=true&w=majority&appName=Cluster0&connectTimeoutMS=30000&socketTimeoutMS=30000&serverSelectionTimeoutMS=30000';
    
    console.log('📍 Connecting to MongoDB Atlas...');
    
    const connectionOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      w: 'majority'
    };

    const connection = await mongoose.connect(MONGODB_URI, connectionOptions);
    
    console.log('✅ MongoDB connection successful!');
    console.log('📊 Connection details:');
    console.log('   - Database:', connection.connection.db.databaseName);
    console.log('   - Host:', connection.connection.host);
    console.log('   - Port:', connection.connection.port);
    console.log('   - Ready State:', connection.connection.readyState);
    
    // Test a simple query
    console.log('🔍 Testing database query...');
    const collections = await connection.connection.db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name));
    
    // Test Inquiry collection specifically
    try {
      const inquiryCount = await connection.connection.db.collection('inquiries').countDocuments();
      console.log('📊 Total inquiries in database:', inquiryCount);
      
      // Check all possible inquiry collections
      const possibleCollections = ['inquiries', 'inquiry', 'Inquiry', 'Inquiries'];
      
      for (const collectionName of possibleCollections) {
        try {
          const count = await connection.connection.db.collection(collectionName).countDocuments();
          if (count > 0) {
            console.log(`📋 Found ${count} documents in '${collectionName}' collection`);
            
            const sampleDoc = await connection.connection.db.collection(collectionName).findOne();
            if (sampleDoc) {
              console.log(`📄 Sample document from '${collectionName}':`);
              console.log('   - ID:', sampleDoc._id);
              console.log('   - Cart Products:', sampleDoc.cartProducts?.length || 0);
              console.log('   - Total Products:', sampleDoc.totalProducts);
              console.log('   - Total Quantity:', sampleDoc.totalQuantity);
              console.log('   - User:', sampleDoc.user);
              console.log('   - Created At:', sampleDoc.createdAt);
              
              if (sampleDoc.cartProducts && sampleDoc.cartProducts.length > 0) {
                console.log('📦 Cart Products Details:');
                sampleDoc.cartProducts.forEach((product, index) => {
                  console.log(`   Product ${index + 1}:`);
                  console.log(`     - ID: ${product.productId}`);
                  console.log(`     - Quantity: ${product.quantity}`);
                  console.log(`     - Sizes: ${JSON.stringify(product.selectedSizes)}`);
                });
              }
            }
          }
        } catch (err) {
          // Collection doesn't exist, continue
        }
      }
      
      // Also check for the specific inquiry ID you mentioned
      const specificInquiryId = '6979d8cf62f0c8b2d301c6f0';
      try {
        const specificInquiry = await connection.connection.db.collection('inquiries').findOne({
          _id: new mongoose.Types.ObjectId(specificInquiryId)
        });
        
        if (specificInquiry) {
          console.log(`🎯 Found specific inquiry ${specificInquiryId}:`);
          console.log('   - Cart Products:', specificInquiry.cartProducts?.length || 0);
          console.log('   - Company:', specificInquiry.user);
          console.log('   - Raw Data:', JSON.stringify(specificInquiry, null, 2));
        } else {
          console.log(`❌ Specific inquiry ${specificInquiryId} not found`);
        }
      } catch (specificError) {
        console.log(`⚠️ Error finding specific inquiry: ${specificError.message}`);
      }
      
    } catch (queryError) {
      console.log('⚠️ Query test failed:', queryError.message);
    }
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    console.error('📋 Error details:');
    console.error('   - Code:', error.code);
    console.error('   - Message:', error.message);
    
    if (error.code === 'ETIMEOUT') {
      console.log('💡 Suggestions:');
      console.log('   - Check your internet connection');
      console.log('   - Verify MongoDB Atlas cluster is running');
      console.log('   - Check if IP address is whitelisted');
      console.log('   - Try connecting from a different network');
    }
    
    process.exit(1);
  }
}

testConnection();