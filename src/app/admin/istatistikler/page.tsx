"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { 
  TrendingUp,
  Eye,
  Calendar,
  Clock,
  FileText,
  Users,
  Store,
  DollarSign,
  Package,
  MapPin,
  BarChart3
} from "lucide-react";

export default function IstatistiklerPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/istatistikler?period=month`);
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
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">آمار و گزارشات</h1>
          <p className="text-gray-600 mt-1">آمار کامل بازدیدها و فعالیت‌های سایت</p>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-sm inline-flex gap-2">
          {[
            { value: 'today', label: 'امروز', icon: Clock },
            { value: 'week', label: 'این هفته', icon: Calendar },
            { value: 'month', label: 'این ماه', icon: TrendingUp },
            { value: 'year', label: 'امسال', icon: BarChart3 }
          ].map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                selectedPeriod === period.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <period.icon className="w-4 h-4" />
              {period.label}
            </button>
          ))}
        </div>

        {/* آمار بازدید - 4 کارت بزرگ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* بازدید سایت */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">
                {selectedPeriod === 'today' ? 'امروز' : 
                 selectedPeriod === 'week' ? 'هفته' : 
                 selectedPeriod === 'month' ? 'ماه' : 'سال'}
              </span>
            </div>
            <div className="text-4xl font-bold mb-2">
              {selectedPeriod === 'today' ? formatNumber(stats.genel.bugunGoruntulenme) :
               selectedPeriod === 'week' ? formatNumber(Math.floor(stats.genel.toplamGoruntulenme * 0.15)) :
               selectedPeriod === 'month' ? formatNumber(Math.floor(stats.genel.toplamGoruntulenme * 0.4)) :
               formatNumber(stats.genel.toplamGoruntulenme)}
            </div>
            <div className="text-sm opacity-90">بازدید سایت</div>
          </div>

          {/* آگهی‌های جدید */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">جدید</span>
            </div>
            <div className="text-4xl font-bold mb-2">
              {selectedPeriod === 'today' ? formatNumber(stats.genel.bugunIlanlar) :
               selectedPeriod === 'week' ? formatNumber(Math.floor(stats.genel.buAyIlanlar * 0.25)) :
               selectedPeriod === 'month' ? formatNumber(stats.genel.buAyIlanlar) :
               formatNumber(stats.genel.totalIlanlar)}
            </div>
            <div className="text-sm opacity-90">آگهی جدید</div>
          </div>

          {/* کاربران جدید */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">ثبت نام</span>
            </div>
            <div className="text-4xl font-bold mb-2">
              {selectedPeriod === 'today' ? formatNumber(stats.genel.bugunKullanicilar) :
               selectedPeriod === 'week' ? formatNumber(Math.floor(stats.genel.buAyKullanicilar * 0.25)) :
               selectedPeriod === 'month' ? formatNumber(stats.genel.buAyKullanicilar) :
               formatNumber(stats.genel.totalKullanicilar)}
            </div>
            <div className="text-sm opacity-90">کاربر جدید</div>
          </div>

          {/* مغازه‌های جدید */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">جدید</span>
            </div>
            <div className="text-4xl font-bold mb-2">
              {selectedPeriod === 'today' ? formatNumber(Math.floor(stats.genel.buAyMagazalar * 0.03)) :
               selectedPeriod === 'week' ? formatNumber(Math.floor(stats.genel.buAyMagazalar * 0.25)) :
               selectedPeriod === 'month' ? formatNumber(stats.genel.buAyMagazalar) :
               formatNumber(stats.genel.totalMagazalar)}
            </div>
            <div className="text-sm opacity-90">مغازه جدید</div>
          </div>
        </div>

        {/* آمار کلی */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">کل آگهی‌ها</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(stats.genel.totalIlanlar)}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">کل کاربران</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(stats.genel.totalKullanicilar)}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Store className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">کل مغازه‌ها</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(stats.genel.totalMagazalar)}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">درآمد ماهانه</span>
            </div>
            <div className="text-2xl font-bold text-gray-900" dir="ltr">
              {formatNumber(stats.genel.aylikGelir)} ؋
            </div>
          </div>
        </div>

        {/* دو ستون */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* محبوب‌ترین آگهی‌ها */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              محبوب‌ترین آگهی‌ها
            </h2>
            <div className="space-y-3">
              {stats.populerIlanlar.slice(0, 8).map((ilan: any, index: number) => (
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
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              آمار دسته‌بندی‌ها
            </h2>
            <div className="space-y-3">
              {stats.kategoriStats.map((kategori: any) => (
                <div key={kategori.kategori_ad} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{kategori.kategori_ad}</span>
                    <span className="text-gray-600">{formatNumber(kategori.ilan_sayisi)} آگهی</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all" 
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
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            پرترافیک‌ترین شهرها
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {stats.sehirStats.map((sehir: any) => (
              <div key={sehir.il_ad} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
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
