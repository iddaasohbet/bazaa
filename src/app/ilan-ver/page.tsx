"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Upload, X, ArrowLeft, Smartphone, Car, Wrench,
  ChevronDown, FolderOpen, Tag, Menu, Shirt, Home as HomeIcon, BookOpen, Star
} from "lucide-react";
import { getCitiesList, getDistrictsList } from "@/lib/cities";

interface Kategori {
  id: number;
  ad: string;
  ad_dari?: string;
  ikon?: string;
}

interface AltKategori {
  id: number;
  ad: string;
  ad_dari?: string;
  slug: string;
}

export default function IlanVer() {
  const router = useRouter();
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [altKategoriler, setAltKategoriler] = useState<AltKategori[]>([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0); // Ana fotoğraf indexi
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [districts, setDistricts] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // Dropdown states
  const [allCatOpen, setAllCatOpen] = useState(false);
  const [subCatOpen, setSubCatOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [durumOpen, setDurumOpen] = useState(false);

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
    durum: "yeni",
    marka: "",
    model: "",
  });

  const cities = getCitiesList();

  // Dışarı tıklanınca dropdown'ları kapat
  useEffect(() => {
    const handleClickOutside = () => {
      setAllCatOpen(false);
      setSubCatOpen(false);
      setCityOpen(false);
      setDistrictOpen(false);
      setDurumOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Auth check
  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = localStorage.getItem('user');
        if (!user) {
          router.replace('/giris?redirect=/ilan-ver');
          return;
        }
        const userData = JSON.parse(user);
        if (!userData?.email) {
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

  // Fetch categories
  useEffect(() => {
    if (isAuthenticated) {
      fetchKategoriler();
    }
  }, [isAuthenticated]);

  const fetchKategoriler = async () => {
    try {
      const response = await fetch('/api/kategoriler');
      const data = await response.json();
      if (data.success) setKategoriler(data.data);
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const handleCityChange = (cityId: string) => {
    setFormData({ ...formData, il_id: cityId, ilce: "" });
    setDistricts(getDistrictsList(cityId));
  };

  const handleKategoriChange = async (kategoriId: string) => {
    setFormData({ ...formData, kategori_id: kategoriId, alt_kategori_id: "" });
    setAltKategoriler([]);
    
    if (kategoriId) {
      try {
        const response = await fetch(`/api/alt-kategoriler?kategori_id=${kategoriId}`);
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setAltKategoriler(data.data);
        }
      } catch (error) {
        console.error('Alt kategoriler yüklenemedi:', error);
      }
    }
  };

  // Image compression
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
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
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.85);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const remainingSlots = 10 - images.length;
      
      if (remainingSlots === 0) {
        alert('حداکثر ۱۰ عکس می‌توانید آپلود کنید');
        return;
      }

      const compressedFiles: File[] = [];
      for (const file of files.slice(0, remainingSlots)) {
        const compressed = await compressImage(file);
        compressedFiles.push(compressed);
      }
      
      setImages([...images, ...compressedFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    // Ana resim silinirse veya öncesindeki bir resim silinirse index'i ayarla
    if (index === mainImageIndex) {
      setMainImageIndex(0);
    } else if (index < mainImageIndex) {
      setMainImageIndex(prev => prev - 1);
    }
  };

  // Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length < 10) setIsDragging(true);
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

    if (images.length >= 10) return;

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );

    if (files.length === 0) return;

    const remainingSlots = 10 - images.length;
    const compressedFiles: File[] = [];
    
    for (const file of files.slice(0, remainingSlots)) {
      const compressed = await compressImage(file);
      compressedFiles.push(compressed);
    }
    
    setImages([...images, ...compressedFiles]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.kategori_id || !formData.il_id) {
      alert('لطفا دسته بندی و شهر را انتخاب کنید');
      return;
    }
    
    if (formData.baslik.length < 10) {
      alert('عنوان باید حداقل ۱۰ کاراکتر باشد');
      return;
    }
    
    if (formData.aciklama.length < 20) {
      alert('توضیحات باید حداقل ۲۰ کاراکتر باشد');
      return;
    }
    
    if (!formData.fiyat && !formData.fiyat_usd) {
      alert('لطفا قیمت را وارد کنید');
      return;
    }
    
    setLoading(true);
    
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        router.push('/giris?redirect=/ilan-ver');
        return;
      }

      const userData = JSON.parse(userStr);
      
      // Resimleri sırala - ana resim ilk sıraya
      const sortedImages = [...images];
      if (mainImageIndex > 0 && mainImageIndex < sortedImages.length) {
        const mainImage = sortedImages.splice(mainImageIndex, 1)[0];
        sortedImages.unshift(mainImage);
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
        kullanici_id: userData.id,
        resimler: resimlerBase64,
      };

      const response = await fetch('/api/ilanlar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ilanData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || 'خطا در ثبت آگهی');
        setLoading(false);
        return;
      }

      alert('آگهی با موفقیت منتشر شد!');
      router.push('/ilanlarim');
    } catch (error) {
      console.error('خطا در ثبت:', error);
      alert('خطایی رخ داد');
      setLoading(false);
    }
  };

  if (checking || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] via-[#3b82f6] to-[#8b5cf6] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Sabit kategori listesi - Görseldeki gibi
  const fixedCategories = [
    { id: 1, name: 'Apparel', icon: Shirt, gradient: 'from-green-400 via-emerald-400 to-cyan-400' },
    { id: 2, name: 'Electronics', icon: Smartphone, gradient: 'from-cyan-400 to-blue-500' },
    { id: 3, name: 'Home', icon: HomeIcon, gradient: 'from-orange-400 via-red-400 to-pink-400' },
    { id: 4, name: 'Vehicles', icon: Car, gradient: 'from-purple-500 to-indigo-600' },
    { id: 5, name: 'Hobbies', icon: BookOpen, gradient: 'from-amber-400 to-orange-500' },
    { id: 6, name: 'Services', icon: Wrench, gradient: 'from-yellow-400 to-amber-500' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f4e] via-[#2d3a8c] to-[#6b3fa0]"></div>
      
      {/* Background Blur Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-purple-500/25 rounded-full blur-[120px]"></div>
        <div className="absolute top-[50%] right-[30%] w-[400px] h-[400px] bg-pink-500/15 rounded-full blur-[80px]"></div>
      </div>

      {/* Back Button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors group z-20"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </Link>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-[40px] border border-white/20 p-8 md:p-10 shadow-2xl w-full max-w-[1300px]">
          
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN - Title + Category + Location */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Title */}
                <div className="text-center lg:text-right mb-2">
                  <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    ثبت آگهی
                  </h1>
                  <p className="text-white/60 text-sm mt-2">آگهی جدید ایجاد کنید</p>
                </div>

                {/* Category - İlk 6 kategori butonları */}
                <div>
                  <h3 className="text-white font-semibold text-sm mb-4">دسته بندی</h3>
                  <div className="grid grid-cols-3 gap-2.5">
                    {kategoriler.slice(0, 6).map((kat, index) => {
                      const gradients = [
                        'from-green-400 via-emerald-400 to-cyan-400',
                        'from-cyan-400 to-blue-500',
                        'from-orange-400 via-red-400 to-pink-400',
                        'from-purple-500 to-indigo-600',
                        'from-amber-400 to-orange-500',
                        'from-yellow-400 to-amber-500',
                      ];
                      const icons = [Shirt, Smartphone, HomeIcon, Car, BookOpen, Wrench];
                      const IconComp = icons[index] || Tag;
                      const isSelected = formData.kategori_id === kat.id.toString();
                      
                      return (
                        <button
                          key={kat.id}
                          type="button"
                          onClick={() => handleKategoriChange(kat.id.toString())}
                          className={`p-3 rounded-2xl backdrop-blur-md border-2 transition-all flex flex-col items-center gap-2 ${
                            isSelected
                              ? 'bg-white/15 border-amber-400 shadow-lg shadow-amber-400/20'
                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[index] || 'from-gray-400 to-gray-500'} flex items-center justify-center shadow-lg`}>
                            <IconComp className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-white text-[11px] font-medium">{kat.ad_dari || kat.ad}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tüm Kategoriler Dropdown - Glassmorphism */}
                {kategoriler.length > 6 && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setAllCatOpen(!allCatOpen); setSubCatOpen(false); setCityOpen(false); setDistrictOpen(false); setDurumOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl hover:bg-white/15 transition-all"
                    >
                      <Tag className="w-4 h-4 text-blue-400" />
                      <span className="flex-1 text-right text-white/80 text-sm">
                        {formData.kategori_id 
                          ? kategoriler.find(k => k.id.toString() === formData.kategori_id)?.ad_dari || kategoriler.find(k => k.id.toString() === formData.kategori_id)?.ad
                          : 'همه دسته بندی ها'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${allCatOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {allCatOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div 
                          className="px-4 py-3 hover:bg-white/20 cursor-pointer text-white/90 text-sm transition-colors rounded-t-2xl"
                          onClick={() => { handleKategoriChange(''); setAllCatOpen(false); }}
                        >
                          همه دسته بندی ها
                        </div>
                        {kategoriler.map(kat => (
                          <div 
                            key={kat.id}
                            className={`px-4 py-3 hover:bg-white/20 cursor-pointer text-sm transition-colors ${formData.kategori_id === kat.id.toString() ? 'bg-white/20 text-white' : 'text-white/80'}`}
                            onClick={() => { handleKategoriChange(kat.id.toString()); setAllCatOpen(false); }}
                          >
                            {kat.ad_dari || kat.ad}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Alt Kategoriler Dropdown - Glassmorphism */}
                {altKategoriler.length > 0 && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setSubCatOpen(!subCatOpen); setAllCatOpen(false); setCityOpen(false); setDistrictOpen(false); setDurumOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl hover:bg-white/15 transition-all"
                    >
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                      </div>
                      <span className="flex-1 text-right text-white/80 text-sm">
                        {formData.alt_kategori_id 
                          ? altKategoriler.find(a => a.id.toString() === formData.alt_kategori_id)?.ad_dari || altKategoriler.find(a => a.id.toString() === formData.alt_kategori_id)?.ad
                          : 'زیردسته بندی انتخاب کنید'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${subCatOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {subCatOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div 
                          className="px-4 py-3 hover:bg-white/20 cursor-pointer text-white/90 text-sm transition-colors rounded-t-2xl"
                          onClick={() => { setFormData({ ...formData, alt_kategori_id: '' }); setSubCatOpen(false); }}
                        >
                          زیردسته بندی انتخاب کنید
                        </div>
                        {altKategoriler.map(alt => (
                          <div 
                            key={alt.id}
                            className={`px-4 py-3 hover:bg-white/20 cursor-pointer text-sm transition-colors ${formData.alt_kategori_id === alt.id.toString() ? 'bg-white/20 text-white' : 'text-white/80'}`}
                            onClick={() => { setFormData({ ...formData, alt_kategori_id: alt.id.toString() }); setSubCatOpen(false); }}
                          >
                            {alt.ad_dari || alt.ad}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Location */}
                <div>
                  <h3 className="text-white font-semibold text-sm mb-4">موقعیت</h3>
                  <div className="space-y-2.5">
                    {/* Şehir - Glassmorphism */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setCityOpen(!cityOpen); setAllCatOpen(false); setSubCatOpen(false); setDistrictOpen(false); setDurumOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl hover:bg-white/15 transition-all"
                      >
                        <span className="flex-1 text-right text-white/80 text-sm">
                          {formData.il_id 
                            ? cities.find(c => c.id === formData.il_id)?.name
                            : 'انتخاب شهر'}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${cityOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {cityOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                          {cities.map(city => (
                            <div 
                              key={city.id}
                              className={`px-4 py-3 hover:bg-white/20 cursor-pointer text-sm transition-colors ${formData.il_id === city.id ? 'bg-white/20 text-white' : 'text-white/80'}`}
                              onClick={() => { handleCityChange(city.id); setCityOpen(false); }}
                            >
                              {city.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* İlçe - Glassmorphism */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); if(formData.il_id) { setDistrictOpen(!districtOpen); setAllCatOpen(false); setSubCatOpen(false); setCityOpen(false); setDurumOpen(false); } }}
                        className={`w-full flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl transition-all ${formData.il_id ? 'hover:bg-white/15 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
                        disabled={!formData.il_id}
                      >
                        <span className="flex-1 text-right text-white/80 text-sm">
                          {formData.ilce || 'انتخاب ناحیه'}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${districtOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {districtOpen && districts.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                          {districts.map((district, index) => (
                            <div 
                              key={`${district}-${index}`}
                              className={`px-4 py-3 hover:bg-white/20 cursor-pointer text-sm transition-colors ${formData.ilce === district ? 'bg-white/20 text-white' : 'text-white/80'}`}
                              onClick={() => { setFormData({ ...formData, ilce: district }); setDistrictOpen(false); }}
                            >
                              {district}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* MIDDLE COLUMN - Product Info */}
              <div className="lg:col-span-4 space-y-4">
                <h3 className="text-white font-semibold text-base mb-3">اطلاعات محصول</h3>
                
                {/* Ürün başlığı */}
                <input
                  type="text"
                  value={formData.baslik}
                  onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                  className="w-full px-4 py-3.5 bg-white/90 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  placeholder="عنوان آگهی"
                  required
                />

                {/* Ürün açıklaması label */}
                <p className="text-white/80 text-sm">توضیحات آگهی</p>

                {/* Ürün açıklaması textarea */}
                <textarea
                  value={formData.aciklama}
                  onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                  className="w-full px-4 py-3.5 bg-white/90 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm"
                  rows={4}
                  placeholder="توضیحات آگهی"
                  required
                />

                {/* Fiyat & Durum */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Fiyat - Pro tasarım */}
                  <div className="flex items-center bg-white/90 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 flex-1">
                      <FolderOpen className="w-5 h-5 text-pink-500" />
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
                        className="flex-1 bg-transparent text-gray-700 placeholder:text-gray-400 focus:outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="قیمت"
                        required
                      />
                    </div>
                    {/* Spinner Buttons */}
                    <div className="flex flex-col border-r border-gray-200">
                      <button 
                        type="button"
                        onClick={() => {
                          const current = parseFloat(formData.para_birimi === 'AFN' ? formData.fiyat : formData.fiyat_usd) || 0;
                          if (formData.para_birimi === 'AFN') {
                            setFormData({ ...formData, fiyat: (current + 100).toString() });
                          } else {
                            setFormData({ ...formData, fiyat_usd: (current + 10).toString(), fiyat: ((current + 10) * 70).toString() });
                          }
                        }}
                        className="px-2 py-1 hover:bg-gray-100 text-gray-500 text-xs"
                      >
                        ▲
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          const current = parseFloat(formData.para_birimi === 'AFN' ? formData.fiyat : formData.fiyat_usd) || 0;
                          if (current > 0) {
                            if (formData.para_birimi === 'AFN') {
                              setFormData({ ...formData, fiyat: Math.max(0, current - 100).toString() });
                            } else {
                              const newVal = Math.max(0, current - 10);
                              setFormData({ ...formData, fiyat_usd: newVal.toString(), fiyat: (newVal * 70).toString() });
                            }
                          }
                        }}
                        className="px-2 py-1 hover:bg-gray-100 text-gray-500 text-xs"
                      >
                        ▼
                      </button>
                    </div>
                  </div>

                  {/* Durum - Glassmorphism */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setDurumOpen(!durumOpen); setAllCatOpen(false); setSubCatOpen(false); setCityOpen(false); setDistrictOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-3 bg-white/90 rounded-xl hover:bg-white transition-all"
                    >
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="flex-1 text-right text-gray-700 text-sm">
                        {formData.durum === 'yeni' && 'نو (جدید)'}
                        {formData.durum === 'az_kullanilmis' && 'کم استفاده شده'}
                        {formData.durum === 'kullanilmis' && 'استفاده شده'}
                        {formData.durum === 'hasarli' && 'فرسوده'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${durumOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {durumOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl z-50 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        {[
                          { value: 'yeni', label: 'نو (جدید)' },
                          { value: 'az_kullanilmis', label: 'کم استفاده شده' },
                          { value: 'kullanilmis', label: 'استفاده شده' },
                          { value: 'hasarli', label: 'فرسوده' },
                        ].map(item => (
                          <div 
                            key={item.value}
                            className={`px-4 py-3 hover:bg-white/50 cursor-pointer text-sm transition-colors ${formData.durum === item.value ? 'bg-white/50 text-gray-900 font-medium' : 'text-gray-700'}`}
                            onClick={() => { setFormData({ ...formData, durum: item.value }); setDurumOpen(false); }}
                          >
                            {item.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Marka & Model */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Marka */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/90 rounded-xl">
                    <Tag className="w-5 h-5 text-orange-500" />
                    <input
                      type="text"
                      value={formData.marka}
                      onChange={(e) => setFormData({ ...formData, marka: e.target.value })}
                      className="flex-1 bg-transparent text-gray-700 placeholder:text-gray-400 focus:outline-none text-sm"
                      placeholder="برند"
                    />
                  </div>

                  {/* Model */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/90 rounded-xl">
                    <Menu className="w-5 h-5 text-blue-500" />
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="flex-1 bg-transparent text-gray-700 placeholder:text-gray-400 focus:outline-none text-sm"
                      placeholder="مدل"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - Photos */}
              <div className="lg:col-span-4 flex flex-col">
                <h3 className="text-white font-semibold text-base mb-3">تصاویر</h3>
                
                {/* Upload Area - Tüm alanı kapla */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex-1 min-h-[450px] flex flex-col items-center justify-center ${
                    isDragging
                      ? 'border-white/60 bg-white/10'
                      : 'border-white/30 bg-transparent hover:border-white/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="photos"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={images.length >= 10}
                  />
                  <label 
                    htmlFor="photos" 
                    className={`cursor-pointer flex flex-col items-center ${images.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center mb-4">
                      <Upload className="w-7 h-7 text-white/60" />
                    </div>
                    <p className="text-white/70 text-sm text-center">
                      عکس آپلود کنید یا اینجا رها کنید
                    </p>
                  </label>
                </div>

                {/* Thumbnails */}
                {images.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-4">
                    {images.map((image, index) => (
                      <div 
                        key={index} 
                        className={`relative group aspect-square cursor-pointer ${
                          mainImageIndex === index 
                            ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-transparent rounded-lg' 
                            : ''
                        }`}
                        onClick={() => setMainImageIndex(index)}
                        title={mainImageIndex === index ? 'عکس اصلی' : 'کلیک کنید برای انتخاب عکس اصلی'}
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {/* Ana Resim Badge */}
                        {mainImageIndex === index && (
                          <div className="absolute bottom-1 right-1 bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            اصلی
                          </div>
                        )}
                        {/* Yıldız ikonu - ana resim değilse göster */}
                        {mainImageIndex !== index && (
                          <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white/80 backdrop-blur-sm text-gray-600 px-1.5 py-0.5 rounded text-[9px] flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5" />
                              اصلی کنید
                            </div>
                          </div>
                        )}
                        {/* Silme butonu */}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                          className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-gray-700 border border-white/30 text-white flex items-center justify-center text-xs hover:bg-red-500 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 justify-start mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
                  >
                    {loading ? 'در حال ثبت...' : 'ثبت آگهی'}
                  </button>
                  <Link
                    href="/"
                    className="px-8 py-3 rounded-full font-semibold text-white/80 border border-white/30 hover:bg-white/10 transition-all"
                  >
                    انصراف
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
