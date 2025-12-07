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
  const [coverIndex, setCoverIndex] = useState(0); // Kapak resmi index'i
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [districts, setDistricts] = useState<string[]>([]);
  const [compressing, setCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
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

  // Resim sıkıştırma fonksiyonu
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Maksimum boyut: 1920x1920
          const maxSize = 1920;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.85 // Kalite %85
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Maksimum resim sayısını kontrol et
      const remainingSlots = 10 - images.length;
      if (remainingSlots === 0) {
        alert('⚠️ حداکثر ۱۰ عکس می‌توانید آپلود کنید! برای افزودن عکس جدید، ابتدا یکی از عکس‌های موجود را حذف کنید.');
        return;
      }
      
      setCompressing(true);
      
      try {
        // Tüm resimleri sıkıştır
        const compressedFiles: File[] = [];
        for (const file of files.slice(0, remainingSlots)) {
          try {
            const compressed = await compressImage(file);
            compressedFiles.push(compressed);
          } catch (error) {
            console.error('Resim sıkıştırma hatası:', error);
            compressedFiles.push(file);
          }
        }
        
        // Yeni resimleri ekle
        const newImages = [...images, ...compressedFiles];
        setImages(newImages);
        
        // Başarı mesajı
        if (compressedFiles.length > 0) {
          const totalImages = newImages.length;
          if (totalImages === 10) {
            alert(`✅ ${compressedFiles.length} عکس با موفقیت اضافه شد! (فشرده‌سازی شده برای بارگذاری سریع‌تر) \n\nشما اکنون حداکثر تعداد مجاز (۱۰ عکس) را دارید.`);
          } else {
            alert(`✅ ${compressedFiles.length} عکس با موفقیت اضافه شد! (فشرده‌سازی شده) \n\nمی‌توانید ${10 - totalImages} عکس دیگر اضافه کنید.`);
          }
        }
        
        // Eğer seçilen dosya sayısı kalan yuvalardan fazlaysa
        if (files.length > remainingSlots) {
          alert(`⚠️ توجه: شما ${files.length} عکس انتخاب کردید، اما فقط ${remainingSlots} عکس اضافه شد زیرا حداکثر ۱۰ عکس مجاز است.`);
        }
      } finally {
        setCompressing(false);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    // Eğer silinen resim kapak resmiyse, kapağı sıfırla
    if (index === coverIndex) {
      setCoverIndex(0);
    } else if (index < coverIndex) {
      setCoverIndex(prev => prev - 1);
    }
  };

  // Kapak resmi seçme
  const selectCover = (index: number) => {
    setCoverIndex(index);
  };

  // Drag & Drop fonksiyonları
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length < 10 && !compressing) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (images.length >= 10 || compressing) return;

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );

    if (files.length === 0) return;

    const remainingSlots = 10 - images.length;
    
    setCompressing(true);
    
    try {
      const compressedFiles: File[] = [];
      for (const file of files.slice(0, remainingSlots)) {
        try {
          const compressed = await compressImage(file);
          compressedFiles.push(compressed);
        } catch (error) {
          console.error('Resim sıkıştırma hatası:', error);
          compressedFiles.push(file);
        }
      }
      
      const newImages = [...images, ...compressedFiles];
      setImages(newImages);
      
      if (compressedFiles.length > 0) {
        const totalImages = newImages.length;
        if (totalImages === 10) {
          alert(`✅ ${compressedFiles.length} عکس با موفقیت اضافه شد! (فشرده‌سازی شده) \n\nشما اکنون حداکثر تعداد مجاز (۱۰ عکس) را دارید.`);
        } else {
          alert(`✅ ${compressedFiles.length} عکس با موفقیت اضافه شد! (فشرده‌سازی شده) \n\nمی‌توانید ${10 - totalImages} عکس دیگر اضافه کنید.`);
        }
      }
      
      if (files.length > remainingSlots) {
        alert(`⚠️ توجه: فقط ${remainingSlots} عکس اضافه شد زیرا حداکثر ۱۰ عکس مجاز است.`);
      }
    } finally {
      setCompressing(false);
    }
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
      const confirm = window.confirm('⚠️ هشدار: شما هیچ عکسی آپلود نکرده‌اید!\n\n📸 آگهی‌های دارای تصویر تا ۵ برابر بیشتر بازدید می‌شوند.\n\n❓ آیا مطمئن هستید که می‌خواهید بدون عکس ادامه دهید؟');
      if (!confirm) return;
    } else if (images.length < 3) {
      const confirm = window.confirm(`⚠️ توصیه: شما فقط ${images.length} عکس آپلود کرده‌اید.\n\n💡 برای جذب بازدید بیشتر، حداقل ۳ تا ۵ عکس از زوایای مختلف آپلود کنید.\n\n❓ آیا می‌خواهید با این تعداد عکس ادامه دهید؟`);
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
      
      // Kapak resmini ilk sıraya koy
      const sortedImages = [...images];
      if (coverIndex > 0 && coverIndex < sortedImages.length) {
        const coverImage = sortedImages.splice(coverIndex, 1)[0];
        sortedImages.unshift(coverImage);
      }

      const resimlerBase64: string[] = [];
      for (const image of sortedImages) {
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
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <p className="text-gray-500 mt-6 text-lg">در حال انتقال...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const selectedKategori = kategoriler.find(k => k.id === parseInt(formData.kategori_id));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Premium Header */}
          <div className="mb-10 text-center" dir="rtl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-5 shadow-lg shadow-blue-500/30">
              <Send className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-3">ثبت آگهی جدید</h1>
            <p className="text-gray-500 text-lg">آگهی خود را در چند مرحله ساده ثبت کنید</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Kategori & Konum */}
            <div className="relative">
              <div className="flex items-center gap-4 mb-5" dir="rtl">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/30">۱</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">دسته بندی و موقعیت</h3>
                  <p className="text-sm text-gray-500">نوع آگهی و شهر خود را مشخص کنید</p>
                </div>
              </div>
              
              <div className="space-y-5 pr-14" dir="rtl">
                {/* Kategori Seçimi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">دسته بندی</label>
                  <select
                    value={formData.kategori_id}
                    onChange={(e) => handleKategoriChange(e.target.value)}
                    className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-gray-50 hover:bg-white"
                    required
                  >
                    <option value="">دسته بندی را انتخاب کنید</option>
                    {kategoriler.map(k => (
                      <option key={k.id} value={k.id}>{k.ad}</option>
                    ))}
                  </select>
                </div>

                {/* Alt Kategoriler */}
                {altKategoriler.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">زیر دسته‌بندی</label>
                    <div className="grid grid-cols-3 gap-3">
                      {altKategoriler.map(altKat => {
                        const IconComponent = altKategoriIcons[altKat.slug] || Package;
                        return (
                          <button
                            key={altKat.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, alt_kategori_id: altKat.id.toString() })}
                            className={`px-4 py-3.5 rounded-xl border-2 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                              formData.alt_kategori_id === altKat.id.toString()
                                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg shadow-blue-500/20'
                                : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                            }`}
                          >
                            <IconComponent className="w-5 h-5" />
                            {altKat.ad_dari || altKat.ad}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Emlak Tipi */}
                {selectedKategori?.ad === 'Emlak' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">نوع ملکیت</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'satilik', label: 'فروشی', icon: Home },
                        { value: 'kiralik', label: 'کرایی', icon: Key },
                        { value: 'rehinli', label: 'رهنی', icon: FileCheck }
                      ].map(tip => (
                        <button
                          key={tip.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, emlak_tipi: tip.value })}
                          className={`px-4 py-3.5 rounded-xl border-2 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                            formData.emlak_tipi === tip.value
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-lg shadow-indigo-500/20'
                              : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                          }`}
                        >
                          <tip.icon className="w-5 h-5" />
                          {tip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Şehir ve İlçe */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">شهر</label>
                    <select
                      value={formData.il_id}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-gray-50 hover:bg-white"
                      required
                    >
                      <option value="">انتخاب شهر</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ناحیه (اختیاری)</label>
                    <select
                      value={formData.ilce}
                      onChange={(e) => setFormData({ ...formData, ilce: e.target.value })}
                      className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-gray-50 hover:bg-white disabled:opacity-50"
                      disabled={!formData.il_id}
                    >
                      <option value="">انتخاب ناحیه</option>
                      {districts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100"></div>

            {/* Step 2: Başlık & Açıklama */}
            <div className="relative">
              <div className="flex items-center gap-4 mb-5" dir="rtl">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/30">۲</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">عنوان و توضیحات</h3>
                  <p className="text-sm text-gray-500">آگهی خود را توصیف کنید</p>
                </div>
              </div>
              
              <div className="space-y-5 pr-14" dir="rtl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">عنوان آگهی</label>
                  <input
                    type="text"
                    value={formData.baslik}
                    onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                    className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-gray-50 hover:bg-white"
                    placeholder="مثال: آپارتمان ۳ خوابه در شهر نو"
                    required
                    maxLength={100}
                  />
                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-gray-400">حداقل ۱۰ کاراکتر</p>
                    <p className={`text-xs font-medium ${formData.baslik.length >= 10 ? 'text-green-600' : 'text-gray-400'}`}>{formData.baslik.length}/100</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات کامل</label>
                  <textarea
                    value={formData.aciklama}
                    onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                    className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-gray-50 hover:bg-white resize-none"
                    rows={5}
                    placeholder="توضیحات کامل و جزئیات محصول یا خدمات خود را بنویسید..."
                    required
                    maxLength={2000}
                  />
                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-gray-400">حداقل ۵۰ کاراکتر</p>
                    <p className={`text-xs font-medium ${formData.aciklama.length >= 50 ? 'text-green-600' : 'text-gray-400'}`}>{formData.aciklama.length}/2000</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100"></div>

            {/* Step 3: Fiyat & Durum */}
            <div className="relative">
              <div className="flex items-center gap-4 mb-5" dir="rtl">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/30">۳</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">قیمت و وضعیت</h3>
                  <p className="text-sm text-gray-500">قیمت و وضعیت کالا را تعیین کنید</p>
                </div>
              </div>
              
              <div className="space-y-5 pr-14" dir="rtl">
                {/* Para Birimi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">واحد پول</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, para_birimi: 'AFN', fiyat_usd: '' })}
                      className={`px-4 py-3.5 rounded-xl border-2 text-base font-semibold transition-all flex items-center justify-center gap-2 ${
                        formData.para_birimi === 'AFN'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg shadow-blue-500/20'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                      }`}
                    >
                      <span className="text-xl">؋</span>
                      افغانی
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, para_birimi: 'USD' })}
                      className={`px-4 py-3.5 rounded-xl border-2 text-base font-semibold transition-all flex items-center justify-center gap-2 ${
                        formData.para_birimi === 'USD'
                          ? 'border-green-500 bg-green-50 text-green-700 shadow-lg shadow-green-500/20'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                      }`}
                    >
                      <span className="text-xl">$</span>
                      دالر
                    </button>
                  </div>
                </div>

                {/* Fiyat & Tip */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">قیمت</label>
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
                      className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-gray-50 hover:bg-white"
                      placeholder="0"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نوع قیمت</label>
                    <select
                      value={formData.fiyat_tipi}
                      onChange={(e) => setFormData({ ...formData, fiyat_tipi: e.target.value })}
                      className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-gray-50 hover:bg-white"
                    >
                      <option value="negotiable">قابل چانه زنی</option>
                      <option value="fixed">قیمت ثابت</option>
                    </select>
                  </div>
                </div>

                {/* Durum */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">وضعیت کالا</label>
                  <div className="grid grid-cols-4 gap-3">
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
                        className={`px-3 py-3.5 rounded-xl border-2 text-sm font-semibold transition-all flex flex-col items-center gap-2 ${
                          formData.durum === durum.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg shadow-blue-500/20'
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                        }`}
                      >
                        <durum.icon className="w-5 h-5" />
                        {durum.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100"></div>

            {/* Step 4: Fotoğraflar */}
            <div className="relative">
              <div className="flex items-center gap-4 mb-5" dir="rtl">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/30">۴</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">تصاویر آگهی</h3>
                  <p className="text-sm text-gray-500">عکس‌های محصول خود را آپلود کنید</p>
                </div>
                <div className="mr-auto">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    images.length === 0 
                      ? 'bg-gray-100 text-gray-500'
                      : images.length < 10 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                  }`}>
                    {images.length}/۱۰
                  </span>
                </div>
              </div>
              
              <div className="pr-14" dir="rtl">
                <div 
                  className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : images.length >= 10 || compressing
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                        : 'border-gray-300 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={images.length >= 10 || compressing}
                  />
                  <label 
                    htmlFor="images" 
                    className={`cursor-pointer block ${(images.length >= 10 || compressing) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {compressing ? (
                      <>
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-blue-100">
                          <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-base text-gray-900 font-semibold">در حال فشرده‌سازی...</p>
                      </>
                    ) : isDragging ? (
                      <>
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-blue-100">
                          <Upload className="h-7 w-7 text-blue-600" />
                        </div>
                        <p className="text-base text-blue-700 font-semibold">رها کنید</p>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gray-100">
                          <ImageIcon className="h-7 w-7 text-gray-400" />
                        </div>
                        <p className="text-base text-gray-700 font-semibold mb-1">
                          {images.length >= 10 ? 'ظرفیت تکمیل شد' : 'کلیک کنید یا عکس‌ها را بکشید'}
                        </p>
                        <p className="text-sm text-gray-400">
                          PNG, JPG • حداکثر ۱۰ عکس
                        </p>
                      </>
                    )}
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="mt-6">
                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      برای انتخاب تصویر اصلی روی عکس کلیک کنید
                    </p>
                    <div className="grid grid-cols-5 gap-3">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div 
                            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                              index === coverIndex 
                                ? 'border-amber-400 ring-2 ring-amber-200' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => selectCover(index)}
                          >
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`عکس ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {index === coverIndex && (
                              <div className="absolute top-1.5 right-1.5">
                                <span className="bg-amber-400 text-amber-900 text-[10px] px-1.5 py-0.5 rounded font-bold">
                                  اصلی
                                </span>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                              className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 pr-14" dir="rtl">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    در حال ثبت...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    ثبت آگهی
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
