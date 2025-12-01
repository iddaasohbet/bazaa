"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Crown, MapPin, Eye, Heart, Sparkles, Store, TrendingUp } from "lucide-react";
import { formatPrice, getImageUrl } from "@/lib/utils";

interface Ilan {
  id: number;
  baslik: string;
  fiyat: number;
  eski_fiyat?: number;
  indirim_yuzdesi?: number;
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

export default function EliteIlanlar() {
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriler, setFavoriler] = useState<number[]>([]);

  useEffect(() => {
    fetchEliteIlanlar();
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

  const fetchEliteIlanlar = async () => {
    try {
      const response = await fetch('/api/ilanlar?limit=24');
      const data = await response.json();
      if (data.success) {
        // Elite ilanları filtrele - store_level === 'elite' olanlar
        const eliteIlanlar = data.data.filter((i: any) => i.store_level === 'elite');
        setIlanlar(eliteIlanlar.slice(0, 6)); // İlk 6 Elite ilan
      }
    } catch (error) {
      console.error('Elite ilanlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Crown className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">محصولات ویژه پریمیوم</h2>
            <p className="text-gray-600">از مغازه‌های برتر</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Elite ilanları yoksa gösterme
  if (loading || ilanlar.length === 0) {
    return null;
  }

  return (
    <div className="mb-12" dir="rtl">
      {/* Header */}
      <div className="relative mb-6 bg-gradient-to-r from-yellow-50 via-orange-50 to-amber-50 rounded-xl border border-yellow-200 p-4 overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5">
          <Crown className="h-24 w-24 text-yellow-600" />
        </div>
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              محصولات ویژه پریمیوم
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </h2>
            <p className="text-sm text-gray-600">از برترین مغازه‌های پلتفرم</p>
          </div>
        </div>
      </div>

      {/* Elite İlanlar Grid - Normal boyutta */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
        {ilanlar.map((ilan, index) => (
          <motion.div
            key={ilan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/ilan/${ilan.id}`} className="group block h-full">
              <div className="relative h-full bg-white rounded-xl border-2 border-yellow-300 overflow-hidden hover:shadow-2xl hover:border-yellow-500 transition-all duration-300 ring-2 ring-yellow-100">
                {/* Premium Badge - Küçük */}
                <div className="absolute top-2 right-2 z-10">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg">
                    <Crown className="h-3 w-3 fill-white" />
                    <span>ELITE</span>
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
                <div className="relative aspect-video bg-gradient-to-br from-yellow-50 to-orange-50 overflow-hidden">
                  <Image
                    src={getImageUrl(ilan.resimler?.[0] || ilan.ana_resim)}
                    alt={ilan.baslik}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 16vw"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
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
                      const isFavorite = favoriler.includes(ilan.id);
                      
                      console.log('⭐ Elite - Favori işlemi - İlan ID:', ilan.id, 'Favoride mi?', isFavorite);
                      
                      try {
                        if (isFavorite) {
                          // Favoriden çıkar
                          console.log('🗑️ Elite - Favoriden çıkarılıyor...');
                          const response = await fetch(`/api/favoriler?ilanId=${ilan.id}`, {
                            method: 'DELETE',
                            headers: {
                              'x-user-id': user.id.toString()
                            }
                          });
                          const data = await response.json();
                          console.log('✅ Elite - API Response (DELETE):', data);
                          setFavoriler(prev => prev.filter(id => id !== ilan.id));
                        } else {
                          // Favoriye ekle
                          console.log('➕ Elite - Favoriye ekleniyor...');
                          const response = await fetch('/api/favoriler', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'x-user-id': user.id.toString()
                            },
                            body: JSON.stringify({ ilanId: ilan.id })
                          });
                          const data = await response.json();
                          console.log('✅ Elite - API Response (POST):', data);
                          setFavoriler(prev => [...prev, ilan.id]);
                        }
                        
                        // Header'ı ve favoriler sayfasını güncelle
                        console.log('📢 Elite - favoriGuncelle event dispatch ediliyor...');
                        window.dispatchEvent(new Event('favoriGuncelle'));
                      } catch (error) {
                        console.error('❌ Elite - Favori işlemi hatası:', error);
                      }
                    }}
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-all z-20"
                  >
                    <Heart className={`h-4 w-4 transition-colors ${
                      favoriler.includes(ilan.id)
                        ? 'text-red-500 fill-red-500' 
                        : 'text-gray-600'
                    }`} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-3">
                  {/* Store Badge - Küçük */}
                  {ilan.magaza_ad && (
                    <div className="flex items-center gap-1 mb-2">
                      <Store className="h-3 w-3 text-yellow-600" />
                      <span className="text-[10px] font-semibold text-yellow-700 bg-yellow-50 px-1.5 py-0.5 rounded truncate">
                        {ilan.magaza_ad}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight group-hover:text-yellow-600 transition-colors">
                    {ilan.baslik}
                  </h3>
                  
                  {/* Price */}
                  <div className="mb-3">
                    {ilan.indirim_yuzdesi && ilan.indirim_yuzdesi > 0 ? (
                      <div className="space-y-0.5">
                        {ilan.eski_fiyat && (
                          <div className="text-xs text-gray-500 line-through">
                            {formatPrice(ilan.eski_fiyat)}
                          </div>
                        )}
                        <div className="text-lg font-bold text-red-600">
                          {formatPrice(ilan.fiyat)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-gray-900">
                        {formatPrice(ilan.fiyat)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex items-center justify-between pt-2 border-t border-yellow-100">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="h-3.5 w-3.5 text-yellow-600" />
                      <span className="text-xs truncate">{ilan.il_ad}</span>
                    </div>
                    {/* Mağaza Butonu - Elite İlanlar */}
                    {ilan.magaza_slug && (
                      <Link
                        href={`/magaza/${ilan.magaza_slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">مغازه</span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

    </div>
  );
}

