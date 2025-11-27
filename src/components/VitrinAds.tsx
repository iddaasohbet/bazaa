"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, MapPin, Star } from "lucide-react";
import { formatPrice, getImageUrl } from "@/lib/utils";

interface VitrinIlan {
  id: number;
  baslik: string;
  fiyat: number;
  ana_resim: string;
  kategori_ad: string;
  il_ad: string;
  goruntulenme: number;
  magaza_ad?: string;
  magaza_logo?: string;
  vitrin_turu: string;
}

interface VitrinAdsProps {
  vitrinTuru?: "anasayfa" | "kategori" | "arama";
  kategoriId?: number;
  title?: string;
  limit?: number;
}

export default function VitrinAds({ 
  vitrinTuru = "anasayfa", 
  kategoriId,
  title = "آگهی های ویژه",
  limit = 8
}: VitrinAdsProps) {
  const [ilanlar, setIlanlar] = useState<VitrinIlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVitrinAds();
  }, [vitrinTuru, kategoriId]);

  const fetchVitrinAds = async () => {
    try {
      let url = `/api/vitrin?turu=${vitrinTuru}&limit=${limit}`;
      if (kategoriId) {
        url += `&kategori_id=${kategoriId}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setIlanlar(data.data);
      }
    } catch (error) {
      console.error('Vitrin ilanları yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-72"></div>
          ))}
        </div>
      </div>
    );
  }

  if (ilanlar.length === 0) {
    return null;
  }

  return (
    <section className="py-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-1 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
          <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {ilanlar.map((ilan, index) => (
          <motion.div
            key={ilan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link href={`/ilan/${ilan.id}`} className="group block">
              <div className="relative overflow-hidden rounded-xl bg-white border-2 border-yellow-200 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                {/* Vitrin Badge */}
                <div className="absolute top-2 right-2 z-10">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    <Star className="h-3 w-3 fill-white" />
                    <span>ویترین</span>
                  </div>
                </div>

                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={getImageUrl(ilan.ana_resim)}
                    alt={ilan.baslik}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Mağaza Bilgisi */}
                  {ilan.magaza_ad && (
                    <div className="flex items-center gap-2 mb-2">
                      {ilan.magaza_logo && (
                        <div className="relative h-6 w-6 rounded-full overflow-hidden border border-gray-200">
                          <Image
                            src={getImageUrl(ilan.magaza_logo)}
                            alt={ilan.magaza_ad}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span className="text-xs text-blue-600 font-semibold truncate">
                        {ilan.magaza_ad}
                      </span>
                    </div>
                  )}

                  {/* Başlık */}
                  <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[2.5rem]">
                    {ilan.baslik}
                  </h3>

                  {/* Fiyat */}
                  <div className="mb-3">
                    <div className="text-xl md:text-2xl font-bold text-gray-900">
                      {formatPrice(ilan.fiyat)}
                    </div>
                  </div>

                  {/* Alt Bilgiler */}
                  <div className="flex items-center justify-between text-xs text-gray-600 border-t pt-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{ilan.il_ad}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{ilan.goruntulenme}</span>
                    </div>
                  </div>

                  {/* Kategori Badge */}
                  <div className="mt-2">
                    <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-semibold">
                      {ilan.kategori_ad}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}



