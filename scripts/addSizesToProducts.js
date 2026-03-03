// Script to add default sizes to existing products
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const ProductSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', ProductSchema);

async function addSizesToProducts() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find products without sizes field or with empty sizes
    const products = await Product.find({
      $or: [
        { sizes: { $exists: false } },
        { sizes: { $size: 0 } }
      ]
    });

    console.log(`📦 Found ${products.length} products without sizes`);

    if (products.length === 0) {
      console.log('✅ All products already have sizes!');
      process.exit(0);
    }

    // Default sizes to add
    const defaultSizes = ['6 inch', '8 inch', '10 inch', '12 inch'];

    // Update each product
    let updated = 0;
    for (const product of products) {
      await Product.updateOne(
        { _id: product._id },
        { $set: { sizes: defaultSizes } }
      );
      updated++;
      console.log(`✅ Updated: ${product.name} (${product.code})`);
    }

    console.log(`\n🎉 Successfully updated ${updated} products with default sizes!`);
    console.log(`Default sizes added: ${defaultSizes.join(', ')}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

addSizesToProducts();
