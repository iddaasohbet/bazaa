"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Phone, Mail, MapPin, Clock, Save, TrendingUp, Users } from "lucide-react";

interface IletisimAyarlari {
  telefon?: string;
  telefon2?: string;
  email?: string;
  email2?: string;
  adres_tr?: string;
  adres_dari?: string;
  calisma_saatleri?: Array<{ gun: string; saat: string }>;
  istatistikler?: {
    kullanicilar?: string;
    ilanlar?: string;
    destek?: string;
    cevap_suresi?: string;
  };
}

export default function IletisimAyarlariPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ayarlar, setAyarlar] = useState<IletisimAyarlari>({
    telefon: '',
    telefon2: '',
    email: '',
    email2: '',
    adres_tr: '',
    adres_dari: '',
    calisma_saatleri: [
      { gun: 'شنبه - پنج‌شنبه', saat: '08:00 - 20:00' },
      { gun: 'جمعه', saat: '10:00 - 18:00' },
      { gun: 'تعطیلات رسمی', saat: 'بسته' }
    ],
    istatistikler: {
      kullanicilar: '۱۰۰ک+',
      ilanlar: '۵۰ک+',
      destek: '۲۴/۷',
      cevap_suresi: '< ۲ ساعت'
    }
  });

  useEffect(() => {
    fetchAyarlar();
  }, []);

  const fetchAyarlar = async () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) return;

      const userData = JSON.parse(user);

      const response = await fetch('/api/admin/iletisim-ayarlari', {
        headers: {
          'x-user-id': userData.id?.toString() || ''
        }
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        setAyarlar(data.data);
      }
    } catch (error) {
      console.error('Ayarlar yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const user = localStorage.getItem('user');
      if (!user) return;

      const userData = JSON.parse(user);

      const response = await fetch('/api/admin/iletisim-ayarlari', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userData.id?.toString() || ''
        },
        body: JSON.stringify(ayarlar)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ تنظیمات با موفقیت ذخیره شد');
      } else {
        alert('❌ خطا: ' + data.message);
      }
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      alert('❌ خطا در ذخیره‌سازی');
    } finally {
      setSaving(false);
    }
  };

  const updateCalisma = (index: number, field: 'gun' | 'saat', value: string) => {
    const newCalisma = [...(ayarlar.calisma_saatleri || [])];
    newCalisma[index] = { ...newCalisma[index], [field]: value };
    setAyarlar({ ...ayarlar, calisma_saatleri: newCalisma });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تنظیمات تماس</h1>
            <p className="text-gray-600 mt-1">مدیریت اطلاعات تماس در صفحه تماس</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>در حال ذخیره...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>ذخیره تغییرات</span>
              </>
            )}
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* تماس با ما */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">اطلاعات تماس</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  تلفن اصلی *
                </label>
                <input
                  type="text"
                  value={ayarlar.telefon || ''}
                  onChange={(e) => setAyarlar({ ...ayarlar, telefon: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="+93 700 000 000"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  تلفن دوم
                </label>
                <input
                  type="text"
                  value={ayarlar.telefon2 || ''}
                  onChange={(e) => setAyarlar({ ...ayarlar, telefon2: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="+93 700 000 001"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ایمیل اصلی *
                </label>
                <input
                  type="email"
                  value={ayarlar.email || ''}
                  onChange={(e) => setAyarlar({ ...ayarlar, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="info@bazaarewatan.com"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ایمیل دوم
                </label>
                <input
                  type="email"
                  value={ayarlar.email2 || ''}
                  onChange={(e) => setAyarlar({ ...ayarlar, email2: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="support@bazaarewatan.com"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* آدرس */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">آدرس</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  آدرس (فارسی/دری) *
                </label>
                <input
                  type="text"
                  value={ayarlar.adres_dari || ''}
                  onChange={(e) => setAyarlar({ ...ayarlar, adres_dari: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="کابل، افغانستان"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  آدرس (ترکی/انگلیسی)
                </label>
                <input
                  type="text"
                  value={ayarlar.adres_tr || ''}
                  onChange={(e) => setAyarlar({ ...ayarlar, adres_tr: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Kabul, Afghanistan"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ساعات کاری */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">ساعات کاری</h2>
          </div>

          <div className="space-y-3">
            {ayarlar.calisma_saatleri?.map((saat, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    روز
                  </label>
                  <input
                    type="text"
                    value={saat.gun}
                    onChange={(e) => updateCalisma(index, 'gun', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="شنبه - پنج‌شنبه"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    ساعت
                  </label>
                  <input
                    type="text"
                    value={saat.saat}
                    onChange={(e) => updateCalisma(index, 'saat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="08:00 - 20:00"
                    dir="ltr"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* آمار */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">آمار و اطلاعات</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                تعداد کاربران فعال
              </label>
              <input
                type="text"
                value={ayarlar.istatistikler?.kullanicilar || ''}
                onChange={(e) => setAyarlar({
                  ...ayarlar,
                  istatistikler: { ...ayarlar.istatistikler, kullanicilar: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="۱۰۰ک+"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                تعداد آگهی‌های فعال
              </label>
              <input
                type="text"
                value={ayarlar.istatistikler?.ilanlar || ''}
                onChange={(e) => setAyarlar({
                  ...ayarlar,
                  istatistikler: { ...ayarlar.istatistikler, ilanlar: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="۵۰ک+"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                پشتیبانی
              </label>
              <input
                type="text"
                value={ayarlar.istatistikler?.destek || ''}
                onChange={(e) => setAyarlar({
                  ...ayarlar,
                  istatistikler: { ...ayarlar.istatistikler, destek: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="۲۴/۷"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                زمان پاسخ
              </label>
              <input
                type="text"
                value={ayarlar.istatistikler?.cevap_suresi || ''}
                onChange={(e) => setAyarlar({
                  ...ayarlar,
                  istatistikler: { ...ayarlar.istatistikler, cevap_suresi: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="< ۲ ساعت"
              />
            </div>
          </div>
        </div>

        {/* Kaydet Butonu */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-bold transition-all disabled:opacity-50 shadow-lg"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>در حال ذخیره...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>ذخیره همه تغییرات</span>
              </>
            )}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

