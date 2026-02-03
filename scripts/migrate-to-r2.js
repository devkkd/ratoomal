#!/usr/bin/env node

/**
 * Migration script to help set up Cloudflare R2
 * Run this after updating environment variables
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

console.log('🚀 Cloudflare R2 Migration Helper\n');

// Check if required environment variables are set
const requiredEnvVars = [
  'CLOUDFLARE_R2_ENDPOINT',
  'CLOUDFLARE_R2_ACCESS_KEY_ID',
  'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
  'CLOUDFLARE_R2_BUCKET_NAME',
  'CLOUDFLARE_R2_PUBLIC_URL'
];

console.log('📋 Checking Environment Variables...\n');

let allGood = true;
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  console.log(`${status} ${varName}: ${value ? 'configured' : 'MISSING'}`);
  if (!value) allGood = false;
});

if (!allGood) {
  console.log('\n❌ Please set all required environment variables in .env.local');
  console.log('📖 See CLOUDFLARE_R2_MIGRATION.md for setup instructions');
  process.exit(1);
}

console.log('\n✅ All environment variables are configured!');

// Check if dependencies are installed
console.log('\n📦 Checking Dependencies...');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const requiredDeps = ['@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner'];
const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);

if (missingDeps.length > 0) {
  console.log('❌ Missing dependencies:', missingDeps.join(', '));
  console.log('💡 Run: npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner');
  process.exit(1);
}

console.log('✅ All required dependencies are installed!');

// Check if old Cloudinary dependency exists
if (packageJson.dependencies.cloudinary) {
  console.log('⚠️  Old Cloudinary dependency still exists');
  console.log('💡 Run: npm uninstall cloudinary');
}

console.log('\n🎉 Migration setup looks good!');
console.log('📖 Next steps:');
console.log('   1. Test file uploads in your application');
console.log('   2. Update any hardcoded Cloudinary URLs in your database');
console.log('   3. Configure CORS in your R2 bucket if needed');
console.log('   4. Set up custom domain for better performance');

console.log('\n📚 For detailed instructions, see CLOUDFLARE_R2_MIGRATION.md');