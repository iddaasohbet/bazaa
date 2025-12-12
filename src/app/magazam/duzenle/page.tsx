"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Store, 
  Save, 
  ArrowRight, 
  Upload, 
  X,
  Loader2,
  MapPin,
  Phone,
  Type,
  FileText,
  Palette,
  Image as ImageIcon,
  Crown,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { getCitiesList } from "@/lib/cities";

interface MagazaBilgileri {
  id: number;
  kullanici_id: number;
  ad: string;
  ad_dari: string;
  slug: string;
  aciklama?: string;
  adres?: string;
  telefon?: string;
  il_id?: number;
  logo?: string;
  kapak_resmi?: string;
  banner?: string;
  tema_renk?: string;
  store_level: string;
}

export default function MagazaDuzenlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [magazaBilgileri, setMagazaBilgileri] = useState<MagazaBilgileri | null>(null);
  const [logo, setLogo] = useState<string>("");
  const [kapakResmi, setKapakResmi] = useState<string>("");

  const cities = getCitiesList();

  const [formData, setFormData] = useState({
    ad: "",
    ad_dari: "",
    aciklama: "",
    telefon: "",
    adres: "",
    il_id: "",
    tema_renk: "#0f0f1a"
  });

  useEffect(() => {
    checkMagaza();
  }, []);

  const checkMagaza = async () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) {
        router.push('/giris');
        return;
      }

      const userData = JSON.parse(user);
      
      const response = await fetch(`/api/magazalar?kullanici_id=${userData.id}`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const magaza = data.data[0];
        setMagazaBilgileri(magaza);
        
        setFormData({
          ad: magaza.ad || "",
          ad_dari: magaza.ad_dari || "",
          aciklama: magaza.aciklama || "",
          telefon: magaza.telefon || "",
          adres: magaza.adres || "",
          il_id: magaza.il_id?.toString() || "",
          tema_renk: magaza.tema_renk || "#0f0f1a"
        });
        
        setLogo(magaza.logo || "");
        setKapakResmi(magaza.kapak_resmi || "");
      } else {
        router.push('/magaza-ac');
      }
    } catch (error) {
      console.error('Mağaza bilgileri yüklenirken hata:', error);
      router.push('/magaza-ac');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'kapak') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('حجم فایل نباید بیشتر از ۵ مگابایت باشد');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'logo') {
        setLogo(reader.result as string);
      } else {
        setKapakResmi(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!magazaBilgileri) return;
    
    if (!formData.ad || !formData.il_id) {
      alert('لطفاً فیلدهای الزامی را پر کنید');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/magazalar/${magazaBilgileri.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          il_id: parseInt(formData.il_id),
          logo: logo || null,
          kapak_resmi: kapakResmi || null
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('مغازه با موفقیت به‌روزرسانی شد');
        window.dispatchEvent(new Event('magazaGuncelle'));
        router.push('/magazam');
      } else {
        alert(data.message || 'خطا در به‌روزرسانی');
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      alert('خطا در به‌روزرسانی مغازه');
    } finally {
      setSaving(false);
    }
  };

  const isElite = magazaBilgileri?.store_level === 'elite';
  const isPro = magazaBilgileri?.store_level === 'pro';

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">در حال بارگذاری...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!magazaBilgileri) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' }}>
      <Header />
      
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4" dir="rtl">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">ویرایش مغازه</h1>
                {isElite && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold" style={{ background: 'linear-gradient(135deg, #d4a537, #f5d78e)', color: '#000' }}>
                    <Crown className="w-3 h-3" />
                    VIP
                  </span>
                )}
                {isPro && !isElite && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white">
                    <Sparkles className="w-3 h-3" />
                    PRO
                  </span>
                )}
              </div>
              <p className="text-gray-500">اطلاعات مغازه خود را به‌روزرسانی کنید</p>
            </div>
            <Link
              href="/magazam"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-all shadow-sm"
            >
              <ArrowRight className="w-4 h-4" />
              بازگشت
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Sol - Ana Form */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Temel Bilgiler */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg shadow-gray-200/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                      <Store className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">اطلاعات اصلی</h2>
                  </div>

                  <div className="space-y-5">
                    {/* İsimler */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          نام مغازه (انگلیسی) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.ad}
                          onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                          placeholder="My Store"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          نام مغازه (دری)
                        </label>
                        <input
                          type="text"
                          value={formData.ad_dari}
                          onChange={(e) => setFormData({ ...formData, ad_dari: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                          placeholder="مغازه من"
                        />
                      </div>
                    </div>

                    {/* Açıklama */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FileText className="w-4 h-4 inline ml-1" />
                        توضیحات
                      </label>
                      <textarea
                        value={formData.aciklama}
                        onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all resize-none"
                        placeholder="توضیحات مغازه را اینجا بنویسید..."
                      />
                    </div>

                    {/* Telefon ve Şehir */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Phone className="w-4 h-4 inline ml-1" />
                          تلفن
                        </label>
                        <input
                          type="tel"
                          value={formData.telefon}
                          onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                          placeholder="+93 700 000 000"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <MapPin className="w-4 h-4 inline ml-1" />
                          شهر <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.il_id}
                          onChange={(e) => setFormData({ ...formData, il_id: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                          required
                        >
                          <option value="">انتخاب شهر</option>
                          {cities.map((city) => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Adres */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline ml-1" />
                        آدرس کامل
                      </label>
                      <input
                        type="text"
                        value={formData.adres}
                        onChange={(e) => setFormData({ ...formData, adres: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                        placeholder="آدرس کامل مغازه"
                      />
                    </div>
                  </div>
                </div>

                {/* Tema Rengi - Sadece Elite/Pro için */}
                {(isElite || isPro) && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg shadow-gray-200/50">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        <Palette className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">رنگ تم مغازه</h2>
                        <p className="text-sm text-gray-500">رنگ پس‌زمینه صفحه مغازه شما</p>
                      </div>
                      <span className="mr-auto px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        {isElite ? 'پریمیوم' : 'پرو'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={formData.tema_renk}
                        onChange={(e) => setFormData({ ...formData, tema_renk: e.target.value })}
                        className="w-16 h-16 rounded-xl border-2 border-gray-200 cursor-pointer"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={formData.tema_renk}
                          onChange={(e) => setFormData({ ...formData, tema_renk: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                          placeholder="#0f0f1a"
                          dir="ltr"
                        />
                        <p className="text-xs text-gray-400 mt-2">پیشنهاد: #0f0f1a (لاجوردی تیره) یا #0d1b2a (آبی تیره)</p>
                      </div>
                      <div 
                        className="w-16 h-16 rounded-xl border-2 border-gray-200"
                        style={{ backgroundColor: formData.tema_renk }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Sağ - Resimler */}
              <div className="space-y-6">
                
                {/* Logo */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg shadow-gray-200/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">لوگو</h2>
                  </div>
                  
                  <label className="block cursor-pointer">
                    {logo ? (
                      <div className="relative group">
                        <img
                          src={logo}
                          alt="Logo"
                          className="w-full h-48 object-contain rounded-xl border-2 border-gray-100 bg-gray-50 p-4"
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); setLogo(""); }}
                          className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-48 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50/50 transition-all">
                        <Upload className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">بارگذاری لوگو</p>
                        <p className="text-xs text-gray-400 mt-1">حداکثر 5MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Kapak */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg shadow-gray-200/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">تصویر کاور</h2>
                  </div>
                  
                  <label className="block cursor-pointer">
                    {kapakResmi ? (
                      <div className="relative group">
                        <img
                          src={kapakResmi}
                          alt="Kapak"
                          className="w-full h-40 object-cover rounded-xl border-2 border-gray-100"
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); setKapakResmi(""); }}
                          className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-40 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50/50 transition-all">
                        <Upload className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">بارگذاری کاور</p>
                        <p className="text-xs text-gray-400 mt-1">حداکثر 5MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'kapak')}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Kaydet Butonu */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 text-white rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                  style={{ 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      در حال ذخیره...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      ذخیره تغییرات
                    </>
                  )}
                </button>

                {/* Mağazayı Gör */}
                <Link
                  href={`/magaza/${magazaBilgileri.id}`}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                >
                  مشاهده مغازه
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
