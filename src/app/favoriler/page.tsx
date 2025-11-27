"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, MapPin, Eye, Clock, X } from "lucide-react";
import { formatPrice, formatDate, getImageUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Ilan {
  id: number;
  ilan_id: number;
  baslik: string;
  fiyat: number;
  fiyat_tipi?: string;
  resimler?: string;
  kategori_ad: string;
  il: string;
  ilce: string;
  goruntulenme?: number;
  tarih?: string;
}

export default function Favoriler() {
  const [favoriler, setFavoriler] = useState<Ilan[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadFavoriler();
  }, []);

  const loadFavoriler = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        router.push('/giris');
        return;
      }

      const user = JSON.parse(userStr);
      
      const response = await fetch('/api/favoriler', {
        headers: {
          'x-user-id': user.id.toString()
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setFavoriler(data.data || []);
      }
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (ilanId: number) => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      const user = JSON.parse(userStr);
      
      const response = await fetch(`/api/favoriler?ilanId=${ilanId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user.id.toString()
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setFavoriler(prev => prev.filter(f => f.ilan_id !== ilanId));
        window.dispatchEvent(new Event('favoriGuncelle'));
      }
    } catch (error) {
      console.error('Favori silinirken hata:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">علاقه مندی های من</h1>
            <p className="text-gray-600">آگهی های مورد علاقه خود را از اینجا دنبال کنید</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-video bg-gray-200"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : favoriler.length === 0 ? (
            <div className="border border-gray-200 rounded-lg p-16 text-center">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">هنوز آگهی مورد علاقه ای وجود ندارد</h3>
              <p className="text-gray-600 mb-6">
                با اضافه کردن آگهی های مورد علاقه خود، بعداً به راحتی به آنها دسترسی پیدا کنید.
              </p>
              <Link href="/" className="inline-block border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                کشف آگهی ها
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {favoriler.map((favori, index) => {
                const resimler = favori.resimler ? (typeof favori.resimler === 'string' ? JSON.parse(favori.resimler) : favori.resimler) : [];
                const firstImage = Array.isArray(resimler) && resimler.length > 0 ? resimler[0] : '';
                
                return (
                <motion.div
                  key={favori.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="group relative">
                    <Link href={`/ilan/${favori.ilan_id}`} className="block h-full">
                      <div className="overflow-hidden rounded-xl border border-gray-200 transition-all hover:shadow-xl hover:border-blue-300 h-full flex flex-col">
                        {/* Image */}
                        <div className="relative aspect-video bg-gray-100 overflow-hidden">
                          <Image
                            src={getImageUrl(firstImage)}
                            alt={favori.baslik}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                          />
                          
                          {/* Badge */}
                          <div className="absolute top-2 left-2">
                            <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
                              {favori.kategori_ad}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-3 flex-1 flex flex-col">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                            {favori.baslik}
                          </h3>
                          
                          <div className="flex items-baseline gap-1 mb-3">
                            <span className="text-lg font-bold text-blue-600">
                              {formatPrice(favori.fiyat)}
                            </span>
                          </div>

                          <div className="mt-auto space-y-2 text-xs text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                              <span className="truncate">{favori.il}</span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3.5 w-3.5 text-gray-400" />
                                <span>{favori.goruntulenme || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-gray-400" />
                                <span>{formatDate(favori.tarih || '')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFavorite(favori.ilan_id);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full border-2 border-white bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-sm z-10"
                      title="حذف از علاقه مندی ها"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
