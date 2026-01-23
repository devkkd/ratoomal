// Environment variables checker
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'EMAIL_HOST',
  'EMAIL_USER',
  'EMAIL_PASS',
  'ADMIN_EMAIL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const optionalEnvVars = [
  'NEXT_PUBLIC_API_BASE_URL',
  'NODE_ENV',
  'PORT'
];

console.log('🔍 Checking Environment Variables...\n');

let allGood = true;

console.log('📋 Required Variables:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  console.log(`${status} ${varName}: ${value ? 'configured' : 'MISSING'}`);
  if (!value) allGood = false;
});

console.log('\n📋 Optional Variables:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '⚠️';
  console.log(`${status} ${varName}: ${value || 'not set'}`);
});

console.log('\n🎯 Environment Summary:');
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Base URL: ${process.env.NEXT_PUBLIC_API_BASE_URL || 'not set'}`);
console.log(`Port: ${process.env.PORT || 'not set (will use default)'}`);

if (allGood) {
  console.log('\n✅ All required environment variables are configured!');
  process.exit(0);
} else {
  console.log('\n❌ Some required environment variables are missing!');
  process.exit(1);
}