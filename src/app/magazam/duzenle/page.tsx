"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Store, 
  Save, 
  ArrowLeft, 
  Upload, 
  X,
  Loader2,
  MapPin,
  Phone,
  Type,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

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

interface Il {
  id: number;
  ad: string;
}

export default function MagazaDuzenlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [magazaBilgileri, setMagazaBilgileri] = useState<MagazaBilgileri | null>(null);
  const [iller, setIller] = useState<Il[]>([]);
  const [logo, setLogo] = useState<string>("");
  const [kapakResmi, setKapakResmi] = useState<string>("");

  const [formData, setFormData] = useState({
    ad: "",
    ad_dari: "",
    aciklama: "",
    telefon: "",
    adres: "",
    il_id: "",
    tema_renk: "#3B82F6"
  });

  useEffect(() => {
    checkMagaza();
    fetchIller();
  }, []);

  const checkMagaza = async () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) {
        router.push('/giris');
        return;
      }

      const userData = JSON.parse(user);
      
      // Kullanıcının mağazasını API'den yükle
      const response = await fetch(`/api/magazalar?kullanici_id=${userData.id}`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const magaza = data.data[0];
        setMagazaBilgileri(magaza);
        
        // Form verilerini doldur
        setFormData({
          ad: magaza.ad || "",
          ad_dari: magaza.ad_dari || "",
          aciklama: magaza.aciklama || "",
          telefon: magaza.telefon || "",
          adres: magaza.adres || "",
          il_id: magaza.il_id?.toString() || "",
          tema_renk: magaza.tema_renk || "#3B82F6"
        });
        
        setLogo(magaza.logo || "");
        setKapakResmi(magaza.kapak_resmi || "");
      } else {
        // Mağaza yoksa yönlendir
        router.push('/magaza-ac');
      }
    } catch (error) {
      console.error('Mağaza bilgileri yüklenirken hata:', error);
      router.push('/magaza-ac');
    } finally {
      setLoading(false);
    }
  };

  const fetchIller = async () => {
    try {
      const response = await fetch('/api/iller');
      const data = await response.json();
      if (data.success) {
        setIller(data.data);
      }
    } catch (error) {
      console.error('İller yüklenemedi:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'kapak') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Max 5MB
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
        headers: {
          'Content-Type': 'application/json',
        },
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
        
        // Event gönder
        window.dispatchEvent(new Event('magazaGuncelle'));
        
        // Geri dön
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!magazaBilgileri) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8" dir="rtl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">ویرایش مغازه</h1>
                <p className="text-gray-600 mt-1">اطلاعات مغازه خود را به‌روزرسانی کنید</p>
              </div>
              <Link
                href="/magazam"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>بازگشت</span>
              </Link>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Temel Bilgiler */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    اطلاعات اصلی
                  </h2>

                  <div className="space-y-5">
                    {/* Ad */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        نام مغازه (انگلیسی) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Store className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.ad}
                          onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
                          className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="My Store"
                          required
                        />
                      </div>
                    </div>

                    {/* Ad Dari */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        نام مغازه (دری)
                      </label>
                      <div className="relative">
                        <Type className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.ad_dari}
                          onChange={(e) => setFormData({ ...formData, ad_dari: e.target.value })}
                          className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="مغازه من"
                        />
                      </div>
                    </div>

                    {/* Açıklama */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        توضیحات
                      </label>
                      <textarea
                        value={formData.aciklama}
                        onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="توضیحات مغازه را اینجا بنویسید..."
                      />
                    </div>

                    {/* Telefon ve Şehir */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          تلفن
                        </label>
                        <div className="relative">
                          <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={formData.telefon}
                            onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                            className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+93 700 000 000"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          شهر <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            value={formData.il_id}
                            onChange={(e) => setFormData({ ...formData, il_id: e.target.value })}
                            className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="">انتخاب شهر</option>
                            {iller.map((il) => (
                              <option key={il.id} value={il.id}>
                                {il.ad}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Adres */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        آدرس
                      </label>
                      <input
                        type="text"
                        value={formData.adres}
                        onChange={(e) => setFormData({ ...formData, adres: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="آدرس کامل مغازه"
                      />
                    </div>

                    {/* Tema Renk */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        رنگ تم مغازه
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={formData.tema_renk}
                          onChange={(e) => setFormData({ ...formData, tema_renk: e.target.value })}
                          className="w-20 h-12 rounded-lg border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.tema_renk}
                          onChange={(e) => setFormData({ ...formData, tema_renk: e.target.value })}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="#3B82F6"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar - Images */}
              <div className="space-y-6">
                {/* Logo */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">لوگو</h2>
                  
                  <label className="block mb-4 cursor-pointer">
                    {logo ? (
                      <div className="relative">
                        <img
                          src={logo}
                          alt="Logo"
                          className="w-full h-48 object-contain rounded-lg border-2 border-gray-200 bg-gray-50 p-2"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setLogo("");
                          }}
                          className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 transition-colors">
                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">بارگذاری لوگو</p>
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

                {/* Kapak Resmi */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">تصویر کاور</h2>
                  
                  <label className="block mb-4 cursor-pointer">
                    {kapakResmi ? (
                      <div className="relative">
                        <img
                          src={kapakResmi}
                          alt="Kapak"
                          className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setKapakResmi("");
                          }}
                          className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 transition-colors">
                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">بارگذاری کاور</p>
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
                      <span>ذخیره تغییرات</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}













