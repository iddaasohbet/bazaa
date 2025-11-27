"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { BarChart3, Trash2, Eye, MousePointer, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";

interface Reklam {
  id: number;
  baslik: string;
  reklam_turu: string;
  konum: string;
  hedef_url: string;
  goruntulenme: number;
  tiklanma: number;
  butce: number;
  baslangic_tarihi: string;
  bitis_tarihi: string;
  aktif: boolean;
  onay_durumu: string;
}

export default function AdminReklamlarPage() {
  const [reklamlar, setReklamlar] = useState<Reklam[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchReklamlar();
  }, []);

  const fetchReklamlar = async () => {
    try {
      const response = await fetch('/api/admin/reklamlar');
      const data = await response.json();
      if (data.success) {
        setReklamlar(data.data);
      }
    } catch (error) {
      console.error('Reklam listesi hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnayDurumu = async (id: number, durum: string) => {
    try {
      const response = await fetch(`/api/admin/reklamlar/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onay_durumu: durum, aktif: durum === 'onaylandi' })
      });

      if (response.ok) {
        fetchReklamlar();
        alert('وضعیت تبلیغ به‌روزرسانی شد');
      }
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این تبلیغ را حذف کنید؟')) return;

    try {
      const response = await fetch(`/api/admin/reklamlar/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setReklamlar(reklamlar.filter(r => r.id !== id));
        alert('تبلیغ حذف شد');
      }
    } catch (error) {
      console.error('Reklam silme hatası:', error);
    }
  };

  const filteredReklamlar = filter === "all"
    ? reklamlar
    : reklamlar.filter(r => r.onay_durumu === filter);

  const reklamTuruText = {
    banner_header: "بنر هدر",
    banner_kategori: "بنر دسته‌بندی",
    banner_arama: "بنر جستجو",
    sponsorlu_magaza: "مغازه اسپانسر",
    sponsorlu_urun: "محصول اسپانسر"
  };

  const onayDurumuBadge = (durum: string) => {
    switch (durum) {
      case 'onaylandi':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3" /> تأیید شده
        </span>;
      case 'reddedildi':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="h-3 w-3" /> رد شده
        </span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3" /> در انتظار
        </span>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8" dir="rtl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">مدیریت تبلیغات</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">مدیریت و تأیید همه تبلیغات</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">مجموع تبلیغات</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{reklamlar.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">در انتظار</p>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
                  {reklamlar.filter(r => r.onay_durumu === 'beklemede').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">فعال</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  {reklamlar.filter(r => r.onay_durumu === 'onaylandi' && r.aktif).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">مجموع کلیک</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {reklamlar.reduce((sum, r) => sum + r.tiklanma, 0).toLocaleString('fa-AF')}
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
              همه ({reklamlar.length})
            </button>
            <button
              onClick={() => setFilter("beklemede")}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                filter === "beklemede"
                  ? "bg-yellow-600 text-white shadow-lg shadow-yellow-500/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              در انتظار ({reklamlar.filter(r => r.onay_durumu === 'beklemede').length})
            </button>
            <button
              onClick={() => setFilter("onaylandi")}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                filter === "onaylandi"
                  ? "bg-green-600 text-white shadow-lg shadow-green-500/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              تأیید شده ({reklamlar.filter(r => r.onay_durumu === 'onaylandi').length})
            </button>
            <button
              onClick={() => setFilter("reddedildi")}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                filter === "reddedildi"
                  ? "bg-red-600 text-white shadow-lg shadow-red-500/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              رد شده ({reklamlar.filter(r => r.onay_durumu === 'reddedildi').length})
            </button>
          </div>
        </div>

        {/* Ads Table */}
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
                      تبلیغ
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      نوع
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      آمار
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      بودجه
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
                  {filteredReklamlar.map((reklam) => (
                    <tr key={reklam.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900">{reklam.baslik}</div>
                          <div className="text-sm text-gray-500">{reklam.konum}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {reklamTuruText[reklam.reklam_turu as keyof typeof reklamTuruText]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Eye className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{reklam.goruntulenme.toLocaleString('fa-AF')}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MousePointer className="h-4 w-4 text-green-600" />
                            <span className="font-medium">{reklam.tiklanma.toLocaleString('fa-AF')}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {reklam.butce ? `${reklam.butce.toLocaleString('fa-AF')} AFN` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(reklam.bitis_tarihi).toLocaleDateString('fa-IR')}
                      </td>
                      <td className="px-6 py-4">
                        {onayDurumuBadge(reklam.onay_durumu)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 items-center">
                          {reklam.onay_durumu === 'beklemede' && (
                            <>
                              <button
                                onClick={() => handleOnayDurumu(reklam.id, 'onaylandi')}
                                className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg font-semibold text-xs transition-colors"
                                title="تأیید"
                              >
                                تأیید
                              </button>
                              <button
                                onClick={() => handleOnayDurumu(reklam.id, 'reddedildi')}
                                className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-semibold text-xs transition-colors"
                                title="رد"
                              >
                                رد
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(reklam.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredReklamlar.length === 0 && (
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">هنوز تبلیغی وجود ندارد</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


