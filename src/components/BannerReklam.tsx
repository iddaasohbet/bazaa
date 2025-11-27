"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface Reklam {
  id: number;
  baslik: string;
  banner_url: string;
  hedef_url: string;
  reklam_turu: string;
  boyut: string;
}

interface BannerReklamProps {
  konum: "header" | "kategori" | "arama";
  kategoriId?: number;
}

export default function BannerReklam({ konum, kategoriId }: BannerReklamProps) {
  const [reklam, setReklam] = useState<Reklam | null>(null);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReklam();
  }, [konum, kategoriId]);

  const fetchReklam = async () => {
    try {
      let url = `/api/reklamlar?konum=${konum}`;
      if (kategoriId) {
        url += `&kategori_id=${kategoriId}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success && data.data) {
        setReklam(data.data);
      }
    } catch (error) {
      console.error('Reklam yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    if (reklam) {
      // Tıklanma sayısını artır
      await fetch(`/api/reklamlar/tikla/${reklam.id}`, { method: 'POST' });
    }
  };

  if (loading) {
    return null;
  }

  if (!reklam || !visible) {
    return null;
  }

  // Banner boyutları
  const boyutlar: { [key: string]: { width: string; height: string; aspectRatio: string } } = {
    "1200x200": { width: "1200px", height: "200px", aspectRatio: "6/1" },
    "1200x150": { width: "1200px", height: "150px", aspectRatio: "8/1" },
    "728x90": { width: "728px", height: "90px", aspectRatio: "728/90" },
  };

  const boyut = boyutlar[reklam.boyut] || boyutlar["1200x200"];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full my-6"
      dir="rtl"
    >
      {/* Reklam Etiketi */}
      <div className="text-center mb-1">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          تبلیغات
        </span>
      </div>

      {/* Banner Container */}
      <div className="relative mx-auto overflow-hidden rounded-lg shadow-lg" style={{ maxWidth: boyut.width }}>
        <Link 
          href={reklam.hedef_url} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={handleClick}
          className="block relative"
          style={{ aspectRatio: boyut.aspectRatio }}
        >
          <Image
            src={getImageUrl(reklam.banner_url)}
            alt={reklam.baslik}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </Link>

        {/* Kapatma Butonu */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 left-2 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
          aria-label="Reklamı Kapat"
        >
          <X className="h-4 w-4 text-white" />
        </button>
      </div>
    </motion.div>
  );
}



