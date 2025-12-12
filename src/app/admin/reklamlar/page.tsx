"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Edit, Trash2, Tag, Eye, Calendar, ExternalLink, Image as ImageIcon } from "lucide-react";

interface Reklam {
  id: number;
  baslik: string;
  aciklama: string;
  resim: string;
  link: string;
  konum: string;
  goruntulenme: number;
  tiklanma: number;
  aktif: boolean;
  baslangic: string;
  bitis: string;
  created_at: string;
}

export default function AdminReklamlarPage() {
  const [reklamlar, setReklamlar] = useState<Reklam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReklam, setEditingReklam] = useState<Reklam | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    baslik: '',
    aciklama: '',
    resim: '',
    link: '',
    konum: 'header',
    baslangic: '',
    bitis: '',
    aktif: true
  });

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
      console.error('Reklam yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = '/api/admin/reklamlar';
      const method = editingReklam ? 'PUT' : 'POST';
      const body = editingReklam 
        ? { ...formData, id: editingReklam.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(editingReklam ? '✅ تبلیغ به‌روزرسانی شد' : '✅ تبلیغ اضافه شد');
        setShowModal(false);
        setEditingReklam(null);
        resetForm();
        fetchReklamlar();
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

  const handleEdit = (reklam: Reklam) => {
    setEditingReklam(reklam);
    setFormData({
      baslik: reklam.baslik,
      aciklama: reklam.aciklama,
      resim: reklam.resim,
      link: reklam.link,
      konum: reklam.konum,
      baslangic: reklam.baslangic?.split('T')[0] || '',
      bitis: reklam.bitis?.split('T')[0] || '',
      aktif: reklam.aktif
    });
    setImagePreview(reklam.resim);
    setShowModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Boyut kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم فایل باید کمتر از 5 مگابایت باشد');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFormData({ ...formData, resim: base64 });
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این تبلیغ را حذف کنید؟')) return;

    try {
      const response = await fetch(`/api/admin/reklamlar?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ تبلیغ حذف شد');
        fetchReklamlar();
      } else {
        alert('❌ خطا: ' + data.message);
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('❌ خطا در حذف');
    }
  };

  const resetForm = () => {
    setFormData({
      baslik: '',
      aciklama: '',
      resim: '',
      link: '',
      konum: 'header',
      baslangic: '',
      bitis: '',
      aktif: true
    });
    setImagePreview("");
  };

  const handleNewReklam = () => {
    setEditingReklam(null);
    resetForm();
    setShowModal(true);
  };

  const getKonumBadge = (konum: string) => {
    const badges: any = {
      header: { text: 'هدر', color: 'bg-blue-100 text-blue-700' },
      sidebar: { text: 'سایدبار', color: 'bg-green-100 text-green-700' },
      footer: { text: 'فوتر', color: 'bg-purple-100 text-purple-700' }
    };
    const badge = badges[konum] || badges.header;
    return <span className={`${badge.color} px-2 py-1 rounded text-xs font-bold`}>{badge.text}</span>;
  };

  return (
    <AdminLayout>
      <div className="mb-8" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مدیریت تبلیغات</h1>
            <p className="mt-2 text-gray-600">تبلیغات سایت را مدیریت کنید</p>
          </div>
          <button
            onClick={handleNewReklam}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus className="h-5 w-5" />
            تبلیغ جدید
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600">کل تبلیغات</div>
            <div className="text-2xl font-bold text-gray-900">{reklamlar.length}</div>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-4">
            <div className="text-sm text-green-600">فعال</div>
            <div className="text-2xl font-bold text-green-700">{reklamlar.filter(r => r.aktif).length}</div>
          </div>
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <div className="text-sm text-blue-600">کل نمایش</div>
            <div className="text-2xl font-bold text-blue-700">{reklamlar.reduce((sum, r) => sum + r.goruntulenme, 0)}</div>
          </div>
          <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
            <div className="text-sm text-purple-600">کل کلیک</div>
            <div className="text-2xl font-bold text-purple-700">{reklamlar.reduce((sum, r) => sum + r.tiklanma, 0)}</div>
          </div>
        </div>
      </div>

      {loading && reklamlar.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : reklamlar.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300" dir="rtl">
          <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">هنوز تبلیغی اضافه نشده است</p>
          <button
            onClick={handleNewReklam}
            className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
          >
            اولین تبلیغ را اضافه کنید
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {reklamlar.map((reklam) => (
            <div key={reklam.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-4 p-6">
                {/* Image */}
                <div className="md:w-64 flex-shrink-0">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={reklam.resim}
                      alt={reklam.baslik}
                      className="w-full h-full object-cover"
                    />
                    {!reklam.aktif && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold bg-red-500 px-3 py-1 rounded-full text-sm">
                          غیرفعال
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1" dir="rtl">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{reklam.baslik}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">{reklam.aciklama}</p>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {getKonumBadge(reklam.konum)}
                        {reklam.aktif ? (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">فعال</span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">غیرفعال</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {reklam.link && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <ExternalLink className="h-4 w-4" />
                      <span className="truncate">{reklam.link}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Eye className="h-4 w-4" />
                      <span>{reklam.goruntulenme} نمایش</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Tag className="h-4 w-4" />
                      <span>{reklam.tiklanma} کلیک</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>از {new Date(reklam.baslangic).toLocaleDateString('fa-IR')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>تا {new Date(reklam.bitis).toLocaleDateString('fa-IR')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(reklam)}
                      className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(reklam.id)}
                      className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingReklam ? 'ویرایش تبلیغ' : 'تبلیغ جدید'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">عنوان *</label>
                <input
                  type="text"
                  required
                  value={formData.baslik}
                  onChange={(e) => setFormData({...formData, baslik: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="عنوان تبلیغ"
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
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">تصویر تبلیغ *</label>
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="reklamResim"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="reklamResim" className="cursor-pointer">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-700 font-medium mb-1">برای آپلود تصویر کلیک کنید</p>
                    <p className="text-xs text-gray-500">PNG, JPG (حداکثر 5MB)</p>
                  </label>
                </div>

                {/* Preview */}
                {imagePreview && (
                  <div className="mt-3">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                      <img src={imagePreview} alt="پیش‌نمایش" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, resim: '' });
                          setImagePreview('');
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* یا URL وارد کنید */}
                <div className="mt-3">
                  <details className="text-sm">
                    <summary className="cursor-pointer text-gray-600 hover:text-gray-900 font-medium">یا آدرس تصویر (URL) وارد کنید</summary>
                    <input
                      type="url"
                      value={formData.resim.startsWith('http') ? formData.resim : ''}
                      onChange={(e) => {
                        setFormData({...formData, resim: e.target.value});
                        setImagePreview(e.target.value);
                      }}
                      className="w-full mt-2 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </details>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">لینک</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="/arama یا https://example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">موقعیت</label>
                  <select
                    value={formData.konum}
                    onChange={(e) => setFormData({...formData, konum: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="header">هدر</option>
                    <option value="sidebar">سایدبار</option>
                    <option value="footer">فوتر</option>
                  </select>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">تاریخ شروع</label>
                  <input
                    type="date"
                    value={formData.baslangic}
                    onChange={(e) => setFormData({...formData, baslangic: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">تاریخ پایان</label>
                  <input
                    type="date"
                    value={formData.bitis}
                    onChange={(e) => setFormData({...formData, bitis: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingReklam(null);
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
                  {loading ? 'در حال ذخیره...' : editingReklam ? 'به‌روزرسانی' : 'افزودن'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
