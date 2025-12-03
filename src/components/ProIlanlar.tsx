"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, Eye, Heart, Zap, Store, TrendingUp } from "lucide-react";
import { formatPrice, getImageUrl } from "@/lib/utils";

interface Ilan {
  id: number;
  baslik: string;
  fiyat: number;
  eski_fiyat?: number;
  indirim_yuzdesi?: number;
  para_birimi?: string;
  fiyat_usd?: number;
  ana_resim: string;
  kategori_ad: string;
  il_ad: string;
  goruntulenme: number;
  resimler?: string[];
  store_level?: string;
  magaza_id?: number;
  magaza_slug?: string;
  magaza_ad?: string;
}

export default function ProIlanlar() {
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProIlanlar();
  }, []);

  const fetchProIlanlar = async () => {
    try {
      // ⚡ OPTIMIZE: Sadece 6 Pro ilan çek
      const response = await fetch('/api/ilanlar?store_level=pro&limit=6', {
        cache: 'no-store' // Client-side fresh data
      });
      const data = await response.json();
      if (data.success) {
        setIlanlar(data.data);
      }
    } catch (error) {
      console.error('Pro ilanlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pro ilanları yoksa gösterme
  if (loading || ilanlar.length === 0) {
    return null;
  }

  return (
    <div className="mb-12" dir="rtl">
      {/* Header */}
      <div className="relative mb-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-200 p-4 overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5">
          <Zap className="h-24 w-24 text-blue-600" />
        </div>
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
            <Star className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              محصولات پرو
              <Zap className="h-4 w-4 text-blue-500" />
            </h2>
            <p className="text-sm text-gray-600">از مغازه‌های حرفه‌ای</p>
          </div>
        </div>
      </div>

      {/* Pro İlanlar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
        {ilanlar.map((ilan, index) => (
          <motion.div
            key={ilan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/ilan/${ilan.id}`} className="group block h-full">
              <div className="relative h-full bg-white rounded-xl border-2 border-blue-300 overflow-hidden hover:shadow-2xl hover:border-blue-500 transition-all duration-300 ring-2 ring-blue-100">
                {/* Pro Badge */}
                <div className="absolute top-2 right-2 z-10">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg">
                    <Star className="h-3 w-3 fill-white" />
                    <span>PRO</span>
                  </div>
                </div>

                {/* İndirim Badge */}
                {ilan.indirim_yuzdesi && ilan.indirim_yuzdesi > 0 && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg">
                      {ilan.indirim_yuzdesi}% تخفیف
                    </div>
                  </div>
                )}

                {/* Image */}
                <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(ilan.resimler?.[0] || ilan.ana_resim)}
                    alt={ilan.baslik}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Favorite Button */}
                  <button 
                    onClick={(e) => { 
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-all"
                  >
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-3">
                  {/* Store Badge */}
                  {ilan.magaza_ad && (
                    <div className="flex items-center gap-1 mb-2">
                      <Store className="h-3 w-3 text-blue-600" />
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded truncate">
                        {ilan.magaza_ad}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                    {ilan.baslik}
                  </h3>
                  
                  {/* Price */}
                  <div className="mb-3">
                    {ilan.indirim_yuzdesi && ilan.indirim_yuzdesi > 0 ? (
                      <div className="space-y-0.5">
                        {ilan.eski_fiyat && (
                          <div className="text-xs text-gray-500 line-through">
                            {formatPrice(ilan.eski_fiyat, (ilan.para_birimi as 'AFN' | 'USD') || 'AFN')}
                          </div>
                        )}
                        <div className="text-lg font-bold text-red-600">
                          {ilan.para_birimi === 'USD' && ilan.fiyat_usd 
                            ? formatPrice(ilan.fiyat_usd, 'USD')
                            : formatPrice(ilan.fiyat, 'AFN')}
                        </div>
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-gray-900">
                        {ilan.para_birimi === 'USD' && ilan.fiyat_usd 
                          ? formatPrice(ilan.fiyat_usd, 'USD')
                          : formatPrice(ilan.fiyat, 'AFN')}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex items-center justify-between pt-2 border-t border-blue-100">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="h-3.5 w-3.5 text-blue-600" />
                      <span className="text-xs truncate">{ilan.il_ad}</span>
                    </div>
                    {/* Mağaza Butonu - Pro İlanlar */}
                    {ilan.magaza_slug && (
                      <Link
                        href={`/magaza/${ilan.magaza_slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">مغازه</span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

