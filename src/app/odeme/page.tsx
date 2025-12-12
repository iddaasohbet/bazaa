"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Package, CreditCard, CheckCircle, Copy, Check } from "lucide-react";

function OdemeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paketId = searchParams.get('paket');
  
  const [paket, setPaket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    ad_soyad: '',
    telefon: '',
    email: '',
    islem_saati: '',
    dekont_no: '',
    notlar: ''
  });

  useEffect(() => {
    if (paketId) {
      fetchPaket();
    }
  }, [paketId]);

  const fetchPaket = async () => {
    try {
      const response = await fetch('/api/paketler');
      const data = await response.json();
      if (data.success) {
        const selectedPaket = data.data.find((p: any) => p.id === parseInt(paketId || '0'));
        setPaket(selectedPaket);
      }
    } catch (error) {
      console.error('Paket yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyIBAN = () => {
    navigator.clipboard.writeText('AF00 0000 0000 0000 0000');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // localStorage'dan mağaza bilgilerini al
      const magazaBilgileri = localStorage.getItem('magazaBilgileri');
      if (!magazaBilgileri) {
        alert('مشکل در دریافت اطلاعات مغازه');
        router.push('/magaza-ac');
        return;
      }

      const bilgiler = JSON.parse(magazaBilgileri);
      const user = localStorage.getItem('user');
      if (!user) {
        alert('لطفاً وارد شوید');
        router.push('/giris');
        return;
      }

      const userData = JSON.parse(user);

      // Mağazayı oluştur
      const response = await fetch('/api/magaza-olustur', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userData.id.toString()
        },
        body: JSON.stringify({
          magaza_ad: bilgiler.magaza_ad,
          magaza_ad_dari: bilgiler.magaza_ad_dari,
          aciklama: bilgiler.aciklama,
          adres: bilgiler.adres,
          logo: bilgiler.logo,
          kapak_resmi: bilgiler.kapak_resmi,
          store_level: bilgiler.store_level,
          paket_id: paketId,
          odeme_bilgisi: {
            ad_soyad: formData.ad_soyad,
            telefon: formData.telefon,
            email: formData.email,
            islem_saati: formData.islem_saati,
            dekont_no: formData.dekont_no,
            notlar: formData.notlar
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        // localStorage'ı temizle
        localStorage.removeItem('magazaBilgileri');
        
        // Header'ı güncelle
        window.dispatchEvent(new Event('magazaGuncelle'));
        
        alert('✅ پرداخت ثبت شد! مغازه شما فعال شد.');
        router.push('/magazam');
      } else {
        alert('خطا: ' + (data.message || 'مشکل در ثبت پرداخت'));
      }
    } catch (error) {
      console.error('Ödeme hatası:', error);
      alert('خطا در ثبت پرداخت');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!paket) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center" dir="rtl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">پکیج یافت نشد</h2>
            <button onClick={() => router.push('/magaza-paket')} className="btn-primary">
              بازگشت به پکیج‌ها
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12" dir="rtl">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">پرداخت پکیج</h1>
            <p className="text-gray-600">لطفاً مراحل پرداخت را تکمیل کنید</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Paket Özeti - Daha dar */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-6" dir="rtl">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                  <Package className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">خلاصه سفارش</h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">نام پکیج</div>
                    <div className="text-xl font-bold text-gray-900">{paket.ad_dari}</div>
                    <div className="text-xs text-gray-500 mt-1">{paket.ad}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">مدت زمان</div>
                      <div className="text-base font-bold text-gray-900">
                        {paket.sure_ay === 1 ? 'یک ماهه' : `${paket.sure_ay} ماهه`}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">محصولات</div>
                      <div className="text-base font-bold text-gray-900">
                        {paket.product_limit === 999999 ? 'نامحدود' : paket.product_limit}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">محصولات:</span>
                      <span className="font-semibold text-gray-900">
                        {paket.product_limit === 999999 ? '∞' : paket.product_limit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">دسته‌بندی:</span>
                      <span className="font-semibold text-gray-900">
                        {paket.category_limit === 999 ? '∞' : paket.category_limit}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-600 rounded-lg p-4 mt-6">
                    <div className="text-xs text-blue-100 mb-1">مبلغ قابل پرداخت</div>
                    <div className="text-3xl font-bold text-white" dir="ltr">
                      {paket.fiyat.toLocaleString('fa-AF')} <span className="text-lg">AFN</span>
                    </div>
                    {paket.sure_ay === 3 && (
                      <div className="mt-2 inline-block bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                        ✓ ۳۰٪ تخفیف
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ödeme Bilgileri - Daha geniş */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8" dir="rtl">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">اطلاعات پرداخت</h2>
                </div>

                {!showForm ? (
                  <div className="space-y-6">
                    {/* IBAN Bilgisi */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <p className="text-sm text-gray-600 mb-4 text-center">
                        لطفاً مبلغ را به این حساب واریز کنید:
                      </p>
                      
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="text-xs text-gray-500 mb-2 text-center">شماره حساب (IBAN)</div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-mono text-lg font-bold text-gray-900 flex-1 text-center" dir="ltr">
                            AF00 0000 0000 0000 0000
                          </div>
                          <button
                            onClick={handleCopyIBAN}
                            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? 'کپی شد' : 'کپی'}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">نام بانک:</span>
                          <span className="font-semibold text-gray-900">Afghanistan Int. Bank</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">نام صاحب حساب:</span>
                          <span className="font-semibold text-gray-900">Bazaar Watan</span>
                        </div>
                      </div>
                    </div>

                    {/* Ödeme Bildir Butonu */}
                    <button
                      onClick={() => setShowForm(true)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition-colors text-base"
                    >
                      ✓ پرداخت انجام شد - اطلاع دهید
                    </button>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700 text-center">
                        <span className="font-semibold text-amber-700">توجه:</span> پس از واریز، روی دکمه بالا کلیک کنید
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        نام و نام خانوادگی *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.ad_soyad}
                        onChange={(e) => setFormData({...formData, ad_soyad: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="نام کامل خود را وارد کنید"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        شماره تماس *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.telefon}
                        onChange={(e) => setFormData({...formData, telefon: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="۰۷۰۰۰۰۰۰۰۰"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ایمیل
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="example@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        زمان واریز *
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={formData.islem_saati}
                        onChange={(e) => setFormData({...formData, islem_saati: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        شماره رسید/مرجع
                      </label>
                      <input
                        type="text"
                        value={formData.dekont_no}
                        onChange={(e) => setFormData({...formData, dekont_no: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="شماره رسید بانکی"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        یادداشت
                      </label>
                      <textarea
                        value={formData.notlar}
                        onChange={(e) => setFormData({...formData, notlar: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="اگر توضیحات اضافی دارید بنویسید..."
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
                      >
                        ← قبلی
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {loading ? 'در حال ارسال...' : 'ارسال اطلاعات'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OdemePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    }>
      <OdemeContent />
    </Suspense>
  );
}

