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
    qualities: [75, 90, 100],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 1024],
  },
  // API route için ayarlar - Büyük resimler için limit artırıldı
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // 10 resim için yeterli (her biri 10MB'a kadar)
    },
  },
};

export default nextConfig;

