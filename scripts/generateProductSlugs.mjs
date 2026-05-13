import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env.local') });

await mongoose.connect(process.env.MONGODB_URI);
console.log('✅ Connected to MongoDB');

const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  code: String,
  slug: String,
}, { strict: false }));

function generateSlug(name, code) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  return base + '-' + code.toLowerCase();
}

const products = await Product.find({ slug: { $exists: false } });
console.log(`Found ${products.length} products without slug`);

let updated = 0;
let skipped = 0;

for (const p of products) {
  if (!p.name || !p.code) { skipped++; continue; }

  let slug = generateSlug(p.name, p.code);

  // Ensure uniqueness
  const existing = await Product.findOne({ slug, _id: { $ne: p._id } });
  if (existing) slug = slug + '-' + p._id.toString().slice(-4);

  await Product.updateOne({ _id: p._id }, { $set: { slug } });
  updated++;
  if (updated % 50 === 0) console.log(`Updated ${updated}...`);
}

console.log(`✅ Done! Updated: ${updated}, Skipped: ${skipped}`);
await mongoose.disconnect();
