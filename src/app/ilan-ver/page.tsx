"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Upload, 
  X, 
  AlertCircle, 
  MapPin, 
  Tag, 
  DollarSign, 
  Home,
  Key,
  FileCheck,
  Package,
  Star,
  ThumbsUp,
  AlertTriangle,
  Image as ImageIcon,
  Send
} from "lucide-react";
import { getCitiesList, getDistrictsList } from "@/lib/cities";

interface Kategori {
  id: number;
  ad: string;
}

interface AltKategori {
  id: number;
  ad: string;
  ad_dari?: string;
  slug: string;
}

const altKategoriIcons: Record<string, any> = {
  'satilik': Home,
  'kiralik': Key,
  'rehinli': FileCheck,
};

export default function IlanVer() {
  const router = useRouter();
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [altKategoriler, setAltKategoriler] = useState<AltKategori[]>([]);
  const [loadingAltKategoriler, setLoadingAltKategoriler] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [districts, setDistricts] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    baslik: "",
    aciklama: "",
    fiyat: "",
    fiyat_tipi: "negotiable",
    para_birimi: "AFN",
    fiyat_usd: "",
    kategori_id: "",
    alt_kategori_id: "",
    il_id: "",
    ilce: "",
    durum: "kullanilmis",
    emlak_tipi: "",
  });

  const cities = getCitiesList();

  const handleCityChange = (cityId: string) => {
    setFormData({ ...formData, il_id: cityId, ilce: "" });
    setDistricts(getDistrictsList(cityId));
  };

  const handleKategoriChange = async (kategoriId: string) => {
    setFormData({ ...formData, kategori_id: kategoriId, alt_kategori_id: "", emlak_tipi: "" });
    setAltKategoriler([]);
    
    if (kategoriId) {
      setLoadingAltKategoriler(true);
      try {
        const response = await fetch(`/api/alt-kategoriler?kategori_id=${kategoriId}`);
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setAltKategoriler(data.data);
        }
      } catch (error) {
        console.error('Alt kategoriler yüklenemedi:', error);
      } finally {
        setLoadingAltKategoriler(false);
      }
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = localStorage.getItem('user');
        if (!user || user === 'null' || user === 'undefined') {
          router.replace('/giris?redirect=/ilan-ver');
          return;
        }
        
        const userData = JSON.parse(user);
        if (!userData || !userData.email) {
          router.replace('/giris?redirect=/ilan-ver');
          return;
        }
        
        setIsAuthenticated(true);
        setChecking(false);
      } catch (error) {
        router.replace('/giris?redirect=/ilan-ver');
      }
    };
    
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [kategorilerRes] = await Promise.all([
        fetch('/api/kategoriler')
      ]);
      
      const kategorilerData = await kategorilerRes.json();
      
      if (kategorilerData.success) setKategoriler(kategorilerData.data);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      const maxSize = 5 * 1024 * 1024;
      const validFiles = files.filter(file => {
        if (file.size > maxSize) {
          alert(`${file.name} خیلی بزرگ است! حداکثر 5 مگابایت میتوانید آپلود کنید.`);
          return false;
        }
        return true;
      });
      
      setImages(prev => [...prev, ...validFiles].slice(0, 10));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasyon
    if (!formData.kategori_id || !formData.il_id) {
      alert('لطفا دسته بندی و شهر را انتخاب کنید.');
      return;
    }
    
    if (!formData.baslik || formData.baslik.length < 10) {
      alert('عنوان باید حداقل 10 کاراکتر باشد.');
      return;
    }
    
    if (!formData.aciklama || formData.aciklama.length < 50) {
      alert('توضیحات باید حداقل 50 کاراکتر باشد.');
      return;
    }
    
    if (!formData.fiyat && !formData.fiyat_usd) {
      alert('لطفا قیمت را وارد کنید.');
      return;
    }
    
    const selectedKategori = kategoriler.find(k => k.id === parseInt(formData.kategori_id));
    if (selectedKategori?.ad === 'Emlak' && !formData.emlak_tipi) {
      alert('لطفا نوع ملکیت را انتخاب کنید.');
      return;
    }
    
    if (images.length === 0) {
      const confirm = window.confirm('شما هیچ عکسی اضافه نکرده‌اید. آیا می‌خواهید بدون عکس ادامه دهید؟');
      if (!confirm) return;
    }
    
    setLoading(true);
    
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        alert('نشست شما منقضی شده است. لطفا دوباره وارد شوید.');
        router.push('/giris?redirect=/ilan-ver');
        return;
      }

      const userData = JSON.parse(userStr);
      
      const resimlerBase64: string[] = [];
      for (const image of images) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(image);
        });
        resimlerBase64.push(base64);
      }
      
      const ilanData = {
        baslik: formData.baslik,
        aciklama: formData.aciklama,
        fiyat: parseFloat(formData.fiyat),
        fiyat_tipi: formData.fiyat_tipi,
        para_birimi: formData.para_birimi,
        fiyat_usd: formData.fiyat_usd ? parseFloat(formData.fiyat_usd) : null,
        kategori_id: parseInt(formData.kategori_id),
        alt_kategori_id: formData.alt_kategori_id ? parseInt(formData.alt_kategori_id) : null,
        il_id: formData.il_id,
        ilce: formData.ilce || null,
        durum: formData.durum,
        emlak_tipi: formData.emlak_tipi || null,
        kullanici_id: userData.id,
        resimler: resimlerBase64,
      };

      const response = await fetch('/api/ilanlar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ilanData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || 'هنگام ثبت آگهی خطایی رخ داد');
        setLoading(false);
        return;
      }

      alert('آگهی شما با موفقیت منتشر شد!');
      router.push('/ilanlarim');
    } catch (error) {
      console.error('خطای ثبت آگهی:', error);
      alert('هنگام ثبت آگهی خطایی رخ داد. لطفا دوباره تلاش کنید.');
      setLoading(false);
    }
  };

  if (checking || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-16 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
              <p className="text-gray-600 mt-4">در حال انتقال...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const selectedKategori = kategoriler.find(k => k.id === parseInt(formData.kategori_id));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-6 text-center" dir="rtl">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ثبت آگهی جدید</h1>
            <p className="text-gray-600">فرم را تکمیل کنید و آگهی خود را منتشر کنید</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Kategori & Konum */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2" dir="rtl">
                <Tag className="w-4 h-4 text-blue-600" />
                دسته بندی و موقعیت
              </h3>
              <div className="grid md:grid-cols-4 gap-3" dir="rtl">
                <select
                  value={formData.kategori_id}
                  onChange={(e) => handleKategoriChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">دسته بندی</option>
                  {kategoriler.map(k => (
                    <option key={k.id} value={k.id}>{k.ad}</option>
                  ))}
                </select>

                <select
                  value={formData.alt_kategori_id}
                  onChange={(e) => setFormData({ ...formData, alt_kategori_id: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  disabled={!formData.kategori_id || altKategoriler.length === 0}
                >
                  <option value="">زیر دسته (اختیاری)</option>
                  {altKategoriler.map(ak => (
                    <option key={ak.id} value={ak.id}>{ak.ad_dari || ak.ad}</option>
                  ))}
                </select>

                <select
                  value={formData.il_id}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">شهر</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>

                <select
                  value={formData.ilce}
                  onChange={(e) => setFormData({ ...formData, ilce: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  disabled={!formData.il_id}
                >
                  <option value="">ناحیه (اختیاری)</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              {/* Alt Kategoriler - Tüm Kategoriler için */}
              {altKategoriler.length > 0 && (
                <div className="mt-3" dir="rtl">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    زیر دسته‌بندی انتخاب کنید:
                  </label>
                  <div className={`grid gap-2 ${
                    altKategoriler.length <= 3 ? 'grid-cols-3' : 
                    altKategoriler.length <= 4 ? 'grid-cols-4' : 
                    'grid-cols-5'
                  }`}>
                    {altKategoriler.map(altKat => {
                      const IconComponent = altKategoriIcons[altKat.slug] || Package;
                      return (
                        <button
                          key={altKat.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, alt_kategori_id: altKat.id.toString() })}
                          className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-all flex items-center justify-center gap-1 ${
                            formData.alt_kategori_id === altKat.id.toString()
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                          {altKat.ad_dari || altKat.ad}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Emlak Tipi - Sadece Emlak kategorisi için */}
              {selectedKategori?.ad === 'Emlak' && (
                <div className="mt-3 grid grid-cols-3 gap-2" dir="rtl">
                  {[
                    { value: 'satilik', label: 'فروشی', icon: Home },
                    { value: 'kiralik', label: 'کرایی', icon: Key },
                    { value: 'rehinli', label: 'رهنی', icon: FileCheck }
                  ].map(tip => (
                    <button
                      key={tip.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, emlak_tipi: tip.value })}
                      className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-all flex items-center justify-center gap-1 ${
                        formData.emlak_tipi === tip.value
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <tip.icon className="w-4 h-4" />
                      {tip.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Başlık & Açıklama */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm" dir="rtl">
              <h3 className="text-sm font-bold text-gray-900 mb-3">عنوان و توضیحات</h3>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={formData.baslik}
                    onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="عنوان آگهی (حداقل 10 کاراکتر)"
                    required
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.baslik.length}/100</p>
                </div>

                <div>
                  <textarea
                    value={formData.aciklama}
                    onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={6}
                    placeholder="توضیحات کامل محصول (حداقل 50 کاراکتر)"
                    required
                    maxLength={2000}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.aciklama.length}/2000</p>
                </div>
              </div>
            </div>

            {/* Fiyat & Durum */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm" dir="rtl">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                قیمت و وضعیت
              </h3>
              
              <div className="space-y-3">
                {/* Para Birimi */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, para_birimi: 'AFN', fiyat_usd: '' })}
                    className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-all ${
                      formData.para_birimi === 'AFN'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    افغانی (؋)
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, para_birimi: 'USD' })}
                    className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-all ${
                      formData.para_birimi === 'USD'
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    دالر ($)
                  </button>
                </div>

                {/* Fiyat & Tip */}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={formData.para_birimi === 'AFN' ? formData.fiyat : formData.fiyat_usd}
                    onChange={(e) => {
                      if (formData.para_birimi === 'AFN') {
                        setFormData({ ...formData, fiyat: e.target.value, fiyat_usd: '' });
                      } else {
                        const usdValue = e.target.value;
                        const afnValue = usdValue ? (parseFloat(usdValue) * 70).toString() : '';
                        setFormData({ ...formData, fiyat_usd: usdValue, fiyat: afnValue });
                      }
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="قیمت"
                    required
                    min="0"
                  />

                  <select
                    value={formData.fiyat_tipi}
                    onChange={(e) => setFormData({ ...formData, fiyat_tipi: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="negotiable">قابل چانه زنی</option>
                    <option value="fixed">قیمت ثابت</option>
                  </select>
                </div>

                {/* Durum */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'yeni', label: 'نو', icon: Package },
                    { value: 'az_kullanilmis', label: 'کم استفاده', icon: Star },
                    { value: 'kullanilmis', label: 'استفاده شده', icon: ThumbsUp },
                    { value: 'hasarli', label: 'معیوب', icon: AlertTriangle }
                  ].map(durum => (
                    <button
                      key={durum.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, durum: durum.value })}
                      className={`px-2 py-2 rounded-lg border text-xs font-semibold transition-all flex flex-col items-center gap-1 ${
                        formData.durum === durum.value
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <durum.icon className="w-4 h-4" />
                      {durum.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fotoğraflar */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm" dir="rtl">
              <h3 className="text-sm font-bold text-gray-900 mb-3">عکس‌ها (حداکثر 10 عکس)</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-700 font-medium">برای آپلود کلیک کنید</p>
                  <p className="text-xs text-gray-500">PNG, JPG (حداکثر 5MB)</p>
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`عکس ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded flex items-center gap-0.5">
                          <ImageIcon className="w-2 h-2" />
                          اصلی
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3" dir="rtl">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-700">
                  <p className="font-semibold text-gray-900 mb-1">نکات مهم</p>
                  <ul className="space-y-0.5 text-gray-600">
                    <li>• اطلاعات دقیق و کامل وارد کنید</li>
                    <li>• از عکس‌های واضح استفاده کنید</li>
                    <li>• توضیحات کامل بنویسید</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3" dir="rtl">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    در حال ثبت...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    ثبت آگهی
                  </>
                )}
              </button>
              <button
                type="button"
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-bold transition-colors"
                onClick={() => window.history.back()}
              >
                لغو
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
