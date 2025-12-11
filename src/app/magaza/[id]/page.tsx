"use client";

import { useState, useEffect, useRef } from "react";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Store, MapPin, Eye, Phone, Star, Package, Crown, ShoppingBag, Sparkles, Zap, MessageCircle, Send, ThumbsUp, BadgeCheck, ShieldCheck, Settings, Edit, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [sliderIndex, setSliderIndex] = useState(0);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Hero slider otomatik geçiş - Sadece ilk 5 ürünle
  useEffect(() => {
    if (ilanlar.length > 1) {
      const maxSlides = Math.min(5, ilanlar.length);
      const interval = setInterval(() => {
        setHeroSlideIndex((prev) => (prev + 1) % maxSlides);
      }, 5000); // 5 saniyede bir değişir
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

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const isPremium = magaza?.paket_turu === "premium";
  const isPro = magaza?.paket_turu === "pro";
  const isElite = magaza?.store_level === "elite" || isPremium;

  // Premium/Elite mağaza için VIP Dark Theme
  if (isElite && magaza) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
        <Header />
        
        <main className="flex-1 pb-16">
          <div className="mx-auto max-w-7xl px-4">
            
            {/* VIP Hero Banner - PRO Slider */}
            <div className="relative mt-6 mb-8 rounded-3xl overflow-hidden h-[450px] sm:h-[500px] bg-black">
              {/* Background - Ürün Slider (Sadece ilk 5 ürün) */}
              <div className="absolute inset-0 bg-black">
                {ilanlar.length > 0 ? (
                  <>
                    {/* Ürün resimleri - Sadece ilk 5 */}
                    {ilanlar.slice(0, 5).map((ilan, idx) => (
                      <div 
                        key={ilan.id}
                        className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                        style={{ 
                          opacity: idx === heroSlideIndex ? 1 : 0,
                          zIndex: idx === heroSlideIndex ? 1 : 0
                        }}
                      >
                        <Image
                          src={getImageUrl(ilan.ana_resim)}
                          alt={ilan.baslik}
                          fill
                          className="object-cover"
                          priority={idx === 0}
                          quality={85}
                        />
                      </div>
                    ))}
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70 z-10" />
                  </>
                ) : magaza.kapak_resmi ? (
                  <>
                    <img
                      src={getImageUrl(magaza.kapak_resmi)}
                      alt={magaza.ad}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />
                )}
              </div>

              {/* Slide Indicators - Sadece 5 ürün için */}
              {ilanlar.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {ilanlar.slice(0, 5).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setHeroSlideIndex(idx)}
                      className={`rounded-full transition-all duration-300 ${
                        idx === heroSlideIndex
                          ? 'w-10 h-2.5 bg-amber-400'
                          : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="relative z-10 px-8 sm:px-16 py-10 sm:py-14 text-center rounded-3xl mx-4 bg-black/50"
                  dir="rtl"
                >
                  
                  {/* Logo - Mağazanın kendi logosu */}
                  <div className="flex justify-center mb-6">
                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-amber-500 shadow-2xl bg-black">
                      {magaza.logo ? (
                        <img
                          src={getImageUrl(magaza.logo)}
                          alt={magaza.ad}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-700">
                          <Crown className="w-14 h-14 text-black" />
                        </div>
                      )}
                      {/* Premium Badge */}
                      <div className="absolute -top-1 -right-1 px-2 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-black">
                        VIP
                      </div>
                    </div>
                  </div>

                  {/* Store Name */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 mb-4">
                    {magaza.ad_dari || magaza.ad}
                  </h1>

                  {/* Description */}
                  {magaza.aciklama && (
                    <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto mb-6 leading-relaxed">
                      {magaza.aciklama}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-6 sm:gap-10 mb-8 flex-wrap">
                    <div className="flex items-center gap-2 text-amber-400/80">
                      <Package className="w-5 h-5" />
                      <span className="text-sm font-semibold">{magaza.ilan_sayisi} محصول</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-400/80">
                      <Eye className="w-5 h-5" />
                      <span className="text-sm font-semibold">{magaza.goruntulenme} بازدید</span>
                    </div>
                    {magaza.il_ad && (
                      <div className="flex items-center gap-2 text-amber-400/80">
                        <MapPin className="w-5 h-5" />
                        <span className="text-sm font-semibold">{magaza.il_ad}</span>
                      </div>
                    )}
                  </div>

                  {/* Shop Now Button */}
                  {magaza.telefon && (
                    <a
                      href={`tel:${magaza.telefon}`}
                      className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #d4a537 0%, #b8860b 50%, #8b6914 100%)',
                        boxShadow: '0 4px 20px rgba(212, 165, 55, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                        color: '#1a1a1a'
                      }}
                    >
                      <Phone className="w-5 h-5" />
                      <span>تماس بگیرید</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Navigation Arrows */}
              {ilanlar.length > 1 && (
                <>
                  <button 
                    onClick={() => {
                      const maxSlides = Math.min(5, ilanlar.length);
                      setHeroSlideIndex((prev) => (prev - 1 + maxSlides) % maxSlides);
                    }}
                    className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white bg-black/60 hover:bg-black/80 border-2 border-amber-400/50 hover:border-amber-400 transition-all z-20 shadow-xl"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
                  </button>
                  <button 
                    onClick={() => {
                      const maxSlides = Math.min(5, ilanlar.length);
                      setHeroSlideIndex((prev) => (prev + 1) % maxSlides);
                    }}
                    className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white bg-black/60 hover:bg-black/80 border-2 border-amber-400/50 hover:border-amber-400 transition-all z-20 shadow-xl"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
                  </button>
                </>
              )}
            </div>

            {/* Products Slider */}
            {ilanlar.length > 0 && (
              <div className="mb-12" dir="rtl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500">
                      <ShoppingBag className="w-5 h-5 text-black" />
                    </div>
                    <h2 className="text-2xl font-bold text-amber-400">محصولات</h2>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => scrollSlider('right')}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-amber-400 bg-zinc-800 border border-amber-500/30 hover:bg-zinc-700 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => scrollSlider('left')}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-amber-400 bg-zinc-800 border border-amber-500/30 hover:bg-zinc-700 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Horizontal Scroll Container */}
                <div 
                  ref={sliderRef}
                  className="flex gap-4 overflow-x-auto pb-4"
                  style={{ scrollbarWidth: 'none' }}
                >
                  {ilanlar.map((ilan, index) => (
                    <motion.div
                      key={ilan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex-shrink-0 w-48 sm:w-56"
                    >
                      <Link href={`/ilan/${ilan.id}`} className="group block">
                        <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 bg-zinc-900 border border-amber-500/20">
                          {/* Image */}
                          <div className="relative aspect-square overflow-hidden">
                            <Image
                              src={getImageUrl(ilan.ana_resim)}
                              alt={ilan.baslik}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>

                          {/* Content */}
                          <div className="p-4 bg-zinc-900">
                            <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 min-h-[40px]">
                              {ilan.baslik}
                            </h3>
                            <div className="flex items-center justify-between">
                              <span className="text-amber-400 font-bold text-lg">
                                ${ilan.para_birimi === 'USD' && ilan.fiyat_usd ? ilan.fiyat_usd.toLocaleString() : ilan.fiyat.toLocaleString()}
                              </span>
                              <div className="flex items-center gap-1 text-gray-400 text-xs">
                                <Eye className="w-3 h-3" />
                                <span>{ilan.goruntulenme}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}


            {/* Comments Section - %50 Şeffaf */}
            <div 
              className="rounded-3xl p-6 sm:p-8 mb-8 backdrop-blur-sm" 
              style={{ backgroundColor: 'rgba(20, 20, 20, 0.5)', border: '1px solid rgba(212, 165, 55, 0.2)' }} 
              dir="rtl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #d4a537 0%, #b8860b 100%)' }}
                >
                  <MessageCircle className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-amber-400">نظرات مشتریان</h2>
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
                  className="mb-8 p-6 rounded-2xl backdrop-blur-sm" 
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
                  className="mb-8 p-6 rounded-2xl text-center backdrop-blur-sm" 
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
                      className="p-6 rounded-2xl transition-all backdrop-blur-sm"
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
