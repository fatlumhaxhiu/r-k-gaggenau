import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.RK_TRACKING_TEST === '1' ? '.local-tests/next-tracking' : '.next',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ];
  },
};



export default nextConfig;
