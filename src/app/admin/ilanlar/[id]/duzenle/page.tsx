"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { Save, ArrowLeft, Loader2 } from "lucide-react";

interface Ilan {
  id: number;
  baslik: string;
  aciklama: string;
  fiyat: string;
  kategori_id: number;
  alt_kategori_id?: number;
  aktif: boolean;
}

interface Kategori {
  id: number;
  ad: string;
  ad_dari?: string;
}

export default function IlanDuzenlePage() {
  const router = useRouter();
  const params = useParams();
  const ilanId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  
  const [formData, setFormData] = useState({
    baslik: "",
    aciklama: "",
    fiyat: "",
    kategori_id: "",
    alt_kategori_id: "",
    aktif: true
  });

  useEffect(() => {
    fetchKategoriler();
    if (ilanId) {
      fetchIlan();
    }
  }, [ilanId]);

  const fetchKategoriler = async () => {
    try {
      const response = await fetch('/api/kategoriler');
      const data = await response.json();
      if (data.success) {
        setKategoriler(data.data);
      }
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const fetchIlan = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/ilanlar/${ilanId}`);
      const data = await response.json();
      
      if (data.success) {
        const ilan = data.data;
        setFormData({
          baslik: ilan.baslik || "",
          aciklama: ilan.aciklama || "",
          fiyat: ilan.fiyat?.toString() || "",
          kategori_id: ilan.kategori_id?.toString() || "",
          alt_kategori_id: ilan.alt_kategori_id?.toString() || "",
          aktif: ilan.aktif !== false
        });
      } else {
        alert('İlan bulunamadı');
        router.push('/admin/ilanlar');
      }
    } catch (error) {
      console.error('İlan yüklenemedi:', error);
      alert('İlan yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.baslik || !formData.kategori_id) {
      alert('عنوان و دسته‌بندی الزامی است');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/ilanlar/${ilanId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          kategori_id: parseInt(formData.kategori_id),
          alt_kategori_id: formData.alt_kategori_id ? parseInt(formData.alt_kategori_id) : null,
          fiyat: parseFloat(formData.fiyat) || 0
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('آگهی با موفقیت به‌روزرسانی شد');
        router.push('/admin/ilanlar');
      } else {
        alert(data.message || 'خطا در به‌روزرسانی');
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      alert('خطا در به‌روزرسانی آگهی');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ویرایش آگهی</h1>
              <p className="text-gray-600 mt-1">شناسه: #{ilanId}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Başlık */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                عنوان آگهی <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.baslik}
                onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="مثال: فروش آپارتمان 120 متری در کابل"
                required
              />
            </div>

            {/* Kategori */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  دسته‌بندی <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.kategori_id}
                  onChange={(e) => setFormData({ ...formData, kategori_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">انتخاب کنید</option>
                  {kategoriler.map((kat) => (
                    <option key={kat.id} value={kat.id}>
                      {kat.ad_dari || kat.ad}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  قیمت (افغانی)
                </label>
                <input
                  type="number"
                  value={formData.fiyat}
                  onChange={(e) => setFormData({ ...formData, fiyat: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                توضیحات
              </label>
              <textarea
                value={formData.aciklama}
                onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="جزئیات کامل آگهی خود را اینجا بنویسید..."
              />
            </div>

            {/* Aktif */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="aktif"
                checked={formData.aktif}
                onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="aktif" className="text-sm font-semibold text-gray-700 cursor-pointer">
                آگهی فعال باشد
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    در حال ذخیره...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    ذخیره تغییرات
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
              >
                لغو
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}





