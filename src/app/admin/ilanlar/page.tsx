"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Filter,
  MoreVertical,
  TrendingUp,
  Star,
  Power
} from "lucide-react";

interface Ilan {
  id: number;
  baslik: string;
  fiyat: number;
  eski_fiyat?: number;
  kategori_ad: string;
  il_ad: string;
  kullanici_ad: string;
  magaza_ad?: string;
  ana_resim: string;
  durum: string;
  aktif: boolean;
  onecikan: boolean;
  goruntulenme: number;
  created_at: string;
}

export default function IlanlarPage() {
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchIlanlar();
  }, [filterStatus]);

  const fetchIlanlar = async () => {
    setLoading(true);
    try {
      const durum = filterStatus === 'all' ? '' : filterStatus;
      const response = await fetch(`/api/admin/ilanlar?limit=50&durum=${durum}`);
      const data = await response.json();
      
      if (data.success) {
        setIlanlar(data.data);
      }
    } catch (error) {
      console.error('İlanlar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('این آگهی را حذف کنید؟')) return;

    try {
      const response = await fetch(`/api/admin/ilanlar?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        alert('آگهی با موفقیت حذف شد');
        fetchIlanlar();
      } else {
        alert(data.message || 'خطا در حذف آگهی');
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('خطا در حذف آگهی');
    }
  };

  const toggleAktif = async (id: number, currentValue: boolean) => {
    try {
      const response = await fetch('/api/admin/ilanlar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, aktif: !currentValue })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(!currentValue ? '✅ آگهی فعال شد' : '❌ آگهی غیرفعال شد');
        fetchIlanlar();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Toggle hatası:', error);
      alert('خطا در تغییر وضعیت');
    }
  };

  const filteredIlanlar = ilanlar.filter(ilan =>
    ilan.baslik.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ilan.kategori_ad?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const durumText: Record<string, string> = {
    yeni: 'نو',
    az_kullanilmis: 'کم استفاده',
    kullanilmis: 'استفاده شده',
    hasarli: 'معیوب'
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">مدیریت آگهی‌ها</h1>
            <p className="text-gray-600 mt-1">
              مجموع {filteredIlanlar.length} آگهی
            </p>
          </div>
          <Link
            href="/admin/ilanlar/yeni"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>آگهی جدید</span>
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجوی آگهی..."
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">همه آگهی‌ها</option>
                <option value="aktif">فعال</option>
                <option value="beklemede">در انتظار تأیید</option>
              </select>
            </div>
          </div>
        </div>

        {/* İlanlar Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">در حال بارگذاری...</p>
              </div>
            </div>
          ) : filteredIlanlar.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600">آگهی یافت نشد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      تصویر
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      عنوان
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      دسته‌بندی
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      قیمت
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      وضعیت
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      فعال/غیرفعال
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      بازدید
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredIlanlar.map((ilan) => (
                    <tr key={ilan.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                          {ilan.ana_resim ? (
                            <img
                              src={ilan.ana_resim}
                              alt={ilan.baslik}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Eye className="w-6 h-6" />
                            </div>
                          )}
                          {ilan.onecikan && (
                            <div className="absolute top-1 left-1 p-1 bg-yellow-500 rounded">
                              <Star className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900 line-clamp-1">
                            {ilan.baslik}
                          </div>
                          <div className="text-sm text-gray-600">
                            {ilan.il_ad} • {ilan.kullanici_ad}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {ilan.kategori_ad}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-gray-900" dir="ltr">
                            {ilan.fiyat.toLocaleString('fa-AF')} AFN
                          </div>
                          {ilan.eski_fiyat && (
                            <div className="text-sm text-gray-500 line-through" dir="ltr">
                              {ilan.eski_fiyat.toLocaleString('fa-AF')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            ilan.aktif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {ilan.aktif ? 'فعال' : 'غیرفعال'}
                          </span>
                          <div className="text-xs text-gray-500">
                            {durumText[ilan.durum] || ilan.durum}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => toggleAktif(ilan.id, ilan.aktif)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              ilan.aktif ? 'bg-green-600' : 'bg-gray-300'
                            }`}
                            title={ilan.aktif ? 'آگهی فعال' : 'آگهی غیرفعال'}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                ilan.aktif ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Eye className="w-4 h-4" />
                          <span className="font-medium">{ilan.goruntulenme}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/ilan/${ilan.id}`}
                            target="_blank"
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="مشاهده"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/ilanlar/${ilan.id}/duzenle`}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="ویرایش"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(ilan.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}













