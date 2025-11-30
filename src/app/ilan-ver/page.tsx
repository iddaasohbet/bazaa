"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Upload, X, AlertCircle } from "lucide-react";

interface Kategori {
  id: number;
  ad: string;
}

interface Il {
  id: number;
  ad: string;
}

export default function IlanVer() {
  const router = useRouter();
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [iller, setIller] = useState<Il[]>([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  
  const [formData, setFormData] = useState({
    baslik: "",
    aciklama: "",
    fiyat: "",
    fiyat_tipi: "negotiable",
    para_birimi: "AFN",
    fiyat_usd: "",
    kategori_id: "",
    il_id: "",
    durum: "kullanilmis",
    emlak_tipi: "",
  });

  useEffect(() => {
    // Giriş kontrolü
    const checkAuth = () => {
      try {
        const user = localStorage.getItem('user');
        if (!user || user === 'null' || user === 'undefined') {
          // Giriş yapmamışsa login sayfasına yönlendir
          router.replace('/giris?redirect=/ilan-ver');
          return;
        }
        
        // User var mı kontrol et
        const userData = JSON.parse(user);
        if (!userData || !userData.email) {
          router.replace('/giris?redirect=/ilan-ver');
          return;
        }
        
        setIsAuthenticated(true);
        setChecking(false);
      } catch (error) {
        // Parse hatası varsa giriş yap
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
      const [kategorilerRes, illerRes] = await Promise.all([
        fetch('/api/kategoriler'),
        fetch('/api/iller')
      ]);
      
      const kategorilerData = await kategorilerRes.json();
      const illerData = await illerRes.json();
      
      if (kategorilerData.success) setKategoriler(kategorilerData.data);
      if (illerData.success) setIller(illerData.data);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Resim boyutu kontrolü (her biri max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      const validFiles = files.filter(file => {
        if (file.size > maxSize) {
          alert(`${file.name} خیلی بزرگ است! حداکثر اندازه ۵ مگابایت است.`);
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
    setLoading(true);
    
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        alert('لطفاً ابتدا وارد شوید');
        router.push('/giris?redirect=/ilan-ver');
        return;
      }

      const userData = JSON.parse(userStr);
      
      // Resimleri base64'e çevir
      const resimlerBase64: string[] = [];
      for (const image of images) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(image);
        });
        resimlerBase64.push(base64);
      }
      
      // İlan verilerini hazırla
      const ilanData = {
        baslik: formData.baslik,
        aciklama: formData.aciklama,
        fiyat: parseFloat(formData.fiyat),
        fiyat_tipi: formData.fiyat_tipi,
        para_birimi: formData.para_birimi,
        fiyat_usd: formData.fiyat_usd ? parseFloat(formData.fiyat_usd) : null,
        kategori_id: parseInt(formData.kategori_id),
        il_id: parseInt(formData.il_id),
        durum: formData.durum,
        emlak_tipi: formData.emlak_tipi || null,
        kullanici_id: userData.id,
        resimler: resimlerBase64, // Resimleri ekle
      };

      // API'ye gönder
      const response = await fetch('/api/ilanlar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ilanData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || 'خطا در ایجاد آگهی');
        setLoading(false);
        return;
      }

      // Başarılı
      alert('✅ آگهی شما با موفقیت ایجاد شد!');
      router.push('/ilanlarim');
    } catch (error) {
      console.error('İlan verme hatası:', error);
      alert('خطا در ایجاد آگهی. لطفاً دوباره تلاش کنید');
      setLoading(false);
    }
  };

  if (checking || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="border border-gray-200 rounded-lg p-16 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
              <p className="text-gray-600 mt-4">Yönlendiriliyor...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8" dir="rtl">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ثبت آگهی جدید</h1>
            <p className="text-gray-600">آگهی خود را به صورت کامل و دقیق پر کنید</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* İlan Başlığı */}
            <div className="border border-gray-200 rounded-lg p-6" dir="rtl">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                عنوان آگهی *
              </label>
              <input
                type="text"
                value={formData.baslik}
                onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: آیفون ۱۳ پرو ۲۵۶ گیگابایت آبی"
                required
              />
              <p className="text-sm text-gray-500 mt-2">از یک عنوان واضح و توصیفی استفاده کنید</p>
            </div>

            {/* Kategori ve Konum */}
            <div className="border border-gray-200 rounded-lg p-6" dir="rtl">
              <h3 className="text-sm font-bold text-gray-900 mb-4">دسته‌بندی و موقعیت</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    دسته‌بندی *
                  </label>
                  <select
                    value={formData.kategori_id}
                    onChange={(e) => setFormData({ ...formData, kategori_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">دسته‌بندی را انتخاب کنید</option>
                    {kategoriler.map(k => (
                      <option key={k.id} value={k.id}>{k.ad}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شهر *
                  </label>
                  <select
                    value={formData.il_id}
                    onChange={(e) => setFormData({ ...formData, il_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">شهر را انتخاب کنید</option>
                    {iller.map(il => (
                      <option key={il.id} value={il.id}>{il.ad}</option>
                    ))}
                  </select>
                </div>

                {/* Emlak Tipi - Emlak kategorisi seçildiğinde göster */}
                {kategoriler.find(k => k.id === parseInt(formData.kategori_id))?.ad === 'Emlak' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع ملک *
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, emlak_tipi: 'satilik' })}
                        className={`px-6 py-4 rounded-lg border-2 font-semibold transition-all ${
                          formData.emlak_tipi === 'satilik'
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-xl mb-1">🏷️</div>
                          <div>فروشی</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, emlak_tipi: 'kiralik' })}
                        className={`px-6 py-4 rounded-lg border-2 font-semibold transition-all ${
                          formData.emlak_tipi === 'kiralik'
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-xl mb-1">🔑</div>
                          <div>کرایی</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, emlak_tipi: 'rehinli' })}
                        className={`px-6 py-4 rounded-lg border-2 font-semibold transition-all ${
                          formData.emlak_tipi === 'rehinli'
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-xl mb-1">🏦</div>
                          <div>گروی</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Açıklama */}
            <div className="border border-gray-200 rounded-lg p-6" dir="rtl">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                توضیحات *
              </label>
              <textarea
                value={formData.aciklama}
                onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={8}
                placeholder="محصول خود را به طور کامل توصیف کنید. ویژگی‌ها، مدت استفاده، وضعیت و غیره"
                required
              />
              <p className="text-sm text-gray-500 mt-2">حداقل ۵۰ کاراکتر وارد کنید</p>
            </div>

            {/* Fiyat ve Durum */}
            <div className="border border-gray-200 rounded-lg p-6" dir="rtl">
              <h3 className="text-sm font-bold text-gray-900 mb-4">قیمت و وضعیت</h3>
              
              {/* Para Birimi Seçimi */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  واحد پول *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, para_birimi: 'AFN', fiyat_usd: '' })}
                    className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                      formData.para_birimi === 'AFN'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xl mb-1">؋</div>
                      <div>افغانی (AFN)</div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, para_birimi: 'USD' })}
                    className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                      formData.para_birimi === 'USD'
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xl mb-1">$</div>
                      <div>دالر (USD)</div>
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                {/* AFN Fiyat */}
                {formData.para_birimi === 'AFN' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      قیمت (AFN) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.fiyat}
                        onChange={(e) => setFormData({ ...formData, fiyat: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        required
                        min="0"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">؋</span>
                    </div>
                  </div>
                )}

                {/* USD Fiyat */}
                {formData.para_birimi === 'USD' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        قیمت دالر (USD) *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={formData.fiyat_usd}
                          onChange={(e) => setFormData({ ...formData, fiyat_usd: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="0"
                          required
                          min="0"
                          step="0.01"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        قیمت افغانی (AFN) *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={formData.fiyat}
                          onChange={(e) => setFormData({ ...formData, fiyat: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                          required
                          min="0"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">؋</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">معادل افغانی برای نمایش</p>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع قیمت
                  </label>
                  <select
                    value={formData.fiyat_tipi}
                    onChange={(e) => setFormData({ ...formData, fiyat_tipi: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="negotiable">قابل چانه زنی</option>
                    <option value="fixed">قیمت ثابت</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وضعیت *
                  </label>
                  <select
                    value={formData.durum}
                    onChange={(e) => setFormData({ ...formData, durum: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="yeni">نو</option>
                    <option value="az_kullanilmis">کم استفاده</option>
                    <option value="kullanilmis">استفاده شده</option>
                    <option value="hasarli">آسیب دیده</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Fotoğraflar */}
            <div className="border border-gray-200 rounded-lg p-6" dir="rtl">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                تصاویر (حداکثر ۱۰ عدد)
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-gray-50 transition-all cursor-pointer">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-2">برای آپلود تصویر کلیک کنید</p>
                  <p className="text-sm text-gray-500">PNG, JPG, JPEG (حداکثر ۵ مگابایت هر کدام)</p>
                </label>
              </div>

              {/* Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-5 gap-3 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-sm"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                          تصویر اصلی
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bilgilendirme */}
            <div className="border-2 border-blue-200 rounded-lg p-4" dir="rtl">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold text-gray-900 mb-1">قوانین آگهی</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• اطلاعات واقعی و صحیح وارد کنید</li>
                    <li>• تصاویر واضح از محصول اضافه کنید</li>
                    <li>• توضیحات کامل بنویسید</li>
                    <li>• اطلاعات تماس خود را به‌روز نگه دارید</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4" dir="rtl">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'در حال انتشار آگهی...' : 'انتشار آگهی'}
              </button>
              <button
                type="button"
                className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 px-6 py-3.5 rounded-lg font-semibold transition-colors"
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
