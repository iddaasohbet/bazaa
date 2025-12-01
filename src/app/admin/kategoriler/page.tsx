"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  Plus,
  Edit,
  Trash2,
  Grid,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Package
} from "lucide-react";

interface Kategori {
  id: number;
  ad: string;
  ad_dari?: string;
  slug: string;
  aciklama?: string;
  ikon: string;
  sira: number;
  aktif: boolean;
  ilan_sayisi?: number;
}

export default function KategorilerPage() {
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    ad: "",
    ad_dari: "",
    slug: "",
    aciklama: "",
    ikon: "grid",
    aktif: true
  });

  useEffect(() => {
    fetchKategoriler();
  }, []);

  const fetchKategoriler = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/kategoriler');
      const data = await response.json();
      
      if (data.success) {
        setKategoriler(data.data);
      }
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ad || !formData.slug) {
      alert('نام و slug الزامی است');
      return;
    }

    try {
      const url = editingId ? '/api/admin/kategoriler' : '/api/admin/kategoriler';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...formData } : formData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(editingId ? 'دسته‌بندی به‌روزرسانی شد' : 'دسته‌بندی جدید ایجاد شد');
        fetchKategoriler();
        resetForm();
      } else {
        alert(data.message || 'خطا در عملیات');
      }
    } catch (error) {
      console.error('İşlem hatası:', error);
      alert('خطا در عملیات');
    }
  };

  const handleEdit = (kategori: Kategori) => {
    setEditingId(kategori.id);
    setFormData({
      ad: kategori.ad,
      ad_dari: kategori.ad_dari || "",
      slug: kategori.slug,
      aciklama: kategori.aciklama || "",
      ikon: kategori.ikon,
      aktif: kategori.aktif
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: number) => {
    // İlanlı kategorileri sil
    const kategori = kategoriler.find(k => k.id === id);
    if (kategori && kategori.ilan_sayisi && kategori.ilan_sayisi > 0) {
      if (!confirm(`این دسته‌بندی ${kategori.ilan_sayisi} آگهی دارد. آیا مطمئن هستید؟`)) {
        return;
      }
    } else if (!confirm('این دسته‌بندی را حذف کنید؟')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/kategoriler?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        alert('دسته‌بندی حذف شد');
        fetchKategoriler();
      } else {
        alert(data.message || 'خطا در حذف');
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('خطا در حذف');
    }
  };

  const handleToggleAktif = async (id: number, aktif: boolean) => {
    try {
      const response = await fetch('/api/admin/kategoriler', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, aktif: !aktif })
      });

      const data = await response.json();
      
      if (data.success) {
        fetchKategoriler();
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
    }
  };

  const handleSiraChange = async (id: number, direction: 'up' | 'down') => {
    const index = kategoriler.findIndex(k => k.id === id);
    if (index === -1) return;
    
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === kategoriler.length - 1) return;

    const newSira = direction === 'up' ? kategoriler[index].sira - 1 : kategoriler[index].sira + 1;
    
    try {
      const response = await fetch('/api/admin/kategoriler', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, sira: newSira })
      });

      const data = await response.json();
      
      if (data.success) {
        fetchKategoriler();
      }
    } catch (error) {
      console.error('Sıra değiştirme hatası:', error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      ad: "",
      ad_dari: "",
      slug: "",
      aciklama: "",
      ikon: "grid",
      aktif: true
    });
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleAdChange = (value: string) => {
    setFormData({
      ...formData,
      ad: value,
      slug: generateSlug(value)
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">مدیریت دسته‌بندی‌ها</h1>
            <p className="text-gray-600 mt-1">
              مجموع {kategoriler.length} دسته‌بندی
            </p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            <span>{isAdding ? 'لغو' : 'دسته‌بندی جدید'}</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? 'ویرایش دسته‌بندی' : 'دسته‌بندی جدید'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Ad */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    نام دسته‌بندی (انگلیسی) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ad}
                    onChange={(e) => handleAdChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Electronics"
                    required
                  />
                </div>

                {/* Ad Dari */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    نام دسته‌بندی (دری)
                  </label>
                  <input
                    type="text"
                    value={formData.ad_dari}
                    onChange={(e) => setFormData({ ...formData, ad_dari: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="الکترونیک"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="electronics"
                    required
                    dir="ltr"
                  />
                </div>

                {/* İkon */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    آیکون
                  </label>
                  <input
                    type="text"
                    value={formData.ikon}
                    onChange={(e) => setFormData({ ...formData, ikon: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="smartphone"
                    dir="ltr"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lucide icon adı (ör: car, home, smartphone)</p>
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
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="توضیحات دسته‌بندی..."
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
                  دسته‌بندی فعال باشد
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'به‌روزرسانی' : 'ایجاد'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  لغو
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Kategoriler Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">در حال بارگذاری...</p>
              </div>
            </div>
          ) : kategoriler.length === 0 ? (
            <div className="text-center py-20">
              <Grid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">دسته‌بندی یافت نشد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ترتیب
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      دسته‌بندی
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      آگهی‌ها
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      وضعیت
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {kategoriler.map((kategori, index) => (
                    <tr key={kategori.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSiraChange(kategori.id, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-gray-900">{kategori.sira}</span>
                          <button
                            onClick={() => handleSiraChange(kategori.id, 'down')}
                            disabled={index === kategoriler.length - 1}
                            className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                            <Grid className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{kategori.ad}</div>
                            {kategori.ad_dari && (
                              <div className="text-xs text-gray-500">{kategori.ad_dari}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded" dir="ltr">
                          {kategori.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">
                            {kategori.ilan_sayisi || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleAktif(kategori.id, kategori.aktif)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                            kategori.aktif 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {kategori.aktif ? (
                            <>
                              <Eye className="w-3 h-3" />
                              فعال
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              غیرفعال
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(kategori)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="ویرایش"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(kategori.id)}
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












