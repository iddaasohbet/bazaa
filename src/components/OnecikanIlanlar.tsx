"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Eye, Heart } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import PriceDisplay from "@/components/PriceDisplay";
import { safeFetchJson } from "@/lib/safeFetch";

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

export default function OnecikanIlanlar() {
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriler, setFavoriler] = useState<number[]>([]);

  useEffect(() => {
    fetchOnecikanIlanlar();
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
      
      const data = await safeFetchJson<{ success: boolean; data: any[] }>(`/api/favoriler`, {
        timeoutMs: 10_000,
        retries: 0,
        headers: {
          'x-user-id': user.id.toString(),
        },
      });
      
      if (data.success) {
        const favoriIds = (data.data || []).map((f: any) => f.ilan_id);
        setFavoriler(favoriIds);
      }
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error);
    }
  };

  const fetchOnecikanIlanlar = async () => {
    try {
      const data = await safeFetchJson<{ success: boolean; data: Ilan[] }>(`/api/ilanlar/onecikan`, {
      timeoutMs: 15_000,
      retries: 0,
      cacheKey: "onecikan",
      cacheTtlMs: 60 * 1000,
    });
    if (data?.success && Array.isArray(data.data)) {
      setIlanlar(data.data);
    }
    } catch (error) {
      console.error('Öne çıkan ilanlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Öne çıkan ilanlar yoksa gösterme
  if (loading || ilanlar.length === 0) {
    return null;
  }

  return (
    <div className="mb-8" dir="rtl">
      {/* Header - Sade Kurumsal */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
          <div>
            <h2 className="text-base font-bold text-gray-900">آگهی‌های ویژه</h2>
            <p className="text-gray-400 text-[11px]">محصولات برگزیده توسط تیم ما</p>
          </div>
        </div>
      </div>

      {/* Öne Çıkan İlanlar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        {ilanlar.map((ilan, index) => (
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

                  {/* Favorite Button - Top Right */}
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
                      
                      try {
                        if (isFavorite) {
                          const response = await fetch(`/api/favoriler?ilanId=${ilan.id}`, {
                            method: 'DELETE',
                            headers: {
                              'x-user-id': user.id.toString()
                            }
                          });
                          await response.json();
                          setFavoriler(prev => prev.filter(id => id !== ilan.id));
                        } else {
                          const response = await fetch('/api/favoriler', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'x-user-id': user.id.toString()
                            },
                            body: JSON.stringify({ ilanId: ilan.id })
                          });
                          await response.json();
                          setFavoriler(prev => [...prev, ilan.id]);
                        }
                        
                        window.dispatchEvent(new Event('favoriGuncelle'));
                      } catch (error) {
                        console.error('Favori işlemi hatası:', error);
                      }
                    }}
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

                  {/* Öne Çıkan Badge - Bottom Right */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow-lg bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600">
                    <Star className="w-3 h-3 fill-white" />
                    <span>ویژه</span>
                  </div>
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
        ))}
      </div>

    </div>
  );
}

