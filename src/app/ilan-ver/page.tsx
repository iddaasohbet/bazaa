"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Upload, X, ArrowLeft, Smartphone, Home as HomeIcon, Sofa, Car, Briefcase, Wrench,
  MapPin, DollarSign, Tag, Image as ImageIcon, Sparkles, Check
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

// Kategori iconları
const categoryIcons: Record<string, any> = {
  'apparel': Sparkles,
  'electronics': Smartphone,
  'home': HomeIcon,
  'vehicles': Car,
  'hobbies': Sofa,
  'services': Wrench,
  'emlak': HomeIcon,
  'elektronik': Smartphone,
  'araclar': Car,
  'ev': HomeIcon,
  'is': Briefcase,
};

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
    para_birimi: "AFN",
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
        alert('Maksimum 10 resim yükleyebilirsiniz');
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
      alert('Lütfen kategori ve şehir seçiniz');
      return;
    }
    
    if (formData.baslik.length < 10) {
      alert('Başlık en az 10 karakter olmalıdır');
      return;
    }
    
    if (formData.aciklama.length < 50) {
      alert('Açıklama en az 50 karakter olmalıdır');
      return;
    }
    
    if (!formData.fiyat) {
      alert('Lütfen fiyat giriniz');
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
        fiyat_tipi: "negotiable",
        para_birimi: formData.para_birimi,
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
        alert(data.message || 'Hata oluştu');
        setLoading(false);
        return;
      }

      alert('İlan başarıyla yayınlandı!');
      router.push('/ilanlarim');
    } catch (error) {
      console.error('İlan ekleme hatası:', error);
      alert('Bir hata oluştu');
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

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#3b82f6] to-[#8b5cf6] animate-gradient-shift"></div>
      
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Back Button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors group z-10"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium hidden sm:inline">بازگشت به صفحه اصلی</span>
      </Link>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border-2 border-white/30 p-6 md:p-10 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Ürün Ekle
            </h1>
            <p className="text-white/80 text-sm">Yeni ilan oluşturun</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Category & Location */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Category */}
                <div>
                  <h3 className="text-white font-bold text-lg mb-4">Category</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {kategoriler.slice(0, 6).map((kat) => {
                      const IconComp = categoryIcons[kat.ikon || kat.ad.toLowerCase()] || Tag;
                      return (
                        <button
                          key={kat.id}
                          type="button"
                          onClick={() => handleKategoriChange(kat.id.toString())}
                          className={`p-4 rounded-2xl backdrop-blur-md border-2 transition-all flex flex-col items-center gap-2 ${
                            formData.kategori_id === kat.id.toString()
                              ? 'bg-white/40 border-white/60'
                              : 'bg-white/10 border-white/20 hover:bg-white/20'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            formData.kategori_id === kat.id.toString()
                              ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                              : 'bg-white/20'
                          }`}>
                            <IconComp className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-white text-xs font-medium">{kat.ad}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subcategories */}
                {altKategoriler.length > 0 && (
                  <div>
                    <label className="text-white text-sm font-medium mb-3 block">
                      Subcategories smı mini icons
                    </label>
                    <select
                      value={formData.alt_kategori_id}
                      onChange={(e) => setFormData({ ...formData, alt_kategori_id: e.target.value })}
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:border-white"
                    >
                      <option value="">Alt kategori seçin</option>
                      {altKategoriler.map(alt => (
                        <option key={alt.id} value={alt.id} className="text-gray-900">{alt.ad_dari || alt.ad}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Location */}
                <div>
                  <h3 className="text-white font-bold text-lg mb-4">Location</h3>
                  <div className="space-y-3">
                    <select
                      value={formData.il_id}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:border-white"
                      required
                    >
                      <option value="" className="text-gray-900">Şehir seçimi</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id} className="text-gray-900">{city.name}</option>
                      ))}
                    </select>

                    <select
                      value={formData.ilce}
                      onChange={(e) => setFormData({ ...formData, ilce: e.target.value })}
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:border-white disabled:opacity-50"
                      disabled={!formData.il_id}
                    >
                      <option value="" className="text-gray-900">İlçe seçimi</option>
                      {districts.map(district => (
                        <option key={district} value={district} className="text-gray-900">{district}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column - Product Info & Photos */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Product Info */}
                <div>
                  <h3 className="text-white font-bold text-lg mb-4">Product Info</h3>
                  <div className="space-y-3">
                    {/* Ürün başlığı */}
                    <input
                      type="text"
                      value={formData.baslik}
                      onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:border-white"
                      placeholder="Ürün başlığı"
                      required
                    />

                    {/* Ürün açıklaması */}
                    <textarea
                      value={formData.aciklama}
                      onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:border-white resize-none"
                      rows={4}
                      placeholder="Ürün açıklaması"
                      required
                    />

                    <div className="grid grid-cols-2 gap-3">
                      {/* Fiyat */}
                      <div className="relative">
                        <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                        <input
                          type="number"
                          value={formData.fiyat}
                          onChange={(e) => setFormData({ ...formData, fiyat: e.target.value })}
                          className="w-full pl-4 pr-11 py-3 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:border-white"
                          placeholder="Fiyat"
                          required
                        />
                      </div>

                      {/* Durum */}
                      <div className="flex items-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-white text-sm font-medium">Durum</span>
                        <select
                          value={formData.durum}
                          onChange={(e) => setFormData({ ...formData, durum: e.target.value })}
                          className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                        >
                          <option value="yeni" className="text-gray-900">Yeni/Kullanılmış</option>
                          <option value="kullanilmis" className="text-gray-900">Kullanılmış</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Marka */}
                      <div className="relative">
                        <Tag className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                        <input
                          type="text"
                          value={formData.marka}
                          onChange={(e) => setFormData({ ...formData, marka: e.target.value })}
                          className="w-full pl-4 pr-11 py-3 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:border-white"
                          placeholder="Marka"
                        />
                      </div>

                      {/* Model */}
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:border-white"
                        placeholder="Model"
                      />
                    </div>
                  </div>
                </div>

                {/* Photos */}
                <div>
                  <h3 className="text-white font-bold text-lg mb-4">Photos</h3>
                  
                  {/* Upload Area */}
                  <div
                    className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${
                      isDragging
                        ? 'border-white bg-white/20'
                        : images.length >= 10
                          ? 'border-white/20 bg-white/5'
                          : 'border-white/30 bg-white/10 hover:border-white hover:bg-white/15'
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
                      <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white font-medium mb-1">
                        {images.length >= 10 ? 'Maksimum dosya sayısına ulaşıldı' : 'Fotoğraf yükle veya buraya bırak'}
                      </p>
                      <p className="text-white/60 text-sm">
                        PNG, JPG • Maksimum 10 fotoğraf
                      </p>
                    </label>
                  </div>

                  {/* Thumbnails */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-5 gap-3 mt-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group aspect-square">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover rounded-xl border-2 border-white/30"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-4">
                  <Link
                    href="/"
                    className="px-6 py-3 rounded-xl border-2 border-white/30 text-white font-bold hover:bg-white/10 transition-all"
                  >
                    İptal Et
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative px-8 py-3 rounded-xl font-bold text-white overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative flex items-center gap-2">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Yükleniyor...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          İlanı Yayınla
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
      `}</style>
    </div>
  );
}
