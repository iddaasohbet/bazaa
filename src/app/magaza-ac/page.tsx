"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Store, Upload, MapPin, Phone, Mail, User, FileText, CreditCard, Package, Star, TrendingUp, Award, Zap, Crown, Sparkles, BadgeCheck, Rocket, Gift } from "lucide-react";

interface Paket {
  id: number;
  ad_dari: string;
  store_level: string;
  fiyat: number;
  eski_fiyat?: number;
  sure_ay: number;
  ozellikler?: {
    aciklama?: string;
    ozellikler?: string[];
  };
}

export default function MagazaAcPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [paketler, setPaketler] = useState<Paket[]>([]);
  const [selectedPaket, setSelectedPaket] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    // Mağaza bilgileri
    magaza_ad: '',
    magaza_ad_dari: '',
    aciklama: '',
    il_id: '',
    adres: '',
    logo: null as File | null,
    kapak_resmi: null as File | null,
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [kapakPreview, setKapakPreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'kapak') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'logo') {
          setLogoPreview(reader.result as string);
          setFormData({...formData, logo: file});
        } else {
          setKapakPreview(reader.result as string);
          setFormData({...formData, kapak_resmi: file});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    // Giriş kontrolü
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      // Giriş yapmamış, giriş sayfasına yönlendir
      router.push('/giris?redirect=/magaza-ac');
      return;
    }
    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (error) {
      console.error('User parse error:', error);
      router.push('/giris?redirect=/magaza-ac');
      return;
    }
    setAuthChecking(false);
    fetchPaketler();
  }, [router]);

  const fetchPaketler = async () => {
    try {
      const response = await fetch('/api/paketler');
      const data = await response.json();
      if (data.success) {
        setPaketler(data.data);
      }
    } catch (error) {
      console.error('Paket yükleme hatası:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }

    // Step 2 - Paket seçimi ve oluşturma
    if (!selectedPaket) {
      alert('لطفاً یک پکیج انتخاب کنید');
      return;
    }

    const selectedPaketData = paketler.find(p => p.id === selectedPaket);
    
    // Basic paket ücretsiz, direkt oluştur
    if (Number(selectedPaketData?.fiyat) === 0) {
      setLoading(true);
      
      try {
        // Mağazayı API'ye kaydet
        const response = await fetch('/api/magaza-olustur', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user?.id.toString() || ''
          },
          body: JSON.stringify({
            magaza_ad: formData.magaza_ad,
            magaza_ad_dari: formData.magaza_ad_dari,
            aciklama: formData.aciklama,
            adres: formData.adres,
            logo: logoPreview,
            kapak_resmi: kapakPreview,
            store_level: selectedPaketData?.store_level || 'basic',
            paket_id: selectedPaket
          })
        });

        const data = await response.json();
        
        if (data.success) {
          // localStorage'ı temizle
          localStorage.removeItem('magazaBilgileri');
          
          // Header'ı güncelle
          window.dispatchEvent(new Event('magazaGuncelle'));
          
          alert('✅ مغازه شما با موفقیت ایجاد و فعال شد!');
          router.push('/magazam');
        } else {
          alert('خطا در ایجاد مغازه: ' + (data.message || ''));
          setLoading(false);
        }
      } catch (error) {
        console.error('Mağaza oluşturma hatası:', error);
        alert('خطا در ایجاد مغازه');
        setLoading(false);
      }
    } else {
      // Ücretli paket için mağaza bilgilerini localStorage'a geçici kaydet
      localStorage.setItem('magazaBilgileri', JSON.stringify({
        kullanici_id: user?.id,
        magaza_ad: formData.magaza_ad,
        magaza_ad_dari: formData.magaza_ad_dari,
        aciklama: formData.aciklama,
        adres: formData.adres,
        paket_id: selectedPaket,
        store_level: selectedPaketData?.store_level,
        onay_durumu: 'beklemede',
        logo: logoPreview,
        kapak_resmi: kapakPreview
      }));
      
      // Ücretli paket - Animasyonlu yönlendirme
      setRedirecting(true);
      setTimeout(() => {
        router.push(`/odeme?paket=${selectedPaket}&magaza=yeni`);
      }, 2500);
    }
  };

  // Auth kontrolü devam ediyor
  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Yönlendirme Animasyonu */}
      {redirecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <CreditCard className="absolute inset-0 m-auto h-10 w-10 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2" dir="rtl">
              در حال انتقال به صفحه پرداخت...
            </h3>
            <p className="text-gray-600" dir="rtl">
              لطفاً صبر کنید
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12" dir="rtl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Store className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">مغازه خود را باز کنید</h1>
            <p className="text-lg text-gray-600">در سه مرحله ساده مغازه آنلاین خود را راه‌اندازی کنید</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-12" dir="rtl">
            <div className="flex items-center justify-center gap-4">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all ${
                    step >= s 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {s}
                  </div>
                  {s < 2 && (
                    <div className={`w-24 h-1 mx-2 transition-all ${
                      step > s ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-32 mt-4 text-sm font-medium">
              <span className={step >= 1 ? 'text-blue-600' : 'text-gray-400'}>اطلاعات مغازه</span>
              <span className={step >= 2 ? 'text-blue-600' : 'text-gray-400'}>انتخاب پکیج</span>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit} dir="rtl">
              {/* Step 1: Mağaza Bilgileri */}
              {step === 1 && (
                <div className="space-y-8 p-8">
                  {/* Header */}
                  <div className="text-center border-b border-gray-200 -m-8 mb-8 p-8 bg-gray-50">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 rounded-full mb-3">
                      <Store className="h-7 w-7 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-1 text-gray-900">اطلاعات مغازه</h2>
                    <p className="text-sm text-gray-600">مغازه آنلاین خود را شخصی‌سازی کنید</p>
                  </div>

                  {/* Kapak Resmi */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-4 text-center">
                      تصویر کاور مغازه (توصیه: ۱۲۰۰×۳۰۰ پیکسل)
                    </label>
                    <div className="relative aspect-[4/1] max-h-48 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 hover:border-purple-400 transition-all cursor-pointer group">
                      {kapakPreview ? (
                        <img src={kapakPreview} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <Upload className="h-12 w-12 text-gray-400 group-hover:text-purple-500 transition-all mb-2" />
                          <span className="text-sm text-gray-500">کلیک کنید تا کاور آپلود کنید</span>
                          <span className="text-xs text-gray-400 mt-1">۱۲۰۰×۳۰۰ پیکسل</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'kapak')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Logo */}
                  <div className="flex justify-center">
                    <div className="text-center">
                      <label className="block text-sm font-bold text-gray-700 mb-4">
                        لوگوی مغازه (توصیه: ۴۰۰×۴۰۰ پیکسل)
                      </label>
                      <div className="relative inline-block">
                        <div className="w-24 h-24 rounded-lg border-2 border-gray-300 overflow-hidden bg-white cursor-pointer hover:border-purple-400 transition-all shadow-sm">
                          {logoPreview ? (
                            <div className="w-full h-full relative">
                              <img 
                                src={logoPreview} 
                                alt="Logo" 
                                className="w-full h-full object-contain p-1"
                                style={{ objectPosition: 'center' }}
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                              <Store className="h-10 w-10 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'logo')}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="absolute -bottom-2 -right-2 w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all"
                        >
                          <Upload className="h-5 w-5 text-white" />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Kare logo önerilir</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        نام مغازه (فارسی/انگلیسی) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.magaza_ad}
                        onChange={(e) => setFormData({...formData, magaza_ad: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder="مثال: فروشگاه الکترونیک احمد"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        نام مغازه (دری) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.magaza_ad_dari}
                        onChange={(e) => setFormData({...formData, magaza_ad_dari: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder="مغازه الکترونیکی احمد"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <FileText className="inline h-4 w-4 ml-1" />
                      توضیحات مغازه
                    </label>
                    <textarea
                      value={formData.aciklama}
                      onChange={(e) => setFormData({...formData, aciklama: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="درباره مغازه و محصولات خود بنویسید..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 ml-1" />
                      آدرس
                    </label>
                    <input
                      type="text"
                      value={formData.adres}
                      onChange={(e) => setFormData({...formData, adres: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="آدرس کامل مغازه"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Paket Seçimi */}
              {step === 2 && (
                <div className="space-y-8 p-8">
                  {/* Header */}
                  <div className="text-center border-b border-gray-200 -m-8 mb-8 p-8 bg-gray-50">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-3">
                      <Package className="h-7 w-7 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-1 text-gray-900">انتخاب پکیج</h2>
                    <p className="text-sm text-gray-600">بهترین پکیج را برای رشد کسب و کار خود انتخاب کنید</p>
                  </div>

                  {/* Ücretli Paketler - Üstte */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {paketler.filter(p => Number(p.fiyat) > 0).map((paket) => {
                      const isPro = paket.store_level === 'pro';
                      const isElite = paket.store_level === 'elite';
                      
                      return (
                        <div
                          key={paket.id}
                          onClick={() => setSelectedPaket(paket.id)}
                          className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                            selectedPaket === paket.id
                              ? isElite 
                                ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 via-white to-orange-50 shadow-2xl shadow-yellow-200/50 ring-4 ring-yellow-100'
                                : 'border-blue-400 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-2xl shadow-blue-200/50 ring-4 ring-blue-100'
                              : isElite
                                ? 'border-yellow-200 bg-gradient-to-br from-yellow-50/50 to-white hover:border-yellow-300 shadow-lg hover:shadow-xl'
                                : 'border-blue-200 bg-gradient-to-br from-blue-50/50 to-white hover:border-blue-300 shadow-lg hover:shadow-xl'
                          }`}
                        >
                          {/* Most Popular Badge - Elite için */}
                          {isElite && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                              <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
                                <Crown className="h-4 w-4" />
                                <span>محبوب‌ترین انتخاب</span>
                                <Sparkles className="h-4 w-4" />
                              </div>
                            </div>
                          )}

                          {/* Best Value Badge - Pro için */}
                          {isPro && paket.sure_ay === 3 && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                <BadgeCheck className="h-4 w-4" />
                                <span>بهترین قیمت</span>
                              </div>
                            </div>
                          )}

                          {/* Recommended Badge - Pro 1 ay */}
                          {isPro && paket.sure_ay === 1 && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                <span>پرفروش</span>
                              </div>
                            </div>
                          )}

                          <div className="p-6 pt-8">
                            {/* Icon */}
                            <div className="text-center mb-4">
                              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3 ${
                                isElite 
                                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-300/50' 
                                  : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-300/50'
                              }`}>
                                {isElite ? (
                                  <Crown className="h-8 w-8 text-white" />
                                ) : (
                                  <Rocket className="h-8 w-8 text-white" />
                                )}
                              </div>
                            </div>
                            
                            {/* Title */}
                            <div className="text-center mb-4">
                              <div className="text-2xl font-bold text-gray-900 mb-1">{paket.ad_dari}</div>
                              <div className="text-sm text-gray-500 font-medium">
                                {paket.sure_ay === 1 ? 'ماهانه' : `${paket.sure_ay} ماهه`}
                              </div>
                            </div>

                            {/* Description */}
                            {paket.ozellikler?.aciklama && (
                              <div className="mb-5 px-2">
                                <p className="text-sm text-gray-600 leading-relaxed text-center">
                                  {paket.ozellikler.aciklama}
                                </p>
                              </div>
                            )}

                            {/* Price */}
                            <div className={`text-center mb-5 py-5 rounded-xl border-2 relative overflow-hidden ${
                              isElite 
                                ? 'bg-gradient-to-br from-yellow-100 via-yellow-50 to-orange-100 border-yellow-300' 
                                : 'bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 border-blue-300'
                            }`}>
                              {selectedPaket === paket.id && (
                                <div className={`absolute inset-0 ${
                                  isElite ? 'bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-yellow-400/20' : 'bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-blue-400/20'
                                } animate-pulse`}></div>
                              )}
                              <div className="relative z-10">
                                {/* Eski Fiyat - Database'den veya otomatik hesaplama */}
                                {(paket.eski_fiyat && paket.eski_fiyat > paket.fiyat) && (
                                  <div className="mb-2">
                                    <span className="text-lg text-gray-500 line-through decoration-red-500 decoration-2" dir="ltr">
                                      {paket.eski_fiyat.toLocaleString('fa-AF')} AFN
                                    </span>
                                  </div>
                                )}
                                
                                {/* Yeni Fiyat */}
                                <div className="text-4xl font-bold text-gray-900 mb-1" dir="ltr">
                                  {paket.fiyat.toLocaleString('fa-AF')}
                                  <span className="text-lg text-gray-600 mr-2">AFN</span>
                                </div>
                                
                                {/* İndirim Badge - Otomatik hesaplama */}
                                {paket.eski_fiyat && paket.eski_fiyat > paket.fiyat && (
                                  <div className="mt-3">
                                    <span className="inline-flex items-center gap-1.5 text-sm text-white font-bold bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 rounded-full shadow-lg shadow-red-300/50 border-2 border-red-400 animate-pulse">
                                      <Zap className="h-4 w-4" />
                                      <span>{Math.round(((paket.eski_fiyat - paket.fiyat) / paket.eski_fiyat) * 100)}٪ تخفیف ویژه</span>
                                      <Sparkles className="h-4 w-4" />
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Select Button */}
                            <button
                              type="button"
                              className={`w-full py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                                selectedPaket === paket.id
                                  ? isElite
                                    ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 text-white shadow-lg shadow-yellow-300/50 hover:shadow-xl'
                                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white shadow-lg shadow-blue-300/50 hover:shadow-xl'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {selectedPaket === paket.id ? (
                                <>
                                  <BadgeCheck className="h-5 w-5" />
                                  <span>انتخاب شده</span>
                                </>
                              ) : (
                                <>
                                  <span>انتخاب پکیج</span>
                                  <Award className="h-5 w-5" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Ücretsiz Paket - Tam Genişlik */}
                  {paketler.filter(p => Number(p.fiyat) === 0).map((paket) => (
                    <div key={paket.id} className="w-full">
                      <div
                        onClick={() => setSelectedPaket(paket.id)}
                        className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                          selectedPaket === paket.id
                            ? 'border-green-400 bg-gradient-to-br from-green-50 via-white to-emerald-50 shadow-2xl shadow-green-200/50 ring-4 ring-green-100'
                            : 'border-green-200 bg-gradient-to-br from-green-50/50 to-white hover:border-green-300 shadow-lg hover:shadow-xl'
                        }`}
                      >
                        {/* Free Badge */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                          <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                            <Gift className="h-4 w-4" />
                            <span>رایگان برای همیشه</span>
                            <Sparkles className="h-4 w-4" />
                          </div>
                        </div>

                        <div className="p-6 pt-8">
                          <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Sol - Bilgiler */}
                            <div className="flex-1 text-center md:text-right">
                              {/* Icon */}
                              <div className="mb-4 flex justify-center md:justify-start">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-300/50">
                                  <Star className="h-8 w-8 text-white" />
                                </div>
                              </div>
                              
                              {/* Title */}
                              <div className="mb-4">
                                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{paket.ad_dari}</div>
                                <div className="text-sm text-gray-600 font-medium">برای شروع سریع و آزمایشی</div>
                              </div>

                              {/* Description */}
                              {paket.ozellikler?.aciklama && (
                                <div className="mb-4">
                                  <p className="text-sm text-gray-600 leading-relaxed">
                                    {paket.ozellikler.aciklama}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Sağ - Price & Button */}
                            <div className="flex-shrink-0 w-full md:w-80">
                              {/* Price */}
                              <div className="text-center mb-5 py-6 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 rounded-xl border-2 border-green-300 relative overflow-hidden">
                                {selectedPaket === paket.id && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-green-400/20 animate-pulse"></div>
                                )}
                                <div className="relative z-10">
                                  <div className="flex items-center justify-center gap-2 mb-2">
                                    <Gift className="h-6 w-6 text-green-600" />
                                    <div className="text-4xl font-bold text-green-600">رایگان</div>
                                    <Sparkles className="h-6 w-6 text-green-600" />
                                  </div>
                                  <div className="text-sm text-green-700 font-semibold">بدون نیاز به پرداخت</div>
                                </div>
                              </div>

                              {/* Select Button */}
                              <button
                                type="button"
                                className={`w-full py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                                  selectedPaket === paket.id
                                    ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 text-white shadow-lg shadow-green-300/50 hover:shadow-xl'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {selectedPaket === paket.id ? (
                                  <>
                                    <BadgeCheck className="h-5 w-5" />
                                    <span>انتخاب شده</span>
                                  </>
                                ) : (
                                  <>
                                    <Rocket className="h-5 w-5" />
                                    <span>شروع رایگان</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-all border border-gray-300"
                    >
                      ← قبلی
                    </button>
                    <button
                      type="submit"
                      disabled={!selectedPaket || loading}
                      className="flex-1 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          در حال ایجاد...
                        </span>
                      ) : (
                        Number(paketler.find(p => p.id === selectedPaket)?.fiyat) === 0 
                          ? '✓ ایجاد مغازه رایگان' 
                          : 'ادامه و پرداخت ←'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Buttons - Step 1 için */}
              {step === 1 && (
                <div className="flex justify-start gap-4 pt-6 px-8 pb-8 border-t border-gray-200 -mx-8 -mb-8 bg-gray-50">
                  <button
                    type="submit"
                    className="px-12 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all"
                  >
                    بعدی ←
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 text-center shadow-lg" dir="rtl">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <p className="text-base font-bold text-gray-800">نکته مهم</p>
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              پکیج Basic کاملاً رایگان است و می‌توانید فوراً شروع کنید! برای امکانات حرفه‌ای‌تر، پکیج‌های Pro و Premium را بررسی کنید.
            </p>
          </div>
        </div>
      </main>

        <Footer />
      </div>
    </>
  );
}

