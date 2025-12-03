"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Store, MapPin, Eye, Phone, Star, Package, Crown, ShoppingBag, Sparkles, Zap, MessageCircle, Send, ThumbsUp, BadgeCheck, ShieldCheck, Settings, Edit, TrendingUp } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import PriceDisplay from "@/components/PriceDisplay";

interface Magaza {
  id: number;
  kullanici_id: number;
  ad: string;
  ad_dari: string;
  logo: string;
  kapak_resmi: string;
  aciklama: string;
  telefon: string;
  adres: string;
  il_ad: string;
  paket_turu: "normal" | "pro" | "premium";
  store_level?: "basic" | "pro" | "elite";
  guvenilir_satici: boolean;
  goruntulenme: number;
  ilan_sayisi: number;
}

interface Ilan {
  id: number;
  baslik: string;
  fiyat: number;
  ana_resim: string;
  kategori_ad: string;
  goruntulenme: number;
  vitrin: boolean;
}

export default function MagazaSayfasi({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [magaza, setMagaza] = useState<Magaza | null>(null);
  const [vitrinIlanlar, setVitrinIlanlar] = useState<Ilan[]>([]);
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [loading, setLoading] = useState(true);
  const [yorumlar, setYorumlar] = useState<any[]>([]);
  const [yorumStats, setYorumStats] = useState<any>(null);
  const [yeniYorum, setYeniYorum] = useState({ yorum: '', puan: 5 });
  const [yorumGonderiliyor, setYorumGonderiliyor] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Kullanıcı kontrolü
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error('User parse error:', error);
      }
    }
    
    fetchMagaza();
    fetchYorumlar();
  }, [resolvedParams.id]);

  const fetchMagaza = async () => {
    try {
      setLoading(true);
      
      // Mağaza bilgisi
      const magazaResponse = await fetch(`/api/magazalar/${resolvedParams.id}`);
      const magazaData = await magazaResponse.json();
      
      if (magazaData.success) {
        setMagaza(magazaData.data);
      }

      // Vitrin ilanları
      const vitrinResponse = await fetch(`/api/vitrin?turu=magaza&magaza_id=${resolvedParams.id}&limit=5`);
      const vitrinData = await vitrinResponse.json();
      if (vitrinData.success) {
        setVitrinIlanlar(vitrinData.data);
      }

      // Mağaza ilanları
      const ilanlarResponse = await fetch(`/api/magazalar/${resolvedParams.id}/ilanlar`);
      const ilanlarData = await ilanlarResponse.json();
      if (ilanlarData.success) {
        setIlanlar(ilanlarData.data);
      }
    } catch (error) {
      console.error('Mağaza yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchYorumlar = async () => {
    try {
      const response = await fetch(`/api/magazalar/${resolvedParams.id}/yorumlar`);
      const data = await response.json();
      if (data.success) {
        setYorumlar(data.data.yorumlar || []);
        setYorumStats(data.data.istatistikler || null);
      }
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error);
    }
  };

  const handleYorumGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('نظر دادن نیاز به ورود دارد');
      return;
    }

    if (yeniYorum.yorum.trim().length < 10) {
      alert('نظر باید حداقل ۱۰ کاراکتر باشد');
      return;
    }

    setYorumGonderiliyor(true);
    
    try {
      const response = await fetch(`/api/magazalar/${resolvedParams.id}/yorumlar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kullanici_id: user.id,
          yorum: yeniYorum.yorum,
          puan: yeniYorum.puan,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ نظر شما با موفقیت ثبت شد');
        setYeniYorum({ yorum: '', puan: 5 });
        await fetchYorumlar(); // Yorumları yeniden yükle
      } else {
        alert(data.message || 'خطا در ثبت نظر');
      }
    } catch (error) {
      console.error('Yorum gönderilirken hata:', error);
      alert('خطا در ثبت نظر');
    } finally {
      setYorumGonderiliyor(false);
    }
  };

  const isPremium = magaza?.paket_turu === "premium";
  const isPro = magaza?.paket_turu === "pro";
  const isElite = magaza?.store_level === "elite" || isPremium;

  return (
    <div className={`min-h-screen flex flex-col ${
      isElite 
        ? 'bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50' 
        : isPro
        ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
        : 'bg-gradient-to-br from-gray-50 via-white to-purple-50'
    }`}>
      <Header />
      
      <main className="flex-1 pb-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : !magaza ? (
            <div className="flex items-center justify-center py-20">
              <div className="bg-white rounded-xl border border-gray-200 p-16 text-center max-w-md" dir="rtl">
                <div className="mb-6">
                  <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  مغازه یافت نشد
                </h2>
                <p className="text-gray-600 mb-8">
                  متأسفانه این مغازه موجود نیست یا حذف شده است
                </p>
                <Link 
                  href="/" 
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-sm"
                >
                  بازگشت به صفحه اصلی
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Kapak Bölgesi - TAM GENİŞLİK */}
              <div className="relative mb-8 mt-4 sm:mt-6 md:mt-8">
                {/* Kapak Resmi - Tam Genişlik */}
                <div className={`relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ${
                  isElite 
                    ? 'border-2 sm:border-4 border-yellow-400 ring-4 sm:ring-8 ring-yellow-200/50' 
                    : isPro
                    ? 'border-2 sm:border-4 border-blue-400 ring-4 sm:ring-8 ring-blue-200/50'
                    : 'border-2 sm:border-4 border-white'
                }`}>
                  {/* Elite/Pro Badge */}
                  {(isElite || isPro) && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-20">
                      <div className={`flex items-center gap-1.5 sm:gap-2 text-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-bold shadow-2xl border-2 ${
                        isElite
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-300'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-300'
                      }`}>
                        {isElite ? (
                          <>
                            <Crown className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 fill-white" />
                            <span className="hidden sm:inline">مغازه پریمیوم</span>
                            <span className="sm:hidden">پریمیوم</span>
                            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                          </>
                        ) : (
                          <>
                            <Star className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 fill-white" />
                            <span className="hidden sm:inline">مغازه حرفه‌ای</span>
                            <span className="sm:hidden">حرفه‌ای</span>
                            <Zap className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Kapak Resmi */}
                  <div className={`relative ${isElite ? 'h-48 sm:h-56 md:h-64 lg:h-72' : isPro ? 'h-40 sm:h-48 md:h-56 lg:h-64' : 'h-32 sm:h-40 md:h-48'} ${
                    isElite 
                      ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600' 
                      : isPro
                      ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'
                      : 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600'
                  }`}>
                    {magaza.kapak_resmi ? (
                      <img
                        src={getImageUrl(magaza.kapak_resmi)}
                        alt={magaza.ad}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {isElite ? (
                          <Crown className="h-40 w-40 text-white/20" />
                        ) : (
                          <Store className="h-32 w-32 text-white/20" />
                        )}
                      </div>
                    )}
                    <div className={`absolute inset-0 ${
                      isElite 
                        ? 'bg-gradient-to-t from-black/70 via-transparent to-yellow-500/20' 
                        : 'bg-gradient-to-t from-black/60 to-transparent'
                    }`}></div>
                    
                    {/* Elite Particles */}
                    {isElite && (
                      <>
                        <div className="absolute top-10 right-20 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                        <div className="absolute top-32 right-40 w-3 h-3 bg-orange-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute top-24 left-32 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                      </>
                    )}
                  </div>
                </div>

                {/* Logo - Kapaktan Taşan - ORTADA */}
                <div className="absolute -bottom-12 sm:-bottom-16 md:-bottom-20 left-1/2 -translate-x-1/2 z-20">
                  <div className={`relative ${isElite ? 'w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40' : isPro ? 'w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36' : 'w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28'} rounded-2xl sm:rounded-3xl overflow-hidden ${
                    isElite 
                      ? 'border-2 sm:border-4 border-yellow-400 shadow-2xl bg-white ring-4 sm:ring-8 ring-yellow-300/50' 
                      : isPro
                      ? 'border-2 sm:border-4 border-blue-400 shadow-2xl bg-white ring-4 sm:ring-8 ring-blue-300/50'
                      : 'border-2 sm:border-4 border-white shadow-2xl bg-white ring-2 sm:ring-4 ring-purple-200'
                  } flex-shrink-0`}>
                    {magaza.logo ? (
                      <img
                        src={getImageUrl(magaza.logo)}
                        alt={magaza.ad}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${
                        isElite 
                          ? 'bg-gradient-to-br from-yellow-500 to-orange-600' 
                          : isPro
                          ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                          : 'bg-gradient-to-br from-gray-500 to-gray-600'
                      }`}>
                        {isElite ? (
                          <Crown className="h-16 w-16 text-white" />
                        ) : isPro ? (
                          <Star className="h-14 w-14 text-white" />
                        ) : (
                          <Store className="h-12 w-12 text-white" />
                        )}
                      </div>
                    )}
                    
                    {/* Glow Effect */}
                    {(isElite || isPro) && (
                      <div className={`absolute inset-0 animate-pulse ${
                        isElite 
                          ? 'bg-gradient-to-br from-yellow-400/20 to-orange-400/20' 
                          : 'bg-gradient-to-br from-blue-400/20 to-indigo-400/20'
                      }`}></div>
                    )}
                  </div>
                </div>

                {/* Mağaza Bilgileri */}
                <div className="relative px-4 sm:px-6 md:px-8 pt-16 sm:pt-20 md:pt-24" dir="rtl">
                  {/* Bilgiler - Elite/Pro Özel */}
                  <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl ${
                    isElite 
                      ? 'bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 border-2 sm:border-4 border-yellow-300' 
                      : isPro
                      ? 'bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border-2 sm:border-4 border-blue-300'
                      : 'bg-white border-2 border-gray-200'
                  }`}>
                      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-0 sm:justify-between mb-6">
                        <div className="flex-1 order-2 sm:order-1 w-full">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                            <h1 className={`font-bold ${
                              isElite 
                                ? 'text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent' 
                                : isPro
                                ? 'text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
                                : 'text-xl sm:text-2xl md:text-3xl text-gray-900'
                            }`}>
                              {magaza.ad_dari || magaza.ad}
                            </h1>
                            {(isElite || isPro) && (
                              <div className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold shadow-lg ${
                                isElite
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs sm:text-sm md:text-base border-2 border-yellow-300'
                                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs sm:text-sm'
                              }`}>
                                {isElite ? <Crown className="h-4 w-4 sm:h-5 sm:w-5 fill-white" /> : <Star className="h-3 w-3 sm:h-4 sm:w-4" />}
                                <span>{isElite ? 'PREMIUM' : 'PRO'}</span>
                                {isElite && <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />}
                              </div>
                            )}
                          </div>
                          
                          {/* Sadece mağaza sahibi için yönetim butonu - Mobilde üstte */}
                          {user && magaza && user.id === magaza.kullanici_id && (
                            <div className="flex sm:hidden flex-col gap-2 mb-4 w-full">
                              <Link
                                href="/magazam"
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md font-semibold"
                              >
                                <Settings className="h-4 w-4" />
                                <span className="text-sm">پنل مدیریت</span>
                              </Link>
                              
                              {/* Yükseltme Butonu */}
                              {magaza.store_level === 'basic' && (
                                <Link
                                  href="/magaza-paket"
                                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all font-bold shadow-lg"
                                >
                                  <TrendingUp className="h-4 w-4" />
                                  <span className="text-sm">ارتقای مغازه به PRO/ELITE ⭐</span>
                                </Link>
                              )}
                              {magaza.paket_turu === 'pro' && magaza.store_level !== 'elite' && (
                                <Link
                                  href="/magaza-paket"
                                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white rounded-lg transition-all font-bold shadow-lg"
                                >
                                  <Crown className="h-4 w-4 fill-white" />
                                  <span className="text-sm">ارتقا به ELITE ⭐⭐⭐</span>
                                </Link>
                              )}
                            </div>
                          )}
                          
                          {/* Rozetler */}
                          {((isElite || isPro) || magaza.guvenilir_satici) && (
                            <div className="flex items-center gap-2 mb-4 flex-wrap">
                              {/* Doğrulama Rozeti - Sadece Elite/Pro */}
                              {(isElite || isPro) && (
                                <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl shadow-lg border-2 ${
                                  isElite
                                    ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300'
                                    : 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300'
                                }`}>
                                  <BadgeCheck className={`h-4 w-4 sm:h-5 sm:w-5 ${isElite ? 'text-yellow-600' : 'text-blue-600'}`} />
                                  <span className={`text-xs sm:text-sm font-bold ${isElite ? 'text-yellow-800' : 'text-blue-800'}`}>
                                    مغازه تأیید شده
                                  </span>
                                </div>
                              )}
                              
                              {/* Güvenilir Satıcı Rozeti - Sadece Admin Açarsa */}
                              {magaza.guvenilir_satici && (
                                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl shadow-md bg-green-100 border-2 border-green-300">
                                  <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                  <span className="text-xs sm:text-sm font-bold text-green-800">
                                    فروشنده معتبر
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <p className={`mb-4 leading-relaxed ${
                            isElite ? 'text-gray-800 text-sm sm:text-base md:text-lg lg:text-xl' : 'text-gray-700 text-sm sm:text-base md:text-lg'
                          }`}>{magaza.aciklama}</p>
                        </div>
                        
                        {/* Desktop'ta yönetim butonu - Sağ üstte */}
                        {user && magaza && user.id === magaza.kullanici_id && (
                          <div className="hidden sm:flex flex-col gap-2 order-1 sm:order-2 self-start">
                            <Link
                              href="/magazam"
                              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md font-semibold"
                            >
                              <Settings className="h-4 w-4" />
                              <span className="text-sm">پنل مدیریت</span>
                            </Link>
                            
                            {/* Yükseltme Butonu */}
                            {magaza.store_level === 'basic' && (
                              <Link
                                href="/magaza-paket"
                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                              >
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-sm">ارتقا به PRO/ELITE</span>
                              </Link>
                            )}
                            {magaza.paket_turu === 'pro' && magaza.store_level !== 'elite' && (
                              <Link
                                href="/magaza-paket"
                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white rounded-lg transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                              >
                                <Crown className="h-4 w-4 fill-white" />
                                <span className="text-sm">ارتقا به ELITE ⭐</span>
                              </Link>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                          <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                          <span className="truncate">{magaza.ilan_sayisi} محصول</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                          <span className="truncate">{magaza.goruntulenme} بازدید</span>
                        </div>
                        {magaza.il_ad && (
                          <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                            <span className="truncate">{magaza.il_ad}</span>
                          </div>
                        )}
                        {magaza.telefon && (
                          <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                            <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                            <span dir="ltr" className="truncate">{magaza.telefon}</span>
                          </div>
                        )}
                      </div>

                      {magaza.telefon && (
                        <a
                          href={`tel:${magaza.telefon}`}
                          className={`inline-flex items-center justify-center gap-2 font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl transition-all shadow-lg text-sm sm:text-base w-full sm:w-auto ${
                            isElite
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-2 border-yellow-400'
                              : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-2 border-green-500'
                          }`}
                        >
                          <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span>تماس با مغازه</span>
                          {isElite && <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />}
                        </a>
                      )}
                  </div>
                </div>
              </div>

              {/* Vitrin İlanları - Elite Özel */}
              {vitrinIlanlar.length > 0 && (
                <section className={`mb-8 sm:mb-12 rounded-xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl ${
                  isElite 
                    ? 'bg-gradient-to-br from-white via-yellow-50/50 to-orange-50/50 border-2 sm:border-4 border-yellow-300 ring-2 sm:ring-4 ring-yellow-200/30' 
                    : 'bg-white border-2 border-yellow-200'
                }`} dir="rtl">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    {isElite ? (
                      <>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                          <Crown className="h-5 w-5 sm:h-7 sm:w-7 text-white fill-white" />
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                            ویترین پریمیوم
                          </h2>
                          <p className="text-xs sm:text-sm text-gray-600">محصولات ویژه این مغازه</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">ویترین مغازه</h2>
                      </>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {vitrinIlanlar.map((ilan, index) => (
                      <motion.div
                        key={ilan.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link href={`/ilan/${ilan.id}`} className="group block">
                          <div className="bg-white rounded-xl shadow-xl border-2 border-yellow-300 overflow-hidden hover:shadow-2xl hover:border-yellow-500 transition-all ring-2 ring-yellow-100">
                            <div className="relative aspect-square bg-gray-100">
                              <Image
                                src={getImageUrl(ilan.ana_resim)}
                                alt={ilan.baslik}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute top-2 right-2">
                                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                  ویترین
                                </div>
                              </div>
                            </div>
                            <div className="p-3">
                              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm group-hover:text-blue-600 transition-colors">
                                {ilan.baslik}
                              </h3>
                              <PriceDisplay 
                                price={ilan.fiyat}
                                currency="AFN"
                                className="text-lg font-bold text-gray-900"
                              />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tüm İlanlar - Elite Özel */}
              <section className={`rounded-xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl mb-8 sm:mb-12 ${
                isElite 
                  ? 'bg-gradient-to-br from-white to-yellow-50/30 border-2 sm:border-4 border-yellow-200' 
                  : 'bg-white border-2 border-gray-200'
              }`} dir="rtl">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {isElite ? (
                    <>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                        تمام محصولات
                      </h2>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">همه محصولات</h2>
                    </>
                  )}
                </div>
                {ilanlar.length === 0 ? (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 p-16 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="mb-6">
                        <svg className="w-20 h-20 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        هنوز محصولی اضافه نشده است
                      </h3>
                      <p className="text-gray-600">
                        به زودی محصولات در این مغازه قرار می‌گیرند
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                    {ilanlar.map((ilan) => (
                      <Link key={ilan.id} href={`/ilan/${ilan.id}`} className="group">
                        <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-purple-300 transition-all">
                          <div className="relative aspect-square bg-gray-100">
                            <Image
                              src={getImageUrl(ilan.ana_resim)}
                              alt={ilan.baslik}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {ilan.baslik}
                            </h3>
                            <PriceDisplay 
                              price={ilan.fiyat}
                              currency="AFN"
                              className="text-base font-bold text-gray-900"
                            />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* Yorumlar Bölümü */}
              <section className={`rounded-xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl ${
                isElite 
                  ? 'bg-gradient-to-br from-white to-purple-50/30 border-2 sm:border-4 border-purple-200' 
                  : 'bg-white border-2 border-gray-200'
              }`} dir="rtl">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isElite 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                      : 'bg-blue-100'
                  }`}>
                    <MessageCircle className={`h-5 w-5 sm:h-6 sm:w-6 ${isElite ? 'text-white' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1">
                    <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold ${
                      isElite 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent' 
                        : 'text-gray-900'
                    }`}>
                      نظرات مشتریان
                    </h2>
                    {yorumStats && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.round(parseFloat(yorumStats.ortalama_puan))
                                  ? 'fill-yellow-500 text-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {yorumStats.ortalama_puan} از {yorumStats.toplam_yorum} نظر
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Yorum Formu */}
                {user ? (
                  <form onSubmit={handleYorumGonder} className="mb-6 sm:mb-8 bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-gray-200">
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        امتیاز شما
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((puan) => (
                          <button
                            key={puan}
                            type="button"
                            onClick={() => setYeniYorum({ ...yeniYorum, puan })}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-8 w-8 ${
                                puan <= yeniYorum.puan
                                  ? 'fill-yellow-500 text-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        نظر شما
                      </label>
                      <textarea
                        value={yeniYorum.yorum}
                        onChange={(e) => setYeniYorum({ ...yeniYorum, yorum: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder="تجربه خود از خرید از این مغازه را بنویسید... (حداقل ۱۰ کاراکتر)"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={yorumGonderiliyor}
                      className={`flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-lg transition-all w-full sm:w-auto ${
                        isElite
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      } disabled:opacity-50`}
                    >
                      {yorumGonderiliyor ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          در حال ارسال...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          ثبت نظر
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="mb-6 sm:mb-8 bg-blue-50 border-2 border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center">
                    <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mx-auto mb-3" />
                    <p className="text-sm sm:text-base text-gray-700 mb-4">
                      برای ثبت نظر باید وارد حساب کاربری خود شوید
                    </p>
                    <Link
                      href="/giris"
                      className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all w-full sm:w-auto"
                    >
                      ورود / ثبت نام
                    </Link>
                  </div>
                )}

                {/* Yorumlar Listesi */}
                <div className="space-y-4">
                  {yorumlar.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">هنوز نظری ثبت نشده است</p>
                      <p className="text-sm text-gray-400 mt-2">اولین نفری باشید که نظر می‌دهد!</p>
                    </div>
                  ) : (
                    yorumlar.map((yorum) => (
                      <div
                        key={yorum.id}
                        className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-purple-300 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">
                              {yorum.kullanici_ad?.charAt(0) || 'K'}
                            </span>
                          </div>

                          <div className="flex-1">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="font-bold text-gray-900">{yorum.kullanici_ad}</div>
                                <div className="text-xs text-gray-500">
                                  {new Date(yorum.created_at).toLocaleDateString('fa-AF')}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < yorum.puan
                                        ? 'fill-yellow-500 text-yellow-500'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Yorum Metni */}
                            <p className="text-gray-700 leading-relaxed">{yorum.yorum}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

