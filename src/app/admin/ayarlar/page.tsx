"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Settings,
  Database,
  AtSign,
  Key,
  AlertCircle,
  CheckCircle2,
  Upload,
  Image as ImageIcon
} from "lucide-react";

interface Ayar {
  id: number;
  anahtar: string;
  deger: string;
  kategori: string;
  aciklama: string;
}

export default function AyarlarPage() {
  const [ayarlar, setAyarlar] = useState<Ayar[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [activeTab, setActiveTab] = useState('logo');
  const [headerLogo, setHeaderLogo] = useState<string>('');
  const [footerLogo, setFooterLogo] = useState<string>('');
  const [headerLogoPreview, setHeaderLogoPreview] = useState<string>('');
  const [footerLogoPreview, setFooterLogoPreview] = useState<string>('');

  useEffect(() => {
    fetchAyarlar();
    fetchLogos();
  }, []);

  const fetchAyarlar = async () => {
    try {
      const response = await fetch('/api/admin/ayarlar');
      const data = await response.json();
      
      if (data.success) {
        setAyarlar(data.data);
      }
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogos = async () => {
    try {
      const response = await fetch('/api/admin/logo');
      const data = await response.json();
      
      if (data.success) {
        const { header_logo, footer_logo } = data.data;
        if (header_logo) {
          setHeaderLogo(header_logo);
          setHeaderLogoPreview(header_logo);
        }
        if (footer_logo) {
          setFooterLogo(footer_logo);
          setFooterLogoPreview(footer_logo);
        }
      }
    } catch (error) {
      console.error('Logolar yüklenirken hata:', error);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'header' | 'footer') => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('📤 Upload: Dosya seçildi -', file.name, '- Boyut:', file.size, 'bytes');
      
      // Dosya boyutu kontrolü (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        console.log('❌ Upload: Dosya çok büyük');
        setMessage({ type: 'error', text: 'فایل خیلی بزرگ است! حداکثر ۲ مگابایت' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        console.log('✅ Upload: Base64 hazır -', type, '- Uzunluk:', base64String.length);
        if (type === 'header') {
          setHeaderLogo(base64String);
          setHeaderLogoPreview(base64String);
        } else {
          setFooterLogo(base64String);
          setFooterLogoPreview(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (anahtar: string, yeniDeger: string) => {
    setAyarlar(prev => prev.map(ayar => 
      ayar.anahtar === anahtar ? { ...ayar, deger: yeniDeger } : ayar
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      console.log('💾 Kaydet: Logo kaydetme başladı');
      console.log('📏 Kaydet: Header logo uzunluk:', headerLogo.length);
      console.log('📏 Kaydet: Footer logo uzunluk:', footerLogo.length);
      
      // Logoları API'ye kaydet
      const logoResponse = await fetch('/api/admin/logo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          header_logo: headerLogo,
          footer_logo: footerLogo
        }),
      });

      const logoData = await logoResponse.json();
      console.log('📥 Kaydet: API yanıtı:', logoData);
      
      if (!logoData.success) {
        setMessage({ type: 'error', text: 'Logolar kaydedilemedi' });
        setSaving(false);
        return;
      }

      // Diğer ayarları kaydet
      const response = await fetch('/api/admin/ayarlar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ayarlar: ayarlar.map(a => ({ anahtar: a.anahtar, deger: a.deger }))
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'تنظیمات و لوگوها با موفقیت ذخیره شدند!' });
        // Header ve Footer'ı güncelle
        window.dispatchEvent(new Event('logoUpdated'));
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Bir hata oluştu' });
      }
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      setMessage({ type: 'error', text: 'Ayarlar kaydedilirken hata oluştu' });
    } finally {
      setSaving(false);
    }
  };

  const getAyarByKey = (anahtar: string): string => {
    return ayarlar.find(a => a.anahtar === anahtar)?.deger || '';
  };

  // Ayar açıklamalarını Dari/Pashto'ya çevir
  const getAyarLabel = (anahtar: string): string => {
    const labels: { [key: string]: string } = {
      'site_adi': 'د سایټ نوم',
      'site_slogan': 'د سایټ شعار',
      'site_aciklama': 'د سایټ تفصیل',
      'site_anahtar_kelimeler': 'SEO کلیدي کلمې',
      'site_email': 'بریښنالیک پته',
      'site_telefon': 'ټیلیفون شمیره',
      'site_adres': 'پته',
      'facebook_url': 'فیسبوک لینک',
      'twitter_url': 'ټویټر لینک',
      'instagram_url': 'انستاګرام لینک',
      'youtube_url': 'یوټیوب لینک',
      'ilan_onay_gerektir': 'اعلان تایید ته اړتیا لري؟ (0: نه، 1: هو)',
      'kayit_aktif': 'د کارونکي ثبت فعال دی؟ (0: نه، 1: هو)',
      'magaza_acma_aktif': 'دوکان جوړول فعال دی؟ (0: نه، 1: هو)',
      'varsayilan_ilan_suresi': 'د اعلان ډیفالټ موده (ورځې)',
      'maksimum_resim_sayisi': 'د اعلان لپاره اعظمي عکسونه',
      'google_analytics_id': 'Google Analytics ID',
      'google_maps_api_key': 'Google Maps API Key',
      'smtp_host': 'SMTP سرور',
      'smtp_port': 'SMTP پورټ',
      'smtp_kullanici': 'SMTP کارونکی',
      'smtp_sifre': 'SMTP پټنوم',
      'bakim_modu': 'د ساتنې حالت فعال دی؟ (0: نه، 1: هو)',
      'bakim_mesaji': 'د ساتنې پیغام'
    };
    return labels[anahtar] || anahtar;
  };

  const kategoriler = [
    { key: 'logo', label: 'لوگوها', icon: ImageIcon },
    { key: 'genel', label: 'عمومی تنظیمات', icon: Globe },
    { key: 'iletisim', label: 'د اړیکو معلومات', icon: Mail },
    { key: 'sosyal_medya', label: 'ټولنیز رسنۍ', icon: AtSign },
    { key: 'sistem', label: 'سیستم', icon: Settings },
    { key: 'entegrasyon', label: 'ادغام', icon: Database },
    { key: 'email', label: 'بریښنالیک', icon: Mail },
  ];

  const renderAyarInput = (ayar: Ayar) => {
    const isBoolean = ['0', '1'].includes(ayar.deger) && 
                      (ayar.anahtar.includes('aktif') || ayar.anahtar.includes('gerektir') || ayar.anahtar.includes('modu'));

    if (isBoolean) {
      return (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={ayar.deger === '1'}
            onChange={(e) => handleChange(ayar.anahtar, e.target.checked ? '1' : '0')}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">{getAyarLabel(ayar.anahtar)}</span>
        </label>
      );
    }

    if (ayar.anahtar.includes('sifre') || ayar.anahtar.includes('password')) {
      return (
        <input
          type="password"
          value={ayar.deger}
          onChange={(e) => handleChange(ayar.anahtar, e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={getAyarLabel(ayar.anahtar)}
        />
      );
    }

    if (ayar.anahtar.includes('mesaj') || ayar.anahtar.includes('aciklama')) {
      return (
        <textarea
          value={ayar.deger}
          onChange={(e) => handleChange(ayar.anahtar, e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={getAyarLabel(ayar.anahtar)}
        />
      );
    }

    return (
      <input
        type="text"
        value={ayar.deger}
        onChange={(e) => handleChange(ayar.anahtar, e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={getAyarLabel(ayar.anahtar)}
      />
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">بارول...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">تنظیمات</h1>
            <p className="text-gray-600">د سیستم عمومی تنظیمات او تشکیلات</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>خوندی کول...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>خوندی کړئ</span>
              </>
            )}
          </button>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200">
          {kategoriler.map((kat) => {
            const Icon = kat.icon;
            return (
              <button
                key={kat.key}
                onClick={() => setActiveTab(kat.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === kat.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{kat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div className="p-6">
          {/* Logo Yönetimi */}
          {activeTab === 'logo' && (
            <div className="space-y-8" dir="rtl">
              {/* Header Logo */}
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  لوگوی Header (سرصفحه)
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-6">
                    {/* Preview */}
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white overflow-hidden">
                        {headerLogoPreview ? (
                          <img src={headerLogoPreview} alt="Header Logo" className="w-full h-full object-contain p-2" />
                        ) : (
                          <div className="text-center">
                            <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">بدون لوگو</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upload Button */}
                    <div className="flex-1">
                      <label className="cursor-pointer">
                        <div className="border-2 border-blue-300 border-dashed rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50 transition-all">
                          <div className="flex items-center justify-center gap-3">
                            <Upload className="h-6 w-6 text-blue-600" />
                            <div className="text-center">
                              <p className="text-sm font-medium text-gray-900">برای آپلود لوگو کلیک کنید</p>
                              <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG (حداکثر ۲MB)</p>
                            </div>
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLogoUpload(e, 'header')}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-600 mt-2">توصیه: ابعاد ۱۸۰×۶۰ پیکسل</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Logo */}
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  لوگوی Footer (پاورقی)
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-6">
                    {/* Preview */}
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white overflow-hidden">
                        {footerLogoPreview ? (
                          <img src={footerLogoPreview} alt="Footer Logo" className="w-full h-full object-contain p-2" />
                        ) : (
                          <div className="text-center">
                            <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">بدون لوگو</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upload Button */}
                    <div className="flex-1">
                      <label className="cursor-pointer">
                        <div className="border-2 border-blue-300 border-dashed rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50 transition-all">
                          <div className="flex items-center justify-center gap-3">
                            <Upload className="h-6 w-6 text-blue-600" />
                            <div className="text-center">
                              <p className="text-sm font-medium text-gray-900">برای آپلود لوگو کلیک کنید</p>
                              <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG (حداکثر ۲MB)</p>
                            </div>
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLogoUpload(e, 'footer')}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-600 mt-2">توصیه: ابعاد ۱۸۰×۶۰ پیکسل</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold text-gray-900 mb-1">نکته</p>
                    <ul className="space-y-1 text-gray-600">
                      <li>• پس از آپلود لوگو، حتماً دکمه "خوندی کړئ" را بزنید</li>
                      <li>• فرمت‌های PNG و SVG برای کیفیت بهتر توصیه می‌شوند</li>
                      <li>• لوگو با پس‌زمینه شفاف بهتر است</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Diğer Ayarlar */}
          {activeTab !== 'logo' && (
            <div className="space-y-6">
              {ayarlar
                .filter(ayar => ayar.kategori === activeTab)
                .map((ayar) => (
                  <div key={ayar.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                    <label className="block mb-2">
                      <span className="text-sm font-medium text-gray-700">{getAyarLabel(ayar.anahtar)}</span>
                      <span className="text-xs text-gray-500 ml-2">({ayar.anahtar})</span>
                    </label>
                    {renderAyarInput(ayar)}
                  </div>
                ))}

              {ayarlar.filter(ayar => ayar.kategori === activeTab).length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>په دې کټګورۍ کې تنظیمات نشته</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Save Button - Bottom */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 shadow-lg"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>خوندی کول...</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>بدلونونه خوندی کړئ</span>
            </>
          )}
        </button>
      </div>
    </AdminLayout>
  );
}

