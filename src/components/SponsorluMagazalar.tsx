"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Store, Star, Eye, Package } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface SponsorluMagaza {
  id: number;
  ad: string;
  ad_dari: string;
  logo: string;
  kapak_resmi: string;
  aciklama: string;
  paket_turu: string;
  ilan_sayisi: number;
  goruntulenme: number;
  favori_urunler: Array<{
    id: number;
    baslik: string;
    fiyat: number;
    ana_resim: string;
  }>;
}

export default function SponsorluMagazalar() {
  const [magazalar, setMagazalar] = useState<SponsorluMagaza[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSponsorluMagazalar();
  }, []);

  const fetchSponsorluMagazalar = async () => {
    try {
      const response = await fetch('/api/magazalar/sponsorlu?limit=3');
      const data = await response.json();
      if (data.success) {
        setMagazalar(data.data);
      }
    } catch (error) {
      console.error('Sponsorlu mağazalar yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || magazalar.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-blue-50 to-white" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Store className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">مغازه های اسپانسر شده</h2>
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold">
              ویژه
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {magazalar.map((magaza, index) => (
            <motion.div
              key={magaza.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={`/magaza/${magaza.id}`}>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-yellow-200 hover:shadow-2xl hover:border-yellow-400 transition-all group">
                  {/* Sponsorlu Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      <Star className="h-4 w-4 fill-white" />
                      <span>اسپانسر</span>
                    </div>
                  </div>

                  {/* Kapak Resmi */}
                  <div className="relative h-40 bg-gradient-to-r from-blue-400 to-indigo-400 overflow-hidden">
                    {magaza.kapak_resmi ? (
                      <Image
                        src={getImageUrl(magaza.kapak_resmi)}
                        alt={magaza.ad}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Store className="h-16 w-16 text-white/30" />
                      </div>
                    )}
                  </div>

                  {/* Logo */}
                  <div className="relative px-6 -mt-12">
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden">
                      {magaza.logo ? (
                        <Image
                          src={getImageUrl(magaza.logo)}
                          alt={magaza.ad}
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                          <Store className="h-12 w-12 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* İçerik */}
                  <div className="px-6 pb-6 pt-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {magaza.ad_dari || magaza.ad}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {magaza.aciklama}
                    </p>

                    {/* İstatistikler */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        <span>{magaza.ilan_sayisi} محصول</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{magaza.goruntulenme}</span>
                      </div>
                    </div>

                    {/* Favori Ürünler */}
                    {magaza.favori_urunler && magaza.favori_urunler.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">محصولات برتر:</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {magaza.favori_urunler.slice(0, 3).map((urun) => (
                            <div key={urun.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                              <Image
                                src={getImageUrl(urun.ana_resim)}
                                alt={urun.baslik}
                                fill
                                className="object-cover hover:scale-110 transition-transform"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Paket Badge */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        magaza.paket_turu === 'premium'
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      }`}>
                        {magaza.paket_turu === 'premium' ? 'مغازه ممتاز' : 'مغازه حرفه‌ای'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



