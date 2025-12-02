"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  Search,
  Filter,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  Eye,
  Download,
  TrendingUp,
  Calendar,
  CreditCard,
  Package,
  Star,
  TrendingDown
} from "lucide-react";

interface Odeme {
  id: number;
  kullanici_ad: string;
  kullanici_email: string;
  odeme_turu: 'paket' | 'vitrin' | 'reklam' | 'urun_yukseltme';
  iliskili_id?: number;
  tutar: number;
  para_birimi: string;
  odeme_yontemi?: string;
  odeme_durumu: 'beklemede' | 'tamamlandi' | 'iptal' | 'iade';
  transaction_id?: string;
  aciklama?: string;
  created_at: string;
}

export default function OdemelerPage() {
  const [odemeler, setOdemeler] = useState<Odeme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDurum, setFilterDurum] = useState("all");
  const [filterTur, setFilterTur] = useState("all");

  useEffect(() => {
    fetchOdemeler();
  }, [filterDurum, filterTur]);

  const fetchOdemeler = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterDurum !== 'all') params.append('durum', filterDurum);
      if (filterTur !== 'all') params.append('tur', filterTur);
      
      const response = await fetch(`/api/admin/odemeler?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setOdemeler(data.data);
      }
    } catch (error) {
      console.error('Ödemeler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, yeniDurum: string) => {
    try {
      const response = await fetch('/api/admin/odemeler', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, odeme_durumu: yeniDurum })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('وضعیت پرداخت به‌روزرسانی شد');
        fetchOdemeler();
      } else {
        alert(data.message || 'خطا در به‌روزرسانی');
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      alert('خطا در به‌روزرسانی');
    }
  };

  const filteredOdemeler = odemeler.filter(odeme =>
    odeme.kullanici_ad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    odeme.kullanici_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    odeme.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // İstatistikler
  const stats = {
    toplam: odemeler.reduce((sum, o) => sum + o.tutar, 0),
    tamamlanan: odemeler.filter(o => o.odeme_durumu === 'tamamlandi').reduce((sum, o) => sum + o.tutar, 0),
    bekleyen: odemeler.filter(o => o.odeme_durumu === 'beklemede').length,
    iptal: odemeler.filter(o => o.odeme_durumu === 'iptal').length,
  };

  const odemeTuruLabels: Record<string, { label: string; icon: any; color: string }> = {
    paket: { label: 'بسته', icon: Package, color: 'bg-purple-100 text-purple-700' },
    vitrin: { label: 'ویترین', icon: Star, color: 'bg-yellow-100 text-yellow-700' },
    reklam: { label: 'تبلیغات', icon: TrendingUp, color: 'bg-blue-100 text-blue-700' },
    urun_yukseltme: { label: 'ارتقا محصول', icon: TrendingDown, color: 'bg-green-100 text-green-700' }
  };

  const durumBadges: Record<string, { label: string; icon: any; color: string }> = {
    beklemede: { label: 'در انتظار', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
    tamamlandi: { label: 'تکمیل شده', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
    iptal: { label: 'لغو شده', icon: XCircle, color: 'bg-red-100 text-red-700' },
    iade: { label: 'بازگشت', icon: RotateCcw, color: 'bg-gray-100 text-gray-700' }
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">مدیریت پرداخت‌ها</h1>
            <p className="text-gray-600 mt-1">
              مجموع {filteredOdemeler.length} پرداخت
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1" dir="ltr">
              {stats.toplam.toLocaleString('fa-AF')} AFN
            </div>
            <div className="text-sm opacity-90">کل درآمد</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1" dir="ltr">
              {stats.tamamlanan.toLocaleString('fa-AF')} AFN
            </div>
            <div className="text-sm opacity-90">تکمیل شده</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.bekleyen}</div>
            <div className="text-sm opacity-90">در انتظار</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.iptal}</div>
            <div className="text-sm opacity-90">لغو شده</div>
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
                placeholder="جستجوی کاربر، Transaction ID..."
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter Durum */}
            <div className="relative">
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterDurum}
                onChange={(e) => setFilterDurum(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="beklemede">در انتظار</option>
                <option value="tamamlandi">تکمیل شده</option>
                <option value="iptal">لغو شده</option>
                <option value="iade">بازگشت</option>
              </select>
            </div>

            {/* Filter Tür */}
            <div className="relative">
              <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterTur}
                onChange={(e) => setFilterTur(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">همه انواع</option>
                <option value="paket">بسته‌ها</option>
                <option value="vitrin">ویترین</option>
                <option value="reklam">تبلیغات</option>
                <option value="urun_yukseltme">ارتقا محصول</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ödemeler Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">در حال بارگذاری...</p>
              </div>
            </div>
          ) : filteredOdemeler.length === 0 ? (
            <div className="text-center py-20">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">پرداختی یافت نشد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      کاربر
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      نوع پرداخت
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      مبلغ
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      روش پرداخت
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      وضعیت
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      تاریخ
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOdemeler.map((odeme) => {
                    const turInfo = odemeTuruLabels[odeme.odeme_turu];
                    const durumInfo = durumBadges[odeme.odeme_durumu];
                    const TurIcon = turInfo.icon;
                    const DurumIcon = durumInfo.icon;
                    
                    return (
                      <tr key={odeme.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <code className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            #{odeme.id}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-gray-900">{odeme.kullanici_ad}</div>
                            <div className="text-xs text-gray-500" dir="ltr">{odeme.kullanici_email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${turInfo.color}`}>
                            <TurIcon className="w-3 h-3" />
                            {turInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900" dir="ltr">
                            {odeme.tutar.toLocaleString('fa-AF')} {odeme.para_birimi}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {odeme.odeme_yontemi || '-'}
                          </div>
                          {odeme.transaction_id && (
                            <div className="text-xs text-gray-400 mt-1" dir="ltr">
                              TXN: {odeme.transaction_id.substring(0, 12)}...
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${durumInfo.color}`}>
                            <DurumIcon className="w-3 h-3" />
                            {durumInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(odeme.created_at).toLocaleDateString('fa-AF')}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(odeme.created_at).toLocaleTimeString('fa-AF')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {odeme.odeme_durumu === 'beklemede' && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(odeme.id, 'tamamlandi')}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="تأیید"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(odeme.id, 'iptal')}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="لغو"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => alert(`Transaction ID: ${odeme.transaction_id || 'N/A'}\n\nتوضیحات: ${odeme.aciklama || 'ندارد'}`)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="جزئیات"
                            >
                              <Eye className="w-4 h-4" />
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














