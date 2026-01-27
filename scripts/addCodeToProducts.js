const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Product Schema (same as your model)
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, trim: true, uppercase: true },
  price: { type: Number, required: true, min: 0 },
  moq: { type: Number, default: 1, min: 1 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", default: null },
  thumbnail: { type: String, required: true },
  images: { type: [String], default: [] },
  video360: { type: String, default: "" },
  services: { type: [String], default: [] },
  features: { type: [String], default: [] },
  godName: String,
  color: String,
  suitableFor: String,
  usage: String,
  posture: String,
  baseShape: String,
  finish: String,
  appearance: String,
  careInstruction: String,
  assemblyRequired: String,
  availability: { type: String, enum: ["In Stock", "Out of Stock"], default: "In Stock" },
  productType: String,
  shortDescription: String,
  longDescription: String,
  description: String,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function addCodeToExistingProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find products without code field
    const productsWithoutCode = await Product.find({
      $or: [
        { code: { $exists: false } },
        { code: "" },
        { code: null }
      ]
    });

    console.log(`📦 Found ${productsWithoutCode.length} products without code`);

    let updated = 0;
    let errors = 0;

    for (let i = 0; i < productsWithoutCode.length; i++) {
      const product = productsWithoutCode[i];
      
      try {
        // Generate a unique code based on product name and index
        const baseName = product.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        const shortName = baseName.substring(0, 6);
        const code = `${shortName}${String(i + 1).padStart(3, '0')}`;
        
        // Check if code already exists
        const existingProduct = await Product.findOne({ code: code });
        let finalCode = code;
        
        if (existingProduct) {
          // If code exists, add timestamp
          finalCode = `${shortName}${Date.now().toString().slice(-4)}`;
        }

        // Update the product
        await Product.findByIdAndUpdate(product._id, { code: finalCode });
        console.log(`✅ Updated product "${product.name}" with code: ${finalCode}`);
        updated++;
        
      } catch (error) {
        console.error(`❌ Error updating product "${product.name}":`, error.message);
        errors++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Updated: ${updated} products`);
    console.log(`❌ Errors: ${errors} products`);
    
  } catch (error) {
    console.error('💥 Script error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
addCodeToExistingProducts();