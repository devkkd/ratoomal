/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for production builds
  experimental: {
    optimizePackageImports: ['lucide-react', '@heroicons/react']
  },
  
  // Handle build-time environment variables safely
  env: {
    CUSTOM_BASE_URL: process.env.NODE_ENV === 'production' 
      ? (process.env.NEXT_PUBLIC_API_BASE_URL || '')
      : 'http://localhost:3000'
  },
  
  // Empty turbopack config to silence the warning
  turbopack: {},
};

export default nextConfig;
