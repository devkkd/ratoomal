#!/usr/bin/env node

/**
 * Script to remove console.log statements from source files
 * Keeps console.error and console.warn for debugging
 */

const fs = require('fs');
const path = require('path');

const filesToClean = [
  'store/wishlistStore.js',
  'store/inquiryCartStore.js',
  'store/middleware/persistMiddleware.js',
  'hooks/useReliableTranslation.js',
  'lib/simpleTranslation.js',
  'app/components/CuratedCollections.jsx',
  'app/components/GodFigurines.jsx',
  'app/components/Utility.jsx',
  'app/components/Header.jsx',
];

function removeConsoleLogs(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Remove console.log statements (keep console.error and console.warn)
    content = content.replace(/console\.log\([^)]*\);?\n?/g, '');
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Cleaned: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error cleaning ${filePath}:`, error.message);
  }
}

console.log('🧹 Removing console.log statements...\n');

filesToClean.forEach(file => {
  removeConsoleLogs(file);
});

console.log('\n✅ Console logs removed! Ready for production.');
