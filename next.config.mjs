/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mark nodemailer and mongoose as server-only (prevents Turbopack bundling issues on Windows)
  serverExternalPackages: ['nodemailer', 'mongoose'],

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

  // Long-lived cache headers for static assets in /public
  async headers() {
    return [
      {
        // Immutable cache for all images (1 year)
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Immutable cache for client testimonial photos (1 year)
        source: '/client/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Long cache for banner video (7 days, not immutable since it may be replaced)
        source: '/banner-video.mp4',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Fonts and other static assets
        source: '/:path*.woff2',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
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

  // Turbopack configuration (silences conflict error with custom webpack config in Next.js 16)
  turbopack: {},
  
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
  
};

export default nextConfig;
