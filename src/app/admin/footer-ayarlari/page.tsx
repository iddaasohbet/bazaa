"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  Save,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Download,
  Link as LinkIcon,
  Plus,
  X
} from "lucide-react";

interface FooterSettings {
  site_baslik: string;
  site_aciklama: string;
  copyright_metni: string;
  iletisim_adres: string;
  iletisim_telefon: string;
  iletisim_email: string;
  sosyal_facebook: string;
  sosyal_twitter: string;
  sosyal_instagram: string;
  app_baslik: string;
  app_aciklama: string;
  app_google_play_link: string;
  app_qr_url: string;
  hizli_linkler: string;
  alt_linkler: string;
}

interface Link {
  label: string;
  href: string;
}

export default function FooterAyarlariPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [hizliLinkler, setHizliLinkler] = useState<Link[]>([]);
  const [altLinkler, setAltLinkler] = useState<Link[]>([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/footer-ayarlari');
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
        
        // JSON linklerini parse et
        try {
          const hizli = JSON.parse(data.data.hizli_linkler || '[]');
          setHizliLinkler(hizli);
        } catch (e) {
          setHizliLinkler([]);
        }
        
        try {
          const alt = JSON.parse(data.data.alt_linkler || '[]');
          setAltLinkler(alt);
        } catch (e) {
          setAltLinkler([]);
        }
      }
    } catch (error) {
      console.error('Ayarlar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!settings) return;

    setSaving(true);

    try {
      const response = await fetch('/api/admin/footer-ayarlari', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          hizli_linkler: JSON.stringify(hizliLinkler),
          alt_linkler: JSON.stringify(altLinkler)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('تنظیمات footer با موفقیت ذخیره شد');
      } else {
        alert(data.message || 'خطا در ذخیره تنظیمات');
      }
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      alert('خطا در ذخیره');
    } finally {
      setSaving(false);
    }
  };

  const addHizliLink = () => {
    setHizliLinkler([...hizliLinkler, { label: '', href: '' }]);
  };

  const removeHizliLink = (index: number) => {
    setHizliLinkler(hizliLinkler.filter((_, i) => i !== index));
  };

  const updateHizliLink = (index: number, field: 'label' | 'href', value: string) => {
    const updated = [...hizliLinkler];
    updated[index][field] = value;
    setHizliLinkler(updated);
  };

  const addAltLink = () => {
    setAltLinkler([...altLinkler, { label: '', href: '' }]);
  };

  const removeAltLink = (index: number) => {
    setAltLinkler(altLinkler.filter((_, i) => i !== index));
  };

  const updateAltLink = (index: number, field: 'label' | 'href', value: string) => {
    const updated = [...altLinkler];
    updated[index][field] = value;
    setAltLinkler(updated);
  };

  if (loading || !settings) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری تنظیمات...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">تنظیمات Footer</h1>
          <p className="text-gray-600 mt-1">مدیریت محتوای پاورقی سایت</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Genel Bilgiler */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              اطلاعات عمومی
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  عنوان سایت
                </label>
                <input
                  type="text"
                  value={settings.site_baslik}
                  onChange={(e) => setSettings({ ...settings, site_baslik: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="BazaareWatan"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  توضیحات سایت
                </label>
                <textarea
                  value={settings.site_aciklama}
                  onChange={(e) => setSettings({ ...settings, site_aciklama: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="معتبرترین پلتفرم آگهی..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  متن Copyright
                </label>
                <input
                  type="text"
                  value={settings.copyright_metni}
                  onChange={(e) => setSettings({ ...settings, copyright_metni: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="آگهی های افغانستان..."
                />
              </div>
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              اطلاعات تماس
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  آدرس
                </label>
                <input
                  type="text"
                  value={settings.iletisim_adres}
                  onChange={(e) => setSettings({ ...settings, iletisim_adres: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="کابل، افغانستان"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    شماره تلفن
                  </label>
                  <input
                    type="text"
                    value={settings.iletisim_telefon}
                    onChange={(e) => setSettings({ ...settings, iletisim_telefon: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+93 700 000 000"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    ایمیل
                  </label>
                  <input
                    type="email"
                    value={settings.iletisim_email}
                    onChange={(e) => setSettings({ ...settings, iletisim_email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="info@example.com"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sosyal Medya */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">شبکه‌های اجتماعی</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-600" />
                  Facebook
                </label>
                <input
                  type="url"
                  value={settings.sosyal_facebook}
                  onChange={(e) => setSettings({ ...settings, sosyal_facebook: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://facebook.com/..."
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-blue-400" />
                  Twitter
                </label>
                <input
                  type="url"
                  value={settings.sosyal_twitter}
                  onChange={(e) => setSettings({ ...settings, sosyal_twitter: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://twitter.com/..."
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-600" />
                  Instagram
                </label>
                <input
                  type="url"
                  value={settings.sosyal_instagram}
                  onChange={(e) => setSettings({ ...settings, sosyal_instagram: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://instagram.com/..."
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Mobil Uygulama */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              تنظیمات اپلیکیشن موبایل
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  عنوان بخش اپلیکیشن
                </label>
                <input
                  type="text"
                  value={settings.app_baslik}
                  onChange={(e) => setSettings({ ...settings, app_baslik: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="اپلیکیشن موبایل ما را دانلود کنید"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  توضیحات اپلیکیشن
                </label>
                <input
                  type="text"
                  value={settings.app_aciklama}
                  onChange={(e) => setSettings({ ...settings, app_aciklama: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="آگهی ها را سریعتر کشف کنید..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  لینک Google Play
                </label>
                <input
                  type="url"
                  value={settings.app_google_play_link}
                  onChange={(e) => setSettings({ ...settings, app_google_play_link: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://play.google.com/store/apps/..."
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  لینک QR Code
                </label>
                <input
                  type="url"
                  value={settings.app_qr_url}
                  onChange={(e) => setSettings({ ...settings, app_qr_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://cihatcengiz.com"
                  dir="ltr"
                />
                <p className="text-xs text-gray-500 mt-2">QR کد به این لینک هدایت می‌شود</p>
              </div>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">لینک های سریع</h2>
              <button
                type="button"
                onClick={addHizliLink}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                افزودن لینک
              </button>
            </div>

            <div className="space-y-3">
              {hizliLinkler.map((link, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateHizliLink(index, 'label', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="عنوان لینک (مثلاً: درباره ما)"
                  />
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => updateHizliLink(index, 'href', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="مسیر (مثلاً: /hakkimizda)"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => removeHizliLink(index)}
                    className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Alt Bar Linkleri */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">لینک‌های پایین صفحه</h2>
              <button
                type="button"
                onClick={addAltLink}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                افزودن لینک
              </button>
            </div>

            <div className="space-y-3">
              {altLinkler.map((link, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateAltLink(index, 'label', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="عنوان (مثلاً: حریم خصوصی)"
                  />
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => updateAltLink(index, 'href', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="مسیر (مثلاً: /gizlilik)"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => removeAltLink(index)}
                    className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>در حال ذخیره...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>ذخیره تنظیمات</span>
              </>
            )}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}











