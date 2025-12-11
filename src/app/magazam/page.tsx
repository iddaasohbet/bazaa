"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Store, MapPin, Phone, Eye, Package, Edit, TrendingUp, ExternalLink, MessageSquare, Camera, Star, Crown, Sparkles, BarChart3, Users, Plus, Settings, Calendar, Clock, CheckCircle, AlertCircle, ArrowUp, ArrowDown, Activity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import PriceDisplay from "@/components/PriceDisplay";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface MagazaBilgileri {
  id: number;
  kullanici_id: number;
  ad: string;
  ad_dari: string;
  slug: string;
  aciklama?: string;
  adres?: string;
  telefon?: string;
  il_ad?: string;
  logo?: string;
  kapak_resmi?: string;
  store_level: string;
  onay_durumu: string;
  paket_baslangic?: string;
  paket_bitis?: string;
  goruntulenme?: number;
  created_at?: string;
}

export default function MagazamPage() {
  const router = useRouter();
  const [magazaBilgileri, setMagazaBilgileri] = useState<MagazaBilgileri | null>(null);
  const [loading, setLoading] = useState(true);
  const [ilanlar, setIlanlar] = useState<any[]>([]);
  const [stats, setStats] = useState({
    aktifIlanlar: 0,
    toplamGoruntulenme: 0,
    toplamFavoriler: 0,
    toplamMesajlar: 0
  });

  useEffect(() => {
    checkMagaza();
  }, []);

  const checkMagaza = async () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) {
        router.push('/giris');
        return;
      }

      const userData = JSON.parse(user);
      
      const response = await fetch(`/api/magazalar?kullanici_id=${userData.id}`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const magaza = data.data[0];
        setMagazaBilgileri(magaza);
        await fetchMagazaIlanlari(magaza.id);
        await fetchStats(userData.id, magaza.id);
      } else {
        router.push('/magaza-ac');
      }
    } catch (error) {
      console.error('Mağaza bilgileri yüklenirken hata:', error);
      router.push('/magaza-ac');
    } finally {
      setLoading(false);
    }
  };

  const fetchMagazaIlanlari = async (magazaId: number) => {
    try {
      const response = await fetch(`/api/magazalar/${magazaId}/ilanlar`);
      const data = await response.json();
      if (data.success) {
        setIlanlar(data.data || []);
      }
    } catch (error) {
      console.error('İlanlar yüklenirken hata:', error);
    }
  };

  const fetchStats = async (kullaniciId: number, magazaId: number) => {
    try {
      const response = await fetch(`/api/istatistikler?kullanici_id=${kullaniciId}`);
      const data = await response.json();
      if (data.success && data.data) {
        setStats({
          aktifIlanlar: data.data.aktifIlanlar || 0,
          toplamGoruntulenme: data.data.toplamGoruntulenme || 0,
          toplamFavoriler: data.data.toplamFavoriler || 0,
          toplamMesajlar: data.data.toplamMesajlar || 0
        });
      }
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    }
  };

  const getStoreLevelInfo = (level: string) => {
    switch(level) {
      case 'basic':
        return { text: 'عادی', icon: Store, color: 'from-gray-500 to-gray-600', bg: 'bg-gray-100' };
      case 'pro':
        return { text: 'پرو', icon: Star, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-100' };
      case 'elite':
        return { text: 'پریمیوم', icon: Crown, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-100' };
      default:
        return { text: level, icon: Store, color: 'from-gray-500 to-gray-600', bg: 'bg-gray-100' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">در حال بارگذاری...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!magazaBilgileri) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-4" dir="rtl">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center mb-6">
              <Store className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">مغازه خود را بسازید</h2>
            <p className="text-gray-600 mb-6">با افتتاح مغازه، محصولات خود را به مشتریان نشان دهید</p>
            <Link
              href="/magaza-ac"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-8 py-4 rounded-xl"
            >
              <Store className="h-5 w-5" />
              افتتاح مغازه
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const levelInfo = getStoreLevelInfo(magazaBilgileri.store_level);
  const LevelIcon = levelInfo.icon;
  const isElite = magazaBilgileri.store_level === 'elite';
  const isPro = magazaBilgileri.store_level === 'pro';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' }}>
      <Header />
      
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4" dir="rtl">
          
          {/* Profil Kartı - Premium */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden mb-8 border border-gray-100">
            {/* Kapak - Daha yüksek */}
            <div className="h-44 sm:h-56 relative" style={{ background: isElite ? 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #2d1f3d 100%)' : isPro ? 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)' : 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #6366f1 100%)' }}>
              {magazaBilgileri.kapak_resmi && (
                <Image src={magazaBilgileri.kapak_resmi} alt="Kapak" fill className="object-cover opacity-40" />
              )}
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              
              {/* VIP Badge for Elite - Animasyonlu */}
              {isElite && (
                <div 
                  className="absolute top-5 left-5 flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg"
                  style={{ 
                    background: 'linear-gradient(135deg, #d4a537 0%, #f5d78e 50%, #d4a537 100%)',
                    boxShadow: '0 4px 20px rgba(212, 165, 55, 0.4)'
                  }}
                >
                  <Crown className="w-5 h-5 text-black" />
                  <span className="font-black text-sm text-black tracking-wide">VIP PREMIUM</span>
                </div>
              )}
              
              {/* Pro Badge */}
              {isPro && !isElite && (
                <div className="absolute top-5 left-5 flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 shadow-lg">
                  <Star className="w-4 h-4 text-white" />
                  <span className="font-bold text-sm text-white">PRO</span>
                </div>
              )}
              
              <Link
                href="/magazam/duzenle"
                className="absolute top-5 right-5 flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all text-sm font-medium border border-white/20"
              >
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">تغییر کاور</span>
              </Link>
            </div>

            {/* Profil Bilgileri */}
            <div className="px-6 sm:px-8 pb-8">
              {/* Logo ve Bilgiler - Yatay düzen */}
              <div className="flex items-start gap-6 -mt-10">
                {/* Logo */}
                <div className="relative flex-shrink-0">
                  <div 
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white overflow-hidden"
                    style={{ 
                      border: isElite ? '4px solid #d4a537' : '4px solid white',
                      boxShadow: isElite ? '0 8px 30px rgba(212, 165, 55, 0.3)' : '0 8px 30px rgba(0,0,0,0.15)'
                    }}
                  >
                    {magazaBilgileri.logo ? (
                      <img src={magazaBilgileri.logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                        <Store className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <Link
                    href="/magazam/duzenle"
                    className="absolute -bottom-2 -left-2 w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
                  >
                    <Camera className="w-4 h-4" />
                  </Link>
                </div>
                
                {/* Bilgiler */}
                <div className="flex-1 pt-12">
                  {/* İsim ve Rozetler */}
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{magazaBilgileri.ad_dari || magazaBilgileri.ad}</h1>
                    <div 
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-white"
                      style={{ background: isElite ? 'linear-gradient(135deg, #d4a537, #f5d78e)' : isPro ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'linear-gradient(135deg, #6b7280, #9ca3af)', color: isElite ? '#000' : '#fff' }}
                    >
                      <LevelIcon className="w-3 h-3" />
                      {levelInfo.text}
                    </div>
                    {magazaBilgileri.onay_durumu === 'onaylandi' && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700">
                        <CheckCircle className="w-3 h-3" />
                        تأیید شده
                      </div>
                    )}
                  </div>
                  
                  {/* İletişim Bilgileri */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    {magazaBilgileri.telefon && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-emerald-500" />
                        <span dir="ltr">{magazaBilgileri.telefon}</span>
                      </div>
                    )}
                    {magazaBilgileri.il_ad && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        {magazaBilgileri.il_ad}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-purple-500" />
                      {magazaBilgileri.goruntulenme || 0} بازدید
                    </div>
                  </div>

                  {/* Aksiyon Butonları */}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/magaza/${magazaBilgileri.id}`}
                      target="_blank"
                      className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      مشاهده مغازه
                    </Link>
                    <Link
                      href="/magazam/duzenle"
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                      ویرایش
                    </Link>
                    {!isElite && (
                      <Link
                        href="/magaza-paket"
                        className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-bold transition-all"
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #ea580c)' }}
                      >
                        <Sparkles className="w-4 h-4" />
                        ارتقا
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hızlı İşlemler - Premium */}
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 mb-8 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-5 text-lg">دسترسی سریع</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link href="/ilan-ver" className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all border border-blue-100 hover:border-blue-200 hover:shadow-md hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
                  <Plus className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">آگهی جدید</span>
              </Link>
              <Link href="/magazam/duzenle" className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 transition-all border border-gray-100 hover:border-gray-200 hover:shadow-md hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg shadow-gray-900/20 group-hover:scale-110 transition-transform">
                  <Settings className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">تنظیمات</span>
              </Link>
              <Link href="/mesajlar" className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-fuchsia-50 hover:from-purple-100 hover:to-fuchsia-100 transition-all border border-purple-100 hover:border-purple-200 hover:shadow-md hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">پیام‌ها</span>
              </Link>
              <Link href="/magaza-paket" className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-all border border-amber-100 hover:border-amber-200 hover:shadow-md hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                  <Crown className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">پلن‌ها</span>
              </Link>
            </div>
          </div>

          {/* 📊 İstatistikler - Grafikli */}
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden border border-gray-100 mb-8">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">آمار و تحلیل</h3>
                  <p className="text-sm text-gray-500">عملکرد مغازه شما</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* İstatistik Kartları */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                      <ArrowUp className="w-4 h-4" />
                      +12%
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stats.toplamGoruntulenme}</div>
                  <div className="text-sm text-gray-600">بازدید کل</div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg bg-emerald-600 flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                      <ArrowUp className="w-4 h-4" />
                      +5%
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stats.aktifIlanlar}</div>
                  <div className="text-sm text-gray-600">آگهی فعال</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl p-5 border border-purple-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                      <ArrowUp className="w-4 h-4" />
                      +8%
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stats.toplamFavoriler}</div>
                  <div className="text-sm text-gray-600">علاقه‌مندی</div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 border border-orange-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg bg-orange-600 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm font-semibold">
                      <Activity className="w-4 h-4" />
                      جدید
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stats.toplamMesajlar}</div>
                  <div className="text-sm text-gray-600">پیام‌ها</div>
                </div>
              </div>

              {/* Grafikler */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Görüntülenme Grafiği */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    بازدید 7 روز گذشته
                  </h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={[
                      { name: 'شنبه', value: 45 },
                      { name: 'یکشنبه', value: 52 },
                      { name: 'دوشنبه', value: 48 },
                      { name: 'سه‌شنبه', value: 61 },
                      { name: 'چهارشنبه', value: 55 },
                      { name: 'پنجشنبه', value: 67 },
                      { name: 'جمعه', value: stats.toplamGoruntulenme || 0 }
                    ]}>
                      <defs>
                        <linearGradient id="colorView" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#colorView)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* İlan Dağılımı */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-600" />
                    توزیع آگهی‌ها
                  </h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[
                      { name: 'فعال', value: stats.aktifIlanlar },
                      { name: 'بازدید', value: Math.floor((stats.toplamGoruntulenme || 0) / 10) },
                      { name: 'فعالیت', value: stats.toplamFavoriler + stats.toplamMesajlar }
                    ]}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart - Genel Faaliyet */}
              <div className="mt-6 bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  فعالیت کلی
                </h4>
                
                {stats.toplamGoruntulenme === 0 && stats.aktifIlanlar === 0 && stats.toplamFavoriler === 0 && stats.toplamMesajlar === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="text-gray-500">هنوز فعالیتی ثبت نشده است</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pie Chart */}
                    <div className="flex items-center justify-center">
                      <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'بازدید', value: Math.max(stats.toplamGoruntulenme || 0, 1) },
                              { name: 'آگهی', value: Math.max(stats.aktifIlanlar, 1) },
                              { name: 'علاقه‌مندی', value: Math.max(stats.toplamFavoriler, 1) },
                              { name: 'پیام', value: Math.max(stats.toplamMesajlar, 1) }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => {
                              if (percent < 0.05) return '';
                              return `${name}\n${(percent * 100).toFixed(0)}%`;
                            }}
                            outerRadius={110}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#3b82f6" />
                            <Cell fill="#10b981" />
                            <Cell fill="#f59e0b" />
                            <Cell fill="#8b5cf6" />
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              border: '1px solid #e5e7eb', 
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                            formatter={(value: any) => [value, 'مقدار']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-col justify-center gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                          <div className="w-4 h-4 rounded bg-blue-600"></div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">بازدید</div>
                            <div className="text-sm text-gray-600">{stats.toplamGoruntulenme || 0} مورد</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50">
                          <div className="w-4 h-4 rounded bg-emerald-600"></div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">آگهی</div>
                            <div className="text-sm text-gray-600">{stats.aktifIlanlar} مورد</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50">
                          <div className="w-4 h-4 rounded bg-amber-500"></div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">علاقه‌مندی</div>
                            <div className="text-sm text-gray-600">{stats.toplamFavoriler} مورد</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
                          <div className="w-4 h-4 rounded bg-purple-600"></div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">پیام</div>
                            <div className="text-sm text-gray-600">{stats.toplamMesajlar} مورد</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* İlanlar - Premium */}
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">آگهی‌های من</h3>
                <p className="text-sm text-gray-500 mt-1">{ilanlar.length} آگهی فعال</p>
              </div>
              <Link 
                href="/ilan-ver" 
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" />
                آگهی جدید
              </Link>
            </div>

            {ilanlar.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Package className="w-10 h-10 text-gray-300" />
                </div>
                <h4 className="font-bold text-gray-900 text-xl mb-2">هنوز آگهی ندارید</h4>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">اولین آگهی خود را اضافه کنید و محصولات خود را به مشتریان نشان دهید</p>
                <Link
                  href="/ilan-ver"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-600/20 hover:from-blue-700 hover:to-indigo-700 transition-all hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  اولین آگهی را اضافه کنید
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 p-6">
                {ilanlar.map((ilan) => (
                  <Link key={ilan.id} href={`/ilan/${ilan.id}`} className="group block">
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden relative">
                        <Image
                          src={getImageUrl(ilan.ana_resim)}
                          alt={ilan.baslik}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 min-h-[40px] group-hover:text-blue-600 transition-colors">{ilan.baslik}</h4>
                        <PriceDisplay price={ilan.fiyat} currency="AFN" className="text-base font-bold text-blue-600" />
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                          <Eye className="w-3.5 h-3.5" />
                          {ilan.goruntulenme} بازدید
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {ilanlar.length > 12 && (
              <div className="p-5 border-t border-gray-100 text-center bg-gradient-to-r from-gray-50 to-white">
                <Link href="/ilanlarim" className="text-sm text-blue-600 font-semibold hover:text-blue-700 hover:underline">
                  مشاهده همه آگهی‌ها ({ilanlar.length})
                </Link>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
