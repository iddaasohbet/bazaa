import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // API route için ayarlar
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // 10 resim için yeterli boyut
    },
  },
};

export default nextConfig;

