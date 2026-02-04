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
      : 'http://localhost:3001'  // Updated to match the actual dev server port
  },
  
  // Configure external image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-a7812a845df148fe9eec1889ce42d836.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Empty turbopack config to silence the warning
  turbopack: {},
};

export default nextConfig;
