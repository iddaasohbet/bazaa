"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { 
  Store, 
  Save, 
  Search,
  User,
  Package,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Gift,
  Crown
} from "lucide-react";

interface Kullanici {
  id: number;
  ad: string;
  email: string;
  telefon: string;
}

interface Paket {
  id: number;
  ad: string;
  fiyat: number;
  sure: number;
  ozellikler: string;
}

export default function MagazaOlusturPage() {
  const [kullanicilar, setKullanicilar] = useState<Kullanici[]>([]);
  const [paketler, setPaketler] = useState<Paket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [formData, setFormData] = useState({
    kullanici_id: "",
    magaza_adi: "",
    aciklama: "",
    adres: "",
    telefon: "",
    logo: "",
    kapak_resmi: "",
    paket_id: "",
    ucretsiz: true,
    aktif: true
  });

  useEffect(() => {
    fetchKullanicilar();
    fetchPaketler();
  }, []);

  const fetchKullanicilar = async () => {
    try {
      const response = await fetch('/api/admin/kullanicilar');
      const data = await response.json();
      if (data.success) {
        setKullanicilar(data.data);
      }
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
    }
  };

  const fetchPaketler = async () => {
    try {
      const response = await fetch('/api/admin/paketler');
      const data = await response.json();
      if (data.success) {
        setPaketler(data.data);
      }
    } catch (error) {
      console.error('Paketler yüklenirken hata:', error);
    }
  };

  const handleKullaniciSelect = (kullanici: Kullanici) => {
    setFormData({
      ...formData,
      kullanici_id: kullanici.id.toString(),
      magaza_adi: `${kullanici.ad} دوکان`,
      telefon: kullanici.telefon || ""
    });
    setSearchTerm(kullanici.ad);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.kullanici_id || !formData.magaza_adi) {
      setMessage({ type: 'error', text: 'کاربر و نام مغازه ضروری است' });
      return;
    }

    if (!formData.paket_id) {
      setMessage({ type: 'error', text: 'لطفاً یک پکیج انتخاب کنید' });
      return;
    }

    setLoading(true);
    setMessage(null);

    console.log('📦 Mağaza oluşturuluyor:', formData);

    try {
      const response = await fetch('/api/admin/magaza-olustur', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('📨 API Response:', data);

      if (data.success) {
        setMessage({ type: 'success', text: `✅ مغازه با موفقیت ایجاد شد! (ID: ${data.data.magaza_id})` });
        // Formu temizle
        setFormData({
          kullanici_id: "",
          magaza_adi: "",
          aciklama: "",
          adres: "",
          telefon: "",
          logo: "",
          kapak_resmi: "",
          paket_id: "",
          ucretsiz: true,
          aktif: true
        });
        setSearchTerm("");
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: 'error', text: '❌ خطا: ' + (data.message || 'یک خطای ناشناخته رخ داد') });
      }
    } catch (error: any) {
      console.error('❌ Mağaza oluşturma hatası:', error);
      setMessage({ type: 'error', text: '❌ خطا در ایجاد مغازه: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const filteredKullanicilar = kullanicilar.filter(k => 
    k.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Gift className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">د کارونکي لپاره دوکان جوړ کړئ</h1>
            <p className="text-gray-600">بې له پیسو ورکولو مستقیم فعال دوکان جوړ کړئ</p>
          </div>
        </div>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Panel - Kullanıcı Seçimi */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-bold text-gray-900">کارونکی انتخاب کړئ</h2>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Kullanıcı ara..."
                />
              </div>

              {/* Kullanıcı Listesi */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredKullanicilar.map((kullanici) => (
                  <button
                    key={kullanici.id}
                    type="button"
                    onClick={() => handleKullaniciSelect(kullanici)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      formData.kullanici_id === kullanici.id.toString()
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{kullanici.ad}</div>
                    <div className="text-sm text-gray-600">{kullanici.email}</div>
                    <div className="text-xs text-gray-500">{kullanici.telefon}</div>
                  </button>
                ))}
              </div>

              {formData.kullanici_id && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Kullanıcı seçildi</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sağ Panel - Mağaza Bilgileri */}
          <div className="lg:col-span-2 space-y-6">
            {/* Temel Bilgiler */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Store className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-bold text-gray-900">د دوکان معلومات</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    د دوکان نوم *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.magaza_adi}
                    onChange={(e) => setFormData({...formData, magaza_adi: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: احمد موبایل دوکان"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تفصیل
                  </label>
                  <textarea
                    value={formData.aciklama}
                    onChange={(e) => setFormData({...formData, aciklama: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="د دوکان په اړه لنډ معلومات..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ټیلیفون
                    </label>
                    <input
                      type="text"
                      value={formData.telefon}
                      onChange={(e) => setFormData({...formData, telefon: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+93 700 000 000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      پته
                    </label>
                    <input
                      type="text"
                      value={formData.adres}
                      onChange={(e) => setFormData({...formData, adres: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="کابل، افغانستان"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Paket Seçimi */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-bold text-gray-900">پیکیج</h2>
                <span className="ml-auto px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  وړیا
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paketler.map((paket) => (
                  <button
                    key={paket.id}
                    type="button"
                    onClick={() => setFormData({...formData, paket_id: paket.id.toString()})}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.paket_id === paket.id.toString()
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="font-bold text-gray-900 mb-2">{paket.ad}</div>
                    <div className="text-sm text-gray-600 mb-2">{paket.sure} gün</div>
                    <div className="text-lg font-bold text-purple-600 line-through">
                      ${paket.fiyat}
                    </div>
                    <div className="text-sm text-green-600 font-medium">Ücretsiz</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Durum Ayarları */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">حالت</h2>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.ucretsiz}
                    onChange={(e) => setFormData({...formData, ucretsiz: e.target.checked})}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">وړیا</span>
                    <p className="text-xs text-gray-500">د پیسو ورکولو پرته</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.aktif}
                    onChange={(e) => setFormData({...formData, aktif: e.target.checked})}
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">فعال</span>
                    <p className="text-xs text-gray-500">مستقیم فعال حالت کې</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !formData.kullanici_id}
                className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>جوړیږي...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>دوکان جوړ کړئ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}









