"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Edit, Trash2, Package, DollarSign, Users, Calendar } from "lucide-react";

interface Paket {
  id: number;
  ad: string;
  ad_dari: string;
  store_level: string;
  sure_ay: number;
  fiyat: number;
  product_limit: number;
  category_limit: number;
  aktif: boolean;
  created_at: string;
}

export default function AdminPaketlerPage() {
  const [paketler, setPaketler] = useState<Paket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPaket, setEditingPaket] = useState<Paket | null>(null);
  const [formData, setFormData] = useState({
    ad: '',
    ad_dari: '',
    store_level: 'basic',
    sure_ay: 1,
    fiyat: 0,
    product_limit: 50,
    category_limit: 1,
    aktif: true
  });

  useEffect(() => {
    fetchPaketler();
  }, []);

  const fetchPaketler = async () => {
    try {
      const response = await fetch('/api/admin/paketler');
      const data = await response.json();
      if (data.success) {
        setPaketler(data.data);
      }
    } catch (error) {
      console.error('Paket yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = '/api/admin/paketler';
      const method = editingPaket ? 'PUT' : 'POST';
      const body = editingPaket 
        ? { ...formData, id: editingPaket.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(editingPaket ? '✅ پکیج به‌روزرسانی شد' : '✅ پکیج اضافه شد');
        setShowModal(false);
        setEditingPaket(null);
        resetForm();
        fetchPaketler();
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

  const handleEdit = (paket: Paket) => {
    setEditingPaket(paket);
    setFormData({
      ad: paket.ad,
      ad_dari: paket.ad_dari,
      store_level: paket.store_level,
      sure_ay: paket.sure_ay,
      fiyat: paket.fiyat,
      product_limit: paket.product_limit,
      category_limit: paket.category_limit,
      aktif: paket.aktif
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این پکیج را حذف کنید؟')) return;

    try {
      const response = await fetch(`/api/admin/paketler?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ پکیج حذف شد');
        fetchPaketler();
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
      ad: '',
      ad_dari: '',
      store_level: 'basic',
      sure_ay: 1,
      fiyat: 0,
      product_limit: 50,
      category_limit: 1,
      aktif: true
    });
  };

  const handleNewPaket = () => {
    setEditingPaket(null);
    resetForm();
    setShowModal(true);
  };

  const getLevelBadge = (level: string) => {
    const badges: any = {
      basic: { text: 'عادی', color: 'bg-gray-100 text-gray-700' },
      pro: { text: 'پرو', color: 'bg-blue-100 text-blue-700' },
      elite: { text: 'پریمیوم', color: 'bg-yellow-100 text-yellow-700' }
    };
    const badge = badges[level] || badges.basic;
    return <span className={`${badge.color} px-3 py-1 rounded-full text-sm font-bold`}>{badge.text}</span>;
  };

  const basicPaketler = paketler.filter(p => p.store_level === 'basic');
  const proPaketler = paketler.filter(p => p.store_level === 'pro');
  const elitePaketler = paketler.filter(p => p.store_level === 'elite');

  return (
    <AdminLayout>
      <div className="mb-8" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مدیریت پکیج‌ها</h1>
            <p className="mt-2 text-gray-600">پکیج‌های مغازه را مدیریت کنید</p>
          </div>
          <button
            onClick={handleNewPaket}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus className="h-5 w-5" />
            پکیج جدید
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600">کل پکیج‌ها</div>
            <div className="text-2xl font-bold text-gray-900">{paketler.length}</div>
          </div>
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600">پکیج عادی</div>
            <div className="text-2xl font-bold text-gray-700">{basicPaketler.length}</div>
          </div>
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <div className="text-sm text-blue-600">پکیج پرو</div>
            <div className="text-2xl font-bold text-blue-700">{proPaketler.length}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
            <div className="text-sm text-yellow-600">پکیج پریمیوم</div>
            <div className="text-2xl font-bold text-yellow-700">{elitePaketler.length}</div>
          </div>
        </div>
      </div>

      {loading && paketler.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : paketler.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300" dir="rtl">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">هنوز پکیجی اضافه نشده است</p>
          <button
            onClick={handleNewPaket}
            className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
          >
            اولین پکیج را اضافه کنید
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Basic Packages */}
          {basicPaketler.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4" dir="rtl">پکیج‌های عادی</h2>
              <div className="grid gap-4">
                {basicPaketler.map((paket) => (
                  <PaketCard key={paket.id} paket={paket} onEdit={handleEdit} onDelete={handleDelete} getLevelBadge={getLevelBadge} />
                ))}
              </div>
            </div>
          )}

          {/* Pro Packages */}
          {proPaketler.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4" dir="rtl">پکیج‌های پرو</h2>
              <div className="grid gap-4">
                {proPaketler.map((paket) => (
                  <PaketCard key={paket.id} paket={paket} onEdit={handleEdit} onDelete={handleDelete} getLevelBadge={getLevelBadge} />
                ))}
              </div>
            </div>
          )}

          {/* Elite Packages */}
          {elitePaketler.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4" dir="rtl">پکیج‌های پریمیوم</h2>
              <div className="grid gap-4">
                {elitePaketler.map((paket) => (
                  <PaketCard key={paket.id} paket={paket} onEdit={handleEdit} onDelete={handleDelete} getLevelBadge={getLevelBadge} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPaket ? 'ویرایش پکیج' : 'پکیج جدید'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">نام (انگلیسی) *</label>
                  <input
                    type="text"
                    required
                    value={formData.ad}
                    onChange={(e) => setFormData({...formData, ad: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Pro Store"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">نام (دری) *</label>
                  <input
                    type="text"
                    required
                    value={formData.ad_dari}
                    onChange={(e) => setFormData({...formData, ad_dari: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="بسته پرو"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">سطح پکیج *</label>
                  <select
                    value={formData.store_level}
                    onChange={(e) => setFormData({...formData, store_level: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="basic">عادی</option>
                    <option value="pro">پرو</option>
                    <option value="elite">پریمیوم</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">مدت زمان (ماه) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.sure_ay}
                    onChange={(e) => setFormData({...formData, sure_ay: parseInt(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">قیمت (افغانی) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.fiyat}
                  onChange={(e) => setFormData({...formData, fiyat: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">محدودیت محصول *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.product_limit}
                    onChange={(e) => setFormData({...formData, product_limit: parseInt(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">محدودیت دسته‌بندی *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.category_limit}
                    onChange={(e) => setFormData({...formData, category_limit: parseInt(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
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

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPaket(null);
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
                  {loading ? 'در حال ذخیره...' : editingPaket ? 'به‌روزرسانی' : 'افزودن'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function PaketCard({ paket, onEdit, onDelete, getLevelBadge }: any) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4" dir="rtl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{paket.ad_dari}</h3>
            {getLevelBadge(paket.store_level)}
            {paket.aktif ? (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">فعال</span>
            ) : (
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">غیرفعال</span>
            )}
          </div>
          <p className="text-gray-600 text-sm">{paket.ad}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{paket.fiyat.toLocaleString()} <span className="text-sm">افغانی</span></div>
          <div className="text-sm text-gray-600">{paket.sure_ay} ماهه</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 text-sm" dir="rtl">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-gray-600 mb-1">محصولات</div>
          <div className="font-bold text-gray-900">{paket.product_limit === 999999 ? 'نامحدود' : paket.product_limit}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-gray-600 mb-1">دسته‌بندی</div>
          <div className="font-bold text-gray-900">{paket.category_limit === 999 ? 'نامحدود' : paket.category_limit}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-gray-600 mb-1">مدت</div>
          <div className="font-bold text-gray-900">{paket.sure_ay} ماه</div>
        </div>
      </div>

      <div className="flex items-center gap-2" dir="rtl">
        <button
          onClick={() => onEdit(paket)}
          className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Edit className="h-4 w-4" />
          ویرایش
        </button>
        <button
          onClick={() => onDelete(paket.id)}
          className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          حذف
        </button>
      </div>
    </div>
  );
}





