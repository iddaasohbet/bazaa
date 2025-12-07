"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Store, MapPin, Phone, Mail, Eye, Package, Edit, Settings, TrendingUp, ShoppingBag, ExternalLink, MessageSquare, Camera, Star, Clock, Shield, Sparkles, BarChart3, Users, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import PriceDisplay from "@/components/PriceDisplay";
import { motion } from "framer-motion";

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
  const [activeTab, setActiveTab] = useState('ilanlar');
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
      
      // Kullanıcının mağazasını API'den yükle
      const response = await fetch(`/api/magazalar?kullanici_id=${userData.id}`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const magaza = data.data[0];
        setMagazaBilgileri(magaza);
        
        // Mağazanın ilanlarını yükle
        await fetchMagazaIlanlari(magaza.id);
        
        // İstatistikleri yükle
        await fetchStats(userData.id, magaza.id);
      } else {
        // Mağaza yoksa yönlendir
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
      console.log('📦 Mağaza ilanları yükleniyor - Mağaza ID:', magazaId);
      
      const response = await fetch(`/api/magazalar/${magazaId}/ilanlar`);
      const data = await response.json();
      
      console.log('📦 İlanlar API Response:', data);
      
      if (data.success) {
        console.log('✅ İlanlar yüklendi:', data.data.length, 'adet');
        setIlanlar(data.data || []);
      } else {
        console.warn('⚠️ İlanlar yüklenemedi');
        setIlanlar([]);
      }
    } catch (error) {
      console.error('❌ İlanlar yüklenirken hata:', error);
      setIlanlar([]);
    }
  };

  const fetchStats = async (kullaniciId: number, magazaId: number) => {
    try {
      console.log('📊 İstatistikler yükleniyor - Kullanıcı ID:', kullaniciId);
      
      const response = await fetch(`/api/istatistikler?kullanici_id=${kullaniciId}`);
      const data = await response.json();
      
      console.log('📊 İstatistik API Response:', data);
      console.log('📊 İstatistik RAW DATA:', JSON.stringify(data, null, 2));
      
      if (data.success && data.data) {
        console.log('✅ İstatistikler yüklendi:', data.data);
        console.log('📊 Stats Detail:', {
          aktifIlanlar: data.data.aktifIlanlar,
          toplamGoruntulenme: data.data.toplamGoruntulenme,
          toplamFavoriler: data.data.toplamFavoriler,
          toplamMesajlar: data.data.toplamMesajlar
        });
        setStats({
          aktifIlanlar: data.data.aktifIlanlar || 0,
          toplamGoruntulenme: data.data.toplamGoruntulenme || 0,
          toplamFavoriler: data.data.toplamFavoriler || 0,
          toplamMesajlar: data.data.toplamMesajlar || 0
        });
      } else {
        console.warn('⚠️ İstatistik yüklenemedi, 0 değerleri kullanılıyor');
      }
    } catch (error) {
      console.error('❌ İstatistikler yüklenirken hata:', error);
    }
  };

  const getStoreLevelBadge = (level: string) => {
    switch(level) {
      case 'basic':
        return { text: 'عادی', color: 'bg-gray-100 text-gray-700 border-gray-300' };
      case 'pro':
        return { text: 'پرو', color: 'bg-blue-100 text-blue-700 border-blue-300' };
      case 'elite':
        return { text: 'پریمیوم', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
      default:
        return { text: level, color: 'bg-gray-100 text-gray-700 border-gray-300' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'beklemede':
        return { text: 'در انتظار تأیید', color: 'bg-orange-100 text-orange-700 border-orange-300' };
      case 'onaylandi':
        return { text: 'تأیید شده', color: 'bg-green-100 text-green-700 border-green-300' };
      case 'reddedildi':
        return { text: 'رد شده', color: 'bg-red-100 text-red-700 border-red-300' };
      default:
        return { text: status, color: 'bg-gray-100 text-gray-700 border-gray-300' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
              <Store className="h-6 w-6 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-gray-600 mt-4 font-medium">در حال بارگذاری مغازه...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!magazaBilgileri) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-lg mx-4" 
            dir="rtl"
          >
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl mx-auto flex items-center justify-center shadow-lg">
                <Store className="h-16 w-16 text-blue-500" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg left-1/2 translate-x-8">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">مغازه خود را بسازید</h2>
            <p className="text-gray-600 mb-8 text-lg">با افتتاح مغازه آنلاین، محصولات خود را به هزاران مشتری عرضه کنید</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/magaza-ac"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Store className="h-5 w-5" />
                افتتاح مغازه رایگان
              </Link>
              <Link
                href="/magaza-paket"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-medium px-8 py-4 rounded-2xl transition-all shadow-md hover:shadow-lg border border-gray-200"
              >
                مشاهده پلن‌ها
              </Link>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const levelBadge = getStoreLevelBadge(magazaBilgileri.store_level);
  const statusBadge = getStatusBadge(magazaBilgileri.onay_durumu);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero Banner */}
        <div className="h-40 md:h-52 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
          {magazaBilgileri.kapak_resmi && (
            <Image
              src={magazaBilgileri.kapak_resmi}
              alt="Kapak"
              fill
              className="object-cover"
            />
          )}
          <Link
            href="/magazam/duzenle"
            className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/30 transition-all text-sm font-medium border border-white/20"
          >
            <Camera className="h-4 w-4" />
            <span className="hidden sm:inline">تغییر کاور</span>
          </Link>
        </div>

        {/* Store Info Section */}
        <div className="container mx-auto px-4" dir="rtl">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 -mt-16 md:-mt-20">
            {/* Logo */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-white bg-white shadow-xl overflow-hidden">
                  {magazaBilgileri.logo ? (
                    <img 
                      src={magazaBilgileri.logo} 
                      alt="Logo" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <Store className="h-16 w-16 md:h-20 md:w-20 text-gray-300" />
                    </div>
                  )}
                </div>
                <Link
                  href="/magazam/duzenle"
                  className="absolute -bottom-2 -left-2 w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-all"
                >
                  <Camera className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Store Details */}
            <div className="flex-1 text-center md:text-right pt-4 md:pt-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-3">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {magazaBilgileri.ad_dari}
                </h1>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${levelBadge.color}`}>
                    {levelBadge.text}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${statusBadge.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      magazaBilgileri.onay_durumu === 'beklemede' ? 'bg-orange-500 animate-pulse' :
                      magazaBilgileri.onay_durumu === 'onaylandi' ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    {statusBadge.text}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-500 text-base mb-4">{magazaBilgileri.ad}</p>
              
              {magazaBilgileri.aciklama && (
                <p className="text-gray-600 mb-5 leading-relaxed max-w-2xl">
                  {magazaBilgileri.aciklama}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                <Link
                  href={`/magaza/${magazaBilgileri.id}`}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl transition-all font-medium shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                  target="_blank"
                >
                  <Globe className="h-4 w-4" />
                  مشاهده مغازه
                </Link>
                <Link
                  href="/magazam/duzenle"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                >
                  <Edit className="h-4 w-4" />
                  ویرایش
                </Link>
                
                {(magazaBilgileri.store_level === 'normal' || magazaBilgileri.store_level === 'basic') && (
                  <Link
                    href="/magaza-paket"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl transition-all font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5"
                  >
                    <Sparkles className="h-4 w-4" />
                    ارتقا به PRO
                  </Link>
                )}
                
                {magazaBilgileri.store_level === 'pro' && (
                  <Link
                    href="/magaza-paket"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5"
                  >
                    <Star className="h-4 w-4" />
                    ارتقا به ELITE
                  </Link>
                )}
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{magazaBilgileri.adres || 'آدرس ثبت نشده'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4 text-green-500" />
                  <span className="text-sm" dir="ltr">{magazaBilgileri.telefon || '۰۷۰۰۱۲۳۴۵۶'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">{magazaBilgileri.il_ad || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Stats Grid - Clean */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12" 
            dir="rtl"
          >
            <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stats.aktifIlanlar}</div>
              <div className="text-sm text-gray-500">آگهی‌های فعال</div>
            </div>
            
            <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stats.toplamGoruntulenme.toLocaleString('fa-AF')}</div>
              <div className="text-sm text-gray-500">بازدید کل</div>
            </div>
            
            <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 hover:border-rose-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stats.toplamFavoriler}</div>
              <div className="text-sm text-gray-500">علاقه‌مندی</div>
            </div>
            
            <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stats.toplamMesajlar}</div>
              <div className="text-sm text-gray-500">پیام‌ها</div>
            </div>
          </motion.div>

          {/* Premium Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="flex border-b border-gray-100" dir="rtl">
              <button
                onClick={() => setActiveTab('ilanlar')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all relative ${
                  activeTab === 'ilanlar'
                    ? 'text-blue-600 bg-blue-50/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Package className="h-5 w-5" />
                آگهی‌ها
                {activeTab === 'ilanlar' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></motion.div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('istatistik')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all relative ${
                  activeTab === 'istatistik'
                    ? 'text-blue-600 bg-blue-50/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                آمار و تحلیل
                {activeTab === 'istatistik' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></motion.div>
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {activeTab === 'ilanlar' && (
                <div dir="rtl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">مدیریت آگهی‌ها</h3>
                      <p className="text-sm text-gray-500">آگهی‌های فروشگاه خود را مدیریت کنید</p>
                    </div>
                    <Link
                      href="/ilan-ver"
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 w-full sm:w-auto justify-center"
                    >
                      <Package className="h-5 w-5" />
                      آگهی جدید
                    </Link>
                  </div>

                  {ilanlar.length === 0 ? (
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border border-gray-100 p-12 md:p-16 text-center">
                      <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center mx-auto mb-6">
                        <Package className="h-10 w-10 text-gray-300" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">هنوز آگهی ندارید</h4>
                      <p className="text-gray-500 mb-6 max-w-sm mx-auto">اولین آگهی خود را اضافه کنید و محصولات خود را به مشتریان نشان دهید</p>
                      <Link
                        href="/ilan-ver"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/25"
                      >
                        <Package className="h-5 w-5" />
                        اولین آگهی را اضافه کنید
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {ilanlar.map((ilan, index) => (
                        <motion.div
                          key={ilan.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link href={`/ilan/${ilan.id}`} className="group block">
                            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-blue-200 hover:shadow-xl transition-all duration-300">
                              <div className="relative aspect-square bg-gray-100">
                                <Image
                                  src={getImageUrl(ilan.ana_resim)}
                                  alt={ilan.baslik}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </div>
                              <div className="p-4">
                                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm group-hover:text-blue-600 transition-colors">
                                  {ilan.baslik}
                                </h4>
                                <PriceDisplay 
                                  price={ilan.fiyat}
                                  currency="AFN"
                                  className="text-base font-bold text-gray-900 mb-2"
                                />
                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3.5 w-3.5" />
                                    {ilan.goruntulenme}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'istatistik' && (
                <div dir="rtl">
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">آمار و تحلیل</h3>
                    <p className="text-sm text-gray-500">عملکرد فروشگاه خود را بررسی کنید</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Quick Stats */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900">رشد این هفته</h4>
                      </div>
                      <div className="text-4xl font-bold text-blue-600 mb-1">+۱۲٪</div>
                      <p className="text-sm text-gray-600">افزایش بازدید نسبت به هفته گذشته</p>
                    </div>

                    {/* Performance */}
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900">بازدیدکنندگان</h4>
                      </div>
                      <div className="text-4xl font-bold text-emerald-600 mb-1">{stats.toplamGoruntulenme}</div>
                      <p className="text-sm text-gray-600">کل بازدید از مغازه شما</p>
                    </div>
                  </div>

                  <div className="mt-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-100 p-8 text-center">
                    <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="font-bold text-gray-900 mb-2">نمودارهای تفصیلی</h4>
                    <p className="text-gray-500 text-sm">گزارش‌های پیشرفته به زودی در دسترس خواهد بود</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

