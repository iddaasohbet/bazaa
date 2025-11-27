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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ödeme bildirimi gönder
    console.log('Ödeme bildirimi:', formData);
    alert('✅ Ödeme bildirimi gönderildi! En kısa sürede incelenecektir.');
    router.push('/');
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12" dir="rtl">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">پرداخت پکیج</h1>
            <p className="text-lg text-gray-600">لطفاً مراحل پرداخت را تکمیل کنید</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Paket Özeti */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200 shadow-xl p-8" dir="rtl">
              <div className="flex items-center gap-3 mb-6">
                <Package className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">خلاصه سفارش</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-100">
                  <div className="text-sm text-gray-600 mb-1">نام پکیج</div>
                  <div className="text-2xl font-bold text-gray-900">{paket.ad_dari}</div>
                  <div className="text-sm text-gray-500 mt-1">{paket.ad}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">مدت زمان</div>
                    <div className="text-lg font-bold text-gray-900">
                      {paket.sure_ay === 1 ? 'یک ماهه' : `${paket.sure_ay} ماهه`}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">محصولات</div>
                    <div className="text-lg font-bold text-gray-900">
                      {paket.product_limit === 999999 ? 'نامحدود' : paket.product_limit}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 border-2 border-blue-400 shadow-lg">
                  <div className="text-sm text-blue-100 mb-2">مبلغ قابل پرداخت</div>
                  <div className="text-4xl font-bold text-white" dir="ltr">
                    {paket.fiyat.toLocaleString('fa-AF')} <span className="text-xl">AFN</span>
                  </div>
                  {paket.sure_ay === 3 && (
                    <div className="mt-3 inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      ✓ شامل ۳۰٪ تخفیف
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">محصولات:</span>
                      <span className="font-bold text-gray-900">
                        {paket.product_limit === 999999 ? '∞' : paket.product_limit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">دسته‌بندی:</span>
                      <span className="font-bold text-gray-900">
                        {paket.category_limit === 999 ? '∞' : paket.category_limit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ödeme Bilgileri */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200 shadow-xl p-8" dir="rtl">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">اطلاعات پرداخت</h2>
              </div>

              {!showForm ? (
                <div className="space-y-6">
                  {/* IBAN Bilgisi */}
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 border-2 border-blue-400 shadow-lg">
                    <div className="text-sm text-blue-100 mb-4 font-medium text-center">
                      لطفاً مبلغ را به این حساب واریز کنید:
                    </div>
                    
                    <div className="bg-white rounded-xl p-5 mb-4 border-2 border-blue-200">
                      <div className="text-xs text-gray-500 mb-2 text-center">شماره حساب (IBAN)</div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-mono text-xl font-bold text-gray-900 flex-1 text-center" dir="ltr">
                          AF00 0000 0000 0000 0000
                        </div>
                        <button
                          onClick={handleCopyIBAN}
                          className="flex items-center gap-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {copied ? 'کپی شد!' : 'کپی'}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm text-white">
                      <div className="flex justify-between items-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <span className="text-blue-100">نام بانک:</span>
                        <span className="font-bold">Afghanistan Int. Bank</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <span className="text-blue-100">نام صاحب حساب:</span>
                        <span className="font-bold">Bazaar Watan</span>
                      </div>
                    </div>
                  </div>

                  {/* Ödeme Bildir Butonu */}
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-5 rounded-2xl transition-all shadow-lg hover:shadow-2xl border-2 border-green-400 text-lg"
                  >
                    ✓ پرداخت انجام شد - اطلاع دهید
                  </button>

                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-700">
                      <span className="font-bold text-yellow-700">توجه:</span> پس از واریز، روی دکمه بالا کلیک کنید
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      نام و نام خانوادگی *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.ad_soyad}
                      onChange={(e) => setFormData({...formData, ad_soyad: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="نام کامل خود را وارد کنید"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      شماره تماس *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.telefon}
                      onChange={(e) => setFormData({...formData, telefon: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="۰۷۰۰۰۰۰۰۰۰"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      ایمیل
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      زمان واریز *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.islem_saati}
                      onChange={(e) => setFormData({...formData, islem_saati: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      شماره رسید/مرجع
                    </label>
                    <input
                      type="text"
                      value={formData.dekont_no}
                      onChange={(e) => setFormData({...formData, dekont_no: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="شماره رسید بانکی"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      یادداشت
                    </label>
                    <textarea
                      value={formData.notlar}
                      onChange={(e) => setFormData({...formData, notlar: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="اگر توضیحات اضافی دارید بنویسید..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 rounded-xl transition-all border-2 border-gray-300"
                    >
                      بازگشت
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg border-2 border-blue-400"
                    >
                      ارسال اطلاعات
                    </button>
                  </div>
                </form>
              )}
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

