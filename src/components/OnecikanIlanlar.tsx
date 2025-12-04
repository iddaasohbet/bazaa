"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, Eye, Heart, TrendingUp, Sparkles } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import PriceDisplay from "@/components/PriceDisplay";

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

  const fetchOnecikanIlanlar = async () => {
    try {
      const response = await fetch('/api/ilanlar/onecikan', {
        next: { revalidate: 60 } // 60 saniye cache
      });
      const data = await response.json();
      if (data.success) {
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
    <div className="mb-12" dir="rtl">
      {/* Header */}
      <div className="relative mb-6 bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 rounded-xl border border-orange-200 p-4 overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5">
          <Star className="h-24 w-24 text-orange-600" />
        </div>
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
            <Star className="h-6 w-6 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              آگهی‌های ویژه
              <Sparkles className="h-4 w-4 text-orange-500" />
            </h2>
            <p className="text-sm text-gray-600">محصولات برگزیده توسط تیم ما</p>
          </div>
        </div>
      </div>

      {/* Öne Çıkan İlanlar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
        {ilanlar.map((ilan, index) => (
          <motion.div
            key={ilan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/ilan/${ilan.id}`} className="group block h-full">
              <div className="overflow-hidden rounded-xl bg-white border-2 border-orange-400 transition-all hover:shadow-xl hover:border-orange-500 h-full flex flex-col">
                {/* Image */}
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(ilan.resimler?.[0] || ilan.ana_resim)}
                    alt={ilan.baslik}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.png';
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Öne Çıkan Badge - Sol üst */}
                  <div className="absolute top-2 left-2">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-lg">
                      <Star className="h-3 w-3 fill-white" />
                      <span>ویژه</span>
                    </div>
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
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight group-hover:text-orange-600 transition-colors">
                    {ilan.baslik}
                  </h3>
                  
                  {/* Fiyat Bölümü */}
                  <div className="mb-3">
                    {ilan.indirim_yuzdesi && ilan.indirim_yuzdesi > 0 ? (
                      <div className="space-y-1">
                        {/* İndirim Badge */}
                        <div className="flex items-center gap-2">
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                            {ilan.indirim_yuzdesi}% تخفیف
                          </span>
                        </div>
                        {/* Eski Fiyat */}
                        {ilan.eski_fiyat && (
                          <div className="line-through">
                            <PriceDisplay 
                              price={ilan.eski_fiyat}
                              currency={(ilan.para_birimi as 'AFN' | 'USD') || 'AFN'}
                              className="text-sm text-gray-500"
                            />
                          </div>
                        )}
                        {/* Yeni Fiyat */}
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
                        className="text-lg font-bold text-orange-600"
                      />
                    )}
                  </div>

                  <div className="mt-auto space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                      <span className="truncate">{ilan.il_ad}</span>
                    </div>
                    {ilan.goruntulenme > 0 && (
                      <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                        <Eye className="h-3.5 w-3.5 text-gray-400" />
                        <span>{ilan.goruntulenme}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

    </div>
  );
}

