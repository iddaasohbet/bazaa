"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Crown, Zap, Eye, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/utils";
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
  const [toplamIlan, setToplamIlan] = useState(0);

  useEffect(() => {
    fetchIlanlar();
    loadFavoriler();
    
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
      const response = await fetch(`/api/ilanlar?limit=15&offset=${currentOffset}`, {
        cache: 'force-cache',
      });
      const data = await response.json();
      
      if (data.success) {
        if (loadMore) {
          setIlanlar(prev => [...prev, ...data.data]);
        } else {
          setIlanlar(data.data);
        }
        
        setOffset(currentOffset + 15);
        setHasMore(data.data.length === 15);
        
        // Toplam ilan sayısını al
        if (data.total) {
          setToplamIlan(data.total);
        }
      }
    } catch (error) {
      console.error('خطا در بارگذاری آگهی ها:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const toggleFavori = async (e: React.MouseEvent, ilanId: number) => {
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
    
    const isFavorite = favoriler.includes(ilanId);
    
    try {
      if (isFavorite) {
        await fetch(`/api/favoriler?ilanId=${ilanId}`, {
          method: 'DELETE',
          headers: { 'x-user-id': user.id.toString() }
        });
        setFavoriler(prev => prev.filter(id => id !== ilanId));
      } else {
        await fetch('/api/favoriler', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user.id.toString()
          },
          body: JSON.stringify({ ilanId })
        });
        setFavoriler(prev => [...prev, ilanId]);
      }
      window.dispatchEvent(new Event('favoriGuncelle'));
    } catch (error) {
      console.error('Favori işlemi hatası:', error);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square rounded-2xl bg-gray-100 border border-gray-50 mb-2"></div>
            <div className="h-3 bg-gray-100 rounded mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (ilanlar.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Eye className="w-8 h-8 text-gray-400 stroke-[1.5]" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">هنوز آگهی ای وجود ندارد</h3>
        <p className="text-gray-400 text-sm mb-6">اولین آگهی را شما ثبت کنید!</p>
        <Link href="/ilan-ver" className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors inline-block">
          ثبت آگهی
        </Link>
      </div>
    );
  }

  return (
    <div dir="rtl">
      {/* Header - Kurumsal & Sade */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="w-6 h-6 text-gray-800 stroke-[1.5]" />
          <div>
            <h2 className="text-base font-bold text-gray-900">همه آگهی‌ها</h2>
            <p className="text-gray-400 text-[11px]">آخرین آگهی‌های ثبت شده</p>
          </div>
        </div>
        <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg">
          {toplamIlan.toLocaleString('fa-IR')} آگهی
        </span>
      </div>

      {/* Grid - Kurumsal */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
        {ilanlar.map((ilan, index) => {
          const isVIP = ilan.store_level === 'pro' || ilan.store_level === 'elite';
          
          return (
            <div key={ilan.id}>
              <Link href={`/ilan/${ilan.id}`} className="group block">
                <div className="relative rounded-2xl bg-white shadow-[0_4px_15px_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:-translate-y-2 transition-all duration-300">
                  
                  {/* Image Area - Top */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-t-2xl">
                    <Image
                      src={getImageUrl(
                        (ilan.resimler && ilan.resimler.length > 0 && ilan.resimler[0])
                          ? ilan.resimler[0]
                          : ilan.ana_resim
                      )}
                      alt={ilan.baslik}
                      fill
                      priority={index < 8}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 20vw, 200px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        if (img.src && !img.src.includes("/images/placeholder.jpg")) {
                          img.src = "/images/placeholder.jpg";
                        }
                      }}
                    />

                    {/* VIP Badge - Top Left (RTL'de sağ üst) - Dikkat Çekici */}
                    {isVIP && (
                      <div className={`absolute top-0 left-0 ${
                        ilan.store_level === 'elite' 
                          ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600' 
                          : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600'
                      } text-white text-[10px] font-black px-3 py-1.5 rounded-br-xl shadow-lg`}>
                        <span className="flex items-center gap-1">
                          {ilan.store_level === 'elite' ? <Crown className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                          VIP
                        </span>
                      </div>
                    )}

                    {/* Favorite Button - Top Right (RTL'de sol üst) */}
                    <button 
                      onClick={(e) => toggleFavori(e, ilan.id)}
                      className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-all hover:bg-white ${
                        favoriler.includes(ilan.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Heart className={`h-4 w-4 transition-colors ${
                        favoriler.includes(ilan.id)
                          ? 'text-red-500 fill-red-500' 
                          : 'text-gray-500'
                      }`} />
                    </button>

                    {/* Package Badge - Bottom Right (RTL'de sol alt) - Renkli */}
                    {isVIP && (
                      <div className={`absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow-lg ${
                        ilan.store_level === 'elite' 
                          ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600' 
                          : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600'
                      }`}>
                        {ilan.store_level === 'elite' ? <Crown className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                        <span>{ilan.store_level === 'elite' ? 'پریمیوم' : 'پرو'}</span>
                      </div>
                    )}
                  </div>

                  {/* Content Area - Bottom */}
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-xs mb-2 line-clamp-2 min-h-[32px] leading-tight">
                      {ilan.baslik}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <PriceDisplay 
                        price={ilan.para_birimi === 'USD' && ilan.fiyat_usd ? ilan.fiyat_usd : ilan.fiyat}
                        currency={(ilan.para_birimi as 'AFN' | 'USD') || 'AFN'}
                        className="text-sm font-bold text-blue-600"
                      />
                      
                      <div className="flex items-center gap-1 text-gray-400 text-[11px]">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{ilan.goruntulenme || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Load More - Sade */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => fetchIlanlar(true)}
            disabled={loadingMore}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium text-sm transition-colors"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                در حال بارگذاری...
              </span>
            ) : (
              'مشاهده بیشتر'
            )}
          </button>
        </div>
      )}
    </div>
  );
}









