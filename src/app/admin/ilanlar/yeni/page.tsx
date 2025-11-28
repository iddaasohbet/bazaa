"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Save,
  AlertCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";

interface Kategori {
  id: number;
  ad: string;
  slug: string;
}

interface Il {
  id: number;
  ad: string;
  slug: string;
}

export default function YeniIlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [iller, setIller] = useState<Il[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    baslik: "",
    aciklama: "",
    fiyat: "",
    eski_fiyat: "",
    fiyat_tipi: "negotiable",
    kategori_id: "",
    il_id: "",
    durum: "kullanilmis",
    stok_miktari: "1",
    video_url: "",
  });

  useEffect(() => {
    fetchKategoriler();
    fetchIller();
  }, []);

  const fetchKategoriler = async () => {
    try {
      const response = await fetch('/api/kategoriler');
      const data = await response.json();
      if (data.success) {
        setKategoriler(data.data);
      }
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Convert to base64 or upload to server
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setImages(prev => [...prev, base64String]);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Resim yükleme hatası:', error);
      alert('خطا در بارگذاری تصویر');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.baslik || !formData.aciklama || !formData.fiyat || !formData.kategori_id || !formData.il_id) {
      alert('لطفاً تمام فیلدهای الزامی را پر کنید');
      return;
    }

    if (images.length === 0) {
      alert('لطفاً حداقل یک تصویر بارگذاری کنید');
      return;
    }

    setLoading(true);

    try {
      // Admin token'ı al
      const adminToken = localStorage.getItem('admin_token');
      const userData = localStorage.getItem('user');
      let kullaniciId = 1; // Default admin ID
      
      if (userData) {
        const user = JSON.parse(userData);
        kullaniciId = user.id;
      }

      const response = await fetch('/api/admin/ilanlar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          ...formData,
          fiyat: parseFloat(formData.fiyat),
          eski_fiyat: formData.eski_fiyat ? parseFloat(formData.eski_fiyat) : null,
          kategori_id: parseInt(formData.kategori_id),
          il_id: parseInt(formData.il_id),
          stok_miktari: parseInt(formData.stok_miktari),
          kullanici_id: kullaniciId,
          resimler: images,
          aktif: true
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('آگهی با موفقیت ایجاد شد');
        router.push('/admin/ilanlar');
      } else {
        alert(data.message || 'خطا در ایجاد آگهی');
      }
    } catch (error) {
      console.error('İlan oluşturma hatası:', error);
      alert('خطا در ایجاد آگهی');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // İndirim yüzdesini hesapla
  const calculateDiscount = () => {
    if (formData.eski_fiyat && formData.fiyat) {
      const oldPrice = parseFloat(formData.eski_fiyat);
      const newPrice = parseFloat(formData.fiyat);
      if (oldPrice > newPrice) {
        return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
      }
    }
    return 0;
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">آگهی جدید</h1>
            <p className="text-gray-600 mt-1">ایجاد آگهی جدید در سیستم</p>
          </div>
          <Link
            href="/admin/ilanlar"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>بازگشت</span>
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Temel Bilgiler */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  اطلاعات اصلی
                </h2>

                <div className="space-y-5">
                  {/* Başlık */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      عنوان آگهی <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="baslik"
                      value={formData.baslik}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="مثال: گوشی iPhone 13 Pro Max 256GB"
                      required
                    />
                  </div>

                  {/* Açıklama */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      توضیحات <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="aciklama"
                      value={formData.aciklama}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      placeholder="توضیحات کامل محصول خود را اینجا بنویسید..."
                      required
                    />
                  </div>

                  {/* Kategori ve İl */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        دسته‌بندی <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="kategori_id"
                        value={formData.kategori_id}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">انتخاب دسته‌بندی</option>
                        {kategoriler.map((kat) => (
                          <option key={kat.id} value={kat.id}>
                            {kat.ad}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        شهر <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="il_id"
                        value={formData.il_id}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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

                  {/* Durum ve Stok */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        وضعیت محصول <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="durum"
                        value={formData.durum}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="yeni">نو</option>
                        <option value="az_kullanilmis">کم استفاده</option>
                        <option value="kullanilmis">استفاده شده</option>
                        <option value="hasarli">معیوب</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        موجودی
                      </label>
                      <input
                        type="number"
                        name="stok_miktari"
                        value={formData.stok_miktari}
                        onChange={handleChange}
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fiyat Bilgileri */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">قیمت‌گذاری</h2>

                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        قیمت (افغانی) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="fiyat"
                        value={formData.fiyat}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="45000"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        قیمت قبلی (اختیاری)
                      </label>
                      <input
                        type="number"
                        name="eski_fiyat"
                        value={formData.eski_fiyat}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="50000"
                      />
                    </div>
                  </div>

                  {calculateDiscount() > 0 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <span className="font-semibold">تخفیف:</span> {calculateDiscount()}٪ کاهش قیمت نمایش داده می‌شود
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      نوع قیمت
                    </label>
                    <select
                      name="fiyat_tipi"
                      value={formData.fiyat_tipi}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="negotiable">قابل مذاکره</option>
                      <option value="fixed">قیمت ثابت</option>
                    </select>
                  </div>

                  {/* Video URL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      لینک ویدیو (اختیاری)
                    </label>
                    <input
                      type="url"
                      name="video_url"
                      value={formData.video_url}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Images */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">تصاویر محصول</h2>

                {/* Upload Area */}
                <label className="block mb-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
                    {uploadingImage ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        <p className="text-sm text-gray-600">در حال بارگذاری...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          بارگذاری تصویر
                        </p>
                        <p className="text-xs text-gray-500">
                          حداکثر 5MB - JPG, PNG, WEBP
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>

                {/* Image Preview Grid */}
                {images.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700">
                      تصاویر انتخاب شده ({images.length})
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 left-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-1 right-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded">
                              تصویر اصلی
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {images.length === 0 && (
                  <div className="flex flex-col items-center gap-2 py-6 text-gray-400">
                    <ImageIcon className="w-12 h-12" />
                    <p className="text-sm">هیچ تصویری بارگذاری نشده</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || images.length === 0}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>در حال ایجاد...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>ایجاد آگهی</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

