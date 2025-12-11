"use client";

import { useState, useEffect, useRef } from "react";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Store, MapPin, Eye, Phone, Star, Package, Crown, ShoppingBag, Sparkles, Zap, MessageCircle, Send, ThumbsUp, BadgeCheck, ShieldCheck, Settings, Edit, TrendingUp, ChevronLeft, ChevronRight, Clock, Truck, Award, Users, Calendar, CheckCircle, Heart } from "lucide-react";
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
    
    fetchMagaza();
    fetchYorumlar();
  }, [resolvedParams.id]);

  const fetchMagaza = async () => {
    try {
      setLoading(true);
      
      const magazaResponse = await fetch(`/api/magazalar/${resolvedParams.id}`);
      const magazaData = await magazaResponse.json();
      
      if (magazaData.success) {
        setMagaza(magazaData.data);
      }

      const vitrinResponse = await fetch(`/api/vitrin?turu=magaza&magaza_id=${resolvedParams.id}&limit=10`);
      const vitrinData = await vitrinResponse.json();
      if (vitrinData.success) {
        setVitrinIlanlar(vitrinData.data);
      }

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
      const response = await fetch(`/api/magaza-yorumlar?magaza_id=${resolvedParams.id}`);
      const data = await response.json();
      if (data.success) {
        setYorumlar(data.data.yorumlar || []);
        setYorumStats(data.data.stats || null);
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
        await fetchYorumlar();
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
  const isElite = magaza?.store_level === "elite" || isPremium;

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

  // Premium/Elite mağaza için VIP Dark Theme
  if (isElite && magaza) {
    const membershipDuration = getMembershipDuration(magaza.created_at);
    
    // Tema rengi - sadece arka plan için
    // Varsayılan: Koyu lacivert/mor tonlu premium arka plan
    const bgColor = magaza.tema_renk || '#0f0f1a';

  return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: bgColor }}>
      <Header />
        
        {/* ✨ Animated Gold Border Effect - Top */}
        <div className="h-1 w-full" style={{ 
          background: 'linear-gradient(90deg, #0a0a0a 0%, #d4a537 20%, #f5d78e 50%, #d4a537 80%, #0a0a0a 100%)',
          animation: 'shimmer 3s ease-in-out infinite'
        }} />
        
        <style jsx>{`
          @keyframes shimmer {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(212, 165, 55, 0.3); }
            50% { box-shadow: 0 0 40px rgba(212, 165, 55, 0.6); }
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
                background: 'linear-gradient(#0a0a0a, #0a0a0a) padding-box, linear-gradient(135deg, #d4a537 0%, #f5d78e 25%, #d4a537 50%, #8b6914 75%, #d4a537 100%) border-box'
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
                          ? 'linear-gradient(90deg, #d4a537, #f5d78e, #d4a537)' 
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
                    border: '3px solid #d4a537',
                    boxShadow: '0 0 30px rgba(212, 165, 55, 0.3)'
                  }}
                  dir="rtl"
                >
                  
                  {/* ✨ Parlayan VIP Logo */}
                  <div className="flex justify-center mb-6">
                    <div 
                      className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden"
                      style={{ 
                        background: 'linear-gradient(135deg, #d4a537 0%, #f5d78e 50%, #d4a537 100%)',
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
                          <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d4a537, #8b6914)' }}>
                            <Crown className="w-16 h-16 text-black" />
                      </div>
                    )}
                      </div>
                      
                      {/* 👑 VIP Badge - İçeride, tam görünür */}
                      <div 
                        className="absolute top-2 right-2 z-20"
                        style={{ 
                          background: 'linear-gradient(135deg, #d4a537 0%, #f5d78e 30%, #d4a537 60%, #8b6914 100%)',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          boxShadow: '0 4px 15px rgba(212, 165, 55, 0.6)',
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
                      background: 'linear-gradient(135deg, #f5d78e 0%, #d4a537 50%, #f5d78e 100%)',
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
                      style={{ 
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        color: '#fff'
                      }}
                    >
                      <BadgeCheck className="w-4 h-4" />
                      <span>مغازه تایید شده</span>
                    </div>
                    
                    {/* Premium Üye Süresi */}
                    {membershipDuration && (
                      <div 
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                        style={{ 
                          background: 'linear-gradient(135deg, #d4a537 0%, #8b6914 100%)',
                          color: '#000'
                        }}
                      >
                        <Crown className="w-4 h-4" />
                        <span>عضو پریمیوم از {membershipDuration}</span>
                            </div>
                          )}
                          
                    {/* Güvenilir Satıcı */}
                    {magaza.guvenilir_satici === true && (
                      <div 
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                        style={{ 
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          color: '#fff'
                        }}
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>فروشنده قابل اعتماد</span>
                                </div>
                              )}
                      </div>

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-6 sm:gap-10 mb-6 flex-wrap">
                    <div className="flex items-center gap-2" style={{ color: '#f5d78e' }}>
                      <Package className="w-5 h-5" />
                      <span className="text-sm font-semibold">{magaza.ilan_sayisi} محصول</span>
                                </div>
                    <div className="flex items-center gap-2" style={{ color: '#f5d78e' }}>
                      <Eye className="w-5 h-5" />
                      <span className="text-sm font-semibold">{magaza.goruntulenme} بازدید</span>
                        </div>
                        {magaza.il_ad && (
                      <div className="flex items-center gap-2" style={{ color: '#f5d78e' }}>
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
                        style={{
                          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                          color: '#fff',
                          boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)'
                        }}
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
                        style={{
                          background: 'linear-gradient(135deg, #d4a537 0%, #f5d78e 50%, #d4a537 100%)',
                          color: '#000',
                          boxShadow: '0 4px 15px rgba(212, 165, 55, 0.4)'
                        }}
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
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        color: '#fff',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                      }}
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
                  background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(15,15,15,0.98) 100%)',
                  border: '3px solid #d4a537',
                  boxShadow: '0 0 20px rgba(212, 165, 55, 0.2)'
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-amber-400">آمار مغازه</h3>
                        </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Package className="w-4 h-4" />
                      <span>تعداد محصولات</span>
                        </div>
                    <span className="text-white font-bold">{magaza.ilan_sayisi}</span>
                          </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Eye className="w-4 h-4" />
                      <span>بازدید کل</span>
                          </div>
                    <span className="text-white font-bold">{magaza.goruntulenme?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Star className="w-4 h-4" />
                      <span>امتیاز</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {yorumStats ? (
                        <>
                          <span className="text-amber-400 font-bold">{yorumStats.ortalama_puan}</span>
                          <span className="text-gray-500 text-sm">/ 5</span>
                        </>
                      ) : (
                        <span className="text-gray-500">-</span>
                    )}
                  </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>تعداد نظرات</span>
                    </div>
                    <span className="text-white font-bold">{yorumStats?.toplam_yorum || 0}</span>
                  </div>
                </div>
                      </div>

              {/* Güven Rozetleri */}
              <div 
                className="rounded-2xl p-6"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(15,15,15,0.98) 100%)',
                  border: '3px solid #d4a537',
                  boxShadow: '0 0 20px rgba(212, 165, 55, 0.2)'
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-amber-400">نشان‌های اعتماد</h3>
                  </div>
                <div className="space-y-3">
                  {/* VIP Premium */}
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(212,165,55,0.1)' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d4a537, #f5d78e)' }}>
                      <Crown className="w-5 h-5 text-black" />
                </div>
                    <div>
                      <p className="text-white font-semibold text-sm">عضو پریمیوم</p>
                      <p className="text-gray-500 text-xs">فروشنده VIP</p>
                            </div>
                    <CheckCircle className="w-5 h-5 text-green-500 mr-auto" />
              </div>

                  {/* Doğrulanmış */}
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.1)' }}>
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
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.1)' }}>
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
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(168,85,247,0.1)' }}>
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
                  background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(15,15,15,0.98) 100%)',
                  border: '3px solid #d4a537',
                  boxShadow: '0 0 20px rgba(212, 165, 55, 0.2)'
                }}
              >
                {/* Çalışma Saatleri */}
                      <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-amber-400">ساعات کاری</h3>
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
                    <MapPin className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-amber-400">آدرس و تماس</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Şehir */}
                    {magaza.il_ad && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/20 flex-shrink-0 mt-0.5">
                          <MapPin className="w-4 h-4 text-amber-400" />
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
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/20 flex-shrink-0 mt-0.5">
                          <Store className="w-4 h-4 text-amber-400" />
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
                          <a href={`tel:${magaza.telefon}`} className="text-white text-sm hover:text-amber-400 transition-colors">
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
                      background: 'linear-gradient(135deg, #d4a537, #8b6914)',
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
                  background: 'linear-gradient(135deg, rgba(26,26,26,0.9) 0%, rgba(10,10,10,0.95) 100%)',
                  border: '3px solid #d4a537',
                  boxShadow: '0 0 20px rgba(212, 165, 55, 0.2)'
                }}
                dir="rtl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #d4a537, #f5d78e)' }}
                  >
                    <ShoppingBag className="w-6 h-6 text-black" />
                        </div>
                  <h2 
                    className="text-2xl font-bold"
                    style={{ 
                      background: 'linear-gradient(135deg, #f5d78e, #d4a537)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    محصولات
                          </h2>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                        </div>

                {/* Grid Container */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {ilanlar.map((ilan) => (
                    <Link key={ilan.id} href={`/ilan/${ilan.id}`} className="group block">
                      <div 
                        className="overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-[1.02]"
                        style={{ 
                          background: '#1a1a1a',
                          border: '2px solid #d4a537'
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
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, rgba(212,165,55,0.1) 0%, transparent 50%, rgba(212,165,55,0.1) 100%)' }} />
                          </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 min-h-[40px]">
                              {ilan.baslik}
                            </h3>
                          <div className="flex items-center justify-between">
                            <span 
                              className="font-bold text-lg"
                              style={{ color: '#f5d78e' }}
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
                background: 'linear-gradient(135deg, rgba(26,26,26,0.9) 0%, rgba(10,10,10,0.95) 100%)',
                border: '3px solid #d4a537',
                boxShadow: '0 0 20px rgba(212, 165, 55, 0.2)'
              }}
              dir="rtl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #d4a537, #f5d78e)' }}
                >
                  <MessageCircle className="w-6 h-6 text-black" />
                  </div>
                <div>
                  <h2 
                    className="text-2xl font-bold"
                    style={{ 
                      background: 'linear-gradient(135deg, #f5d78e, #d4a537)',
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
                            className={`w-4 h-4 ${i < Math.round(parseFloat(yorumStats.ortalama_puan)) ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`}
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
                  style={{ backgroundColor: 'rgba(30, 30, 30, 0.5)', border: '1px solid rgba(212,165,55,0.2)' }}
                >
                    <div className="mb-4">
                    <label className="block text-amber-400 text-sm font-bold mb-2">امتیاز شما</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((puan) => (
                          <button
                            key={puan}
                            type="button"
                            onClick={() => setYeniYorum({ ...yeniYorum, puan })}
                            className="transition-transform hover:scale-110"
                          >
                          <Star className={`w-8 h-8 ${puan <= yeniYorum.puan ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                    <label className="block text-amber-400 text-sm font-bold mb-2">نظر شما</label>
                      <textarea
                        value={yeniYorum.yorum}
                        onChange={(e) => setYeniYorum({ ...yeniYorum, yorum: e.target.value })}
                        rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-amber-500/30 text-white placeholder-gray-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                      placeholder="تجربه خود از خرید از این مغازه را بنویسید..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={yorumGonderiliyor}
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #d4a537 0%, #b8860b 100%)',
                      color: '#1a1a1a'
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
                  style={{ backgroundColor: 'rgba(30, 30, 30, 0.5)', border: '1px solid rgba(212,165,55,0.2)' }}
                >
                  <MessageCircle className="w-12 h-12 text-amber-400/50 mx-auto mb-3" />
                  <p className="text-gray-400 mb-4">برای ثبت نظر باید وارد حساب کاربری خود شوید</p>
                    <Link
                      href="/giris"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #d4a537 0%, #b8860b 100%)',
                      color: '#1a1a1a'
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
                      style={{ backgroundColor: 'rgba(30, 30, 30, 0.5)', border: '1px solid rgba(212,165,55,0.1)' }}
                      >
                        <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #d4a537 0%, #b8860b 100%)' }}
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
                                <Star key={i} className={`w-4 h-4 ${i < yorum.puan ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`} />
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
              borderTop: '3px solid #d4a537'
            }}
          >
            <div className="flex items-center justify-center gap-3 max-w-lg mx-auto">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${magaza.telefon.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                style={{ background: '#25D366', color: '#fff' }}
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
                style={{ background: 'linear-gradient(135deg, #d4a537, #8b6914)', color: '#000' }}
              >
                <Phone className="w-5 h-5" />
                تماس
              </a>
              
              {/* Mesaj */}
              <button
                onClick={() => alert('قابلیت پیام به زودی فعال می‌شود')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                style={{ background: '#3b82f6', color: '#fff' }}
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
