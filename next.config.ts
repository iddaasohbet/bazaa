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
      {
        protocol: 'http',
        hostname: '104.247.173.212',
      },
    ],
  },
  // API route için ayarlar - Büyük resimler için limit artırıldı
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // 10 resim için yeterli (her biri 10MB'a kadar)
    },
  },
};

export default nextConfig;

