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
  // API route için ayarlar - Büyük resimler için limit artırıldı
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // 10 resim için yeterli (her biri 10MB'a kadar)
    },
  },
  // Sayfa ve API route'lar için
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
    responseLimit: '100mb',
  },
};

export default nextConfig;

