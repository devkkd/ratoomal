/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  // Environment-specific configuration
  env: {
    CUSTOM_BASE_URL: process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ratoomal.onrender.com'
      : 'http://localhost:3000'
  },
  
  // Ensure proper handling of API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
