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
              <div className="space-y-3">
                {/* Kategori Seçimi */}
                <div dir="rtl">
                  <select
                    value={formData.kategori_id}
                    onChange={(e) => handleKategoriChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">دسته بندی را انتخاب کنید</option>
                    {kategoriler.map(k => (
                      <option key={k.id} value={k.id}>{k.ad}</option>
                    ))}
                  </select>
                </div>

                {/* Alt Kategoriler - Kategori seçildiğinde hemen görünsün */}
                {altKategoriler.length > 0 && (
                  <div dir="rtl">
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
                  <div dir="rtl">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      نوع ملکیت:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
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
                  </div>
                )}

                {/* Şehir ve İlçe */}
                <div className="grid md:grid-cols-2 gap-3" dir="rtl">
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
              </div>
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
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6 shadow-lg" dir="rtl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  تصاویر آگهی
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`px-4 py-2 rounded-full font-bold text-sm shadow-md ${
                    images.length === 0 
                      ? 'bg-gray-200 text-gray-600'
                      : images.length < 10 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  }`}>
                    {images.length} / ۱۰ عکس
                  </span>
                </div>
              </div>

              <div 
                className={`relative border-3 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                  isDragging
                    ? 'border-blue-600 bg-blue-100 scale-[1.02] shadow-2xl'
                    : images.length >= 10 || compressing
                      ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                      : 'border-blue-400 bg-white hover:border-blue-600 hover:bg-blue-50 hover:shadow-xl'
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
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                        <div className="h-8 w-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-base text-gray-900 font-bold mb-1">
                        در حال فشرده‌سازی تصاویر...
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        لطفاً صبر کنید
                      </p>
                    </>
                  ) : isDragging ? (
                    <>
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 animate-pulse">
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-lg text-blue-700 font-bold mb-1">
                        رها کنید تا آپلود شود!
                      </p>
                      <p className="text-sm text-blue-600">
                        عکس‌ها را اینجا رها کنید
                      </p>
                    </>
                  ) : (
                    <>
                      <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                        images.length >= 10 ? 'bg-gray-200' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                      }`}>
                        <Upload className={`h-8 w-8 ${images.length >= 10 ? 'text-gray-400' : 'text-white'}`} />
                      </div>
                      <p className="text-base text-gray-900 font-bold mb-1">
                        {images.length >= 10 ? 'حداکثر تعداد عکس آپلود شده است' : 'عکس‌ها را بکشید و رها کنید یا کلیک کنید'}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {images.length < 10 ? `می‌توانید ${10 - images.length} عکس دیگر اضافه کنید` : 'برای آپلود بیشتر، ابتدا عکسی را حذف کنید'}
                      </p>
                      <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          PNG, JPG, JPEG
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          هر اندازه
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                          حداکثر ۱۰ عکس
                        </span>
                      </div>
                    </>
                  )}
                </label>
              </div>

              {images.length > 0 && (
                <div className="mt-5">
                  <div className="mb-3 pb-3 border-b border-blue-200">
                    <p className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      روی عکس مورد نظر کلیک کنید تا به عنوان تصویر اصلی (کاور) انتخاب شود
                    </p>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div 
                          className={`aspect-square rounded-xl overflow-hidden border-3 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                            index === coverIndex 
                              ? 'border-amber-500 ring-2 ring-amber-300 scale-105' 
                              : 'border-gray-200 hover:border-blue-400 hover:scale-105'
                          }`}
                          onClick={() => selectCover(index)}
                        >
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`عکس ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {/* Cover badge */}
                          {index === coverIndex && (
                            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-amber-500/90 to-transparent py-2 px-2">
                              <div className="flex items-center justify-center gap-1 text-white text-xs font-bold">
                                <Star className="w-3 h-3 fill-white" />
                                تصویر اصلی
                              </div>
                            </div>
                          )}
                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center hover:from-red-600 hover:to-red-700 shadow-lg transform transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          {/* Number badge */}
                          <div className="absolute bottom-2 left-2">
                            <span className="bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-bold">
                              #{index + 1}
                            </span>
                          </div>
                          {/* Select as cover hint */}
                          {index !== coverIndex && (
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <span className="bg-white/90 text-gray-800 text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
                                انتخاب به عنوان کاور
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-300 rounded-xl p-5 shadow-lg" dir="rtl">
              <div className="flex gap-3">
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-2.5 rounded-xl shadow-md flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div className="text-sm text-gray-800">
                  <p className="font-bold text-gray-900 mb-3 text-base">💡 نکات مهم برای ثبت آگهی موفق</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">✓</span>
                      <span><strong>عکس‌های باکیفیت:</strong> حداقل ۵ تا ۱۰ عکس واضح و روشن از زوایای مختلف آپلود کنید</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">✓</span>
                      <span><strong>عنوان جذاب:</strong> عنوان کامل و توصیفی انتخاب کنید (حداقل ۱۰ کاراکتر)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">✓</span>
                      <span><strong>توضیحات کامل:</strong> تمام جزئیات مهم محصول را بنویسید (حداقل ۵۰ کاراکتر)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">✓</span>
                      <span><strong>قیمت منصفانه:</strong> قیمت واقعی و متناسب با بازار را وارد کنید</span>
                    </li>
                  </ul>
                  <div className="mt-3 pt-3 border-t border-amber-200">
                    <p className="text-xs text-gray-600 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-600" />
                      <span>آگهی‌های دارای تصویر کامل تا <strong className="text-amber-700">۵ برابر</strong> بیشتر بازدید می‌شوند!</span>
                    </p>
                  </div>
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
