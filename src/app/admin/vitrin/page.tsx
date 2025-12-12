"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Store, Search, Star, TrendingUp, Eye, Calendar } from "lucide-react";

interface Magaza {
  id: number;
  ad: string;
  ad_dari: string;
  logo: string;
  store_level: string;
  vitrin_oncelik: number | null;
  aktif: boolean;
  created_at: string;
}

export default function AdminVitrinPage() {
  const [magazalar, setMagazalar] = useState<Magaza[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMagazalar();
  }, []);

  const fetchMagazalar = async () => {
    try {
      const response = await fetch('/api/admin/magazalar');
      const data = await response.json();
      if (data.success) {
        setMagazalar(data.data);
      }
    } catch (error) {
      console.error('Mağaza yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVitrin = async (magazaId: number, currentPriority: number | null) => {
    try {
      const response = await fetch(`/api/admin/magazalar/${magazaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vitrin_oncelik: currentPriority ? null : 1
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(currentPriority ? '❌ از ویترین حذف شد' : '✅ به ویترین اضافه شد');
        fetchMagazalar();
      } else {
        alert('❌ خطا: ' + data.message);
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('❌ خطا در به‌روزرسانی');
    }
  };

  const filteredMagazalar = magazalar.filter(magaza =>
    magaza.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    magaza.ad_dari.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const vitrinMagazalar = filteredMagazalar.filter(m => m.vitrin_oncelik);
  const digerMagazalar = filteredMagazalar.filter(m => !m.vitrin_oncelik);

  return (
    <AdminLayout>
      <div className="mb-8" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مدیریت ویترین</h1>
            <p className="mt-2 text-gray-600">مغازه‌های ویترین صفحه اصلی را مدیریت کنید</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg">
            <div className="text-sm opacity-90">تعداد مغازه‌های ویترین</div>
            <div className="text-2xl font-bold">{vitrinMagazalar.length}</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی مغازه..."
            className="w-full pr-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Vitrin Mağazalar */}
          <div>
            <div className="flex items-center gap-2 mb-4" dir="rtl">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">مغازه‌های ویترین فعلی</h2>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                {vitrinMagazalar.length}
              </span>
            </div>

            {vitrinMagazalar.length === 0 ? (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 text-center" dir="rtl">
                <Store className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-600">هنوز مغازه‌ای در ویترین قرار نگرفته است</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {vitrinMagazalar.map((magaza) => (
                  <MagazaCard key={magaza.id} magaza={magaza} onToggle={toggleVitrin} />
                ))}
              </div>
            )}
          </div>

          {/* Diğer Mağazalar */}
          <div>
            <div className="flex items-center gap-2 mb-4" dir="rtl">
              <h2 className="text-2xl font-bold text-gray-900">سایر مغازه‌ها</h2>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                {digerMagazalar.length}
              </span>
            </div>

            <div className="grid gap-4">
              {digerMagazalar.map((magaza) => (
                <MagazaCard key={magaza.id} magaza={magaza} onToggle={toggleVitrin} />
              ))}
            </div>

            {digerMagazalar.length === 0 && searchTerm && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 text-center" dir="rtl">
                <p className="text-gray-600">هیچ مغازه‌ای یافت نشد</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function MagazaCard({ magaza, onToggle }: { magaza: Magaza; onToggle: (id: number, priority: number | null) => void }) {
  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'elite':
        return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">پریمیوم</span>;
      case 'pro':
        return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">پرو</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">عادی</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row gap-4 p-6">
        {/* Logo */}
        <div className="md:w-32 flex-shrink-0">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            {magaza.logo ? (
              <img
                src={magaza.logo}
                alt={magaza.ad}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Store className="h-12 w-12 text-gray-400" />
              </div>
            )}
            {magaza.vitrin_oncelik && (
              <div className="absolute top-2 right-2">
                <Star className="h-6 w-6 text-blue-600 fill-blue-600 drop-shadow-lg" />
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1" dir="rtl">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{magaza.ad_dari}</h3>
                {getLevelBadge(magaza.store_level)}
                {magaza.aktif ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">فعال</span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">غیرفعال</span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-2">{magaza.ad}</p>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(magaza.created_at).toLocaleDateString('fa-IR')}
                </span>
              </div>
            </div>
          </div>

          {/* Action */}
          <button
            onClick={() => onToggle(magaza.id, magaza.vitrin_oncelik)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              magaza.vitrin_oncelik
                ? 'bg-red-100 hover:bg-red-200 text-red-700'
                : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            {magaza.vitrin_oncelik ? 'حذف از ویترین' : 'افزودن به ویترین'}
          </button>
        </div>
      </div>
    </div>
  );
}
