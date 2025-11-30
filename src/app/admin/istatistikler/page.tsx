"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Store,
  DollarSign,
  Eye,
  ShoppingCart,
  MapPin,
  Grid,
  Calendar,
  ArrowUpRight,
  Award,
  Star,
  Clock
} from "lucide-react";

interface Stats {
  // Genel
  totalIlanlar: number;
  ilanGrowth: number;
  totalKullanicilar: number;
  kullaniciGrowth: number;
  totalMagazalar: number;
  magazaGrowth: number;
  aylikGelir: number;
  gelirGrowth: number;
  toplamGoruntulenme: number;
  goruntulenmeGrowth: number;
  
  // Bu ay
  buAyIlanlar: number;
  buAyKullanicilar: number;
  buAyMagazalar: number;
  
  // Bugün
  bugunIlanlar: number;
  bugunKullanicilar: number;
  bugunGoruntulenme: number;
}

interface PopulerIlan {
  id: number;
  baslik: string;
  kategori_ad: string;
  goruntulenme: number;
  fiyat: number;
}

interface KategoriStat {
  kategori_ad: string;
  ilan_sayisi: number;
  toplam_goruntulenme: number;
}

interface SehirStat {
  il_ad: string;
  ilan_sayisi: number;
  kullanici_sayisi: number;
}

export default function IstatistiklerPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [populerIlanlar, setPopulerIlanlar] = useState<PopulerIlan[]>([]);
  const [kategoriStats, setKategoriStats] = useState<KategoriStat[]>([]);
  const [sehirStats, setSehirStats] = useState<SehirStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('month');

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/istatistikler?period=${period}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data.genel);
        setPopulerIlanlar(data.data.populerIlanlar || []);
        setKategoriStats(data.data.kategoriStats || []);
        setSehirStats(data.data.sehirStats || []);
      }
    } catch (error) {
      console.error('İstatistikler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری آمار...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">آمار و گزارشات</h1>
            <p className="text-gray-600 mt-1">تحلیل جامع عملکرد سیستم</p>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setPeriod('today')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                period === 'today' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              امروز
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                period === 'week' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              این هفته
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                period === 'month' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              این ماه
            </button>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* İlanlar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                stats.ilanGrowth >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {stats.ilanGrowth >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{Math.abs(stats.ilanGrowth)}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stats.totalIlanlar.toLocaleString('fa-AF')}
            </div>
            <div className="text-sm text-gray-600 mb-3">مجموع آگهی‌ها</div>
            <div className="text-xs text-gray-500">
              این ماه: {stats.buAyIlanlar} • امروز: {stats.bugunIlanlar}
            </div>
          </div>

          {/* Kullanıcılar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                stats.kullaniciGrowth >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {stats.kullaniciGrowth >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{Math.abs(stats.kullaniciGrowth)}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stats.totalKullanicilar.toLocaleString('fa-AF')}
            </div>
            <div className="text-sm text-gray-600 mb-3">مجموع کاربران</div>
            <div className="text-xs text-gray-500">
              این ماه: {stats.buAyKullanicilar} • امروز: {stats.bugunKullanicilar}
            </div>
          </div>

          {/* Mağazalar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Store className="w-7 h-7 text-white" />
              </div>
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                stats.magazaGrowth >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {stats.magazaGrowth >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{Math.abs(stats.magazaGrowth)}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stats.totalMagazalar.toLocaleString('fa-AF')}
            </div>
            <div className="text-sm text-gray-600 mb-3">مجموع مغازه‌ها</div>
            <div className="text-xs text-gray-500">
              این ماه: {stats.buAyMagazalar} مغازه جدید
            </div>
          </div>

          {/* Görüntülenme */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                stats.goruntulenmeGrowth >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {stats.goruntulenmeGrowth >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{Math.abs(stats.goruntulenmeGrowth)}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stats.toplamGoruntulenme.toLocaleString('fa-AF')}
            </div>
            <div className="text-sm text-gray-600 mb-3">مجموع بازدیدها</div>
            <div className="text-xs text-gray-500">
              امروز: {stats.bugunGoruntulenme.toLocaleString('fa-AF')} بازدید
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-yellow-100 text-sm font-medium mb-2">درآمد ماهانه</p>
              <h2 className="text-4xl font-bold" dir="ltr">{stats.aylikGelir.toLocaleString('fa-AF')} AFN</h2>
            </div>
            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
              stats.gelirGrowth >= 0 ? 'bg-white/20' : 'bg-red-500/20'
            }`}>
              {stats.gelirGrowth >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{Math.abs(stats.gelirGrowth)}% نسبت به ماه قبل</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Popüler İlanlar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                محبوب‌ترین آگهی‌ها
              </h2>
            </div>
            <div className="space-y-3">
              {populerIlanlar.length > 0 ? (
                populerIlanlar.slice(0, 5).map((ilan, index) => (
                  <div key={ilan.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-yellow-600">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate text-sm">{ilan.baslik}</div>
                      <div className="text-xs text-gray-500">{ilan.kategori_ad}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-sm" dir="ltr">
                        {ilan.fiyat.toLocaleString('fa-AF')} AFN
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Eye className="w-3 h-3" />
                        {ilan.goruntulenme.toLocaleString('fa-AF')}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">داده‌ای موجود نیست</p>
              )}
            </div>
          </div>

          {/* Kategori İstatistikleri */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Grid className="w-5 h-5 text-purple-500" />
                آمار دسته‌بندی‌ها
              </h2>
            </div>
            <div className="space-y-3">
              {kategoriStats.length > 0 ? (
                kategoriStats.slice(0, 5).map((kategori, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center flex-shrink-0">
                      <Grid className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{kategori.kategori_ad}</div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{kategori.ilan_sayisi} آگهی</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {kategori.toplam_goruntulenme.toLocaleString('fa-AF')}
                        </span>
                      </div>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${Math.min((kategori.ilan_sayisi / kategoriStats[0].ilan_sayisi) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">داده‌ای موجود نیست</p>
              )}
            </div>
          </div>
        </div>

        {/* Şehir İstatistikleri */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              آمار شهرها
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sehirStats.length > 0 ? (
              sehirStats.slice(0, 8).map((sehir, index) => (
                <div key={index} className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-gray-900 text-sm">{sehir.il_ad}</h3>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">آگهی‌ها:</span>
                      <span className="font-bold text-gray-900">{sehir.ilan_sayisi}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">کاربران:</span>
                      <span className="font-bold text-gray-900">{sehir.kullanici_sayisi}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-500 py-8">داده‌ای موجود نیست</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}











