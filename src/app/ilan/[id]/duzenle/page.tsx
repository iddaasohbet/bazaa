"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Upload, X, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Kategori {
  id: number;
  ad: string;
}

interface Il {
  id: number;
  ad: string;
}

export default function IlanDuzenle({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [iller, setIller] = useState<Il[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    baslik: "",
    aciklama: "",
    fiyat: "",
    fiyat_tipi: "negotiable",
    kategori_id: "",
    il_id: "",
    durum: "kullanilmis",
  });

  useEffect(() => {
    // Auth kontrolü
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/giris?redirect=/ilan/' + resolvedParams.id + '/duzenle');
      return;
    }

    fetchData();
    fetchIlan();
  }, []);

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

  const fetchIlan = async () => {
    try {
      const response = await fetch(`/api/ilanlar/${resolvedParams.id}`);
      const data = await response.json();
      
      if (data.success) {
        const ilan = data.data;
        setFormData({
          baslik: ilan.baslik,
          aciklama: ilan.aciklama,
          fiyat: ilan.fiyat.toString(),
          fiyat_tipi: ilan.fiyat_tipi,
          kategori_id: ilan.kategori_id?.toString() || "",
          il_id: ilan.il_id?.toString() || "",
          durum: ilan.durum,
        });
        setImages(ilan.resimler || []);
      }
    } catch (error) {
      console.error('İlan yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      const maxSize = 5 * 1024 * 1024;
      const validFiles = files.filter(file => {
        if (file.size > maxSize) {
          alert(`${file.name} خیلی بزرگ است! حداکثر اندازه ۵ مگابایت است.`);
          return false;
        }
        return true;
      });
      
      setNewImages(prev => [...prev, ...validFiles].slice(0, 10));
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeOldImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Yeni resimleri base64'e çevir
      const newImagesBase64: string[] = [];
      for (const image of newImages) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(image);
        });
        newImagesBase64.push(base64);
      }

      // Eski ve yeni resimleri birleştir
      const allImages = [...images, ...newImagesBase64];
      
      // İlan verilerini hazırla
      const ilanData = {
        baslik: formData.baslik,
        aciklama: formData.aciklama,
        fiyat: parseFloat(formData.fiyat),
        fiyat_tipi: formData.fiyat_tipi,
        kategori_id: parseInt(formData.kategori_id),
        il_id: parseInt(formData.il_id),
        durum: formData.durum,
        resimler: allImages,
      };

      // API'ye gönder
      const response = await fetch(`/api/ilanlar/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ilanData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || 'خطا در به‌روزرسانی آگهی');
        setSaving(false);
        return;
      }

      alert('✅ آگهی با موفقیت به‌روزرسانی شد!');
      router.push('/ilanlarim');
    } catch (error) {
      console.error('İlan güncelleme hatası:', error);
      alert('خطا در به‌روزرسانی آگهی');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="border border-gray-200 rounded-lg p-16 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
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
          <div className="mb-8 flex items-center gap-4">
            <Link 
              href="/ilanlarim"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ویرایش آگهی</h1>
              <p className="text-gray-600 mt-1">اطلاعات آگهی خود را به‌روزرسانی کنید</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resimler */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <label className="block text-sm font-bold text-gray-900 mb-4">
                عکس‌های آگهی (حداکثر ۱۰ عکس)
              </label>
              
              {/* Mevcut Resimler */}
              {images.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">عکس‌های فعلی:</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Resim ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeOldImage(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Yeni Resimler */}
              {newImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">عکس‌های جدید:</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {newImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Yeni ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-gray-50">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">برای بارگذاری کلیک کنید</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Form Fields */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  عنوان آگهی *
                </label>
                <input
                  type="text"
                  required
                  value={formData.baslik}
                  onChange={(e) => setFormData({...formData, baslik: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: iPhone 13 Pro 256GB"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  توضیحات *
                </label>
                <textarea
                  required
                  value={formData.aciklama}
                  onChange={(e) => setFormData({...formData, aciklama: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="توضیحات کامل محصول را بنویسید..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    دسته‌بندی *
                  </label>
                  <select
                    required
                    value={formData.kategori_id}
                    onChange={(e) => setFormData({...formData, kategori_id: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">انتخاب کنید</option>
                    {kategoriler.map(kat => (
                      <option key={kat.id} value={kat.id}>{kat.ad}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    شهر *
                  </label>
                  <select
                    required
                    value={formData.il_id}
                    onChange={(e) => setFormData({...formData, il_id: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">انتخاب کنید</option>
                    {iller.map(il => (
                      <option key={il.id} value={il.id}>{il.ad}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    قیمت (افغانی) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.fiyat}
                    onChange={(e) => setFormData({...formData, fiyat: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="۱۰۰۰"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    نوع قیمت
                  </label>
                  <select
                    value={formData.fiyat_tipi}
                    onChange={(e) => setFormData({...formData, fiyat_tipi: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="negotiable">قابل چانه زنی</option>
                    <option value="fixed">قیمت ثابت</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  وضعیت محصول
                </label>
                <select
                  value={formData.durum}
                  onChange={(e) => setFormData({...formData, durum: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="yeni">نو</option>
                  <option value="az_kullanilmis">کم استفاده</option>
                  <option value="kullanilmis">استفاده شده</option>
                  <option value="hasarli">آسیب دیده</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-lg font-bold text-lg transition-colors"
              >
                {saving ? 'در حال ذخیره...' : 'به‌روزرسانی آگهی'}
              </button>
              <Link
                href="/ilanlarim"
                className="px-6 py-4 border-2 border-gray-300 hover:bg-gray-50 rounded-lg font-bold transition-colors"
              >
                لغو
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}




















