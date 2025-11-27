"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Star, Trash2, Eye, MousePointer, ShoppingCart, TrendingUp } from "lucide-react";

interface Vitrin {
  id: number;
  ilan_baslik: string;
  magaza_ad: string;
  vitrin_turu: string;
  kategori_ad: string;
  goruntulenme: number;
  tiklanma: number;
  baslangic_tarihi: string;
  bitis_tarihi: string;
  aktif: boolean;
}

export default function AdminVitrinPage() {
  const [vitrinler, setVitrinler] = useState<Vitrin[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchVitrinler();
  }, []);

  const fetchVitrinler = async () => {
    try {
      const response = await fetch('/api/admin/vitrin');
      const data = await response.json();
      if (data.success) {
        setVitrinler(data.data);
      }
    } catch (error) {
      console.error('Vitrin listesi hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این مورد را از ویترین حذف کنید؟')) return;

    try {
      const response = await fetch(`/api/vitrin?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setVitrinler(vitrinler.filter(v => v.id !== id));
        alert('از ویترین حذف شد');
      }
    } catch (error) {
      console.error('Vitrin kaldırma hatası:', error);
      alert('خطایی رخ داد');
    }
  };

  const toggleAktif = async (id: number, aktif: boolean) => {
    try {
      const response = await fetch(`/api/admin/vitrin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aktif: !aktif })
      });

      if (response.ok) {
        fetchVitrinler();
      }
    } catch (error) {
      console.error('Durum değiştirme hatası:', error);
    }
  };

  const filteredVitrinler = filter === "all" 
    ? vitrinler 
    : vitrinler.filter(v => v.vitrin_turu === filter);

  const vitrinTuruText = {
    anasayfa: "صفحه اصلی",
    kategori: "دسته‌بندی",
    arama: "جستجو",
    magaza: "مغازه"
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8" dir="rtl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">مدیریت ویترین</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">مدیریت همه آگهی‌های ویترین</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">مجموع ویترین</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{vitrinler.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">فعال</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  {vitrinler.filter(v => v.aktif).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">مجموع بازدید</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {vitrinler.reduce((sum, v) => sum + v.goruntulenme, 0).toLocaleString('fa-AF')}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">مجموع کلیک</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {vitrinler.reduce((sum, v) => sum + v.tiklanma, 0).toLocaleString('fa-AF')}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <MousePointer className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                filter === "all"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              همه ({vitrinler.length})
            </button>
            <button
              onClick={() => setFilter("anasayfa")}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                filter === "anasayfa"
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-500/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              صفحه اصلی ({vitrinler.filter(v => v.vitrin_turu === "anasayfa").length})
            </button>
            <button
              onClick={() => setFilter("kategori")}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                filter === "kategori"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              دسته‌بندی ({vitrinler.filter(v => v.vitrin_turu === "kategori").length})
            </button>
            <button
              onClick={() => setFilter("magaza")}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                filter === "magaza"
                  ? "bg-green-600 text-white shadow-lg shadow-green-500/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              مغازه ({vitrinler.filter(v => v.vitrin_turu === "magaza").length})
            </button>
          </div>
        </div>

        {/* Showcase Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      آگهی
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      مغازه
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      نوع ویترین
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      دسته‌بندی
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      آمار
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      تاریخ پایان
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      وضعیت
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredVitrinler.map((vitrin) => (
                    <tr key={vitrin.id} className={`hover:bg-gray-50 transition-colors ${!vitrin.aktif ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                          <span className="font-semibold text-gray-900">{vitrin.ilan_baslik}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {vitrin.magaza_ad || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {vitrinTuruText[vitrin.vitrin_turu as keyof typeof vitrinTuruText]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {vitrin.kategori_ad || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Eye className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{vitrin.goruntulenme.toLocaleString('fa-AF')}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MousePointer className="h-4 w-4 text-green-600" />
                            <span className="font-medium">{vitrin.tiklanma.toLocaleString('fa-AF')}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(vitrin.bitis_tarihi).toLocaleDateString('fa-IR')}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleAktif(vitrin.id, vitrin.aktif)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                            vitrin.aktif
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {vitrin.aktif ? 'فعال' : 'غیرفعال'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(vitrin.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف از ویترین"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredVitrinler.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">هنوز آگهی ویترینی وجود ندارد</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


