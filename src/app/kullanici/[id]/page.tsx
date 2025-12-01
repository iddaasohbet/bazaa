"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Eye, Clock, Heart, User as UserIcon } from "lucide-react";
import { formatPrice, formatDate, getImageUrl } from "@/lib/utils";

interface Ilan {
  id: number;
  baslik: string;
  fiyat: number;
  fiyat_tipi: string;
  ana_resim: string;
  kategori_ad: string;
  il_ad: string;
  goruntulenme: number;
  created_at: string;
  resimler?: string[];
  resim_sayisi: number;
}

interface Kullanici {
  id: string;
  ad: string;
}

export default function KullaniciIlanlari({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [kullanici, setKullanici] = useState<Kullanici | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [resolvedParams.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ilanlar/kullanici/${resolvedParams.id}`);
      const data = await response.json();
      
      if (data.success) {
        setIlanlar(data.data);
        setKullanici(data.kullanici);
      }
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600" dir="rtl">
            <Link href="/" className="hover:text-blue-600">صفحه اصلی</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">آگهی‌های کاربر</span>
          </div>

          {/* Kullanici Header */}
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{kullanici?.ad}</h1>
                <p className="text-gray-600 mt-1">
                  {loading ? 'Yükleniyor...' : `${ilanlar.length} aktif ilan`}
                </p>
              </div>
            </div>
          </div>

          {/* İlanlar */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-video bg-gray-200"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : ilanlar.length === 0 ? (
            <div className="border border-gray-200 rounded-lg p-16 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Henüz İlan Yok</h3>
              <p className="text-gray-600">Bu kullanıcının aktif ilanı bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {ilanlar.map((ilan, index) => (
                <motion.div
                  key={ilan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/ilan/${ilan.id}`} className="group block h-full">
                    <div className="overflow-hidden rounded-xl border border-gray-200 transition-all hover:shadow-xl hover:border-blue-300 h-full flex flex-col">
                      {/* Image */}
                      <div className="relative aspect-video bg-gray-100 overflow-hidden">
                        <Image
                          src={getImageUrl(ilan.resimler?.[0] || ilan.ana_resim)}
                          alt={ilan.baslik}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Badge */}
                        <div className="absolute top-2 left-2">
                          <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
                            {ilan.kategori_ad}
                          </span>
                        </div>
                        
                        {/* Favorite Button */}
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-all"
                        >
                          <Heart className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-3 flex-1 flex flex-col">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                          {ilan.baslik}
                        </h3>
                        
                        <div className="flex items-baseline gap-1 mb-3">
                          <span className="text-lg font-bold text-blue-600">
                            {formatPrice(ilan.fiyat)}
                          </span>
                        </div>

                        <div className="mt-auto space-y-2 text-xs text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                            <span className="truncate">{ilan.il_ad}</span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3.5 w-3.5 text-gray-400" />
                              <span>{ilan.goruntulenme}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-gray-400" />
                              <span>{formatDate(ilan.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}


