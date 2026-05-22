/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mark nodemailer as server-only (prevents bundling issues)
  serverExternalPackages: ['nodemailer'],

  // WWW Canonicalization: redirect non-www to www
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "ratoomals.com" }],
        destination: "https://www.ratoomals.com/:path*",
        permanent: true, // 301 redirect
      },
    ];
  },

  // Optimize for production builds
  experimental: {
    optimizePackageImports: ['lucide-react', '@heroicons/react'],
    serverActions: {
      bodySizeLimit: '200mb',
    },
  },

  // Never strip console logs — we need them for email debugging
  compiler: {},
  
  // Handle build-time environment variables safely
  env: {
    CUSTOM_BASE_URL: process.env.NODE_ENV === 'production' 
      ? (process.env.NEXT_PUBLIC_API_BASE_URL || '')
      : 'http://localhost:3001'
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
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Configure webpack to handle video files
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/videos/',
          outputPath: 'static/videos/',
          name: '[name].[hash].[ext]',
        },
      },
    });
    return config;
  },
  
  // Empty turbopack config to silence the warning
  turbopack: {},
};

export default nextConfig;
