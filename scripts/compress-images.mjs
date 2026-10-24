/**
 * Image compression script
 * Compresses large PNG/JPG images in /public to WebP + keeps original as fallback
 * Run: node scripts/compress-images.mjs
 */

import sharp from 'sharp';
import { readdir, stat, rename, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Files to compress with specific settings
const targets = [
  // Hero — most critical (LCP element)
  {
    src: 'images/hero1.png',
    webp: 'images/hero1.webp',
    quality: 82,
    width: 1920,
  },
  // Global collections
  { src: 'images/global/8.png', webp: 'images/global/8.webp', quality: 80, width: 800 },
  { src: 'images/global/9.png', webp: 'images/global/9.webp', quality: 80, width: 800 },
  { src: 'images/global/1.png', webp: 'images/global/1.webp', quality: 80, width: 800 },
  { src: 'images/global/2.png', webp: 'images/global/2.webp', quality: 80, width: 800 },
  { src: 'images/global/3.png', webp: 'images/global/3.webp', quality: 80, width: 800 },
  { src: 'images/global/4.png', webp: 'images/global/4.webp', quality: 80, width: 800 },
  { src: 'images/global/5.png', webp: 'images/global/5.webp', quality: 80, width: 800 },
  { src: 'images/global/6.png', webp: 'images/global/6.webp', quality: 80, width: 800 },
  { src: 'images/global/7.png', webp: 'images/global/7.webp', quality: 80, width: 800 },
  // Testimonial client photos
  { src: 'client/1.JPG',   webp: 'client/1.webp',   quality: 75, width: 520 },
  { src: 'client/2.JPG',   webp: 'client/2.webp',   quality: 75, width: 520 },
  { src: 'client/3.jpeg',  webp: 'client/3.webp',   quality: 75, width: 520 },
  { src: 'client/4.jpeg',  webp: 'client/4.webp',   quality: 75, width: 520 },
  { src: 'client/5.jpeg',  webp: 'client/5.webp',   quality: 75, width: 520 },
  { src: 'client/6.jpeg',  webp: 'client/6.webp',   quality: 75, width: 520 },
  { src: 'client/7.jpeg',  webp: 'client/7.webp',   quality: 75, width: 520 },
  { src: 'client/8.jpeg',  webp: 'client/8.webp',   quality: 75, width: 520 },
  { src: 'client/9.jpeg',  webp: 'client/9.webp',   quality: 75, width: 520 },
  { src: 'client/10.jpeg', webp: 'client/10.webp',  quality: 75, width: 520 },
  { src: 'client/11.jpeg', webp: 'client/11.webp',  quality: 75, width: 520 },
  { src: 'client/12.jpeg', webp: 'client/12.webp',  quality: 75, width: 520 },
  { src: 'client/13.jpeg', webp: 'client/13.webp',  quality: 75, width: 520 },
  // Decorative images
  { src: 'images/top-left.png',  webp: 'images/top-left.webp',  quality: 80, width: 600 },
  { src: 'images/top-right.png', webp: 'images/top-right.webp', quality: 80, width: 600 },
  { src: 'images/placeholder.png', webp: 'images/placeholder.webp', quality: 75, width: 600 },
];

async function compress() {
  let totalSaved = 0;

  for (const t of targets) {
    const srcPath = path.join(PUBLIC_DIR, t.src);
    const webpPath = path.join(PUBLIC_DIR, t.webp);

    if (!existsSync(srcPath)) {
      console.log(`⚠️  SKIP (not found): ${t.src}`);
      continue;
    }

    const beforeSize = (await stat(srcPath)).size;

    try {
      await sharp(srcPath)
        .resize({ width: t.width, withoutEnlargement: true })
        .webp({ quality: t.quality, effort: 4 })
        .toFile(webpPath);

      const afterSize = (await stat(webpPath)).size;
      const saved = beforeSize - afterSize;
      totalSaved += saved;

      console.log(
        `✅ ${t.src.padEnd(30)} ${(beforeSize / 1024).toFixed(0).padStart(6)} KB → WebP ${(afterSize / 1024).toFixed(0).padStart(5)} KB  (saved ${(saved / 1024).toFixed(0)} KB)`
      );
    } catch (err) {
      console.error(`❌ ${t.src}: ${err.message}`);
    }
  }

  console.log(`\n🎉 Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
}

compress();
