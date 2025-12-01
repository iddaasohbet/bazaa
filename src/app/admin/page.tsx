"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  Grid, 
  Users, 
  Star,
  TrendingUp,
  Eye,
  Plus
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalIlanlar: 0,
    aktifIlanlar: 0,
    toplamKullanicilar: 0,
    bugunEklenenIlanlar: 0,
  });

  useEffect(() => {
    // İstatistikleri yükle
    setStats({
      totalIlanlar: 1234,
      aktifIlanlar: 1180,
      toplamKullanicilar: 5678,
      bugunEklenenIlanlar: 45,
    });
  }, []);

  const quickActions = [
    { icon: Plus, label: "Yeni İlan", href: "/admin/ilanlar/yeni", color: "bg-blue-500" },
    { icon: Star, label: "Öne Çıkanlar", href: "/admin/onecikan", color: "bg-yellow-500" },
    { icon: Grid, label: "Kategoriler", href: "/admin/kategoriler", color: "bg-purple-500" },
    { icon: Users, label: "Kullanıcılar", href: "/admin/kullanicilar", color: "bg-green-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Admin Panel
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Siteyi Görüntüle
              </Link>
              <button className="text-gray-600 hover:text-red-600">
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Kontrol Paneli</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Toplam</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalIlanlar}
            </div>
            <div className="text-sm text-gray-600">Toplam İlan</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Aktif</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.aktifIlanlar}
            </div>
            <div className="text-sm text-gray-600">Aktif İlan</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Üyeler</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.toplamKullanicilar}
            </div>
            <div className="text-sm text-gray-600">Toplam Kullanıcı</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-500">Bugün</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.bugunEklenenIlanlar}
            </div>
            <div className="text-sm text-gray-600">Yeni İlan</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="font-semibold text-gray-900">{action.label}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Son İlanlar</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <div className="font-semibold text-gray-900">Örnek İlan {i}</div>
                  <div className="text-sm text-gray-600">2 saat önce</div>
                </div>
                <Link href={`/admin/ilanlar/${i}`} className="text-blue-600 hover:underline text-sm">
                  Düzenle
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

