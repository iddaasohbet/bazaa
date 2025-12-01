"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { FileText, Save, Eye, EyeOff } from "lucide-react";

interface Sayfa {
  id: number;
  slug: string;
  baslik: string;
  baslik_dari: string;
  icerik: string;
  aktif: boolean;
}

export default function SayfalarYonetimi() {
  const router = useRouter();
  const [sayfalar, setSayfalar] = useState<Sayfa[]>([]);
  const [selectedSayfa, setSelectedSayfa] = useState<Sayfa | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSayfalar();
  }, []);

  const fetchSayfalar = async () => {
    try {
      const response = await fetch('/api/admin/sayfalar');
      const data = await response.json();
      if (data.success) {
        setSayfalar(data.data);
        if (data.data.length > 0) {
          setSelectedSayfa(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Sayfa yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedSayfa) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/admin/sayfalar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedSayfa)
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ صفحه با موفقیت ذخیره شد!');
        fetchSayfalar();
      } else {
        alert('❌ خطا در ذخیره صفحه');
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('❌ خطا در ذخیره صفحه');
    } finally {
      setSaving(false);
    }
  };

  const getSayfaIcon = (slug: string) => {
    switch(slug) {
      case 'sss': return '❓';
      case 'hakkimizda': return 'ℹ️';
      case 'guvenli-alisveris': return '🛡️';
      case 'nasil-calisir': return '⚙️';
      default: return '📄';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">بارگذاری...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">مدیریت صفحات</h1>
        <p className="text-gray-600">ویرایش محتوای صفحات اطلاعاتی</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sayfa Listesi */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-bold text-gray-900 mb-4">صفحات</h3>
            <div className="space-y-2">
              {sayfalar.map((sayfa) => (
                <button
                  key={sayfa.id}
                  onClick={() => setSelectedSayfa(sayfa)}
                  className={`w-full text-right px-4 py-3 rounded-lg transition-all ${
                    selectedSayfa?.id === sayfa.id
                      ? 'bg-blue-50 border-2 border-blue-500 text-blue-700'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getSayfaIcon(sayfa.slug)}</span>
                    <div className="flex-1">
                      <div className="font-semibold">{sayfa.baslik_dari}</div>
                      <div className="text-xs text-gray-500">{sayfa.slug}</div>
                    </div>
                    {sayfa.aktif ? (
                      <Eye className="h-4 w-4 text-green-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Düzenleme Formu */}
        <div className="lg:col-span-3">
          {selectedSayfa ? (
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Header */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{getSayfaIcon(selectedSayfa.slug)}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedSayfa.baslik_dari}</h2>
                      <p className="text-sm text-gray-500">/{selectedSayfa.slug}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                  >
                    <Save className="h-5 w-5" />
                    {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="p-6 space-y-6">
                {/* Başlıklar */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      عنوان فارسی
                    </label>
                    <input
                      type="text"
                      value={selectedSayfa.baslik_dari}
                      onChange={(e) => setSelectedSayfa({...selectedSayfa, baslik_dari: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Başlık (Türkçe)
                    </label>
                    <input
                      type="text"
                      value={selectedSayfa.baslik}
                      onChange={(e) => setSelectedSayfa({...selectedSayfa, baslik: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* İçerik */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    محتوای صفحه (HTML)
                  </label>
                  <textarea
                    value={selectedSayfa.icerik}
                    onChange={(e) => setSelectedSayfa({...selectedSayfa, icerik: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    rows={20}
                    dir="rtl"
                    placeholder="HTML محتوای صفحه را اینجا بنویسید..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    می‌توانید از HTML استفاده کنید. مثال: &lt;h2&gt;عنوان&lt;/h2&gt; &lt;p&gt;متن&lt;/p&gt;
                  </p>
                </div>

                {/* Aktif/Pasif */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="aktif"
                    checked={selectedSayfa.aktif}
                    onChange={(e) => setSelectedSayfa({...selectedSayfa, aktif: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="aktif" className="text-sm font-medium text-gray-700">
                    صفحه فعال است
                  </label>
                </div>

                {/* Bilgi Kutusu */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold text-gray-900 mb-1">نکته:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• تغییرات بلافاصله در سایت اعمال می‌شود</li>
                        <li>• برای نمایش بهتر از HTML استفاده کنید</li>
                        <li>• برای غیرفعال کردن صفحه، تیک "فعال" را بردارید</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">یک صفحه را برای ویرایش انتخاب کنید</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}



