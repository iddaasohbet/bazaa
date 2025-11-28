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
  const router = useRouter();

  useEffect(() => {
    loadFavoriler();
    
    // Favori güncellemelerini dinle
    const handleFavoriUpdate = () => {
      console.log('🔄 Favori güncellendi, yeniden yükleniyor...');
      loadFavoriler();
    };
    
    window.addEventListener('favoriGuncelle', handleFavoriUpdate);
    return () => window.removeEventListener('favoriGuncelle', handleFavoriUpdate);
  }, []);

  const loadFavoriler = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.log('⚠️ Kullanıcı giriş yapmamış, yönlendiriliyor...');
        router.push('/giris');
        return;
      }

      const user = JSON.parse(userStr);
      console.log('📋 Favoriler yükleniyor - Kullanıcı ID:', user.id);
      
      const response = await fetch('/api/favoriler', {
        headers: {
          'x-user-id': user.id.toString()
        }
      });

      const data = await response.json();
      console.log('📋 Favoriler API Response:', data);
      
      if (data.success) {
        console.log('✅ Favoriler yüklendi:', data.data.length, 'adet');
        setFavoriler(data.data || []);
      } else {
        console.error('❌ Favori yükleme başarısız:', data.message);
        setFavoriler([]);
      }
    } catch (error) {
      console.error('❌ Favoriler yüklenirken hata:', error);
      setFavoriler([]);
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
              {favoriler.map((favori, index) => (
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
                            src={getImageUrl(favori.ana_resim)}
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
                          
                          {/* İndirim Badge */}
                          {favori.indirim_yuzdesi && favori.indirim_yuzdesi > 0 && (
                            <div className="absolute top-2 right-2">
                              <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                                {favori.indirim_yuzdesi}% تخفیف
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-3 flex-1 flex flex-col">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                            {favori.baslik}
                          </h3>
                          
                          {/* Fiyat */}
                          <div className="mb-3">
                            {favori.eski_fiyat && favori.indirim_yuzdesi && favori.indirim_yuzdesi > 0 ? (
                              <div className="space-y-0.5">
                                <div className="text-xs text-gray-500 line-through">
                                  {formatPrice(favori.eski_fiyat)}
                                </div>
                                <div className="text-lg font-bold text-red-600">
                                  {formatPrice(favori.fiyat)}
                                </div>
                              </div>
                            ) : (
                              <div className="text-lg font-bold text-blue-600">
                                {formatPrice(favori.fiyat)}
                              </div>
                            )}
                          </div>

                          <div className="mt-auto space-y-2 text-xs text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                              <span className="truncate">{favori.il_ad}</span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3.5 w-3.5 text-gray-400" />
                                <span>{favori.goruntulenme || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-gray-400" />
                                <span>{formatDate(favori.ilan_created_at)}</span>
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
                      className="absolute top-2 right-2 w-8 h-8 rounded-full border-2 border-white bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-lg z-10"
                      title="حذف از علاقه مندی ها"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
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
