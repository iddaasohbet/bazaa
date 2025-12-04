"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Eye, Clock, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate, getImageUrl } from "@/lib/utils";
import PriceDisplay from "@/components/PriceDisplay";

interface Ilan {
  id: number;
  baslik: string;
  fiyat: number;
  eski_fiyat?: number;
  indirim_yuzdesi?: number;
  fiyat_tipi: string;
  para_birimi?: string;
  fiyat_usd?: number;
  ana_resim: string;
  kategori_ad: string;
  kategori_slug: string;
  il_ad: string;
  durum: string;
  goruntulenme: number;
  created_at: string;
  resimler?: string[];
  resim_sayisi: number;
  store_level?: string;
  magaza_id?: number;
  magaza_slug?: string;
  magaza_ad?: string;
}

export default function AdList() {
  const router = useRouter();
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [favoriler, setFavoriler] = useState<number[]>([]);

  useEffect(() => {
    fetchIlanlar();
    loadFavoriler();
    
    // Favori güncellemelerini dinle
    const handleFavoriUpdate = () => {
      loadFavoriler();
    };
    
    window.addEventListener('favoriGuncelle', handleFavoriUpdate);
    return () => window.removeEventListener('favoriGuncelle', handleFavoriUpdate);
  }, []);

  const loadFavoriler = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      const user = JSON.parse(userStr);
      if (!user?.id) return;
      
      const response = await fetch('/api/favoriler', {
        headers: {
          'x-user-id': user.id.toString()
        }
      });

      const data = await response.json();
      
      if (data.success) {
        const favoriIds = (data.data || []).map((f: any) => f.ilan_id);
        setFavoriler(favoriIds);
      }
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error);
    }
  };

  const fetchIlanlar = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const currentOffset = loadMore ? offset : 0;
      // ⚡ OPTIMIZE: İlk yüklemede 12 ilan, sonrasında 12'şer daha yükle
      const response = await fetch(`/api/ilanlar?limit=12&offset=${currentOffset}`, {
        next: { revalidate: 60 } // 60 saniye cache
      });
      const data = await response.json();
      
      if (data.success) {
        if (loadMore) {
          setIlanlar(prev => [...prev, ...data.data]);
        } else {
          setIlanlar(data.data);
        }
        
        setOffset(currentOffset + 12);
        setHasMore(data.data.length === 12);
      }
    } catch (error) {
      console.error('خطا در بارگذاری آگهی ها:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const durumBadges: { [key: string]: { text: string; color: string } } = {
    'yeni': { text: 'نو', color: 'bg-green-100 text-green-700' },
    'az_kullanilmis': { text: 'کم استفاده', color: 'bg-blue-100 text-blue-700' },
    'kullanilmis': { text: 'استفاده شده', color: 'bg-gray-100 text-gray-700' },
    'hasarli': { text: 'آسیب دیده', color: 'bg-red-100 text-red-700' },
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video bg-gray-200 rounded-xl mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (ilanlar.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">هنوز آگهی ای وجود ندارد</h3>
        <p className="text-gray-600 mb-6">اولین آگهی را شما ثبت کنید!</p>
        <Link href="/ilan-ver" className="btn-primary inline-block">
          ثبت آگهی
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6" dir="rtl">
        <h2 className="text-2xl font-bold text-gray-900">همه آگهی‌ها</h2>
        <p className="text-gray-600 text-sm mt-1">آخرین آگهی‌های ثبت شده</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {ilanlar.map((ilan, index) => {
          const durumBadge = durumBadges[ilan.durum] || durumBadges['kullanilmis'];
          
          return (
            <motion.div
              key={ilan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/ilan/${ilan.id}`} className="group block h-full">
                <div className="overflow-hidden rounded-xl bg-white border border-gray-200 transition-all hover:shadow-xl hover:border-blue-300 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative aspect-video bg-gray-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(
                        (ilan.resimler && ilan.resimler.length > 0 && ilan.resimler[0]) 
                          ? ilan.resimler[0] 
                          : ilan.ana_resim
                      )}
                      alt={ilan.baslik}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== '/images/placeholder.jpg' && target.src !== '/placeholder.svg') {
                          target.src = '/images/placeholder.jpg';
                        }
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
                        {ilan.kategori_ad}
                      </span>
                    </div>
                    
                              {/* Favorite Button */}
                              <button 
                                onClick={async (e) => { 
                                  e.preventDefault(); 
                                  e.stopPropagation();
                                  
                                  const userStr = localStorage.getItem('user');
                                  if (!userStr) {
                                    alert('لطفاً ابتدا وارد شوید');
                                    return;
                                  }

                                  const user = JSON.parse(userStr);
                                  if (!user?.id) {
                                    alert('خطا در شناسایی کاربر');
                                    return;
                                  }
                                  
                                  const isFavorite = favoriler.includes(ilan.id);
                                  
                                  console.log('❤️ Favori işlemi - İlan ID:', ilan.id, 'Favoride mi?', isFavorite);
                                  
                                  try {
                                    if (isFavorite) {
                                      // Favoriden çıkar
                                      console.log('🗑️ Favoriden çıkarılıyor...');
                                      const response = await fetch(`/api/favoriler?ilanId=${ilan.id}`, {
                                        method: 'DELETE',
                                        headers: {
                                          'x-user-id': user.id.toString()
                                        }
                                      });
                                      const data = await response.json();
                                      console.log('✅ API Response (DELETE):', data);
                                      setFavoriler(prev => prev.filter(id => id !== ilan.id));
                                    } else {
                                      // Favoriye ekle
                                      console.log('➕ Favoriye ekleniyor...');
                                      const response = await fetch('/api/favoriler', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                          'x-user-id': user.id.toString()
                                        },
                                        body: JSON.stringify({ ilanId: ilan.id })
                                      });
                                      const data = await response.json();
                                      console.log('✅ API Response (POST):', data);
                                      setFavoriler(prev => [...prev, ilan.id]);
                                    }
                                    
                                    console.log('📢 favoriGuncelle event dispatch ediliyor...');
                                    window.dispatchEvent(new Event('favoriGuncelle'));
                                  } catch (error) {
                                    console.error('❌ Favori işlemi hatası:', error);
                                  }
                                }}
                                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-all"
                              >
                                <Heart className={`h-4 w-4 transition-colors ${
                                  favoriler.includes(ilan.id)
                                    ? 'text-red-500 fill-red-500' 
                                    : 'text-gray-600'
                                }`} />
                              </button>
                  </div>

                  {/* Content */}
                  <div className="p-3 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                      {ilan.baslik}
                    </h3>
                    
                    {/* Fiyat Bölümü - İndirim Gösterimi */}
                    <div className="mb-3">
                      {ilan.indirim_yuzdesi && ilan.indirim_yuzdesi > 0 && (ilan.store_level === 'pro' || ilan.store_level === 'elite') ? (
                        <div className="space-y-1">
                          {/* İndirim Badge */}
                          <div className="flex items-center gap-2">
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                              {ilan.indirim_yuzdesi}% تخفیف
                            </span>
                          </div>
                          {/* Eski Fiyat (Üstü Çizili) */}
                          {ilan.eski_fiyat && (
                            <div className="line-through">
                              <PriceDisplay 
                                price={ilan.eski_fiyat} 
                                currency={(ilan.para_birimi as 'AFN' | 'USD') || 'AFN'}
                                className="text-sm text-gray-500"
                              />
                            </div>
                          )}
                          {/* Yeni İndirimli Fiyat */}
                          <PriceDisplay 
                            price={ilan.para_birimi === 'USD' && ilan.fiyat_usd ? ilan.fiyat_usd : ilan.fiyat}
                            currency={(ilan.para_birimi as 'AFN' | 'USD') || 'AFN'}
                            className="text-lg font-bold text-red-600"
                          />
                        </div>
                      ) : (
                        <PriceDisplay 
                          price={ilan.para_birimi === 'USD' && ilan.fiyat_usd ? ilan.fiyat_usd : ilan.fiyat}
                          currency={(ilan.para_birimi as 'AFN' | 'USD') || 'AFN'}
                          className="text-lg font-bold text-blue-600"
                        />
                      )}
                    </div>

                    <div className="mt-auto space-y-2 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                        <span className="truncate">{ilan.il_ad}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        {/* Göz ikonu - Sadece Pro/Elite mağazalarda */}
                        {(ilan.store_level === 'pro' || ilan.store_level === 'elite') && ilan.magaza_slug ? (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              router.push(`/magaza/${ilan.magaza_slug}`);
                            }}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                              ilan.store_level === 'elite'
                                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span className="font-semibold">مغازه</span>
                          </button>
                        ) : (
                          <div></div>
                        )}
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
          );
        })}
      </div>

    </div>
  );
}

