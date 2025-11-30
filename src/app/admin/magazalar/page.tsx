"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  Store,
  Eye,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Star,
  Award
} from "lucide-react";

interface Magaza {
  id: number;
  ad: string;
  ad_dari?: string;
  slug: string;
  logo?: string;
  telefon?: string;
  il_ad?: string;
  kullanici_ad: string;
  store_level: 'basic' | 'pro' | 'elite';
  onay_durumu: 'beklemede' | 'onaylandi' | 'reddedildi';
  aktif: boolean;
  goruntulenme: number;
  ilan_sayisi?: number;
  created_at: string;
}

export default function MagazalarPage() {
  const [magazalar, setMagazalar] = useState<Magaza[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");

  useEffect(() => {
    fetchMagazalar();
  }, [filterStatus, filterLevel]);

  const fetchMagazalar = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('onay_durumu', filterStatus);
      if (filterLevel !== 'all') params.append('store_level', filterLevel);
      
      const response = await fetch(`/api/admin/magazalar?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setMagazalar(data.data);
      }
    } catch (error) {
      console.error('Mağazalar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('این مغازه را حذف کنید؟')) return;

    try {
      const response = await fetch(`/api/admin/magazalar?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        alert('مغازه با موفقیت حذف شد');
        fetchMagazalar();
      } else {
        alert(data.message || 'خطا در حذف مغازه');
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('خطا در حذف مغازه');
    }
  };

  const handleApprove = async (id: number, onay: 'onaylandi' | 'reddedildi') => {
    try {
      const response = await fetch('/api/admin/magazalar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, onay_durumu: onay })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(onay === 'onaylandi' ? 'مغازه تأیید شد' : 'مغازه رد شد');
        fetchMagazalar();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Onay hatası:', error);
      alert('خطا در تغییر وضعیت');
    }
  };

  const filteredMagazalar = magazalar.filter(magaza =>
    magaza.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    magaza.kullanici_ad?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const levelBadge = {
    basic: { label: 'عادی', color: 'bg-gray-100 text-gray-700', icon: Store },
    pro: { label: 'حرفه‌ای', color: 'bg-blue-100 text-blue-700', icon: TrendingUp },
    elite: { label: 'ویژه', color: 'bg-purple-100 text-purple-700', icon: Award }
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">مدیریت مغازه‌ها</h1>
            <p className="text-gray-600 mt-1">
              مجموع {filteredMagazalar.length} مغازه
            </p>
          </div>
          <Link
            href="/admin/magazalar/yeni"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>مغازه جدید</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <Store className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{magazalar.length}</div>
            <div className="text-sm opacity-90">کل مغازه‌ها</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {magazalar.filter(m => m.onay_durumu === 'onaylandi').length}
            </div>
            <div className="text-sm opacity-90">تأیید شده</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {magazalar.filter(m => m.onay_durumu === 'beklemede').length}
            </div>
            <div className="text-sm opacity-90">در انتظار</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {magazalar.filter(m => m.store_level === 'elite').length}
            </div>
            <div className="text-sm opacity-90">مغازه ویژه</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {magazalar.filter(m => !m.aktif).length}
            </div>
            <div className="text-sm opacity-90">غیرفعال</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجوی مغازه..."
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter Status */}
            <div className="relative">
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="onaylandi">تأیید شده</option>
                <option value="beklemede">در انتظار تأیید</option>
                <option value="reddedildi">رد شده</option>
              </select>
            </div>

            {/* Filter Level */}
            <div className="relative">
              <Award className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">همه سطوح</option>
                <option value="basic">عادی</option>
                <option value="pro">حرفه‌ای</option>
                <option value="elite">ویژه</option>
              </select>
            </div>
          </div>
        </div>

        {/* Magazalar Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">در حال بارگذاری...</p>
              </div>
            </div>
          ) : filteredMagazalar.length === 0 ? (
            <div className="text-center py-20">
              <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">مغازه‌ای یافت نشد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      مغازه
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      صاحب مغازه
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      تماس
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      سطح
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      وضعیت
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
                  {filteredMagazalar.map((magaza) => {
                    const level = levelBadge[magaza.store_level];
                    const LevelIcon = level.icon;
                    
                    return (
                      <tr key={magaza.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {magaza.logo ? (
                              <img
                                src={magaza.logo}
                                alt={magaza.ad}
                                className="w-12 h-12 rounded-lg object-cover border-2 border-gray-200"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center border-2 border-gray-200">
                                <Store className="w-6 h-6 text-purple-600" />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-gray-900">{magaza.ad}</div>
                              <div className="text-xs text-gray-500">{magaza.il_ad || '-'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{magaza.kullanici_ad}</div>
                        </td>
                        <td className="px-6 py-4">
                          {magaza.telefon ? (
                            <div className="flex items-center gap-2 text-sm text-gray-600" dir="ltr">
                              <Phone className="w-4 h-4" />
                              {magaza.telefon}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${level.color}`}>
                            <LevelIcon className="w-3 h-3" />
                            {level.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              magaza.onay_durumu === 'onaylandi' 
                                ? 'bg-green-100 text-green-700'
                                : magaza.onay_durumu === 'beklemede'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {magaza.onay_durumu === 'onaylandi' && <CheckCircle className="w-3 h-3" />}
                              {magaza.onay_durumu === 'beklemede' && <Clock className="w-3 h-3" />}
                              {magaza.onay_durumu === 'reddedildi' && <XCircle className="w-3 h-3" />}
                              {magaza.onay_durumu === 'onaylandi' ? 'تأیید شده' : magaza.onay_durumu === 'beklemede' ? 'در انتظار' : 'رد شده'}
                            </span>
                            {!magaza.aktif && (
                              <div className="text-xs text-red-600">غیرفعال</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Eye className="w-4 h-4" />
                            <span className="font-medium">{magaza.goruntulenme}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {magaza.onay_durumu === 'beklemede' && (
                              <>
                                <button
                                  onClick={() => handleApprove(magaza.id, 'onaylandi')}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="تأیید"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleApprove(magaza.id, 'reddedildi')}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="رد"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <Link
                              href={`/magaza/${magaza.slug}`}
                              target="_blank"
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="مشاهده"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/magazalar/${magaza.id}/duzenle`}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="ویرایش"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(magaza.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}











