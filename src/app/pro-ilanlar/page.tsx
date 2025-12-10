"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Zap, Eye, Heart, ArrowRight } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import PriceDisplay from "@/components/PriceDisplay";

interface Ilan {
  id: number;
  baslik: string;
  fiyat: number;
  para_birimi?: string;
  fiyat_usd?: number;
  ana_resim: string;
  resimler?: string[];
  goruntulenme: number;
  store_level?: string;
}

export default function ProIlanlarPage() {
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriler, setFavoriler] = useState<number[]>([]);

  useEffect(() => {
    fetchProIlanlar();
    loadFavoriler();
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
        setFavoriler((data.data || []).map((f: any) => f.ilan_id));
      }
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error);
    }
  };

  const fetchProIlanlar = async () => {
    try {
      const response = await fetch('/api/ilanlar/premium?limit=50');
      const data = await response.json();
      if (data.success) {
        // Sadece pro ilanları filtrele
        const proOnly = data.data.filter((ilan: Ilan) => ilan.store_level === 'pro');
        setIlanlar(proOnly);
      }
    } catch (error) {
      console.error('Pro ilanlar yüklenirken hata:', error);
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">آگهی‌های پرو</h1>
              <p className="text-gray-500 text-sm">آگهی‌های فروشگاه‌های پرو</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square rounded-2xl bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : ilanlar.length === 0 ? (
            <div className="text-center py-16">
              <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">هنوز آگهی پرو وجود ندارد</h3>
              <p className="text-gray-500 mb-6">به زودی آگهی‌های پرو اضافه خواهند شد</p>
              <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2">
                بازگشت به صفحه اصلی
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {ilanlar.map((ilan, index) => (
                <div key={ilan.id}>
                  <Link href={`/ilan/${ilan.id}`} className="group block">
                    <div className="relative rounded-2xl bg-white shadow-[0_4px_15px_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:-translate-y-2 transition-all duration-300">
                      
                      {/* Image Area */}
                      <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-t-2xl">
                        <img
                          src={getImageUrl(
                            (ilan.resimler && ilan.resimler.length > 0 && ilan.resimler[0]) 
                              ? ilan.resimler[0] 
                              : ilan.ana_resim
                          )}
                          alt={ilan.baslik}
                          loading={index < 10 ? "eager" : "lazy"}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== '/images/placeholder.jpg') {
                              target.src = '/images/placeholder.jpg';
                            }
                          }}
                        />

                        {/* VIP Badge */}
                        <div className="absolute top-0 left-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white text-[10px] font-black px-3 py-1.5 rounded-br-xl shadow-lg">
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            VIP
                          </span>
                        </div>

                        {/* Favorite Button */}
                        <button 
                          onClick={(e) => toggleFavori(e, ilan.id)}
                          className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-all hover:bg-white ${
                            favoriler.includes(ilan.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <Heart className={`h-4 w-4 transition-colors ${
                            favoriler.includes(ilan.id) ? 'text-red-500 fill-red-500' : 'text-gray-500'
                          }`} />
                        </button>

                        {/* Pro Badge */}
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600">
                          <Zap className="w-3 h-3" />
                          <span>پرو</span>
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}


