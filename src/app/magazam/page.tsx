"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Store, MapPin, Phone, Mail, Eye, Package, Edit, Settings, TrendingUp, ShoppingBag, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, getImageUrl } from "@/lib/utils";

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
        await fetchStats(userData.id);
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
      const response = await fetch(`/api/magazalar/${magazaId}/ilanlar`);
      const data = await response.json();
      if (data.success) {
        setIlanlar(data.data);
      }
    } catch (error) {
      console.error('İlanlar yüklenirken hata:', error);
    }
  };

  const fetchStats = async (kullaniciId: number) => {
    try {
      const response = await fetch(`/api/istatistikler?kullanici_id=${kullaniciId}`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
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
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!magazaBilgileri) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-4" dir="rtl">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Store className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">هنوز مغازه‌ای ندارید</h2>
            <p className="text-gray-600 mb-8">برای شروع فروش آنلاین، مغازه خود را باز کنید</p>
            <Link
              href="/magaza-ac"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg"
            >
              افتتاح مغازه
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const levelBadge = getStoreLevelBadge(magazaBilgileri.store_level);
  const statusBadge = getStatusBadge(magazaBilgileri.onay_durumu);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        <div className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-6" dir="rtl">
              <Link href="/" className="hover:text-blue-600">صفحه اصلی</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">مغازه من</span>
            </div>

            {/* Profile Header */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8" dir="rtl">
              <div className="flex items-start gap-8">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden relative">
                    {magazaBilgileri.logo ? (
                      <img 
                        src={magazaBilgileri.logo} 
                        alt="Logo" 
                        className="w-full h-full object-contain p-2"
                        style={{ objectPosition: 'center' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Store className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">
                          {magazaBilgileri.ad_dari}
                        </h1>
                        <span className={`px-3 py-1 rounded-md text-xs font-bold border ${levelBadge.color}`}>
                          {levelBadge.text}
                        </span>
                      </div>
                      <p className="text-gray-600 text-lg mb-1">{magazaBilgileri.ad}</p>
                      
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border ${statusBadge.color} mt-2`}>
                        <div className={`w-2 h-2 rounded-full ${
                          magazaBilgileri.onay_durumu === 'beklemede' ? 'bg-orange-500' :
                          magazaBilgileri.onay_durumu === 'onaylandi' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        {statusBadge.text}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/magaza/${magazaBilgileri.id}`}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-medium"
                        target="_blank"
                      >
                        <ExternalLink className="h-4 w-4" />
                        مشاهده مغازه
                      </Link>
                      <Link
                        href="/magazam/duzenle"
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
                      >
                        <Edit className="h-4 w-4" />
                        ویرایش مغازه
                      </Link>
                    </div>
                  </div>

                  {magazaBilgileri.aciklama && (
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {magazaBilgileri.aciklama}
                    </p>
                  )}

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-0.5">آدرس</div>
                        <div className="text-sm font-semibold text-gray-900 truncate">
                          {magazaBilgileri.adres || 'آدرس ثبت نشده'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-0.5">شماره تماس</div>
                        <div className="text-sm font-semibold text-gray-900" dir="ltr">
                          ۰۷۰۰۱۲۳۴۵۶
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-0.5">شهر</div>
                        <div className="text-sm font-semibold text-gray-900 truncate">
                          {magazaBilgileri.il_ad || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">

          {/* Stats - Minimalist */}
          <div className="grid grid-cols-4 gap-6 mb-8" dir="rtl">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm text-gray-500 mb-1">آگهی‌های فعال</div>
              <div className="text-3xl font-bold text-gray-900">{stats.aktifIlanlar}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm text-gray-500 mb-1">بازدید کل</div>
              <div className="text-3xl font-bold text-gray-900">{stats.toplamGoruntulenme.toLocaleString('fa-AF')}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm text-gray-500 mb-1">علاقه‌مندی</div>
              <div className="text-3xl font-bold text-gray-900">{stats.toplamFavoriler}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm text-gray-500 mb-1">پیام‌ها</div>
              <div className="text-3xl font-bold text-gray-900">{stats.toplamMesajlar}</div>
            </div>
          </div>

          {/* Tabs - Clean */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex border-b border-gray-200 bg-gray-50" dir="rtl">
              <button
                onClick={() => setActiveTab('ilanlar')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all ${
                  activeTab === 'ilanlar'
                    ? 'bg-white text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Package className="h-5 w-5" />
                آگهی‌ها
              </button>
              <button
                onClick={() => setActiveTab('istatistik')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all ${
                  activeTab === 'istatistik'
                    ? 'bg-white text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <TrendingUp className="h-5 w-5" />
                آمار
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'ilanlar' && (
                <div dir="rtl">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-semibold text-gray-900">مدیریت آگهی‌ها</h3>
                    <Link
                      href="/ilan-ver"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-all"
                    >
                      <Package className="h-4 w-4" />
                      آگهی جدید
                    </Link>
                  </div>

                  {ilanlar.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-16 text-center">
                      <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">هنوز آگهی اضافه نکرده‌اید</p>
                      <Link
                        href="/ilan-ver"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-all"
                      >
                        <Package className="h-4 w-4" />
                        اولین آگهی را اضافه کنید
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {ilanlar.map((ilan) => (
                        <Link key={ilan.id} href={`/ilan/${ilan.id}`} className="group">
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-400 hover:shadow-md transition-all">
                            <div className="relative aspect-square bg-gray-100">
                              <Image
                                src={getImageUrl(ilan.ana_resim)}
                                alt={ilan.baslik}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium text-gray-900 mb-1 line-clamp-2 text-sm">
                                {ilan.baslik}
                              </h4>
                              <div className="text-base font-bold text-gray-900 mb-2">
                                {formatPrice(ilan.fiyat)}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Eye className="h-3 w-3" />
                                <span>{ilan.goruntulenme} بازدید</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'istatistik' && (
                <div dir="rtl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-8">گزارش آماری</h3>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-16 text-center">
                    <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">آمار تفصیلی به زودی در دسترس خواهد بود</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-12"></div>
      </main>

      <Footer />
    </div>
  );
}

