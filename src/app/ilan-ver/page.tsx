"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Upload, X, AlertCircle, CheckCircle, ChevronRight, ChevronLeft, MapPin, Tag, FileText, DollarSign, Camera, Eye } from "lucide-react";
import { getCitiesList, getDistrictsList } from "@/lib/cities";

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
  const [districts, setDistricts] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const [formData, setFormData] = useState({
    baslik: "",
    aciklama: "",
    fiyat: "",
    fiyat_tipi: "negotiable",
    para_birimi: "AFN",
    fiyat_usd: "",
    kategori_id: "",
    il_id: "",
    ilce: "",
    durum: "kullanilmis",
    emlak_tipi: "",
  });

  const cities = getCitiesList();

  const steps = [
    { id: 1, title: "Kategori & Konum", icon: MapPin, description: "İlanınızın kategorisini ve konumunu seçin" },
    { id: 2, title: "İlan Bilgileri", icon: FileText, description: "Başlık ve açıklama ekleyin" },
    { id: 3, title: "Fiyat & Durum", icon: DollarSign, description: "Fiyat ve ürün durumunu belirleyin" },
    { id: 4, title: "Fotoğraflar", icon: Camera, description: "Ürün fotoğraflarını yükleyin" },
    { id: 5, title: "Önizleme", icon: Eye, description: "İlanınızı kontrol edin ve yayınlayın" },
  ];

  const handleCityChange = (cityId: string) => {
    setFormData({ ...formData, il_id: cityId, ilce: "" });
    setDistricts(getDistrictsList(cityId));
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
      
      const maxSize = 5 * 1024 * 1024;
      const validFiles = files.filter(file => {
        if (file.size > maxSize) {
          alert(`${file.name} çok büyük! Maksimum 5 MB boyutunda resim yükleyebilirsiniz.`);
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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.kategori_id || !formData.il_id) {
          alert('Lütfen kategori ve şehir seçiniz.');
          return false;
        }
        // Eğer Emlak kategorisi seçiliyse, emlak_tipi zorunlu
        const selectedKategori = kategoriler.find(k => k.id === parseInt(formData.kategori_id));
        if (selectedKategori?.ad === 'Emlak' && !formData.emlak_tipi) {
          alert('Lütfen emlak tipini seçiniz.');
          return false;
        }
        return true;
      case 2:
        if (!formData.baslik || !formData.aciklama) {
          alert('Lütfen başlık ve açıklama giriniz.');
          return false;
        }
        if (formData.baslik.length < 10) {
          alert('Başlık en az 10 karakter olmalıdır.');
          return false;
        }
        if (formData.aciklama.length < 50) {
          alert('Açıklama en az 50 karakter olmalıdır.');
          return false;
        }
        return true;
      case 3:
        if (!formData.fiyat && !formData.fiyat_usd) {
          alert('Lütfen fiyat giriniz.');
          return false;
        }
        if (parseFloat(formData.fiyat) <= 0 && parseFloat(formData.fiyat_usd) <= 0) {
          alert('Fiyat 0\'dan büyük olmalıdır.');
          return false;
        }
        return true;
      case 4:
        if (images.length === 0) {
          const confirm = window.confirm('Fotoğraf eklemediniz. Fotoğrafsız devam etmek istiyor musunuz?');
          return confirm;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step <= currentStep || completedSteps.includes(step - 1)) {
      setCurrentStep(step);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(4)) return;
    
    setLoading(true);
    
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        alert('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
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
        alert(data.message || 'İlan verilirken bir hata oluştu');
        setLoading(false);
        return;
      }

      alert('İlanınız başarıyla yayınlandı!');
      router.push('/ilanlarim');
    } catch (error) {
      console.error('İlan verme hatası:', error);
      alert('İlan verilirken bir hata oluştu. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  if (checking || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
              <p className="text-gray-600 mt-6 text-lg">Yönlendiriliyor...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const selectedKategori = kategoriler.find(k => k.id === parseInt(formData.kategori_id));
  const selectedCity = cities.find(c => c.id === formData.il_id);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Yeni İlan Oluştur
            </h1>
            <p className="text-gray-600 text-lg">Adım adım ilerleyin ve profesyonel ilanınızı oluşturun</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center flex-1">
                    <button
                      onClick={() => goToStep(step.id)}
                      disabled={step.id > currentStep && !completedSteps.includes(step.id - 1)}
                      className={`group relative flex items-center justify-center w-14 h-14 rounded-full font-bold text-lg transition-all duration-300 ${
                        currentStep === step.id
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-300 scale-110'
                          : completedSteps.includes(step.id)
                          ? 'bg-green-500 text-white shadow-md'
                          : 'bg-white border-2 border-gray-300 text-gray-400'
                      } ${
                        (step.id <= currentStep || completedSteps.includes(step.id - 1)) && 'hover:scale-105 cursor-pointer'
                      }`}
                    >
                      {completedSteps.includes(step.id) ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                      
                      {/* Tooltip */}
                      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10">
                        <div className="font-semibold">{step.title}</div>
                        <div className="text-gray-300 text-xs mt-1">{step.description}</div>
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </button>
                    
                    <div className="text-center mt-3 hidden md:block">
                      <div className={`text-sm font-semibold transition-colors ${
                        currentStep === step.id ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${
                      completedSteps.includes(step.id) || currentStep > step.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                        : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <form onSubmit={handleSubmit}>
              
              {/* Step 1: Kategori & Konum */}
              {currentStep === 1 && (
                <div className="p-8 md:p-12 animate-fadeIn">
                  <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <MapPin className="w-8 h-8 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Kategori ve Konum Seçimi</h2>
                      <p className="text-gray-600">İlanınızın görüneceği kategori ve konumu belirleyin</p>
                    </div>

                    <div className="space-y-6">
                      {/* Kategori */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                        <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Tag className="w-5 h-5 text-blue-600" />
                          Kategori Seçin *
                        </label>
                        <select
                          value={formData.kategori_id}
                          onChange={(e) => setFormData({ ...formData, kategori_id: e.target.value, emlak_tipi: "" })}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-lg font-medium transition-all"
                          required
                        >
                          <option value="">Bir kategori seçiniz...</option>
                          {kategoriler.map(k => (
                            <option key={k.id} value={k.id}>{k.ad}</option>
                          ))}
                        </select>
                      </div>

                      {/* Emlak Tipi - Sadece Emlak kategorisi seçiliyse */}
                      {selectedKategori?.ad === 'Emlak' && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 animate-fadeIn">
                          <label className="block text-sm font-bold text-gray-900 mb-4">
                            Emlak Tipi *
                          </label>
                          <div className="grid grid-cols-3 gap-4">
                            {[
                              { value: 'satilik', label: 'Satılık', icon: '🏠', color: 'blue' },
                              { value: 'kiralik', label: 'Kiralık', icon: '🔑', color: 'green' },
                              { value: 'rehinli', label: 'Rehinli', icon: '📋', color: 'orange' }
                            ].map(tip => (
                              <button
                                key={tip.value}
                                type="button"
                                onClick={() => setFormData({ ...formData, emlak_tipi: tip.value })}
                                className={`relative px-6 py-6 rounded-xl border-2 font-semibold transition-all duration-300 hover:scale-105 ${
                                  formData.emlak_tipi === tip.value
                                    ? `border-${tip.color}-600 bg-${tip.color}-50 shadow-lg`
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                                }`}
                              >
                                <div className="text-center">
                                  <div className="text-4xl mb-2">{tip.icon}</div>
                                  <div className={formData.emlak_tipi === tip.value ? `text-${tip.color}-700` : 'text-gray-700'}>
                                    {tip.label}
                                  </div>
                                </div>
                                {formData.emlak_tipi === tip.value && (
                                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Konum */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                          <label className="block text-sm font-bold text-gray-900 mb-3">
                            Şehir (İl) *
                          </label>
                          <select
                            value={formData.il_id}
                            onChange={(e) => handleCityChange(e.target.value)}
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-lg font-medium transition-all"
                            required
                          >
                            <option value="">Şehir seçiniz...</option>
                            {cities.map(city => (
                              <option key={city.id} value={city.id}>{city.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                          <label className="block text-sm font-bold text-gray-900 mb-3">
                            İlçe (Opsiyonel)
                          </label>
                          <select
                            value={formData.ilce}
                            onChange={(e) => setFormData({ ...formData, ilce: e.target.value })}
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-lg font-medium transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            disabled={!formData.il_id}
                          >
                            <option value="">İlçe seçiniz...</option>
                            {districts.map(district => (
                              <option key={district} value={district}>{district}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: İlan Bilgileri */}
              {currentStep === 2 && (
                <div className="p-8 md:p-12 animate-fadeIn">
                  <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                        <FileText className="w-8 h-8 text-indigo-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">İlan Bilgileri</h2>
                      <p className="text-gray-600">İlanınızın başlığını ve detaylı açıklamasını girin</p>
                    </div>

                    <div className="space-y-6">
                      {/* Başlık */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                        <label className="block text-sm font-bold text-gray-900 mb-3">
                          İlan Başlığı *
                        </label>
                        <input
                          type="text"
                          value={formData.baslik}
                          onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-medium transition-all"
                          placeholder="Örnek: Sıfır Ayarında iPhone 15 Pro Max 256GB"
                          required
                          maxLength={100}
                        />
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm text-gray-600">Dikkat çekici ve açıklayıcı bir başlık yazın</p>
                          <p className={`text-sm font-medium ${formData.baslik.length >= 10 ? 'text-green-600' : 'text-gray-400'}`}>
                            {formData.baslik.length}/100
                          </p>
                        </div>
                      </div>

                      {/* Açıklama */}
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                        <label className="block text-sm font-bold text-gray-900 mb-3">
                          Detaylı Açıklama *
                        </label>
                        <textarea
                          value={formData.aciklama}
                          onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-lg transition-all"
                          rows={10}
                          placeholder="Ürününüz hakkında detaylı bilgi verin. Özellikler, kullanım süresi, aksesuar durumu gibi detayları ekleyin..."
                          required
                          maxLength={2000}
                        />
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm text-gray-600">Detaylı açıklama alıcıların güvenini artırır</p>
                          <p className={`text-sm font-medium ${formData.aciklama.length >= 50 ? 'text-green-600' : 'text-gray-400'}`}>
                            {formData.aciklama.length}/2000 {formData.aciklama.length < 50 && '(En az 50 karakter)'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Fiyat & Durum */}
              {currentStep === 3 && (
                <div className="p-8 md:p-12 animate-fadeIn">
                  <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <DollarSign className="w-8 h-8 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Fiyat ve Durum</h2>
                      <p className="text-gray-600">Ürününüzün fiyatını ve durumunu belirleyin</p>
                    </div>

                    <div className="space-y-6">
                      {/* Para Birimi */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                        <label className="block text-sm font-bold text-gray-900 mb-4">
                          Para Birimi Seçin *
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, para_birimi: 'AFN', fiyat_usd: '' })}
                            className={`relative px-6 py-6 rounded-xl border-2 font-semibold transition-all duration-300 hover:scale-105 ${
                              formData.para_birimi === 'AFN'
                                ? 'border-blue-600 bg-blue-50 shadow-lg'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-3xl mb-2">؋</div>
                              <div className={formData.para_birimi === 'AFN' ? 'text-blue-700' : 'text-gray-700'}>
                                Afganistan Afganisi (AFN)
                              </div>
                            </div>
                            {formData.para_birimi === 'AFN' && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, para_birimi: 'USD' })}
                            className={`relative px-6 py-6 rounded-xl border-2 font-semibold transition-all duration-300 hover:scale-105 ${
                              formData.para_birimi === 'USD'
                                ? 'border-green-600 bg-green-50 shadow-lg'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-3xl mb-2">$</div>
                              <div className={formData.para_birimi === 'USD' ? 'text-green-700' : 'text-gray-700'}>
                                Amerikan Doları (USD)
                              </div>
                            </div>
                            {formData.para_birimi === 'USD' && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Fiyat Girişi */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                          <label className="block text-sm font-bold text-gray-900 mb-3">
                            {formData.para_birimi === 'AFN' ? 'Fiyat (Afganistan Afganisi)' : 'Fiyat (USD)'} *
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-600">
                              {formData.para_birimi === 'AFN' ? '؋' : '$'}
                            </span>
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
                              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-bold transition-all"
                              placeholder="0"
                              required
                              min="0"
                              step="0.01"
                            />
                          </div>
                          {formData.para_birimi === 'USD' && formData.fiyat && (
                            <p className="text-sm text-gray-600 mt-2">
                              ≈ ؋{parseFloat(formData.fiyat).toLocaleString()} AFN
                            </p>
                          )}
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                          <label className="block text-sm font-bold text-gray-900 mb-3">
                            Fiyat Tipi
                          </label>
                          <select
                            value={formData.fiyat_tipi}
                            onChange={(e) => setFormData({ ...formData, fiyat_tipi: e.target.value })}
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium transition-all"
                          >
                            <option value="negotiable">Pazarlık Yapılabilir</option>
                            <option value="fixed">Sabit Fiyat</option>
                          </select>
                        </div>
                      </div>

                      {/* Durum */}
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                        <label className="block text-sm font-bold text-gray-900 mb-4">
                          Ürün Durumu *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { value: 'yeni', label: 'Sıfır', icon: '✨', color: 'green' },
                            { value: 'az_kullanilmis', label: 'Az Kullanılmış', icon: '⭐', color: 'blue' },
                            { value: 'kullanilmis', label: 'Kullanılmış', icon: '👍', color: 'yellow' },
                            { value: 'hasarli', label: 'Hasarlı', icon: '⚠️', color: 'red' }
                          ].map(durum => (
                            <button
                              key={durum.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, durum: durum.value })}
                              className={`relative px-4 py-4 rounded-xl border-2 font-semibold transition-all duration-300 hover:scale-105 ${
                                formData.durum === durum.value
                                  ? `border-${durum.color}-600 bg-${durum.color}-50 shadow-lg`
                                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                              }`}
                            >
                              <div className="text-center">
                                <div className="text-2xl mb-1">{durum.icon}</div>
                                <div className="text-sm">{durum.label}</div>
                              </div>
                              {formData.durum === durum.value && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Fotoğraflar */}
              {currentStep === 4 && (
                <div className="p-8 md:p-12 animate-fadeIn">
                  <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                        <Camera className="w-8 h-8 text-purple-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Fotoğraf Yükleyin</h2>
                      <p className="text-gray-600">Kaliteli fotoğraflar ilanınızın görünürlüğünü artırır</p>
                    </div>

                    <div className="space-y-6">
                      {/* Upload Area */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-dashed border-purple-200 hover:border-purple-400 hover:bg-purple-100/50 transition-all cursor-pointer group">
                        <input
                          type="file"
                          id="images"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <label htmlFor="images" className="cursor-pointer">
                          <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-200 rounded-full mb-4 group-hover:scale-110 transition-transform">
                              <Upload className="h-10 w-10 text-purple-600" />
                            </div>
                            <p className="text-gray-900 font-bold text-lg mb-2">Fotoğraf Yüklemek İçin Tıklayın</p>
                            <p className="text-gray-600 mb-1">veya sürükleyip bırakın</p>
                            <p className="text-sm text-gray-500">PNG, JPG, JPEG • Maksimum 10 fotoğraf • Her biri max 5MB</p>
                          </div>
                        </label>
                      </div>

                      {/* Preview */}
                      {images.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">
                              Yüklenen Fotoğraflar ({images.length}/10)
                            </h3>
                            <button
                              type="button"
                              onClick={() => setImages([])}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Tümünü Sil
                            </button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {images.map((image, index) => (
                              <div key={index} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                                {index === 0 && (
                                  <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-lg font-medium shadow-lg">
                                    📷 Kapak Foto
                                  </div>
                                )}
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg font-medium">
                                  {index + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tips */}
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex gap-3">
                          <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
                          <div>
                            <h4 className="font-bold text-gray-900 mb-2">Fotoğraf Çekim İpuçları:</h4>
                            <ul className="space-y-1 text-sm text-gray-700">
                              <li>✓ Ürünü farklı açılardan çekin</li>
                              <li>✓ İyi aydınlatılmış ortamda fotoğraf çekin</li>
                              <li>✓ Varsa hasarlı kısımların fotoğrafını ekleyin</li>
                              <li>✓ Net ve yüksek çözünürlüklü fotoğraflar kullanın</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Önizleme */}
              {currentStep === 5 && (
                <div className="p-8 md:p-12 animate-fadeIn">
                  <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <Eye className="w-8 h-8 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">İlan Önizleme</h2>
                      <p className="text-gray-600">İlanınızı kontrol edin ve yayınlayın</p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200 space-y-6">
                      {/* Başlık */}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{formData.baslik}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                            {selectedKategori?.ad}
                          </span>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                            📍 {selectedCity?.name}{formData.ilce && `, ${formData.ilce}`}
                          </span>
                          {formData.emlak_tipi && (
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                              {formData.emlak_tipi === 'satilik' ? '🏠 Satılık' : formData.emlak_tipi === 'kiralik' ? '🔑 Kiralık' : '📋 Rehinli'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Fotoğraflar */}
                      {images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                          {images.slice(0, 4).map((image, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-300">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {images.length > 4 && (
                            <div className="col-span-4 text-center text-sm text-gray-600">
                              +{images.length - 4} fotoğraf daha
                            </div>
                          )}
                        </div>
                      )}

                      {/* Fiyat */}
                      <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {formData.para_birimi === 'AFN' ? '؋' : '$'}
                          {formData.para_birimi === 'AFN' 
                            ? parseFloat(formData.fiyat).toLocaleString()
                            : parseFloat(formData.fiyat_usd).toLocaleString()
                          }
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded ${
                            formData.fiyat_tipi === 'negotiable' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {formData.fiyat_tipi === 'negotiable' ? '💬 Pazarlık Yapılabilir' : '🔒 Sabit Fiyat'}
                          </span>
                          <span className={`px-2 py-1 rounded ${
                            formData.durum === 'yeni' ? 'bg-green-100 text-green-700' :
                            formData.durum === 'az_kullanilmis' ? 'bg-blue-100 text-blue-700' :
                            formData.durum === 'kullanilmis' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {formData.durum === 'yeni' ? '✨ Sıfır' :
                             formData.durum === 'az_kullanilmis' ? '⭐ Az Kullanılmış' :
                             formData.durum === 'kullanilmis' ? '👍 Kullanılmış' : '⚠️ Hasarlı'}
                          </span>
                        </div>
                      </div>

                      {/* Açıklama */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Açıklama:</h4>
                        <p className="text-gray-700 whitespace-pre-line">{formData.aciklama}</p>
                      </div>

                      {/* Uyarı */}
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex gap-3">
                          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-gray-700">
                            <p className="font-semibold text-gray-900 mb-1">Yayınlamadan önce kontrol edin:</p>
                            <ul className="space-y-1 text-gray-600">
                              <li>✓ Tüm bilgiler doğru mu?</li>
                              <li>✓ Fotoğraflar net ve açıklayıcı mı?</li>
                              <li>✓ Fiyat doğru girildi mi?</li>
                              <li>✓ İletişim bilgileriniz güncel mi?</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="bg-gray-50 px-8 md:px-12 py-6 border-t border-gray-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Geri
                </button>

                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600">
                    Adım {currentStep} / {steps.length}
                  </div>
                </div>

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all hover:shadow-lg"
                  >
                    İleri
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-green-600 bg-green-600 hover:bg-green-700 text-white font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Yayınlanıyor...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        İlanı Yayınla
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
