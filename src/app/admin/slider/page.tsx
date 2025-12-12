"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Edit, Trash2, Image as ImageIcon, Link as LinkIcon, Search, X } from "lucide-react";

interface Slider {
  id: number;
  ilan_id?: number;
  baslik: string;
  aciklama: string;
  resim: string;
  link: string;
  sira: number;
  aktif: boolean;
  ilan_baslik?: string;
  ilan_resim?: string;
}

interface Ilan {
  id: number;
  baslik: string;
  fiyat: number;
  ana_resim: string;
  kategori_ad: string;
}

export default function AdminSliderPage() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showIlanModal, setShowIlanModal] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [ilanSearch, setIlanSearch] = useState('');
  const [formData, setFormData] = useState({
    ilan_id: null as number | null,
    baslik: '',
    aciklama: '',
    resim: '',
    link: '',
    sira: 0,
    aktif: true
  });

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const response = await fetch('/api/admin/slider');
      const data = await response.json();
      if (data.success) {
        setSliders(data.data);
      }
    } catch (error) {
      console.error('Slider yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIlanlar = async () => {
    try {
      const response = await fetch('/api/admin/ilanlar?limit=100');
      const data = await response.json();
      if (data.success) {
        setIlanlar(data.data);
      }
    } catch (error) {
      console.error('İlan yükleme hatası:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = '/api/admin/slider';
      const method = editingSlider ? 'PUT' : 'POST';
      const body = editingSlider 
        ? { ...formData, id: editingSlider.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(editingSlider ? '✅ اسلایدر به‌روزرسانی شد' : '✅ اسلایدر اضافه شد');
        setShowModal(false);
        setEditingSlider(null);
        setFormData({ ilan_id: null, baslik: '', aciklama: '', resim: '', link: '', sira: 0, aktif: true });
        fetchSliders();
      } else {
        alert('❌ خطا: ' + data.message);
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('❌ خطا در ذخیره‌سازی');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (slider: Slider) => {
    setEditingSlider(slider);
    setFormData({
      ilan_id: slider.ilan_id || null,
      baslik: slider.baslik,
      aciklama: slider.aciklama,
      resim: slider.resim,
      link: slider.link,
      sira: slider.sira,
      aktif: slider.aktif
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این اسلایدر را حذف کنید؟')) return;

    try {
      const response = await fetch(`/api/admin/slider?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ اسلایدر حذف شد');
        fetchSliders();
      } else {
        alert('❌ خطا: ' + data.message);
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('❌ خطا در حذف');
    }
  };

  const handleNewSlider = () => {
    setEditingSlider(null);
    setFormData({ ilan_id: null, baslik: '', aciklama: '', resim: '', link: '', sira: 0, aktif: true });
    setShowModal(true);
  };

  const handleSelectIlan = (ilan: Ilan) => {
    setFormData({
      ...formData,
      ilan_id: ilan.id,
      baslik: ilan.baslik,
      aciklama: `${ilan.kategori_ad} - قیمت: ${ilan.fiyat} افغانی`,
      resim: ilan.ana_resim,
      link: `/ilan/${ilan.id}`
    });
    setShowIlanModal(false);
  };

  const handleOpenIlanModal = () => {
    fetchIlanlar();
    setShowIlanModal(true);
  };

  const filteredIlanlar = ilanlar.filter(ilan => 
    ilan.baslik.toLowerCase().includes(ilanSearch.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-8" dir="rtl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مدیریت اسلایدر</h1>
            <p className="mt-2 text-gray-600">اسلایدرهای صفحه اصلی را مدیریت کنید</p>
          </div>
          <button
            onClick={handleNewSlider}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus className="h-5 w-5" />
            اسلایدر جدید
          </button>
        </div>
      </div>

      {/* Slider Grid */}
      <div className="grid gap-6">
        {loading && sliders.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : sliders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300" dir="rtl">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">هنوز اسلایدری اضافه نشده است</p>
            <button
              onClick={handleNewSlider}
              className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
            >
              اسلایدر اول را اضافه کنید
            </button>
          </div>
        ) : (
          sliders.map((slider) => (
            <div key={slider.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-4 p-6">
                {/* Preview Image */}
                <div className="md:w-64 flex-shrink-0">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={slider.ilan_id ? slider.ilan_resim : slider.resim}
                      alt={slider.ilan_id ? slider.ilan_baslik : slider.baslik}
                      className="w-full h-full object-cover"
                    />
                    {!slider.aktif && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold bg-red-500 px-3 py-1 rounded-full text-sm">
                          غیرفعال
                        </span>
                      </div>
                    )}
                    {slider.ilan_id && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold">
                          از آگهی
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1" dir="rtl">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {slider.ilan_id ? slider.ilan_baslik : slider.baslik}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{slider.aciklama}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                        ترتیب: {slider.sira}
                      </span>
                      {slider.aktif ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                          فعال
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                          غیرفعال
                        </span>
                      )}
                    </div>
                  </div>

                  {slider.link && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <LinkIcon className="h-4 w-4" />
                      <span className="truncate">{slider.link}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(slider)}
                      className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(slider.id)}
                      className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Slider Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingSlider ? 'ویرایش اسلایدر' : 'اسلایدر جدید'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* انتخاب آگهی یا دستی */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">می‌توانید یک آگهی موجود را انتخاب کنید یا اطلاعات را دستی وارد کنید</p>
                <button
                  type="button"
                  onClick={handleOpenIlanModal}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  انتخاب از آگهی‌های موجود
                </button>
              </div>

              {formData.ilan_id && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-purple-700">
                      آگهی انتخاب شده: #{formData.ilan_id}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, ilan_id: null, baslik: '', aciklama: '', resim: '', link: ''})}
                      className="text-red-600 hover:text-red-700 text-sm font-semibold"
                    >
                      حذف انتخاب
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">عنوان</label>
                <input
                  type="text"
                  value={formData.baslik}
                  onChange={(e) => setFormData({...formData, baslik: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="عنوان اسلایدر"
                  disabled={!!formData.ilan_id}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">توضیحات</label>
                <textarea
                  value={formData.aciklama}
                  onChange={(e) => setFormData({...formData, aciklama: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="توضیحات کوتاه..."
                  disabled={!!formData.ilan_id}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">آدرس تصویر</label>
                <input
                  type="url"
                  value={formData.resim}
                  onChange={(e) => setFormData({...formData, resim: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                  disabled={!!formData.ilan_id}
                />
                {formData.resim && (
                  <div className="mt-3 relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img src={formData.resim} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">لینک</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="/arama یا https://example.com"
                  disabled={!!formData.ilan_id}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ترتیب نمایش</label>
                  <input
                    type="number"
                    value={formData.sira}
                    onChange={(e) => setFormData({...formData, sira: parseInt(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">وضعیت</label>
                  <select
                    value={formData.aktif ? 'true' : 'false'}
                    onChange={(e) => setFormData({...formData, aktif: e.target.value === 'true'})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="true">فعال</option>
                    <option value="false">غیرفعال</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingSlider(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? 'در حال ذخیره...' : editingSlider ? 'به‌روزرسانی' : 'افزودن'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ilan Selection Modal */}
      {showIlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col" dir="rtl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">انتخاب آگهی</h2>
              <button
                onClick={() => setShowIlanModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Search */}
            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={ilanSearch}
                  onChange={(e) => setIlanSearch(e.target.value)}
                  placeholder="جستجوی آگهی..."
                  className="w-full pr-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Ilanlar List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid gap-4">
                {filteredIlanlar.map((ilan) => (
                  <div
                    key={ilan.id}
                    onClick={() => handleSelectIlan(ilan)}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
                  >
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={ilan.ana_resim}
                        alt={ilan.baslik}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{ilan.baslik}</h3>
                      <p className="text-sm text-gray-600 mb-2">{ilan.kategori_ad}</p>
                      <p className="text-lg font-bold text-blue-600">{ilan.fiyat.toLocaleString()} افغانی</p>
                    </div>
                  </div>
                ))}

                {filteredIlanlar.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    هیچ آگهی یافت نشد
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
