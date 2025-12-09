"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Crown, Sparkles, Star, Heart, ArrowLeft, Verified, Shield, Eye, Zap } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import PriceDisplay from "@/components/PriceDisplay";

interface PremiumIlan {
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
  store_level: string;
  magaza_id: number;
  magaza_ad: string;
  magaza_ad_dari?: string;
  magaza_slug: string;
  magaza_logo?: string;
}

export default function PremiumAds() {
  const [ilanlar, setIlanlar] = useState<PremiumIlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriler, setFavoriler] = useState<number[]>([]);

  // Elite ve Pro ilanları ayır
  const eliteIlanlar = ilanlar.filter(ilan => ilan.store_level === 'elite');
  const proIlanlar = ilanlar.filter(ilan => ilan.store_level === 'pro');

  useEffect(() => {
    fetchPremiumIlanlar();
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
        headers: { 'x-user-id': user.id.toString() }
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

  const fetchPremiumIlanlar = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ilanlar/premium?limit=16');
      const data = await response.json();

      if (data.success) {
        setIlanlar(data.data);
      }
    } catch (error) {
      console.error('Premium ilanlar yüklenemedi:', error);
    } finally {
      setLoading(false);
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
    if (!user?.id) return;

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

  // Eğer hiç ilan yoksa gösterme
  if (!loading && ilanlar.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-8 mb-8">
        <div>
          <div className="h-12 w-48 rounded-lg bg-gray-100 animate-pulse mb-4"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-2xl bg-gray-100 border border-gray-50"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Kart componenti - Kurumsal & Sade
  const IlanCard = ({ ilan, isElite, index }: { ilan: PremiumIlan; isElite: boolean; index?: number }) => (
    <div>
      <Link href={`/ilan/${ilan.id}`} className="group block">
        <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
          
          {/* Image Area */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={(() => {
                if (ilan.resimler && Array.isArray(ilan.resimler) && ilan.resimler.length > 0 && ilan.resimler[0]) {
                  return getImageUrl(ilan.resimler[0]);
                }
                if (ilan.ana_resim) {
                  return getImageUrl(ilan.ana_resim);
                }
                return '/images/placeholder.jpg';
              })()}
              alt={ilan.baslik}
              loading={(index !== undefined && index < 4) ? "eager" : "lazy"}
              decoding="async"
              className="w-full h-full object-contain p-4 rounded-xl transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('placeholder')) {
                  target.src = '/images/placeholder.jpg';
                }
              }}
            />

            {/* VIP Badge - Top Left (RTL'de sağ üst) - Dikkat Çekici */}
            <div className={`absolute top-0 left-0 ${
              isElite 
                ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500' 
                : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600'
            } text-white text-[10px] font-black px-3 py-1.5 rounded-br-xl shadow-lg`}>
              <span className="flex items-center gap-1">
                {isElite ? <Crown className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                VIP
              </span>
            </div>

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
            <div className={`absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow-lg ${
              isElite 
                ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500' 
                : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600'
            }`}>
              {isElite ? <Crown className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
              <span>{isElite ? 'پریمیوم' : 'پرو'}</span>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-3">
            <h3 className="font-medium text-gray-900 text-xs mb-2 line-clamp-2 min-h-[32px] leading-tight">
              {ilan.baslik}
            </h3>

            <div className="flex items-center justify-between">
              <PriceDisplay
                price={ilan.para_birimi === 'USD' && ilan.fiyat_usd ? ilan.fiyat_usd : ilan.fiyat}
                currency={(ilan.para_birimi as 'AFN' | 'USD') || 'AFN'}
                className="text-sm font-bold text-gray-900"
              />

              {/* View Details Button - Sade */}
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-[10px] font-medium">
                <Eye className="w-3 h-3" />
                <span>مشاهده</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="space-y-8 mb-8" dir="rtl">
      
      {/* ========== PREMIUM VİTRİN (Elite) - Kurumsal ========== */}
      {eliteIlanlar.length > 0 && (
        <div>
          {/* Premium Section Header - Sade */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-gray-800 stroke-[1.5]" />
              <div>
                <h2 className="text-base font-bold text-gray-900">ویترین پریمیوم</h2>
                <p className="text-gray-400 text-[11px]">آگهی‌های فروشگاه‌های پریمیوم</p>
              </div>
            </div>
            
            <Link 
              href="/premium-ilanlar"
              className="hidden sm:flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors text-xs font-medium"
            >
              <span>همه</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Premium Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {eliteIlanlar.slice(0, 8).map((ilan, index) => (
              <IlanCard key={ilan.id} ilan={ilan} isElite={true} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* ========== PRO VİTRİN - Kurumsal ========== */}
      {proIlanlar.length > 0 && (
        <div>
          {/* Pro Section Header - Sade */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-gray-800 stroke-[1.5]" />
              <div>
                <h2 className="text-base font-bold text-gray-900">ویترین پرو</h2>
                <p className="text-gray-400 text-[11px]">آگهی‌های فروشگاه‌های حرفه‌ای</p>
              </div>
            </div>
            
            <Link 
              href="/pro-ilanlar"
              className="hidden sm:flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors text-xs font-medium"
            >
              <span>همه</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Pro Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {proIlanlar.slice(0, 8).map((ilan, index) => (
              <IlanCard key={ilan.id} ilan={ilan} isElite={false} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile View All Buttons - Sade */}
      <div className="sm:hidden space-y-2">
        {eliteIlanlar.length > 0 && (
          <Link 
            href="/premium-ilanlar"
            className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-medium text-sm transition-colors"
          >
            <Crown className="w-4 h-4" />
            <span>همه آگهی‌های پریمیوم</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        )}
        {proIlanlar.length > 0 && (
          <Link 
            href="/pro-ilanlar"
            className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-medium text-sm transition-colors"
          >
            <Zap className="w-4 h-4" />
            <span>همه آگهی‌های پرو</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}


