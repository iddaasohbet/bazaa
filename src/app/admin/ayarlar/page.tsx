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
  CheckCircle2
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
  const [activeTab, setActiveTab] = useState('genel');

  useEffect(() => {
    fetchAyarlar();
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

  const handleChange = (anahtar: string, yeniDeger: string) => {
    setAyarlar(prev => prev.map(ayar => 
      ayar.anahtar === anahtar ? { ...ayar, deger: yeniDeger } : ayar
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
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
        setMessage({ type: 'success', text: 'Ayarlar başarıyla kaydedildi!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Bir hata oluştu' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ayarlar kaydedilirken hata oluştu' });
    } finally {
      setSaving(false);
    }
  };

  const getAyarByKey = (anahtar: string): string => {
    return ayarlar.find(a => a.anahtar === anahtar)?.deger || '';
  };

  const kategoriler = [
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
          <span className="text-sm text-gray-600">{ayar.aciklama}</span>
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
          placeholder={ayar.aciklama}
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
          placeholder={ayar.aciklama}
        />
      );
    }

    return (
      <input
        type="text"
        value={ayar.deger}
        onChange={(e) => handleChange(ayar.anahtar, e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={ayar.aciklama}
      />
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Ayarlar yükleniyor...</p>
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
          <div className="space-y-6">
            {ayarlar
              .filter(ayar => ayar.kategori === activeTab)
              .map((ayar) => (
                <div key={ayar.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <label className="block mb-2">
                    <span className="text-sm font-medium text-gray-700">{ayar.aciklama}</span>
                    <span className="text-xs text-gray-500 ml-2">({ayar.anahtar})</span>
                  </label>
                  {renderAyarInput(ayar)}
                </div>
              ))}

            {ayarlar.filter(ayar => ayar.kategori === activeTab).length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Settings className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Bu kategoride ayar bulunmuyor</p>
              </div>
            )}
          </div>
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

