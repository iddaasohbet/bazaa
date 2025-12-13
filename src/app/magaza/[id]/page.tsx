"use client";

import { useState, useEffect, useRef, use } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Store, MapPin, Eye, Phone, Star, Package, Crown, ShoppingBag, Sparkles, Zap, MessageCircle, Send, ThumbsUp, BadgeCheck, ShieldCheck, Settings, Edit, TrendingUp, ChevronLeft, ChevronRight, Clock, Truck, Award, Users, Calendar, CheckCircle, Heart } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import PriceDisplay from "@/components/PriceDisplay";
import MagazaStatsPanel from "@/components/MagazaStatsPanel";

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
  created_at?: string;
  onaylandi?: boolean;
  tema_renk?: string;
}

interface Ilan {
  id: number;
  baslik: string;
  fiyat: number;
  para_birimi?: string;
  fiyat_usd?: number;
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
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  // Hero slider otomatik geçiş
  useEffect(() => {
    if (ilanlar.length > 1) {
      const maxSlides = Math.min(5, ilanlar.length);
      const interval = setInterval(() => {
        setHeroSlideIndex((prev) => (prev + 1) % maxSlides);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [ilanlar.length]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error('User parse error:', error);
      }
    }

    const controller = new AbortController();
    void fetchAll(controller.signal);

    return () => controller.abort();
  }, [resolvedParams.id]);

  const fetchAll = async (signal: AbortSignal) => {
    try {
      setLoading(true);

      // 1) Mağaza bilgisi: sayfayı hızlı göstermek için önce bunu çekiyoruz
      const magazaResponse = await fetch(`/api/magazalar/${resolvedParams.id}`, { signal, cache: 'no-store' });
      const magazaData = await magazaResponse.json();
      if (magazaData?.success) setMagaza(magazaData.data);

      // Mağaza geldiyse loading'i bitir, kalanlar arkadan dolsun
      setLoading(false);

      // 2) Kalan veriler paralel
      const [vitrinRes, ilanlarRes, yorumlarRes] = await Promise.allSettled([
        fetch(`/api/vitrin?turu=magaza&magaza_id=${resolvedParams.id}&limit=10`, { signal }).then((r) => r.json()),
        fetch(`/api/magazalar/${resolvedParams.id}/ilanlar`, { signal }).then((r) => r.json()),
        fetch(`/api/magaza-yorumlar?magaza_id=${resolvedParams.id}`, { signal }).then((r) => r.json()),
      ]);

      if (vitrinRes.status === "fulfilled" && vitrinRes.value?.success) {
        setVitrinIlanlar(vitrinRes.value.data || []);
      }
      if (ilanlarRes.status === "fulfilled" && ilanlarRes.value?.success) {
        setIlanlar(ilanlarRes.value.data || []);
      }
      if (yorumlarRes.status === "fulfilled" && yorumlarRes.value?.success) {
        setYorumlar(yorumlarRes.value.data?.yorumlar || []);
        setYorumStats(yorumlarRes.value.data?.stats || null);
      }
    } catch (error) {
      // Abort ise sessiz geç
      if ((error as any)?.name === "AbortError") return;
      console.error('Mağaza yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshYorumlar = async () => {
    try {
      const response = await fetch(`/api/magaza-yorumlar?magaza_id=${resolvedParams.id}`);
      const data = await response.json();
      if (data?.success) {
        setYorumlar(data.data?.yorumlar || []);
        setYorumStats(data.data?.stats || null);
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
      const response = await fetch(`/api/magaza-yorumlar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          magaza_id: parseInt(resolvedParams.id),
          kullanici_id: user.id,
          yorum: yeniYorum.yorum,
          puan: yeniYorum.puan,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ نظر شما با موفقیت ثبت شد');
        setYeniYorum({ yorum: '', puan: 5 });
        void refreshYorumlar();
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

  // scrollSlider fonksiyonu kaldırıldı

  const isPremium = magaza?.paket_turu === "premium";
  const isPro = magaza?.paket_turu === "pro";
  // Pro ve Premium mağaza sayfası aynı VIP temayı kullanır
  const isElite = magaza?.store_level === "elite" || isPremium || isPro || magaza?.store_level === "pro";

  // "Glass / şeffaf" görünüm helper'ı (tüm rozet ve butonlarda aynı efekt)
  const glass = (
    background: string,
    color: string = "#fff",
    shadow: string = "rgba(0,0,0,0.25)"
  ): CSSProperties => ({
    background,
    color,
    border: "1px solid rgba(255,255,255,0.20)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    boxShadow: `0 10px 25px ${shadow}`,
  });

  // Üyelik süresini hesapla
  const getMembershipDuration = (createdAt: string | undefined) => {
    if (!createdAt) return null;
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffYears >= 1) return `${diffYears} سال`;
    if (diffMonths >= 1) return `${diffMonths} ماه`;
    return `${diffDays} روز`;
  };

  // Pro mağaza için ayrı tema kaldırıldı (Pro, VIP temayı kullanır)
  if (false) {
    // Not: Bu blok artık kullanılmıyor. Pro mağazalar VIP temaya yönlendirildi.
    // TS'nin "magaza null olabilir" hatasını önlemek için local shadow.
    const magaza = {} as Magaza;
    const membershipDuration = getMembershipDuration(magaza.created_at);
    const bgColor = magaza.tema_renk || '#1a1a1a';

  return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: bgColor }}>
      <Header />
        
        {/* Gri Border Effect - Top */}
        <div className="h-1 w-full" style={{ 
          background: 'linear-gradient(90deg, #1a1a1a 0%, #6b7280 20%, #9ca3af 50%, #6b7280 80%, #1a1a1a 100%)',
          animation: 'shimmer 3s ease-in-out infinite'
        }} />
        
        <style jsx>{`
          @keyframes shimmer {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
        `}</style>
      
      <main className="flex-1 pb-16">
          <div className="mx-auto max-w-7xl px-4">
            
            {/* PRO Hero Banner */}
            <div 
              className="relative mt-6 mb-8 h-[420px] sm:h-[480px] rounded-3xl overflow-hidden"
              style={{ 
                border: '3px solid transparent',
                background: 'linear-gradient(#1a1a1a, #1a1a1a) padding-box, linear-gradient(135deg, #6b7280 0%, #9ca3af 25%, #6b7280 50%, #4b5563 75%, #6b7280 100%) border-box'
              }}
            >
              {ilanlar.length > 0 ? (
                <div className="absolute inset-0">
                  <Image
                    src={getImageUrl(ilanlar[Math.min(heroSlideIndex, ilanlar.length - 1)].ana_resim)}
                    alt={ilanlar[Math.min(heroSlideIndex, ilanlar.length - 1)].baslik}
                    fill
                    priority
                    quality={100}
                    sizes="100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)' }} />
              </div>
              ) : magaza.kapak_resmi ? (
                <div className="absolute inset-0">
                  <Image src={getImageUrl(magaza.kapak_resmi)} alt={magaza.ad} fill className="object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)' }} />
            </div>
          ) : (
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%)' }} />
              )}

              {ilanlar.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {ilanlar.slice(0, 5).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setHeroSlideIndex(idx)}
                      className={`rounded-full transition-all duration-300 ${
                        idx === heroSlideIndex
                          ? 'w-10 h-2.5'
                          : 'w-2.5 h-2.5'
                      }`}
                      style={{
                        background: idx === heroSlideIndex 
                          ? 'linear-gradient(90deg, #6b7280, #9ca3af, #6b7280)' 
                          : 'rgba(255,255,255,0.4)'
                      }}
                    />
                  ))}
                    </div>
                  )}

              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div 
                  className="px-8 sm:px-16 py-10 sm:py-14 text-center mx-4 rounded-3xl"
                  style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    border: '3px solid #6b7280',
                    boxShadow: '0 0 30px rgba(107, 114, 128, 0.3)'
                  }}
                  dir="rtl"
                >
                  
                  {/* Logo */}
                  <div className="flex justify-center mb-6">
                    <div 
                      className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden"
                      style={{ 
                        background: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 50%, #6b7280 100%)',
                        padding: '4px'
                      }}
                    >
                      <div className="w-full h-full bg-black rounded-xl overflow-hidden">
                        {magaza.logo ? (
                          <img
                            src={getImageUrl(magaza.logo)}
                        alt={magaza.ad}
                            className="w-full h-full object-contain p-3"
                      />
                    ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6b7280, #4b5563)' }}>
                            <Store className="w-16 h-16 text-white" />
                          </div>
                        )}
                      </div>
                      
                      {/* PRO Badge */}
                      <div 
                        className="absolute top-2 right-2 px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1 z-10"
                        style={{ 
                          background: 'linear-gradient(135deg, #6b7280, #9ca3af)',
                          color: '#fff'
                        }}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        PRO
                      </div>
                    </div>
                  </div>

                  {/* Store Name */}
                  <h1 
                    className="text-3xl sm:text-4xl md:text-5xl font-black mb-3"
                    style={{ 
                      background: 'linear-gradient(135deg, #e5e7eb 0%, #9ca3af 50%, #e5e7eb 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {magaza.ad_dari || magaza.ad}
                  </h1>

                  {/* Rozetler */}
                  <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
                    <div 
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                      style={glass(
                        'linear-gradient(135deg, rgba(16,185,129,0.40) 0%, rgba(16,185,129,0.22) 100%)',
                        '#fff',
                        'rgba(16,185,129,0.20)'
                      )}
                    >
                      <BadgeCheck className="w-4 h-4" />
                      <span>مغازه تایید شده</span>
                    </div>
                    
                    {membershipDuration && (
                      <div 
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                        style={glass(
                          'linear-gradient(135deg, rgba(156,163,175,0.35) 0%, rgba(75,85,99,0.25) 100%)',
                          '#fff',
                          'rgba(156,163,175,0.15)'
                        )}
                      >
                        <Star className="w-4 h-4" />
                        <span>عضو پرو از {membershipDuration}</span>
                      </div>
                    )}
                    
                    {magaza.guvenilir_satici === true && (
                      <div 
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                        style={glass(
                          'linear-gradient(135deg, rgba(59,130,246,0.40) 0%, rgba(29,78,216,0.28) 100%)',
                          '#fff',
                          'rgba(59,130,246,0.18)'
                        )}
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>فروشنده قابل اعتماد</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-6 sm:gap-10 mb-6 flex-wrap">
                    <div className="flex items-center gap-2" style={{ color: '#e5e7eb' }}>
                      <Package className="w-5 h-5" />
                      <span className="text-sm font-semibold">{magaza.ilan_sayisi} محصول</span>
                    </div>
                    <div className="flex items-center gap-2" style={{ color: '#e5e7eb' }}>
                      <Eye className="w-5 h-5" />
                      <span className="text-sm font-semibold">{magaza.goruntulenme} بازدید</span>
                    </div>
                    {magaza.il_ad && (
                      <div className="flex items-center gap-2" style={{ color: '#e5e7eb' }}>
                        <MapPin className="w-5 h-5" />
                        <span className="text-sm font-semibold">{magaza.il_ad}</span>
                      </div>
                    )}
                  </div>

                  {/* İletişim Butonları */}
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {magaza.telefon && (
                      <>
                        <a
                          href={`https://wa.me/${magaza.telefon.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105"
                          style={glass(
                            'linear-gradient(135deg, rgba(37,211,102,0.40) 0%, rgba(18,140,126,0.30) 100%)',
                            '#fff',
                            'rgba(37,211,102,0.20)'
                          )}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          <span>واتساپ</span>
                        </a>
                        <a
                          href={`tel:${magaza.telefon}`}
                          className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105"
                          style={glass(
                            'linear-gradient(135deg, rgba(156,163,175,0.38) 0%, rgba(75,85,99,0.28) 100%)',
                            '#fff',
                            'rgba(156,163,175,0.18)'
                          )}
                        >
                          <Phone className="w-5 h-5" />
                          <span>تماس</span>
                        </a>
                        <button
                          onClick={() => alert('قابلیت پیام به زودی فعال می‌شود')}
                          className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105"
                          style={glass(
                            'linear-gradient(135deg, rgba(59,130,246,0.40) 0%, rgba(29,78,216,0.30) 100%)',
                            '#fff',
                            'rgba(59,130,246,0.20)'
                          )}
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span>پیام</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
                  </div>
                </div>

            {/* İstatistikler & Güven Rozetleri - Gri */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8" dir="rtl">
              
              {/* Mağaza İstatistikleri */}
              <div 
                className="rounded-2xl p-6"
                style={{
                  ...glass(
                    "linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.18) 100%)",
                    "#fff",
                    "rgba(0,0,0,0.35)"
                  ),
                  border: "3px solid #6b7280",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5" style={{ color: '#9ca3af' }} />
                  <h3 className="text-lg font-bold" style={{ color: '#9ca3af' }}>آمار مغازه</h3>
                </div>
                <MagazaStatsPanel
                  variant="pro"
                  products={magaza.ilan_sayisi || 0}
                  views={magaza.goruntulenme || 0}
                  rating={yorumStats ? parseFloat(yorumStats.ortalama_puan) : 0}
                  reviews={yorumStats?.toplam_yorum || 0}
                />
              </div>

              {/* Güven Rozetleri */}
              <div 
                className="rounded-2xl p-6"
                style={{
                  ...glass(
                    "linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.18) 100%)",
                    "#fff",
                    "rgba(0,0,0,0.35)"
                  ),
                  border: "3px solid #6b7280",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5" style={{ color: '#9ca3af' }} />
                  <h3 className="text-lg font-bold" style={{ color: '#9ca3af' }}>نشان‌های اعتماد</h3>
                </div>
                <div className="space-y-3">
                  {/* PRO Premium */}
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={glass(
                      "linear-gradient(135deg, rgba(107,114,128,0.22) 0%, rgba(107,114,128,0.10) 100%)",
                      "#fff",
                      "rgba(107,114,128,0.12)"
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6b7280, #9ca3af)' }}>
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">عضو پرو</p>
                      <p className="text-gray-500 text-xs">فروشنده PRO</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500 mr-auto" />
                  </div>
                  
                  {/* Doğrulanmış */}
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={glass(
                      "linear-gradient(135deg, rgba(34,197,94,0.22) 0%, rgba(34,197,94,0.10) 100%)",
                      "#fff",
                      "rgba(34,197,94,0.12)"
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-500">
                      <BadgeCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">مغازه تایید شده</p>
                      <p className="text-gray-500 text-xs">هویت تایید شده</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500 mr-auto" />
                  </div>

                  {/* Güvenilir Satıcı */}
                  {magaza.guvenilir_satici === true && (
                    <div
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={glass(
                        "linear-gradient(135deg, rgba(59,130,246,0.22) 0%, rgba(59,130,246,0.10) 100%)",
                        "#fff",
                        "rgba(59,130,246,0.12)"
                      )}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500">
                        <ShieldCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">فروشنده قابل اعتماد</p>
                        <p className="text-gray-500 text-xs">معامله امن</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500 mr-auto" />
                    </div>
                  )}

                  {/* Hızlı Teslimat */}
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={glass(
                      "linear-gradient(135deg, rgba(168,85,247,0.22) 0%, rgba(168,85,247,0.10) 100%)",
                      "#fff",
                      "rgba(168,85,247,0.12)"
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-500">
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">ارسال سریع</p>
                      <p className="text-gray-500 text-xs">تحویل به موقع</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500 mr-auto" />
                  </div>
                </div>
              </div>

              {/* Çalışma Saatleri & Konum */}
              <div 
                className="rounded-2xl p-6"
                style={{
                  ...glass(
                    "linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.18) 100%)",
                    "#fff",
                    "rgba(0,0,0,0.35)"
                  ),
                  border: "3px solid #6b7280",
                }}
              >
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5" style={{ color: '#9ca3af' }} />
                    <h3 className="text-lg font-bold" style={{ color: '#9ca3af' }}>ساعات کاری</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">شنبه - چهارشنبه</span>
                      <span className="text-white">۰۸:۰۰ - ۲۰:۰۰</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">پنجشنبه</span>
                      <span className="text-white">۰۸:۰۰ - ۱۸:۰۰</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">جمعه</span>
                      <span className="text-red-400">تعطیل</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)' }}>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-400 text-sm font-medium">الان باز است</span>
                  </div>
                </div>

                {/* Konum */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5" style={{ color: '#9ca3af' }} />
                    <h3 className="text-lg font-bold" style={{ color: '#9ca3af' }}>آدرس و تماس</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {magaza.il_ad && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(107,114,128,0.2)' }}>
                          <MapPin className="w-4 h-4" style={{ color: '#9ca3af' }} />
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">شهر</p>
                          <p className="text-white text-sm">{magaza.il_ad}</p>
                        </div>
                      </div>
                    )}
                    
                    {magaza.adres && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(107,114,128,0.2)' }}>
                          <Store className="w-4 h-4" style={{ color: '#9ca3af' }} />
                  </div>
                        <div>
                          <p className="text-gray-500 text-xs">آدرس کامل</p>
                          <p className="text-white text-sm">{magaza.adres}</p>
                </div>
                      </div>
                    )}
                    
                    {magaza.telefon && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(34,197,94,0.2)' }}>
                          <Phone className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">شماره تماس</p>
                          <a href={`tel:${magaza.telefon}`} className="text-white text-sm hover:text-gray-300 transition-colors">
                            {magaza.telefon}
                          </a>
                        </div>
                              </div>
                            )}
                          </div>
                          
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(magaza.adres || magaza.il_ad || 'Kabul, Afghanistan')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 mt-4 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                    style={{ 
                      background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                      color: '#fff'
                    }}
                  >
                    <MapPin className="w-4 h-4" />
                    مشاهده در نقشه
                  </a>
                </div>
              </div>
            </div>

            {/* Products Grid - Gri Çerçeve */}
            {ilanlar.length > 0 && (
              <div 
                className="mb-12 p-6 rounded-3xl" 
                style={{
                  ...glass(
                    "linear-gradient(135deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.16) 100%)",
                    "#fff",
                    "rgba(0,0,0,0.30)"
                  ),
                  border: "3px solid #6b7280",
                }}
                dir="rtl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #6b7280, #9ca3af)' }}
                  >
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <h2 
                    className="text-2xl font-bold"
                    style={{ 
                      background: 'linear-gradient(135deg, #e5e7eb, #9ca3af)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    محصولات
                  </h2>
                  <Sparkles className="w-5 h-5" style={{ color: '#9ca3af' }} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {ilanlar.map((ilan) => (
                    <Link key={ilan.id} href={`/ilan/${ilan.id}`} className="group block">
                      <div 
                        className="overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-[1.02]"
                        style={{
                          ...glass(
                            "linear-gradient(135deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.14) 100%)",
                            "#fff",
                            "rgba(0,0,0,0.22)"
                          ),
                          border: "2px solid #6b7280",
                        }}
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={getImageUrl(ilan.ana_resim)}
                            alt={ilan.baslik}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, rgba(107,114,128,0.1) 0%, transparent 50%, rgba(107,114,128,0.1) 100%)' }} />
                        </div>

                        <div className="p-4">
                          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 min-h-[40px]">
                            {ilan.baslik}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span 
                              className="font-bold text-lg"
                              style={{ color: '#e5e7eb' }}
                            >
                              ${ilan.para_birimi === 'USD' && ilan.fiyat_usd ? ilan.fiyat_usd.toLocaleString() : ilan.fiyat.toLocaleString()}
                            </span>
                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                              <Eye className="w-3 h-3" />
                              {ilan.goruntulenme}
                            </div>
                          </div>
                        </div>
                      </div>
                                </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section - Gri */}
            <div 
              className="rounded-3xl p-6 sm:p-8 mb-8" 
              style={{
                ...glass(
                  "linear-gradient(135deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.16) 100%)",
                  "#fff",
                  "rgba(0,0,0,0.30)"
                ),
                border: "3px solid #6b7280",
              }}
              dir="rtl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #6b7280, #9ca3af)' }}
                >
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 
                    className="text-2xl font-bold"
                    style={{ 
                      background: 'linear-gradient(135deg, #e5e7eb, #9ca3af)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    نظرات مشتریان
                  </h2>
                  {yorumStats && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(parseFloat(yorumStats.ortalama_puan)) ? 'fill-gray-400 text-gray-400' : 'text-zinc-600'}`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm">{yorumStats.ortalama_puan} از {yorumStats.toplam_yorum} نظر</span>
                    </div>
                  )}
                </div>
              </div>

              {user ? (
                <form 
                  onSubmit={handleYorumGonder} 
                  className="mb-8 p-6 rounded-2xl" 
                  style={{
                    ...glass(
                      "linear-gradient(135deg, rgba(0,0,0,0.26) 0%, rgba(0,0,0,0.14) 100%)",
                      "#fff",
                      "rgba(0,0,0,0.22)"
                    ),
                    border: "1px solid rgba(107,114,128,0.25)",
                  }}
                >
                  <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" style={{ color: '#9ca3af' }}>امتیاز شما</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((puan) => (
                        <button
                          key={puan}
                          type="button"
                          onClick={() => setYeniYorum({ ...yeniYorum, puan })}
                          className="transition-transform hover:scale-110"
                        >
                          <Star className={`w-8 h-8 ${puan <= yeniYorum.puan ? 'fill-gray-400 text-gray-400' : 'text-zinc-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" style={{ color: '#9ca3af' }}>نظر شما</label>
                    <textarea
                      value={yeniYorum.yorum}
                      onChange={(e) => setYeniYorum({ ...yeniYorum, yorum: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border text-white placeholder-gray-500 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', borderColor: 'rgba(107,114,128,0.28)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
                      placeholder="تجربه خود از خرید از این مغازه را بنویسید..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={yorumGonderiliyor}
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                      color: '#fff'
                    }}
                  >
                    {yorumGonderiliyor ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        در حال ارسال...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        ثبت نظر
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div 
                  className="mb-8 p-6 rounded-2xl text-center" 
                  style={{
                    ...glass(
                      "linear-gradient(135deg, rgba(0,0,0,0.26) 0%, rgba(0,0,0,0.14) 100%)",
                      "#fff",
                      "rgba(0,0,0,0.22)"
                    ),
                    border: "1px solid rgba(107,114,128,0.25)",
                  }}
                >
                  <MessageCircle className="w-12 h-12 mx-auto mb-3" style={{ color: 'rgba(156,163,175,0.5)' }} />
                  <p className="text-gray-400 mb-4">برای ثبت نظر باید وارد حساب کاربری خود شوید</p>
                                <Link
                    href="/giris"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all"
                    style={{ background: 'linear-gradient(135deg, #6b7280, #4b5563)', color: '#fff' }}
                                >
                    ورود / ثبت نام
                                </Link>
                            </div>
                          )}
                          
              {yorumlar.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'rgba(156,163,175,0.3)' }} />
                  <p className="text-gray-400">هنوز نظری ثبت نشده است</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {yorumlar.map((yorum) => (
                    <div 
                      key={yorum.id}
                      className="p-6 rounded-2xl"
                      style={{ backgroundColor: 'rgba(30, 30, 30, 0.5)', border: '1px solid rgba(107,114,128,0.1)' }}
                    >
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">{yorum.kullanici_ad?.charAt(0) || 'U'}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white">{yorum.kullanici_ad || 'کاربر'}</span>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < yorum.puan ? 'fill-gray-400 text-gray-400' : 'text-zinc-600'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm">{new Date(yorum.created_at).toLocaleDateString('fa-IR')}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{yorum.yorum}</p>
                    </div>
                  ))}
                                </div>
                              )}
            </div>
          </div>
        </main>

        {/* Mobil İletişim Çubuğu */}
        {magaza.telefon && (
          <div 
            className="fixed bottom-0 left-0 right-0 z-50 p-4 lg:hidden"
            style={{ 
              background: 'linear-gradient(to top, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.9) 100%)',
              borderTop: '3px solid #6b7280'
            }}
          >
            <div className="flex items-center justify-center gap-3 max-w-lg mx-auto">
              <a
                href={`https://wa.me/${magaza.telefon.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                style={glass(
                  'linear-gradient(135deg, rgba(37,211,102,0.40) 0%, rgba(18,140,126,0.30) 100%)',
                  '#fff',
                  'rgba(37,211,102,0.20)'
                )}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                واتساپ
              </a>
              
              <a
                href={`tel:${magaza.telefon}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                style={glass(
                  'linear-gradient(135deg, rgba(156,163,175,0.38) 0%, rgba(75,85,99,0.28) 100%)',
                  '#fff',
                  'rgba(156,163,175,0.18)'
                )}
              >
                <Phone className="w-5 h-5" />
                تماس
              </a>
              
              <button
                onClick={() => alert('قابلیت پیام به زودی فعال می‌شود')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                style={glass(
                  'linear-gradient(135deg, rgba(59,130,246,0.40) 0%, rgba(29,78,216,0.30) 100%)',
                  '#fff',
                  'rgba(59,130,246,0.20)'
                )}
              >
                <MessageCircle className="w-5 h-5" />
                پیام
              </button>
            </div>
                                </div>
                              )}

        <Footer />
                            </div>
    );
  }

  // Premium/Elite mağaza için VIP Dark Theme
  if (isElite && magaza) {
    const membershipDuration = getMembershipDuration(magaza.created_at);

    // Pro ve Premium aynı VIP layout'u kullanır; renk aksanı pakete göre değişir:
    // - Premium/Elite: Gold
    // - Pro: Platinum Grey
    const isPremiumVip = magaza.paket_turu === "premium" || magaza.store_level === "elite";
    const A1 = isPremiumVip ? "#d4a537" : "#9ca3af"; // accent
    const A2 = isPremiumVip ? "#f5d78e" : "#e5e7eb"; // highlight
    const A3 = isPremiumVip ? "#8b6914" : "#4b5563"; // deep
    const glowLow = isPremiumVip ? "rgba(212, 165, 55, 0.30)" : "rgba(156, 163, 175, 0.35)";
    const glowHigh = isPremiumVip ? "rgba(212, 165, 55, 0.60)" : "rgba(156, 163, 175, 0.65)";
    const topBorder = `linear-gradient(90deg, #0a0a0a 0%, ${A1} 20%, ${A2} 50%, ${A1} 80%, #0a0a0a 100%)`;
    const heroFrame = `linear-gradient(#0a0a0a, #0a0a0a) padding-box, linear-gradient(135deg, ${A1} 0%, ${A2} 25%, ${A1} 50%, ${A3} 75%, ${A1} 100%) border-box`;
    const accentGrad = `linear-gradient(135deg, ${A1} 0%, ${A2} 50%, ${A1} 100%)`;
    const accentGrad90 = `linear-gradient(90deg, ${A1}, ${A2}, ${A1})`;
    const accentDeep = `linear-gradient(135deg, ${A1}, ${A3})`;
    const badgeGrad = `linear-gradient(135deg, ${A1} 0%, ${A2} 30%, ${A1} 60%, ${A3} 100%)`;
    const titleGrad = `linear-gradient(135deg, ${A2} 0%, ${A1} 50%, ${A2} 100%)`;

    // Kullanıcının seçtiği tema rengi veya varsayılan
    const userBgColor = magaza.tema_renk || '#0B0F14';
    
    const vipBg: CSSProperties = {
      background: isPremiumVip
        ? `radial-gradient(1200px 600px at 20% 10%, rgba(212,165,55,0.10) 0%, rgba(11,15,20,0) 55%), ${userBgColor}`
        : `radial-gradient(1200px 600px at 20% 10%, rgba(156,163,175,0.10) 0%, rgba(11,15,20,0) 55%), ${userBgColor}`,
    };

  return (
      <div className="min-h-screen flex flex-col" style={vipBg}>
      <Header />
        
        {/* ✨ Animated Gold Border Effect - Top */}
        <div className="h-1 w-full" style={{ 
          background: topBorder,
          animation: 'shimmer 3s ease-in-out infinite'
        }} />
        
        <style jsx>{`
          @keyframes shimmer {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px ${glowLow}; }
            50% { box-shadow: 0 0 40px ${glowHigh}; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        `}</style>
      
      <main className="flex-1 pb-16">
          <div className="mx-auto max-w-7xl px-4">
            
            {/* VIP Hero Banner with Slider - Altın Çerçeve */}
            <div 
              className="relative mt-6 mb-8 h-[420px] sm:h-[480px] rounded-3xl overflow-hidden"
              style={{ 
                border: '3px solid transparent',
                background: heroFrame
              }}
            >
              {/* Background - Product Slider */}
              {ilanlar.length > 0 ? (
                <div className="absolute inset-0">
                  <Image
                    src={getImageUrl(ilanlar[Math.min(heroSlideIndex, ilanlar.length - 1)].ana_resim)}
                    alt={ilanlar[Math.min(heroSlideIndex, ilanlar.length - 1)].baslik}
                    fill
                    priority
                    quality={100}
                    sizes="100vw"
                    className="object-cover"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)' }} />
              </div>
              ) : magaza.kapak_resmi ? (
                <div className="absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImageUrl(magaza.kapak_resmi)}
                        alt={magaza.ad}
                        className="w-full h-full object-cover"
                      />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)' }} />
                </div>
              ) : (
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%)' }} />
              )}

              {/* Slide Indicators */}
              {ilanlar.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {ilanlar.slice(0, 5).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setHeroSlideIndex(idx)}
                      className={`rounded-full transition-all duration-300 ${
                        idx === heroSlideIndex
                          ? 'w-10 h-2.5'
                          : 'w-2.5 h-2.5'
                      }`}
                      style={{
                        background: idx === heroSlideIndex 
                          ? accentGrad90
                          : 'rgba(255,255,255,0.4)'
                      }}
                    />
                  ))}
                        </div>
                    )}

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div 
                  className="px-8 sm:px-16 py-10 sm:py-14 text-center mx-4 rounded-3xl"
                  style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    border: `3px solid ${A1}`,
                    boxShadow: `0 0 30px ${glowLow}`
                  }}
                  dir="rtl"
                >
                  
                  {/* ✨ Parlayan VIP Logo */}
                  <div className="flex justify-center mb-6">
                    <div 
                      className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden"
                      style={{ 
                        background: accentGrad,
                        padding: '4px',
                        animation: 'pulse-glow 2s ease-in-out infinite'
                      }}
                    >
                      <div className="w-full h-full bg-black rounded-xl overflow-hidden">
                    {magaza.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getImageUrl(magaza.logo)}
                        alt={magaza.ad}
                            className="w-full h-full object-contain p-3"
                      />
                    ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ background: accentDeep }}>
                            <Crown className="w-16 h-16 text-black" />
                      </div>
                    )}
                      </div>
                      
                      {/* 👑 VIP Badge - İçeride, tam görünür */}
                      <div 
                        className="absolute top-2 right-2 z-20"
                        style={{ 
                          background: badgeGrad,
                          padding: '6px 12px',
                          borderRadius: '8px',
                          boxShadow: `0 4px 15px ${glowHigh}`,
                          border: '2px solid rgba(255,255,255,0.4)'
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <Crown className="w-4 h-4 text-black" />
                          <span className="text-black font-black text-xs tracking-wide">VIP</span>
                        </div>
                      </div>
                  </div>
                </div>

                  {/* Store Name with Gradient */}
                  <h1 
                    className="text-3xl sm:text-4xl md:text-5xl font-black mb-3"
                    style={{ 
                      background: titleGrad,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                              {magaza.ad_dari || magaza.ad}
                            </h1>

                  {/* ⭐ Rozetler - Doğrulanmış & Premium Üye */}
                  <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
                    {/* Doğrulanmış Mağaza */}
                    <div 
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                      style={glass(
                        'linear-gradient(135deg, rgba(34,197,94,0.40) 0%, rgba(22,163,74,0.28) 100%)',
                        '#fff',
                        'rgba(34,197,94,0.18)'
                      )}
                    >
                      <BadgeCheck className="w-4 h-4" />
                      <span>مغازه تایید شده</span>
                    </div>
                    
                    {/* Premium Üye Süresi */}
                    {membershipDuration && (
                      <div 
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                        style={glass(
                          isPremiumVip
                            ? 'linear-gradient(135deg, rgba(245,215,142,0.42) 0%, rgba(212,165,55,0.30) 100%)'
                            : 'linear-gradient(135deg, rgba(229,231,235,0.26) 0%, rgba(156,163,175,0.22) 100%)',
                          '#111827',
                          isPremiumVip ? 'rgba(212,165,55,0.22)' : 'rgba(156,163,175,0.22)'
                        )}
                      >
                        <Crown className="w-4 h-4" />
                        <span>عضو پریمیوم از {membershipDuration}</span>
                            </div>
                          )}
                          
                    {/* Güvenilir Satıcı */}
                    {magaza.guvenilir_satici === true && (
                      <div 
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                        style={glass(
                          'linear-gradient(135deg, rgba(59,130,246,0.40) 0%, rgba(29,78,216,0.30) 100%)',
                          '#fff',
                          'rgba(59,130,246,0.18)'
                        )}
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>فروشنده قابل اعتماد</span>
                          </div>
                        )}
                      </div>

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-6 sm:gap-10 mb-6 flex-wrap">
                    <div className="flex items-center gap-2" style={{ color: A2 }}>
                      <Package className="w-5 h-5" />
                      <span className="text-sm font-semibold">{magaza.ilan_sayisi} محصول</span>
                        </div>
                    <div className="flex items-center gap-2" style={{ color: A2 }}>
                      <Eye className="w-5 h-5" />
                      <span className="text-sm font-semibold">{magaza.goruntulenme} بازدید</span>
                        </div>
                        {magaza.il_ad && (
                      <div className="flex items-center gap-2" style={{ color: A2 }}>
                        <MapPin className="w-5 h-5" />
                        <span className="text-sm font-semibold">{magaza.il_ad}</span>
                          </div>
                        )}
                          </div>
                        
                  {/* 📱 İletişim Butonları */}
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {/* WhatsApp */}
                    {magaza.telefon && (
                      <a
                        href={`https://wa.me/${magaza.telefon.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105"
                        style={glass(
                          'linear-gradient(135deg, rgba(37,211,102,0.40) 0%, rgba(18,140,126,0.30) 100%)',
                          '#fff',
                          'rgba(37,211,102,0.20)'
                        )}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        <span>واتساپ</span>
                      </a>
                    )}

                    {/* Telefon */}
                      {magaza.telefon && (
                        <a
                          href={`tel:${magaza.telefon}`}
                        className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105"
                        style={glass(
                          isPremiumVip
                            ? 'linear-gradient(135deg, rgba(245,215,142,0.42) 0%, rgba(212,165,55,0.30) 100%)'
                            : 'linear-gradient(135deg, rgba(229,231,235,0.28) 0%, rgba(156,163,175,0.22) 100%)',
                          '#111827',
                          isPremiumVip ? 'rgba(212,165,55,0.22)' : 'rgba(156,163,175,0.22)'
                        )}
                      >
                        <Phone className="w-5 h-5" />
                        <span>تماس</span>
                        </a>
                      )}

                    {/* Mesaj Gönder */}
                    <button
                      onClick={() => {
                        if (!user) {
                          alert('برای ارسال پیام باید وارد شوید');
                          return;
                        }
                        // Mesaj gönderme modalı açılabilir
                        alert('قابلیت پیام به زودی فعال می‌شود');
                      }}
                      className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105"
                      style={glass(
                        'linear-gradient(135deg, rgba(59,130,246,0.40) 0%, rgba(29,78,216,0.30) 100%)',
                        '#fff',
                        'rgba(59,130,246,0.20)'
                      )}
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>پیام</span>
                    </button>
                          </div>
                  </div>
                </div>
              </div>

            {/* 📊 İstatistikler & 🏅 Güven Rozetleri */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8" dir="rtl">
              
              {/* Mağaza İstatistikleri */}
              <div 
                className="rounded-2xl p-6"
                style={{
                  ...glass(
                    "linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.18) 100%)",
                    "#fff",
                    "rgba(0,0,0,0.35)"
                  ),
                  border: `3px solid ${A1}`,
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5" style={{ color: A2 }} />
                  <h3 className="text-lg font-bold" style={{ color: A2 }}>آمار مغازه</h3>
                        </div>
                <MagazaStatsPanel
                  variant="elite"
                  products={magaza.ilan_sayisi || 0}
                  views={magaza.goruntulenme || 0}
                  rating={yorumStats ? parseFloat(yorumStats.ortalama_puan) : 0}
                  reviews={yorumStats?.toplam_yorum || 0}
                />
                      </div>

              {/* Güven Rozetleri */}
              <div 
                className="rounded-2xl p-6"
                style={{
                  ...glass(
                    "linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.18) 100%)",
                    "#fff",
                    "rgba(0,0,0,0.35)"
                  ),
                  border: `3px solid ${A1}`,
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5" style={{ color: A2 }} />
                  <h3 className="text-lg font-bold" style={{ color: A2 }}>نشان‌های اعتماد</h3>
                                </div>
                <div className="space-y-3">
                  {/* VIP Premium */}
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={glass(
                      isPremiumVip
                        ? "linear-gradient(135deg, rgba(212,165,55,0.22) 0%, rgba(212,165,55,0.10) 100%)"
                        : "linear-gradient(135deg, rgba(156,163,175,0.22) 0%, rgba(156,163,175,0.10) 100%)",
                      "#fff",
                      isPremiumVip ? "rgba(212,165,55,0.14)" : "rgba(156,163,175,0.14)"
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: accentGrad }}>
                      <Crown className="w-5 h-5 text-black" />
                              </div>
                    <div>
                      <p className="text-white font-semibold text-sm">عضو پریمیوم</p>
                      <p className="text-gray-500 text-xs">فروشنده VIP</p>
                            </div>
                    <CheckCircle className="w-5 h-5 text-green-500 mr-auto" />
                            </div>

                  {/* Doğrulanmış */}
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={glass(
                      "linear-gradient(135deg, rgba(34,197,94,0.22) 0%, rgba(34,197,94,0.10) 100%)",
                      "#fff",
                      "rgba(34,197,94,0.12)"
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-500">
                      <BadgeCheck className="w-5 h-5 text-white" />
                          </div>
                        <div>
                      <p className="text-white font-semibold text-sm">مغازه تایید شده</p>
                      <p className="text-gray-500 text-xs">هویت تایید شده</p>
                  </div>
                    <CheckCircle className="w-5 h-5 text-green-500 mr-auto" />
                  </div>

                  {/* Güvenilir Satıcı */}
                  {magaza.guvenilir_satici === true && (
                    <div
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={glass(
                        "linear-gradient(135deg, rgba(59,130,246,0.22) 0%, rgba(59,130,246,0.10) 100%)",
                        "#fff",
                        "rgba(59,130,246,0.12)"
                      )}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500">
                        <ShieldCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">فروشنده قابل اعتماد</p>
                        <p className="text-gray-500 text-xs">معامله امن</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500 mr-auto" />
                    </div>
                  )}

                  {/* Hızlı Teslimat */}
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={glass(
                      "linear-gradient(135deg, rgba(168,85,247,0.22) 0%, rgba(168,85,247,0.10) 100%)",
                      "#fff",
                      "rgba(168,85,247,0.12)"
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-500">
                      <Truck className="w-5 h-5 text-white" />
                </div>
                    <div>
                      <p className="text-white font-semibold text-sm">ارسال سریع</p>
                      <p className="text-gray-500 text-xs">تحویل به موقع</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500 mr-auto" />
                  </div>
                </div>
              </div>

              {/* Çalışma Saatleri & Konum */}
              <div 
                className="rounded-2xl p-6"
                style={{
                  ...glass(
                    "linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.18) 100%)",
                    "#fff",
                    "rgba(0,0,0,0.35)"
                  ),
                  border: `3px solid ${A1}`,
                }}
              >
                {/* Çalışma Saatleri */}
                      <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5" style={{ color: A2 }} />
                    <h3 className="text-lg font-bold" style={{ color: A2 }}>ساعات کاری</h3>
                      </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">شنبه - چهارشنبه</span>
                      <span className="text-white">۰۸:۰۰ - ۲۰:۰۰</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">پنجشنبه</span>
                      <span className="text-white">۰۸:۰۰ - ۱۸:۰۰</span>
                  </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">جمعه</span>
                      <span className="text-red-400">تعطیل</span>
                            </div>
                          </div>
                  <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)' }}>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-400 text-sm font-medium">الان باز است</span>
                  </div>
                </div>

                {/* Konum & İletişim Bilgileri */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5" style={{ color: A2 }} />
                    <h3 className="text-lg font-bold" style={{ color: A2 }}>آدرس و تماس</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Şehir */}
                    {magaza.il_ad && (
                      <div className="flex items-start gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: isPremiumVip ? "rgba(245,215,142,0.14)" : "rgba(156,163,175,0.16)" }}
                        >
                          <MapPin className="w-4 h-4" style={{ color: A2 }} />
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">شهر</p>
                          <p className="text-white text-sm">{magaza.il_ad}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Adres */}
                    {magaza.adres && (
                      <div className="flex items-start gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: isPremiumVip ? "rgba(245,215,142,0.14)" : "rgba(156,163,175,0.16)" }}
                        >
                          <Store className="w-4 h-4" style={{ color: A2 }} />
                      </div>
                        <div>
                          <p className="text-gray-500 text-xs">آدرس کامل</p>
                          <p className="text-white text-sm">{magaza.adres}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Telefon */}
                    {magaza.telefon && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-500/20 flex-shrink-0 mt-0.5">
                          <Phone className="w-4 h-4 text-green-400" />
                </div>
                        <div>
                          <p className="text-gray-500 text-xs">شماره تماس</p>
                          <a
                            href={`tel:${magaza.telefon}`}
                            className={`text-white text-sm transition-colors ${isPremiumVip ? "hover:text-amber-400" : "hover:text-gray-300"}`}
                          >
                            {magaza.telefon}
                          </a>
                      </div>
                    </div>
                    )}
                  </div>

                  {/* Haritada Göster Butonu - Her zaman göster */}
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(magaza.adres || magaza.il_ad || 'Kabul, Afghanistan')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 mt-4 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                    style={{ 
                      background: accentDeep,
                      color: '#000'
                    }}
                  >
                    <MapPin className="w-4 h-4" />
                    مشاهده در نقشه
                  </a>
                </div>
              </div>
            </div>

            {/* Products Grid - Premium Altın Çerçeve */}
            {ilanlar.length > 0 && (
              <div 
                className="mb-12 p-6 rounded-3xl" 
                style={{
                  ...glass(
                    "linear-gradient(135deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.16) 100%)",
                    "#fff",
                    "rgba(0,0,0,0.30)"
                  ),
                  border: `3px solid ${A1}`,
                }}
                dir="rtl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: accentGrad }}
                  >
                    <ShoppingBag className="w-6 h-6 text-black" />
                        </div>
                  <h2 
                    className="text-2xl font-bold"
                    style={
                      isPremiumVip
                        ? {
                            background: `linear-gradient(135deg, ${A2}, ${A1})`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }
                        : {
                            color: A2,
                            textShadow: "0 1px 10px rgba(0,0,0,0.55)",
                          }
                    }
                  >
                    محصولات
                          </h2>
                  <Sparkles className="w-5 h-5" style={{ color: A2 }} />
                        </div>

                {/* Grid Container */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {ilanlar.map((ilan) => (
                    <Link key={ilan.id} href={`/ilan/${ilan.id}`} className="group block">
                      <div 
                        className="overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-[1.02]"
                        style={{
                          ...glass(
                            "linear-gradient(135deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.14) 100%)",
                            "#fff",
                            "rgba(0,0,0,0.22)"
                          ),
                          border: `2px solid ${A1}`,
                        }}
                      >
                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                              src={getImageUrl(ilan.ana_resim)}
                              alt={ilan.baslik}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          {/* Premium Shine Effect on Hover */}
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                              background: isPremiumVip
                                ? "linear-gradient(135deg, rgba(212,165,55,0.10) 0%, transparent 50%, rgba(212,165,55,0.10) 100%)"
                                : "linear-gradient(135deg, rgba(156,163,175,0.10) 0%, transparent 50%, rgba(156,163,175,0.10) 100%)",
                            }}
                          />
                          </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 min-h-[40px]">
                              {ilan.baslik}
                            </h3>
                          <div className="flex items-center justify-between">
                            <span 
                              className="font-bold text-lg"
                              style={{ color: A2 }}
                            >
                              ${ilan.para_birimi === 'USD' && ilan.fiyat_usd ? ilan.fiyat_usd.toLocaleString() : ilan.fiyat.toLocaleString()}
                            </span>
                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                              <Eye className="w-3 h-3" />
                              <span>{ilan.goruntulenme}</span>
                            </div>
                          </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
                  </div>
                )}


            {/* Comments Section - Premium */}
            <div 
              className="rounded-3xl p-6 sm:p-8 mb-8" 
              style={{
                ...glass(
                  "linear-gradient(135deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.16) 100%)",
                  "#fff",
                  "rgba(0,0,0,0.30)"
                ),
                border: `3px solid ${A1}`,
              }}
              dir="rtl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: accentGrad }}
                >
                  <MessageCircle className="w-6 h-6 text-black" />
                  </div>
                <div>
                  <h2 
                    className="text-2xl font-bold"
                    style={
                      isPremiumVip
                        ? {
                            background: `linear-gradient(135deg, ${A2}, ${A1})`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }
                        : {
                            color: A2,
                            textShadow: "0 1px 10px rgba(0,0,0,0.55)",
                          }
                    }
                  >
                      نظرات مشتریان
                    </h2>
                    {yorumStats && (
                      <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(parseFloat(yorumStats.ortalama_puan))
                                ? (isPremiumVip ? "fill-amber-400 text-amber-400" : "fill-zinc-300 text-zinc-300")
                                : "text-zinc-600"
                            }`}
                            />
                          ))}
                        </div>
                      <span className="text-gray-400 text-sm">{yorumStats.ortalama_puan} از {yorumStats.toplam_yorum} نظر</span>
                      </div>
                    )}
                  </div>
                </div>

              {/* Comment Form - %50 Şeffaf */}
                {user ? (
                <form 
                  onSubmit={handleYorumGonder} 
                  className="mb-8 p-6 rounded-2xl" 
                  style={{
                    ...glass(
                      "linear-gradient(135deg, rgba(0,0,0,0.26) 0%, rgba(0,0,0,0.14) 100%)",
                      "#fff",
                      "rgba(0,0,0,0.22)"
                    ),
                    border: `1px solid ${isPremiumVip ? "rgba(212,165,55,0.28)" : "rgba(156,163,175,0.28)"}`,
                  }}
                >
                    <div className="mb-4">
                    <label className={`block text-sm font-bold mb-2 ${isPremiumVip ? "text-amber-400" : "text-zinc-200"}`}>امتیاز شما</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((puan) => (
                          <button
                            key={puan}
                            type="button"
                            onClick={() => setYeniYorum({ ...yeniYorum, puan })}
                            className="transition-transform hover:scale-110"
                          >
                          <Star
                            className={`w-8 h-8 ${
                              puan <= yeniYorum.puan
                                ? (isPremiumVip ? "fill-amber-400 text-amber-400" : "fill-zinc-300 text-zinc-300")
                                : "text-zinc-600"
                            }`}
                          />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                    <label className={`block text-sm font-bold mb-2 ${isPremiumVip ? "text-amber-400" : "text-zinc-200"}`}>نظر شما</label>
                      <textarea
                        value={yeniYorum.yorum}
                        onChange={(e) => setYeniYorum({ ...yeniYorum, yorum: e.target.value })}
                        rows={4}
                      className={`w-full px-4 py-3 rounded-xl border text-white placeholder-gray-500 focus:ring-1 transition-all ${
                        isPremiumVip
                          ? "border-amber-500/30 focus:border-amber-400 focus:ring-amber-400"
                          : "border-gray-400/30 focus:border-gray-200 focus:ring-gray-200"
                      }`}
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
                      placeholder="تجربه خود از خرید از این مغازه را بنویسید..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={yorumGonderiliyor}
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-50"
                    style={{
                      background: isPremiumVip
                        ? "linear-gradient(135deg, #d4a537 0%, #b8860b 100%)"
                        : "linear-gradient(135deg, #e5e7eb 0%, #9ca3af 100%)",
                      color: '#111827'
                    }}
                    >
                      {yorumGonderiliyor ? (
                        <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          در حال ارسال...
                        </>
                      ) : (
                        <>
                        <Send className="w-5 h-5" />
                          ثبت نظر
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                <div 
                  className="mb-8 p-6 rounded-2xl text-center" 
                  style={{ backgroundColor: 'rgba(30, 30, 30, 0.5)', border: `1px solid ${isPremiumVip ? "rgba(212,165,55,0.2)" : "rgba(156,163,175,0.22)"}` }}
                >
                  <MessageCircle className="w-12 h-12 mx-auto mb-3" style={{ color: isPremiumVip ? "rgba(245,215,142,0.55)" : "rgba(229,231,235,0.55)" }} />
                  <p className="text-gray-400 mb-4">برای ثبت نظر باید وارد حساب کاربری خود شوید</p>
                    <Link
                      href="/giris"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all hover:scale-105"
                    style={{
                      background: isPremiumVip
                        ? "linear-gradient(135deg, #d4a537 0%, #b8860b 100%)"
                        : "linear-gradient(135deg, #e5e7eb 0%, #9ca3af 100%)",
                      color: '#111827'
                    }}
                    >
                      ورود / ثبت نام
                    </Link>
                  </div>
                )}

              {/* Comments List - %50 Şeffaf */}
                <div className="space-y-4">
                  {yorumlar.length === 0 ? (
                    <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                      <p className="text-gray-500">هنوز نظری ثبت نشده است</p>
                    </div>
                  ) : (
                    yorumlar.map((yorum) => (
                      <div
                        key={yorum.id}
                      className="p-6 rounded-2xl"
                      style={{ backgroundColor: 'rgba(30, 30, 30, 0.5)', border: `1px solid ${isPremiumVip ? "rgba(212,165,55,0.1)" : "rgba(156,163,175,0.12)"}` }}
                      >
                        <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: isPremiumVip ? 'linear-gradient(135deg, #d4a537 0%, #b8860b 100%)' : 'linear-gradient(135deg, #e5e7eb 0%, #9ca3af 100%)' }}
                        >
                          <span className="text-black font-bold text-lg">{yorum.kullanici_ad?.charAt(0) || 'K'}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                              <div className="font-bold text-white">{yorum.kullanici_ad}</div>
                              <div className="text-xs text-gray-500">{new Date(yorum.created_at).toLocaleDateString('fa-AF')}</div>
                                </div>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < yorum.puan
                                      ? (isPremiumVip ? "fill-amber-400 text-amber-400" : "fill-zinc-300 text-zinc-300")
                                      : "text-zinc-600"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-300 leading-relaxed">{yorum.yorum}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </main>

        {/* 📱 Sabit İletişim Çubuğu - Mobil için */}
        {magaza.telefon && (
          <div 
            className="fixed bottom-0 left-0 right-0 z-50 p-4 lg:hidden"
            style={{ 
              background: 'linear-gradient(to top, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.9) 100%)',
              borderTop: `3px solid ${A1}`
            }}
          >
            <div className="flex items-center justify-center gap-3 max-w-lg mx-auto">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${magaza.telefon.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                style={glass(
                  'linear-gradient(135deg, rgba(37,211,102,0.40) 0%, rgba(18,140,126,0.30) 100%)',
                  '#fff',
                  'rgba(37,211,102,0.20)'
                )}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                واتساپ
              </a>
              
              {/* Arama */}
              <a
                href={`tel:${magaza.telefon}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                style={glass(
                  isPremiumVip
                    ? 'linear-gradient(135deg, rgba(245,215,142,0.42) 0%, rgba(212,165,55,0.30) 100%)'
                    : 'linear-gradient(135deg, rgba(229,231,235,0.28) 0%, rgba(156,163,175,0.22) 100%)',
                  '#111827',
                  isPremiumVip ? 'rgba(212,165,55,0.22)' : 'rgba(156,163,175,0.22)'
                )}
              >
                <Phone className="w-5 h-5" />
                تماس
              </a>
              
              {/* Mesaj */}
              <button
                onClick={() => alert('قابلیت پیام به زودی فعال می‌شود')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                style={glass(
                  'linear-gradient(135deg, rgba(59,130,246,0.40) 0%, rgba(29,78,216,0.30) 100%)',
                  '#fff',
                  'rgba(59,130,246,0.20)'
                )}
              >
                <MessageCircle className="w-5 h-5" />
                پیام
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    );
  }

  // Normal/Pro mağaza için standart tasarım
  return (
    <div className={`min-h-screen flex flex-col ${
      isPro
        ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
        : 'bg-gradient-to-br from-gray-50 via-white to-purple-50'
    }`}>
      <Header />
      
      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-7xl px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : !magaza ? (
            <div className="flex items-center justify-center py-20">
              <div className="bg-white rounded-xl border border-gray-200 p-16 text-center max-w-md" dir="rtl">
                <Store className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-3">مغازه یافت نشد</h2>
                <p className="text-gray-600 mb-8">متأسفانه این مغازه موجود نیست</p>
                <Link href="/" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                  بازگشت به صفحه اصلی
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Cover Section */}
              <div className="relative mb-8 mt-6">
                <div className={`relative rounded-3xl overflow-hidden shadow-2xl ${
                  isPro ? 'border-4 border-blue-400 ring-8 ring-blue-200/50' : 'border-4 border-white'
                }`}>
                  {isPro && (
                    <div className="absolute top-6 right-6 z-20">
                      <div className="flex items-center gap-2 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl border-2 bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-300">
                        <Star className="h-6 w-6 fill-white" />
                        <span>مغازه حرفه‌ای</span>
                        <Zap className="h-5 w-5" />
                      </div>
                    </div>
                  )}

                  <div className={`relative ${isPro ? 'h-64' : 'h-48'} ${
                    isPro ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500' : 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600'
                  }`}>
                    {magaza.kapak_resmi ? (
                      <img src={getImageUrl(magaza.kapak_resmi)} alt={magaza.ad} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Store className="h-32 w-32 text-white/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                </div>

                {/* Logo */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-20">
                  <div className={`relative ${isPro ? 'w-32 h-32' : 'w-24 h-24'} rounded-3xl overflow-hidden ${
                    isPro ? 'border-4 border-blue-400 shadow-2xl bg-white ring-8 ring-blue-300/50' : 'border-4 border-white shadow-2xl bg-white ring-4 ring-purple-200'
                  }`}>
                    {magaza.logo ? (
                      <img src={getImageUrl(magaza.logo)} alt={magaza.ad} className="w-full h-full object-contain p-2" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${
                        isPro ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-gray-500 to-gray-600'
                      }`}>
                        {isPro ? <Star className="h-14 w-14 text-white" /> : <Store className="h-12 w-12 text-white" />}
                      </div>
                    )}
                  </div>
                </div>

                {/* Store Info */}
                <div className="relative px-8 pt-20" dir="rtl">
                  <div className={`rounded-2xl p-8 shadow-2xl ${
                    isPro ? 'bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border-4 border-blue-300' : 'bg-white border-2 border-gray-200'
                  }`}>
                    <div className="text-center mb-6">
                      <h1 className={`font-bold text-3xl mb-2 ${
                        isPro ? 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent' : 'text-gray-900'
                      }`}>
                        {magaza.ad_dari || magaza.ad}
                      </h1>
                      {magaza.aciklama && <p className="text-gray-600">{magaza.aciklama}</p>}
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Package className={`h-5 w-5 ${isPro ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span>{magaza.ilan_sayisi} محصول</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Eye className={`h-5 w-5 ${isPro ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span>{magaza.goruntulenme} بازدید</span>
                      </div>
                      {magaza.il_ad && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className={`h-5 w-5 ${isPro ? 'text-blue-600' : 'text-gray-500'}`} />
                          <span>{magaza.il_ad}</span>
                        </div>
                      )}
                      {magaza.telefon && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className={`h-5 w-5 ${isPro ? 'text-blue-600' : 'text-gray-500'}`} />
                          <span dir="ltr">{magaza.telefon}</span>
                        </div>
                      )}
                    </div>

                    {magaza.telefon && (
                      <a
                        href={`tel:${magaza.telefon}`}
                        className={`inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-xl transition-all shadow-lg w-full sm:w-auto ${
                          isPro
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                            : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                        }`}
                      >
                        <Phone className="h-5 w-5" />
                        <span>تماس با مغازه</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Products */}
              {ilanlar.length > 0 && (
                <section className="rounded-3xl p-8 shadow-2xl mb-8 bg-white border-2 border-gray-200" dir="rtl">
                  <div className="flex items-center gap-3 mb-6">
                    <ShoppingBag className="h-8 w-8 text-blue-600" />
                    <h2 className="text-3xl font-bold text-gray-900">همه محصولات</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {ilanlar.map((ilan) => (
                      <Link key={ilan.id} href={`/ilan/${ilan.id}`} className="group">
                        <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-purple-300 transition-all">
                          <div className="relative aspect-square bg-gray-100">
                            <Image src={getImageUrl(ilan.ana_resim)} alt={ilan.baslik} fill className="object-cover group-hover:scale-105 transition-transform" />
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">{ilan.baslik}</h3>
                            <PriceDisplay price={ilan.fiyat} currency="AFN" className="text-base font-bold text-gray-900" />
                          </div>
                        </div>
                      </Link>
                                ))}
                              </div>
                </section>
              )}

              {/* Comments */}
              <section className="rounded-3xl p-8 shadow-2xl bg-white border-2 border-gray-200" dir="rtl">
                <div className="flex items-center gap-3 mb-6">
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                  <h2 className="text-3xl font-bold text-gray-900">نظرات مشتریان</h2>
                            </div>

                {user ? (
                  <form onSubmit={handleYorumGonder} className="mb-8 bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-gray-700 mb-2">امتیاز شما</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((puan) => (
                          <button key={puan} type="button" onClick={() => setYeniYorum({ ...yeniYorum, puan })} className="transition-transform hover:scale-110">
                            <Star className={`h-8 w-8 ${puan <= yeniYorum.puan ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-gray-700 mb-2">نظر شما</label>
                      <textarea
                        value={yeniYorum.yorum}
                        onChange={(e) => setYeniYorum({ ...yeniYorum, yorum: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="تجربه خود را بنویسید..."
                        required
                      />
                    </div>
                    <button type="submit" disabled={yorumGonderiliyor} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-all disabled:opacity-50">
                      {yorumGonderiliyor ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="h-5 w-5" />}
                      ثبت نظر
                    </button>
                  </form>
                ) : (
                  <div className="mb-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
                    <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                    <p className="text-gray-700 mb-4">برای ثبت نظر باید وارد شوید</p>
                    <Link href="/giris" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg">
                      ورود / ثبت نام
                    </Link>
                  </div>
                )}

                <div className="space-y-4">
                  {yorumlar.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">هنوز نظری ثبت نشده است</p>
                    </div>
                  ) : (
                    yorumlar.map((yorum) => (
                      <div key={yorum.id} className="bg-white rounded-xl border-2 border-gray-200 p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">{yorum.kullanici_ad?.charAt(0) || 'K'}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="font-bold text-gray-900">{yorum.kullanici_ad}</div>
                                <div className="text-xs text-gray-500">{new Date(yorum.created_at).toLocaleDateString('fa-AF')}</div>
                              </div>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < yorum.puan ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700">{yorum.yorum}</p>
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
