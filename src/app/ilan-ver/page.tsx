"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Upload, X, ArrowLeft, Smartphone, Car, Wrench,
  ChevronDown, FolderOpen, Tag, Menu, Shirt, Home as HomeIcon, BookOpen
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [districts, setDistricts] = useState<string[]>([]);
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
    durum: "yeni",
    marka: "",
    model: "",
  });

  const cities = getCitiesList();

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
    
    if (formData.aciklama.length < 50) {
      alert('توضیحات باید حداقل ۵۰ کاراکتر باشد');
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

      {/* Star Decoration - Bottom Right */}
      <div className="absolute bottom-8 right-8 z-20">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-white/40">
          <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" fill="currentColor"/>
        </svg>
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

                {/* Tüm Kategoriler Dropdown */}
                {kategoriler.length > 6 && (
                  <div className="relative">
                    <div className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl">
                      <Tag className="w-4 h-4 text-blue-400" />
                      <select
                        value={formData.kategori_id}
                        onChange={(e) => handleKategoriChange(e.target.value)}
                        className="flex-1 bg-transparent text-white/80 text-sm focus:outline-none cursor-pointer"
                      >
                        <option value="" className="text-gray-900">همه دسته بندی ها</option>
                        {kategoriler.map(kat => (
                          <option key={kat.id} value={kat.id} className="text-gray-900">{kat.ad_dari || kat.ad}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-white/50" />
                    </div>
                  </div>
                )}

                {/* Alt Kategoriler Dropdown - Sadece alt kategori varsa göster */}
                {altKategoriler.length > 0 && (
                  <div className="relative">
                    <div className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                      </div>
                      <select
                        value={formData.alt_kategori_id}
                        onChange={(e) => setFormData({ ...formData, alt_kategori_id: e.target.value })}
                        className="flex-1 bg-transparent text-white/80 text-sm focus:outline-none cursor-pointer"
                      >
                        <option value="" className="text-gray-900">زیردسته بندی انتخاب کنید</option>
                        {altKategoriler.map(alt => (
                          <option key={alt.id} value={alt.id} className="text-gray-900">{alt.ad_dari || alt.ad}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-white/50" />
                    </div>
                  </div>
                )}

                {/* Location */}
                <div>
                  <h3 className="text-white font-semibold text-sm mb-4">موقعیت</h3>
                  <div className="space-y-2.5">
                    {/* Şehir */}
                    <div className="relative">
                      <select
                        value={formData.il_id}
                        onChange={(e) => handleCityChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl text-white/80 text-sm focus:outline-none appearance-none cursor-pointer"
                        required
                      >
                        <option value="" className="text-gray-900">انتخاب شهر</option>
                        {cities.map(city => (
                          <option key={city.id} value={city.id} className="text-gray-900">{city.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                    </div>

                    {/* İlçe */}
                    <div className="relative">
                      <select
                        value={formData.ilce}
                        onChange={(e) => setFormData({ ...formData, ilce: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl text-white/80 text-sm focus:outline-none appearance-none cursor-pointer disabled:opacity-40"
                        disabled={!formData.il_id}
                      >
                        <option value="" className="text-gray-900">انتخاب ناحیه</option>
                        {districts.map(district => (
                          <option key={district} value={district} className="text-gray-900">{district}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
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
                  {/* Fiyat */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/90 rounded-xl">
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
                      className="flex-1 bg-transparent text-gray-700 placeholder:text-gray-400 focus:outline-none text-sm"
                      placeholder="قیمت"
                      required
                    />
                  </div>

                  {/* Durum */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/90 rounded-xl">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <div className="flex-1">
                      <p className="text-gray-700 text-sm font-medium leading-none">وضعیت</p>
                      <p className="text-gray-400 text-[10px]">(نو/کارکرده)</p>
                    </div>
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
                      <div key={index} className="relative group aspect-square">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-gray-700 border border-white/30 text-white flex items-center justify-center text-xs"
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
