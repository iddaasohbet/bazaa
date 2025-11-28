"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Star, Search, Eye, Calendar, MapPin, Tag } from "lucide-react";

interface Ilan {
  id: number;
  baslik: string;
  fiyat: number;
  ana_resim: string;
  kategori_ad: string;
  il_ad: string;
  goruntulenme: number;
  onecikan: boolean;
  created_at: string;
}

export default function AdminOnecikanPage() {
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchIlanlar();
  }, []);

  const fetchIlanlar = async () => {
    try {
      const response = await fetch('/api/admin/ilanlar?limit=100');
      const data = await response.json();
      if (data.success) {
        setIlanlar(data.data);
      }
    } catch (error) {
      console.error('İlan yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOnecikan = async (ilanId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/ilanlar/${ilanId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onecikan: !currentStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(currentStatus ? '❌ از آگهی‌های ویژه حذف شد' : '✅ به آگهی‌های ویژه اضافه شد');
        fetchIlanlar();
      } else {
        alert('❌ خطا: ' + data.message);
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('❌ خطا در به‌روزرسانی');
    }
  };

  const filteredIlanlar = ilanlar.filter(ilan =>
    ilan.baslik.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onecikanIlanlar = filteredIlanlar.filter(i => i.onecikan);
  const digerIlanlar = filteredIlanlar.filter(i => !i.onecikan);

  return (
    <AdminLayout>
      <div className="mb-8" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">آگهی‌های ویژه</h1>
            <p className="mt-2 text-gray-600">آگهی‌های ویژه را مدیریت کنید</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg">
            <div className="text-sm opacity-90">تعداد آگهی‌های ویژه</div>
            <div className="text-2xl font-bold">{onecikanIlanlar.length}</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی آگهی..."
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
          {/* Öne Çıkan İlanlar */}
          <div>
            <div className="flex items-center gap-2 mb-4" dir="rtl">
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">آگهی‌های ویژه فعلی</h2>
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                {onecikanIlanlar.length}
              </span>
            </div>

            {onecikanIlanlar.length === 0 ? (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center" dir="rtl">
                <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <p className="text-gray-600">هنوز آگهی ویژه‌ای انتخاب نشده است</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {onecikanIlanlar.map((ilan) => (
                  <IlanCard key={ilan.id} ilan={ilan} onToggle={toggleOnecikan} />
                ))}
              </div>
            )}
          </div>

          {/* Diğer İlanlar */}
          <div>
            <div className="flex items-center gap-2 mb-4" dir="rtl">
              <h2 className="text-2xl font-bold text-gray-900">سایر آگهی‌ها</h2>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                {digerIlanlar.length}
              </span>
            </div>

            <div className="grid gap-4">
              {digerIlanlar.map((ilan) => (
                <IlanCard key={ilan.id} ilan={ilan} onToggle={toggleOnecikan} />
              ))}
            </div>

            {digerIlanlar.length === 0 && searchTerm && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 text-center" dir="rtl">
                <p className="text-gray-600">هیچ آگهی یافت نشد</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function IlanCard({ ilan, onToggle }: { ilan: Ilan; onToggle: (id: number, current: boolean) => void }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row gap-4 p-6">
        {/* Image */}
        <div className="md:w-48 flex-shrink-0">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
            <img
              src={ilan.ana_resim}
              alt={ilan.baslik}
              className="w-full h-full object-cover"
            />
            {ilan.onecikan && (
              <div className="absolute top-2 right-2">
                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500 drop-shadow-lg" />
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1" dir="rtl">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{ilan.baslik}</h3>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                <span className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  {ilan.kategori_ad}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {ilan.il_ad}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {ilan.goruntulenme} بازدید
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(ilan.created_at).toLocaleDateString('fa-IR')}
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {ilan.fiyat.toLocaleString()} افغانی
              </div>
            </div>
          </div>

          {/* Action */}
          <button
            onClick={() => onToggle(ilan.id, ilan.onecikan)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              ilan.onecikan
                ? 'bg-red-100 hover:bg-red-200 text-red-700'
                : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
            }`}
          >
            <Star className={`h-4 w-4 ${ilan.onecikan ? '' : 'fill-yellow-500'}`} />
            {ilan.onecikan ? 'حذف از ویژه' : 'افزودن به ویژه'}
          </button>
        </div>
      </div>
    </div>
  );
}
