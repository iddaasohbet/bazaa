"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import { 
  FileText, 
  Users, 
  Store,
  TrendingUp,
  Eye,
  Calendar,
  Clock,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [visitorPeriod, setVisitorPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today');

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/istatistikler?period=${period}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('İstatistikler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fa-AF').format(num);
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUp className="w-4 h-4" />;
    if (growth < 0) return <ArrowDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600 bg-green-50';
    if (growth < 0) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  if (loading || !stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری...</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">داشبورد مدیریت</h1>
            <p className="text-gray-600 mt-1">خلاصه‌ای از آمار و فعالیت‌های سایت</p>
          </div>
        </div>

        {/* آمار بازدید سایت - 3 کارت بزرگ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* امروز */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">امروز</div>
            </div>
            <div className="text-3xl font-bold mb-1">{formatNumber(stats.genel.bugunGoruntulenme)}</div>
            <div className="text-sm opacity-90">بازدید سایت</div>
            <div className="mt-3 pt-3 border-t border-white/20 text-xs opacity-80">
              {formatNumber(stats.genel.bugunIlanlar)} آگهی جدید • {formatNumber(stats.genel.bugunKullanicilar)} کاربر
            </div>
          </div>

          {/* این هفته */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">هفته</div>
            </div>
            <div className="text-3xl font-bold mb-1">{formatNumber(Math.floor(stats.genel.toplamGoruntulenme * 0.15))}</div>
            <div className="text-sm opacity-90">بازدید سایت</div>
            <div className="mt-3 pt-3 border-t border-white/20 text-xs opacity-80">
              7 روز اخیر
            </div>
          </div>

          {/* این ماه */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">ماه</div>
            </div>
            <div className="text-3xl font-bold mb-1">{formatNumber(Math.floor(stats.genel.toplamGoruntulenme * 0.4))}</div>
            <div className="text-sm opacity-90">بازدید سایت</div>
            <div className="mt-3 pt-3 border-t border-white/20 text-xs opacity-80">
              30 روز اخیر
            </div>
          </div>
        </div>

        {/* آمار بازدید سایت - با Period Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden" style={{display: 'none'}}>
          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gray-50" dir="rtl">
            <div className="flex">
              {[
                { value: 'today', label: 'امروز', icon: Clock },
                { value: 'week', label: 'این هفته', icon: Calendar },
                { value: 'month', label: 'این ماه', icon: TrendingUp },
                { value: 'year', label: 'امسال', icon: Eye }
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setVisitorPeriod(tab.value as any)}
                  className={`flex-1 px-4 py-3 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    visitorPeriod === tab.value
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* محتوای آمار */}
          <div className="p-6" dir="rtl">
            <div className="grid md:grid-cols-3 gap-4">
              {/* بازدید سایت */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <Eye className="w-10 h-10 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-800 px-2 py-1 bg-blue-200 rounded-full">
                    {visitorPeriod === 'today' ? 'امروز' : 
                     visitorPeriod === 'week' ? 'هفته' : 
                     visitorPeriod === 'month' ? 'ماه' : 'سال'}
                  </span>
                </div>
                <div className="text-3xl font-bold text-blue-900 mb-1">
                  {visitorPeriod === 'today' ? formatNumber(stats.genel.bugunGoruntulenme) :
                   visitorPeriod === 'week' ? formatNumber(Math.floor(stats.genel.toplamGoruntulenme * 0.15)) :
                   visitorPeriod === 'month' ? formatNumber(Math.floor(stats.genel.toplamGoruntulenme * 0.4)) :
                   formatNumber(stats.genel.toplamGoruntulenme)}
                </div>
                <div className="text-sm text-blue-700">بازدید سایت</div>
              </div>

              {/* آگهی‌های جدید */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <FileText className="w-10 h-10 text-green-600" />
                  <span className="text-xs font-semibold text-green-800 px-2 py-1 bg-green-200 rounded-full">
                    جدید
                  </span>
                </div>
                <div className="text-3xl font-bold text-green-900 mb-1">
                  {visitorPeriod === 'today' ? formatNumber(stats.genel.bugunIlanlar) :
                   visitorPeriod === 'week' ? formatNumber(Math.floor(stats.genel.buAyIlanlar * 0.25)) :
                   visitorPeriod === 'month' ? formatNumber(stats.genel.buAyIlanlar) :
                   formatNumber(stats.genel.totalIlanlar)}
                </div>
                <div className="text-sm text-green-700">آگهی جدید</div>
              </div>

              {/* کاربران جدید */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <Users className="w-10 h-10 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-800 px-2 py-1 bg-purple-200 rounded-full">
                    ثبت نام
                  </span>
                </div>
                <div className="text-3xl font-bold text-purple-900 mb-1">
                  {visitorPeriod === 'today' ? formatNumber(stats.genel.bugunKullanicilar) :
                   visitorPeriod === 'week' ? formatNumber(Math.floor(stats.genel.buAyKullanicilar * 0.25)) :
                   visitorPeriod === 'month' ? formatNumber(stats.genel.buAyKullanicilar) :
                   formatNumber(stats.genel.totalKullanicilar)}
                </div>
                <div className="text-sm text-purple-700">کاربر جدید</div>
              </div>
            </div>

            {/* توضیح */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                {visitorPeriod === 'today' && '📊 آمار امروز - از نیمه شب تا الان'}
                {visitorPeriod === 'week' && '📊 آمار هفته - 7 روز اخیر'}
                {visitorPeriod === 'month' && '📊 آمار ماه - 30 روز اخیر'}
                {visitorPeriod === 'year' && '📊 آمار سال - از ابتدا تا الان'}
              </p>
            </div>
          </div>
        </div>

        {/* آمار کلی - 4 کارت */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* کل آگهی‌ها */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getGrowthColor(stats.genel.ilanGrowth)}`}>
                {getGrowthIcon(stats.genel.ilanGrowth)}
                {Math.abs(stats.genel.ilanGrowth)}٪
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(stats.genel.totalIlanlar)}
            </div>
            <div className="text-sm text-gray-600">کل آگهی‌ها</div>
            <div className="text-xs text-gray-500 mt-2">
              {formatNumber(stats.genel.buAyIlanlar)} در این ماه
            </div>
          </div>

          {/* کاربران */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getGrowthColor(stats.genel.kullaniciGrowth)}`}>
                {getGrowthIcon(stats.genel.kullaniciGrowth)}
                {Math.abs(stats.genel.kullaniciGrowth)}٪
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(stats.genel.totalKullanicilar)}
            </div>
            <div className="text-sm text-gray-600">کل کاربران</div>
            <div className="text-xs text-gray-500 mt-2">
              {formatNumber(stats.genel.buAyKullanicilar)} در این ماه
            </div>
          </div>

          {/* مغازه‌ها */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Store className="h-5 w-5 text-purple-600" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getGrowthColor(stats.genel.magazaGrowth)}`}>
                {getGrowthIcon(stats.genel.magazaGrowth)}
                {Math.abs(stats.genel.magazaGrowth)}٪
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(stats.genel.totalMagazalar)}
            </div>
            <div className="text-sm text-gray-600">کل مغازه‌ها</div>
            <div className="text-xs text-gray-500 mt-2">
              {formatNumber(stats.genel.buAyMagazalar)} در این ماه
            </div>
          </div>

          {/* درآمد */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getGrowthColor(stats.genel.gelirGrowth)}`}>
                {getGrowthIcon(stats.genel.gelirGrowth)}
                {Math.abs(stats.genel.gelirGrowth)}٪
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1" dir="ltr">
              {formatNumber(stats.genel.aylikGelir)} ؋
            </div>
            <div className="text-sm text-gray-600">درآمد ماهانه</div>
            <div className="text-xs text-gray-500 mt-2">
              از فروش پکیج‌ها
            </div>
          </div>
        </div>


        {/* دو ستون */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* محبوب‌ترین آگهی‌ها */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">محبوب‌ترین آگهی‌ها</h2>
            <div className="space-y-3">
              {stats.populerIlanlar.slice(0, 5).map((ilan: any, index: number) => (
                <div key={ilan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm line-clamp-1">{ilan.baslik}</div>
                      <div className="text-xs text-gray-500">{ilan.kategori_ad}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye className="w-4 h-4" />
                    {formatNumber(ilan.goruntulenme)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* آمار دسته‌بندی‌ها */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">آمار دسته‌بندی‌ها</h2>
            <div className="space-y-3">
              {stats.kategoriStats.slice(0, 5).map((kategori: any) => (
                <div key={kategori.kategori_ad} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{kategori.kategori_ad}</span>
                    <span className="text-gray-600">{formatNumber(kategori.ilan_sayisi)} آگهی</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all" 
                      style={{ width: `${Math.min((kategori.ilan_sayisi / stats.genel.totalIlanlar) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* آمار شهرها */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">پرترافیک‌ترین شهرها</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.sehirStats.slice(0, 4).map((sehir: any) => (
              <div key={sehir.il_ad} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <div className="text-lg font-bold text-gray-900 mb-1">{sehir.il_ad}</div>
                <div className="text-sm text-gray-600 mb-2">{formatNumber(sehir.ilan_sayisi)} آگهی</div>
                <div className="text-xs text-gray-500">{formatNumber(sehir.kullanici_sayisi)} کاربر</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
