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
    kategori_id: "",
    il_id: "",
    durum: "kullanilmis",
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
      setImages(prev => [...prev, ...files].slice(0, 10));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      alert('İlan verme özelliği yakında aktif olacak');
      setLoading(false);
    }, 1000);
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Yeni İlan Ver</h1>
            <p className="text-gray-600">İlanınızı detaylı ve eksiksiz doldurun</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* İlan Başlığı */}
            <div className="border border-gray-200 rounded-lg p-6">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                İlan Başlığı *
              </label>
              <input
                type="text"
                value={formData.baslik}
                onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Örn: iPhone 13 Pro 256GB Mavi"
                required
              />
              <p className="text-sm text-gray-500 mt-2">Net ve açıklayıcı bir başlık kullanın</p>
            </div>

            {/* Kategori ve Konum */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Kategori ve Konum</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori *
                  </label>
                  <select
                    value={formData.kategori_id}
                    onChange={(e) => setFormData({ ...formData, kategori_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Kategori seçin</option>
                    {kategoriler.map(k => (
                      <option key={k.id} value={k.id}>{k.ad}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şehir *
                  </label>
                  <select
                    value={formData.il_id}
                    onChange={(e) => setFormData({ ...formData, il_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Şehir seçin</option>
                    {iller.map(il => (
                      <option key={il.id} value={il.id}>{il.ad}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Açıklama */}
            <div className="border border-gray-200 rounded-lg p-6">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Açıklama *
              </label>
              <textarea
                value={formData.aciklama}
                onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={8}
                placeholder="Ürününüzü detaylı şekilde açıklayın. Özellikler, kullanım süresi, durumu vb."
                required
              />
              <p className="text-sm text-gray-500 mt-2">En az 50 karakter giriniz</p>
            </div>

            {/* Fiyat ve Durum */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Fiyat ve Durum Bilgileri</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiyat (AFN) *
                  </label>
                  <input
                    type="number"
                    value={formData.fiyat}
                    onChange={(e) => setFormData({ ...formData, fiyat: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiyat Tipi
                  </label>
                  <select
                    value={formData.fiyat_tipi}
                    onChange={(e) => setFormData({ ...formData, fiyat_tipi: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="negotiable">Pazarlık Yapılabilir</option>
                    <option value="fixed">Sabit Fiyat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durum *
                  </label>
                  <select
                    value={formData.durum}
                    onChange={(e) => setFormData({ ...formData, durum: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="yeni">Sıfır</option>
                    <option value="az_kullanilmis">Az Kullanılmış</option>
                    <option value="kullanilmis">Kullanılmış</option>
                    <option value="hasarli">Hasarlı</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Fotoğraflar */}
            <div className="border border-gray-200 rounded-lg p-6">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Fotoğraflar (En fazla 10)
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
                  <p className="text-gray-700 font-medium mb-2">Fotoğraf yüklemek için tıklayın</p>
                  <p className="text-sm text-gray-500">PNG, JPG, JPEG (Maksimum 5MB her biri)</p>
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
                          Ana Resim
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bilgilendirme */}
            <div className="border-2 border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold text-gray-900 mb-1">İlan Kuralları</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Gerçek ve doğru bilgiler girin</li>
                    <li>• Ürüne ait net fotoğraflar ekleyin</li>
                    <li>• Detaylı açıklama yazın</li>
                    <li>• İletişim bilgilerinizi güncel tutun</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'İlan Yayınlanıyor...' : 'İlanı Yayınla'}
              </button>
              <button
                type="button"
                className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 px-6 py-3.5 rounded-lg font-semibold transition-colors"
                onClick={() => window.history.back()}
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
