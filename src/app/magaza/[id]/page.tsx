"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Store, MapPin, Eye, Phone, Star, Package, Crown, ShoppingBag, Sparkles, Zap, MessageCircle, Send, ThumbsUp, BadgeCheck, ShieldCheck, Video, Play, Upload, X, Clock } from "lucide-react";
import { formatPrice, getImageUrl } from "@/lib/utils";

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
  
  // Video State'leri
  const [videolar, setVideolar] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [videoForm, setVideoForm] = useState({
    video_url: '',
    thumbnail_url: '',
    baslik: '',
    aciklama: '',
    sure: 10
  });
  const [videoYukleniyor, setVideoYukleniyor] = useState(false);

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
    fetchVideolar();
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

  const fetchVideolar = async () => {
    try {
      const response = await fetch(`/api/magazalar/${resolvedParams.id}/videolar`);
      const data = await response.json();
      if (data.success) {
        setVideolar(data.data || []);
      }
    } catch (error) {
      console.error('Videolar yüklenirken hata:', error);
    }
  };

  const handleVideoYukle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Video yüklemek için giriş yapmalısınız');
      return;
    }

    if (!videoForm.video_url) {
      alert('لطفاً لینک ویدیو را وارد کنید');
      return;
    }

    setVideoYukleniyor(true);
    
    try {
      const response = await fetch(`/api/magazalar/${resolvedParams.id}/videolar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoForm),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ ویدیو با موفقیت آپلود شد');
        setVideoForm({ video_url: '', thumbnail_url: '', baslik: '', aciklama: '', sure: 10 });
        setShowVideoUpload(false);
        await fetchVideolar();
      } else {
        alert(data.message || 'خطا در آپلود ویدیو');
      }
    } catch (error) {
      console.error('Video yükleme hatası:', error);
      alert('خطا در آپلود ویدیو');
    } finally {
      setVideoYukleniyor(false);
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
              <div className="relative mb-8 mt-8">
                {/* Kapak Resmi - Tam Genişlik */}
                <div className={`relative rounded-3xl overflow-hidden shadow-2xl ${
                  isElite 
                    ? 'border-4 border-yellow-400 ring-8 ring-yellow-200/50' 
                    : isPro
                    ? 'border-4 border-blue-400 ring-8 ring-blue-200/50'
                    : 'border-4 border-white'
                }`}>
                  {/* Elite/Pro Badge */}
                  {(isElite || isPro) && (
                    <div className="absolute top-6 right-6 z-20">
                      <div className={`flex items-center gap-2 text-white px-6 py-3 rounded-2xl text-base font-bold shadow-2xl border-2 ${
                        isElite
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-300'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-300'
                      }`}>
                        {isElite ? (
                          <>
                            <Crown className="h-6 w-6 fill-white" />
                            <span>مغازه پریمیوم</span>
                            <Sparkles className="h-5 w-5" />
                          </>
                        ) : (
                          <>
                            <Star className="h-6 w-6 fill-white" />
                            <span>مغازه حرفه‌ای</span>
                            <Zap className="h-5 w-5" />
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Kapak Resmi */}
                  <div className={`relative ${isElite ? 'h-72' : isPro ? 'h-64' : 'h-48'} ${
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
                <div className="absolute bottom-36 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className={`relative ${isElite ? 'w-40 h-40' : isPro ? 'w-36 h-36' : 'w-28 h-28'} rounded-3xl overflow-hidden ${
                    isElite 
                      ? 'border-4 border-yellow-400 shadow-2xl bg-white ring-8 ring-yellow-300/50' 
                      : isPro
                      ? 'border-4 border-blue-400 shadow-2xl bg-white ring-8 ring-blue-300/50'
                      : 'border-4 border-white shadow-2xl bg-white ring-4 ring-purple-200'
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
                <div className="relative px-8 pt-24" dir="rtl">
                  {/* Bilgiler - Elite/Pro Özel */}
                  <div className={`rounded-2xl p-8 shadow-2xl ${
                    isElite 
                      ? 'bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 border-4 border-yellow-300' 
                      : isPro
                      ? 'bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border-4 border-blue-300'
                      : 'bg-white border-2 border-gray-200'
                  }`}>
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <h1 className={`font-bold ${
                              isElite 
                                ? 'text-4xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent' 
                                : isPro
                                ? 'text-4xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
                                : 'text-3xl text-gray-900'
                            }`}>
                              {magaza.ad_dari || magaza.ad}
                            </h1>
                            {(isElite || isPro) && (
                              <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold shadow-lg ${
                                isElite
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-base border-2 border-yellow-300'
                                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm'
                              }`}>
                                {isElite ? <Crown className="h-5 w-5 fill-white" /> : <Star className="h-4 w-4" />}
                                <span>{isElite ? 'ELITE PREMIUM' : 'PRO'}</span>
                                {isElite && <Sparkles className="h-4 w-4" />}
                              </div>
                            )}
                          </div>
                          
                          {/* Doğrulama Rozeti - Ücretli Paketler için */}
                          {(isElite || isPro) && (
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg border-2 ${
                                isElite
                                  ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300'
                                  : 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300'
                              }`}>
                                <BadgeCheck className={`h-5 w-5 ${isElite ? 'text-yellow-600' : 'text-blue-600'}`} />
                                <span className={`text-sm font-bold ${isElite ? 'text-yellow-800' : 'text-blue-800'}`}>
                                  مغازه تأیید شده
                                </span>
                              </div>
                              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl shadow-md ${
                                isElite
                                  ? 'bg-green-100 border-2 border-green-300'
                                  : 'bg-green-100 border-2 border-green-300'
                              }`}>
                                <ShieldCheck className="h-5 w-5 text-green-600" />
                                <span className="text-sm font-bold text-green-800">
                                  فروشنده معتبر
                                </span>
                              </div>
                            </div>
                          )}
                          
                          <p className={`mb-4 leading-relaxed ${
                            isElite ? 'text-gray-800 text-xl' : 'text-gray-700 text-lg'
                          }`}>{magaza.aciklama}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Package className="h-5 w-5 text-blue-600" />
                          <span>{magaza.ilan_sayisi} محصول</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Eye className="h-5 w-5 text-blue-600" />
                          <span>{magaza.goruntulenme} بازدید</span>
                        </div>
                        {magaza.il_ad && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            <span>{magaza.il_ad}</span>
                          </div>
                        )}
                        {magaza.telefon && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="h-5 w-5 text-blue-600" />
                            <span dir="ltr">{magaza.telefon}</span>
                          </div>
                        )}
                      </div>

                      {magaza.telefon && (
                        <a
                          href={`tel:${magaza.telefon}`}
                          className={`inline-flex items-center gap-2 font-bold px-8 py-4 rounded-xl transition-all shadow-lg ${
                            isElite
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-2 border-yellow-400'
                              : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-2 border-green-500'
                          }`}
                        >
                          <Phone className="h-5 w-5" />
                          <span>تماس با مغازه</span>
                          {isElite && <Sparkles className="h-4 w-4" />}
                        </a>
                      )}
                  </div>
                </div>
              </div>

              {/* Vitrin İlanları - Elite Özel */}
              {vitrinIlanlar.length > 0 && (
                <section className={`mb-12 rounded-3xl p-8 shadow-2xl ${
                  isElite 
                    ? 'bg-gradient-to-br from-white via-yellow-50/50 to-orange-50/50 border-4 border-yellow-300 ring-4 ring-yellow-200/30' 
                    : 'bg-white border-2 border-yellow-200'
                }`} dir="rtl">
                  <div className="flex items-center gap-3 mb-6">
                    {isElite ? (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                          <Crown className="h-7 w-7 text-white fill-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                            ویترین پریمیوم
                          </h2>
                          <p className="text-sm text-gray-600">محصولات ویژه این مغازه</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                        <h2 className="text-3xl font-bold text-gray-900">ویترین مغازه</h2>
                      </>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {vitrinIlanlar.map((ilan, index) => (
                      <motion.div
                        key={ilan.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link href={`/ilan/${ilan.id}`} className="group block">
                          <div className="bg-white rounded-xl shadow-xl border-3 border-yellow-300 overflow-hidden hover:shadow-2xl hover:border-yellow-500 transition-all ring-2 ring-yellow-100">
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
                              <div className="text-lg font-bold text-gray-900">
                                {formatPrice(ilan.fiyat)}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tüm İlanlar - Elite Özel */}
              <section className={`rounded-3xl p-8 shadow-2xl mb-12 ${
                isElite 
                  ? 'bg-gradient-to-br from-white to-yellow-50/30 border-4 border-yellow-200' 
                  : 'bg-white border-2 border-gray-200'
              }`} dir="rtl">
                <div className="flex items-center gap-3 mb-6">
                  {isElite ? (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                        تمام محصولات
                      </h2>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-8 w-8 text-blue-600" />
                      <h2 className="text-3xl font-bold text-gray-900">همه محصولات</h2>
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
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
                            <div className="text-base font-bold text-gray-900">
                              {formatPrice(ilan.fiyat)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* Video Galerisi - Sadece Elite/Pro Mağazalar */}
              {(isElite || isPro) && (
                <section className={`rounded-3xl p-8 shadow-2xl mb-12 ${
                  isElite 
                    ? 'bg-gradient-to-br from-white to-pink-50/30 border-4 border-pink-200' 
                    : 'bg-white border-2 border-gray-200'
                }`} dir="rtl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isElite 
                          ? 'bg-gradient-to-br from-pink-500 to-rose-500' 
                          : 'bg-blue-100'
                      }`}>
                        <Video className={`h-6 w-6 ${isElite ? 'text-white' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <h2 className={`text-3xl font-bold ${
                          isElite 
                            ? 'bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent' 
                            : 'text-gray-900'
                        }`}>
                          ویدیوهای کوتاه
                        </h2>
                        <p className="text-sm text-gray-600">محصولات را در ویدیوهای کوتاه ببینید</p>
                      </div>
                    </div>
                    
                    {/* Sadece mağaza sahibi için video yükleme butonu */}
                    {user && magaza && user.id === magaza.kullanici_id && (
                      <button
                        onClick={() => setShowVideoUpload(true)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all shadow-lg ${
                          isElite
                            ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <Upload className="h-5 w-5" />
                        آپلود ویدیو
                      </button>
                    )}
                  </div>

                  {/* Video Grid */}
                  {videolar.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">هنوز ویدیویی اضافه نشده است</p>
                      {user && magaza && user.id === magaza.kullanici_id && (
                        <p className="text-sm text-gray-400 mt-2">اولین ویدیو خود را آپلود کنید!</p>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {videolar.map((video) => (
                        <div
                          key={video.id}
                          onClick={() => {
                            setSelectedVideo(video);
                            setShowVideoModal(true);
                          }}
                          className="group cursor-pointer relative aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                        >
                          {/* Thumbnail veya Video Preview */}
                          {video.thumbnail_url ? (
                            <img
                              src={video.thumbnail_url}
                              alt={video.baslik || 'Video'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                              <Video className="h-16 w-16 text-white/50" />
                            </div>
                          )}
                          
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                              <Play className="h-8 w-8 text-pink-600 fill-pink-600 ml-1" />
                            </div>
                          </div>

                          {/* Video Info */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                            {video.baslik && (
                              <p className="text-white font-semibold text-sm line-clamp-2 mb-1">
                                {video.baslik}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-white/80">
                              <Clock className="h-3 w-3" />
                              <span>{video.sure}s</span>
                              <Eye className="h-3 w-3 ml-2" />
                              <span>{video.goruntulenme || 0}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* Video Modal */}
              {showVideoModal && selectedVideo && (
                <div 
                  className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                  onClick={() => setShowVideoModal(false)}
                >
                  <div className="relative max-w-lg w-full aspect-[9/16] bg-black rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setShowVideoModal(false)}
                      className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all"
                    >
                      <X className="h-6 w-6 text-white" />
                    </button>
                    
                    <video
                      src={selectedVideo.video_url}
                      controls
                      autoPlay
                      loop
                      className="w-full h-full object-contain"
                    >
                      Tarayıcınız video oynatmayı desteklemiyor.
                    </video>
                    
                    {selectedVideo.baslik && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4" dir="rtl">
                        <h3 className="text-white font-bold text-lg mb-1">{selectedVideo.baslik}</h3>
                        {selectedVideo.aciklama && (
                          <p className="text-white/80 text-sm">{selectedVideo.aciklama}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Video Upload Modal */}
              {showVideoUpload && (
                <div 
                  className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                  onClick={() => setShowVideoUpload(false)}
                >
                  <div className="bg-white rounded-2xl max-w-lg w-full p-8" onClick={(e) => e.stopPropagation()} dir="rtl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">آپلود ویدیو کوتاه</h3>
                      <button
                        onClick={() => setShowVideoUpload(false)}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all"
                      >
                        <X className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>

                    <form onSubmit={handleVideoYukle} className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          لینک ویدیو *
                        </label>
                        <input
                          type="url"
                          required
                          value={videoForm.video_url}
                          onChange={(e) => setVideoForm({ ...videoForm, video_url: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          placeholder="https://example.com/video.mp4"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          لینک تصویر پیش‌نمایش
                        </label>
                        <input
                          type="url"
                          value={videoForm.thumbnail_url}
                          onChange={(e) => setVideoForm({ ...videoForm, thumbnail_url: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          placeholder="https://example.com/thumbnail.jpg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          عنوان
                        </label>
                        <input
                          type="text"
                          value={videoForm.baslik}
                          onChange={(e) => setVideoForm({ ...videoForm, baslik: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          placeholder="عنوان ویدیو"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          توضیحات
                        </label>
                        <textarea
                          value={videoForm.aciklama}
                          onChange={(e) => setVideoForm({ ...videoForm, aciklama: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          placeholder="توضیحات کوتاه..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          مدت زمان ویدیو *
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="sure"
                              value={10}
                              checked={videoForm.sure === 10}
                              onChange={() => setVideoForm({ ...videoForm, sure: 10 })}
                              className="w-4 h-4 text-pink-600"
                            />
                            <span>۱۰ ثانیه</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="sure"
                              value={30}
                              checked={videoForm.sure === 30}
                              onChange={() => setVideoForm({ ...videoForm, sure: 30 })}
                              className="w-4 h-4 text-pink-600"
                            />
                            <span>۳۰ ثانیه</span>
                          </label>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          <strong>نکته:</strong> ویدیوها باید {isElite ? '10' : '5'} عدد یا کمتر باشند.
                          حداکثر مدت زمان: ۳۰ ثانیه
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={videoYukleniyor}
                        className={`w-full py-3 rounded-lg font-bold transition-all ${
                          isElite
                            ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        } disabled:opacity-50`}
                      >
                        {videoYukleniyor ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            در حال آپلود...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Upload className="h-5 w-5" />
                            آپلود ویدیو
                          </span>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Yorumlar Bölümü */}
              <section className={`rounded-3xl p-8 shadow-2xl ${
                isElite 
                  ? 'bg-gradient-to-br from-white to-purple-50/30 border-4 border-purple-200' 
                  : 'bg-white border-2 border-gray-200'
              }`} dir="rtl">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isElite 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                      : 'bg-blue-100'
                  }`}>
                    <MessageCircle className={`h-6 w-6 ${isElite ? 'text-white' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1">
                    <h2 className={`text-3xl font-bold ${
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
                  <form onSubmit={handleYorumGonder} className="mb-8 bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
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
                      className={`flex items-center gap-2 font-bold px-6 py-3 rounded-lg transition-all ${
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
                  <div className="mb-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
                    <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                    <p className="text-gray-700 mb-4">
                      برای ثبت نظر باید وارد حساب کاربری خود شوید
                    </p>
                    <Link
                      href="/giris"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all"
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

