"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileSidebar from "@/components/ProfileSidebar";
import { Heart, MapPin, Eye, Clock, X, Search } from "lucide-react";
import { formatDate, getImageUrl } from "@/lib/utils";
import PriceDisplay from "@/components/PriceDisplay";
import { useRouter } from "next/navigation";

interface Ilan {
  id: number;
  ilan_id: number;
  baslik: string;
  fiyat: number;
  eski_fiyat?: number;
  indirim_yuzdesi?: number;
  ana_resim: string;
  kategori_ad: string;
  kategori_slug: string;
  il_ad: string;
  goruntulenme: number;
  created_at: string;
  ilan_created_at: string;
}

export default function Favoriler() {
  const [favoriler, setFavoriler] = useState<Ilan[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/giris?redirect=/favoriler');
      return;
    }
    setUserData(JSON.parse(user));
    loadFavoriler();
    
    const handleFavoriUpdate = () => loadFavoriler();
    window.addEventListener('favoriGuncelle', handleFavoriUpdate);
    return () => window.removeEventListener('favoriGuncelle', handleFavoriUpdate);
  }, []);

  const loadFavoriler = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const response = await fetch('/api/favoriler', {
        headers: { 'x-user-id': user.id.toString() }
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
        headers: { 'x-user-id': user.id.toString() }
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

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />
      
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-10">
            <ProfileSidebar userData={userData} activePage="favoriler" />

            {/* Right Content */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* Page Title */}
              <div dir="rtl">
                <h1 className="text-3xl font-bold text-gray-900">علاقه‌مندی‌ها</h1>
                <p className="text-gray-500 mt-2 text-lg">آگهی‌های مورد علاقه خود را مشاهده کنید</p>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                      <div className="aspect-[4/3] bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : favoriler.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center" dir="rtl">
                  <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
                    <Heart className="h-10 w-10 text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">لیست علاقه‌مندی‌ها خالی است</h3>
                  <p className="text-gray-500 mb-8 text-lg">آگهی‌های مورد علاقه خود را اضافه کنید!</p>
                  <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/30"
                  >
                    <Search className="w-5 h-5" />
                    کشف آگهی‌ها
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {favoriler.map((favori, index) => (
                    <motion.div
                      key={favori.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all">
                        <Link href={`/ilan/${favori.ilan_id}`} className="block">
                          <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                            <Image
                              src={getImageUrl(favori.ana_resim)}
                              alt={favori.baslik}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 50vw, 25vw"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                                {favori.kategori_ad}
                              </span>
                            </div>
                            {favori.indirim_yuzdesi && favori.indirim_yuzdesi > 0 && (
                              <div className="absolute top-3 right-12">
                                <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                                  {favori.indirim_yuzdesi}%
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm group-hover:text-blue-600 transition-colors">
                              {favori.baslik}
                            </h3>
                            
                            <div className="mb-3">
                              {favori.eski_fiyat && favori.indirim_yuzdesi ? (
                                <div className="space-y-0.5">
                                  <div className="line-through">
                                    <PriceDisplay price={favori.eski_fiyat} currency="AFN" className="text-xs text-gray-400" />
                                  </div>
                                  <PriceDisplay price={favori.fiyat} currency="AFN" className="text-lg font-bold text-red-600" />
                                </div>
                              ) : (
                                <PriceDisplay price={favori.fiyat} currency="AFN" className="text-lg font-bold text-blue-600" />
                              )}
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                <span className="truncate">{favori.il_ad}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{formatDate(favori.ilan_created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                        
                        {/* Remove Button */}
                        <button
                          onClick={(e) => { e.preventDefault(); removeFavorite(favori.ilan_id); }}
                          className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
