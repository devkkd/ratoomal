#!/usr/bin/env node

// Create test inquiry
import mongoose from 'mongoose';

// Define schemas inline for testing
const UserSchema = new mongoose.Schema({
  companyName: String,
  contactName: String,
  businessEmail: String,
  phone: String,
  country: String,
  businessType: String,
  purpose: String
});

const CartProductSchema = new mongoose.Schema({
  productId: String,
  quantity: Number,
  selectedSizes: [String]
});

const InquirySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  inquiryType: String,
  cartProducts: [CartProductSchema],
  totalProducts: Number,
  totalQuantity: Number,
  inquiryFor: String,
  estimatedQuantity: String,
  customizationNeeded: String,
  message: String,
  status: { type: String, default: 'pending' }
}, { timestamps: true });

async function createTestInquiry() {
  try {
    console.log('🔄 Creating test inquiry...');
    
    const MONGODB_URI = 'mongodb+srv://developmentkontentkraftdigital_db_user:kkd11001@cluster0.7tebl0z.mongodb.net/ratoomal?retryWrites=true&w=majority&appName=Cluster0&connectTimeoutMS=30000&socketTimeoutMS=30000&serverSelectionTimeoutMS=30000';
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Create models
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
    
    // Create test user first
    const testUser = new User({
      companyName: 'Test Company',
      contactName: 'Test User',
      businessEmail: 'test@example.com',
      phone: '1234567890',
      country: 'India',
      businessType: 'Wholesaler',
      purpose: 'Bulk / Wholesale Order'
    });
    
    const savedUser = await testUser.save();
    console.log('✅ Test user created:', savedUser._id);
    
    // Create test inquiry with multiple products
    const testInquiry = new Inquiry({
      user: savedUser._id,
      inquiryType: 'cart_inquiry',
      cartProducts: [
        {
          productId: 'test_product_1',
          quantity: 12,
          selectedSizes: ['3"', '5456', '65472']
        },
        {
          productId: 'test_product_2', 
          quantity: 24,
          selectedSizes: ['3"', '6"']
        },
        {
          productId: 'test_product_3',
          quantity: 18,
          selectedSizes: ['3"']
        }
      ],
      totalProducts: 3,
      totalQuantity: 54,
      inquiryFor: 'custom_design',
      estimatedQuantity: '100-500',
      customizationNeeded: 'branding_logo',
      message: 'Test inquiry for CSV generation',
      status: 'pending'
    });
    
    const savedInquiry = await testInquiry.save();
    console.log('✅ Test inquiry created:', savedInquiry._id);
    console.log('📊 Inquiry details:');
    console.log('   - Cart Products:', savedInquiry.cartProducts.length);
    console.log('   - Total Products:', savedInquiry.totalProducts);
    console.log('   - Total Quantity:', savedInquiry.totalQuantity);
    
    // Verify the inquiry was saved correctly
    const verifyInquiry = await Inquiry.findById(savedInquiry._id).populate('user');
    console.log('🔍 Verification:');
    console.log('   - Found inquiry:', !!verifyInquiry);
    console.log('   - User populated:', !!verifyInquiry?.user);
    console.log('   - Cart products count:', verifyInquiry?.cartProducts?.length);
    
    if (verifyInquiry?.cartProducts) {
      console.log('📦 Cart Products:');
      verifyInquiry.cartProducts.forEach((product, index) => {
        console.log(`   Product ${index + 1}:`);
        console.log(`     - ID: ${product.productId}`);
        console.log(`     - Quantity: ${product.quantity}`);
        console.log(`     - Sizes: ${JSON.stringify(product.selectedSizes)}`);
      });
    }
    
    console.log('\n🎯 Use this inquiry ID for CSV testing:', savedInquiry._id);
    
    await mongoose.disconnect();
    console.log('✅ Test completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

createTestInquiry();