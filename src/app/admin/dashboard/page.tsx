"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Store,
  DollarSign,
  Eye,
  ShoppingCart,
  ArrowUpRight,
  Clock,
  Activity,
  AlertCircle,
  CheckCircle,
  Package,
  BarChart3
} from "lucide-react";

interface Stats {
  totalIlanlar: number;
  ilanGrowth: number;
  totalKullanicilar: number;
  kullaniciGrowth: number;
  totalMagazalar: number;
  magazaGrowth: number;
  aylikGelir: number;
  gelirGrowth: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalIlanlar: 0,
    ilanGrowth: 0,
    totalKullanicilar: 0,
    kullaniciGrowth: 0,
    totalMagazalar: 0,
    magazaGrowth: 0,
    aylikGelir: 0,
    gelirGrowth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Stats yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "مجموع آگهی‌ها",
      value: stats.totalIlanlar.toLocaleString('fa-AF'),
      growth: stats.ilanGrowth,
      icon: FileText,
      color: "blue",
      href: "/admin/ilanlar"
    },
    {
      title: "مجموع کاربران",
      value: stats.totalKullanicilar.toLocaleString('fa-AF'),
      growth: stats.kullaniciGrowth,
      icon: Users,
      color: "green",
      href: "/admin/kullanicilar"
    },
    {
      title: "مجموع مغازه‌ها",
      value: stats.totalMagazalar.toLocaleString('fa-AF'),
      growth: stats.magazaGrowth,
      icon: Store,
      color: "purple",
      href: "/admin/magazalar"
    },
    {
      title: "درآمد ماهانه",
      value: `${stats.aylikGelir.toLocaleString('fa-AF')} AFN`,
      growth: stats.gelirGrowth,
      icon: DollarSign,
      color: "yellow",
      href: "/admin/odemeler"
    }
  ];

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    yellow: "bg-yellow-50 text-yellow-600"
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8" dir="rtl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">داشبورد</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">خوش آمدید! در اینجا آمار به‌روز شما است.</p>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">آخرین به‌روزرسانی:</span>
            <span className="font-medium" dir="ltr">{new Date().toLocaleTimeString('fa-AF', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((stat, index) => {
            const gradientClasses = {
              blue: "from-blue-500 to-blue-600",
              green: "from-green-500 to-green-600",
              purple: "from-purple-500 to-purple-600",
              yellow: "from-yellow-500 to-orange-500"
            };
            
            return (
              <Link key={index} href={stat.href}>
                <div className="relative bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 hover:shadow-xl transition-all cursor-pointer group overflow-hidden">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[stat.color as keyof typeof gradientClasses]} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradientClasses[stat.color as keyof typeof gradientClasses]} flex items-center justify-center shadow-lg`}>
                        <stat.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                        stat.growth >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {stat.growth >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        <span>{Math.abs(stat.growth)}%</span>
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                      {loading ? (
                        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        stat.value
                      )}
                    </div>
                    <div className="text-sm sm:text-base text-gray-600 font-medium">{stat.title}</div>
                    <div className="mt-4 flex items-center text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>مشاهده جزئیات</span>
                      <ArrowUpRight className="w-4 h-4 mr-1 text-blue-600" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Charts and Activity */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Son İlanlar */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">آخرین آگهی‌ها</h2>
              </div>
              <Link href="/admin/ilanlar" className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                <span>مشاهده همه</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-gray-900 truncate text-sm sm:text-base">گوشی Samsung Galaxy S24 Ultra</div>
                      <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          الکترونیک
                        </span>
                        <span>•</span>
                        <span>۲ ساعت پیش</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-sm sm:text-base" dir="ltr">45,000 AFN</div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Eye className="w-3 h-3" />
                        <span>۲۳۴ بازدید</span>
                      </div>
                    </div>
                    <Link 
                      href={`/admin/ilanlar/${i}`} 
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                    >
                      ویرایش
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hızlı İşlemler & Bildirimler */}
          <div className="space-y-4 sm:space-y-6">
            {/* Hızlı İşlemler */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">عملیات سریع</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
                <Link
                  href="/admin/ilanlar/yeni"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-sm">آگهی جدید</span>
                </Link>
                <Link
                  href="/admin/kullanicilar/yeni"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-green-100 text-green-700 hover:from-green-100 hover:to-green-200 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-sm">کاربر جدید</span>
                </Link>
                <Link
                  href="/admin/magazalar"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 hover:from-purple-100 hover:to-purple-200 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Store className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-sm">مغازه‌ها</span>
                </Link>
                <Link
                  href="/admin/vitrin"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 hover:from-orange-100 hover:to-orange-200 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShoppingCart className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-sm">ویترین</span>
                </Link>
              </div>
            </div>

            {/* Bekleyen İşlemler */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">عملیات در انتظار</h3>
              </div>
              <div className="space-y-2">
                <Link href="/admin/ilanlar?durum=beklemede" className="flex items-center justify-between p-3 rounded-xl hover:bg-red-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">آگهی‌های منتظر تأیید</span>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold bg-red-500 text-white rounded-lg">۱۲</span>
                </Link>
                <Link href="/admin/magazalar?durum=beklemede" className="flex items-center justify-between p-3 rounded-xl hover:bg-yellow-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">مغازه‌های منتظر تأیید</span>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold bg-yellow-500 text-white rounded-lg">۵</span>
                </Link>
                <Link href="/admin/odemeler?durum=beklemede" className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">پرداخت‌های در انتظار</span>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold bg-blue-500 text-white rounded-lg">۸</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">فعالیت امروز</p>
                <h3 className="text-2xl font-bold">آمار زنده</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                <span className="text-sm font-medium">آگهی‌های جدید</span>
                <span className="text-lg font-bold">۴۵</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                <span className="text-sm font-medium">اعضای جدید</span>
                <span className="text-lg font-bold">۲۳</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                <span className="text-sm font-medium">مجموع بازدید</span>
                <span className="text-lg font-bold" dir="ltr">12,456</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">محبوب‌ترین</p>
                <h3 className="text-2xl font-bold">دسته‌بندی‌ها</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-sm font-medium">الکترونیک</span>
                </div>
                <span className="text-lg font-bold">۲,۳۴۵</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-sm font-medium">وسایل نقلیه</span>
                </div>
                <span className="text-lg font-bold">۱,۸۷۶</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-sm font-medium">املاک</span>
                </div>
                <span className="text-lg font-bold">۱,۲۳۴</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-yellow-100 text-sm font-medium mb-1">این ماه</p>
                <h3 className="text-2xl font-bold">جزئیات درآمد</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                <span className="text-sm font-medium">فروش پکیج‌ها</span>
                <span className="text-base font-bold" dir="ltr">45,000</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                <span className="text-sm font-medium">ویترین و تبلیغات</span>
                <span className="text-base font-bold" dir="ltr">32,500</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                <span className="text-sm font-medium">سایر درآمدها</span>
                <span className="text-base font-bold" dir="ltr">12,000</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">مجموع درآمد</span>
                <span className="text-xl font-bold" dir="ltr">89,500 AFN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

