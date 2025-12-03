"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, HeadphonesIcon, CheckCircle, Users, TrendingUp, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface IletisimAyarlari {
  telefon?: string;
  telefon2?: string;
  email?: string;
  email2?: string;
  adres_tr?: string;
  adres_dari?: string;
  calisma_saatleri?: Array<{ gun: string; saat: string }>;
  sosyal_medya?: any;
  istatistikler?: {
    kullanicilar?: string;
    ilanlar?: string;
    destek?: string;
    cevap_suresi?: string;
  };
}

export default function Iletisim() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ayarlar, setAyarlar] = useState<IletisimAyarlari>({});
  const [formData, setFormData] = useState({
    ad: "",
    email: "",
    telefon: "",
    konu: "",
    mesaj: "",
  });

  useEffect(() => {
    fetchAyarlar();
  }, []);

  const fetchAyarlar = async () => {
    try {
      const response = await fetch('/api/iletisim-ayarlari');
      const data = await response.json();
      if (data.success) {
        setAyarlar(data.data);
      }
    } catch (error) {
      console.error('İletişim ayarları yükleme hatası:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/iletisim-mesajlari', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({ ad: "", email: "", telefon: "", konu: "", mesaj: "" });
        
        // 3 saniye sonra success mesajını kapat
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(data.message || 'خطا در ارسال پیام');
      }
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      alert('خطا در ارسال پیام. لطفا دوباره تلاش کنید');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center" dir="rtl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold mb-4">ما را صدا بزنید</h1>
              <p className="text-xl text-blue-100">
                تیم ما آماده است تا به سوالات شما پاسخ دهد و در کنار شما باشد
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
              dir="rtl"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{ayarlar.istatistikler?.kullanicilar || '۱۰۰ک+'}</div>
              <div className="text-sm text-gray-600">کاربران فعال</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
              dir="rtl"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{ayarlar.istatistikler?.ilanlar || '۵۰ک+'}</div>
              <div className="text-sm text-gray-600">آگهی فعال</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
              dir="rtl"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-3">
                <ShieldCheck className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{ayarlar.istatistikler?.destek || '۲۴/۷'}</div>
              <div className="text-sm text-gray-600">پشتیبانی</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
              dir="rtl"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-3">
                <HeadphonesIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{ayarlar.istatistikler?.cevap_suresi || '< ۲ ساعت'}</div>
              <div className="text-sm text-gray-600">زمان پاسخ</div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Cards - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Phone Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border border-gray-100 hover:border-blue-200"
                dir="rtl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Phone className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">تماس تلفنی</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      برای پشتیبانی سریع با ما تماس بگیرید
                    </p>
                    <a 
                      href={`tel:${ayarlar.telefon || '+93700000000'}`}
                      className="text-blue-600 font-bold text-lg hover:text-blue-700 transition-colors inline-flex items-center gap-2"
                      dir="ltr"
                    >
                      {ayarlar.telefon || '+93 700 000 000'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Email Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border border-gray-100 hover:border-green-200"
                dir="rtl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Mail className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">ایمیل</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      برای درخواست‌های رسمی ایمیل بزنید
                    </p>
                    <a 
                      href={`mailto:${ayarlar.email || 'info@bazaarewatan.com'}`}
                      className="text-green-600 font-bold hover:text-green-700 transition-colors inline-flex items-center gap-2"
                      dir="ltr"
                    >
                      {ayarlar.email || 'info@bazaarewatan.com'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Address Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border border-gray-100 hover:border-purple-200"
                dir="rtl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <MapPin className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">آدرس دفتر</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      به دفتر ما در کابل سر بزنید
                    </p>
                    <div className="text-gray-700 font-medium">
                      {ayarlar.adres_dari || 'کابل، افغانستان'}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Working Hours Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-200"
                dir="rtl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">ساعات کاری</h3>
                </div>
                <div className="space-y-3">
                  {ayarlar.calisma_saatleri && ayarlar.calisma_saatleri.length > 0 ? (
                    ayarlar.calisma_saatleri.map((saat, idx) => (
                      <div key={idx} className={`flex justify-between items-center py-2 ${idx < (ayarlar.calisma_saatleri?.length || 0) - 1 ? 'border-b border-orange-200' : ''}`}>
                        <span className="text-gray-700 font-medium">{saat.gun}</span>
                        <span className={`font-bold ${saat.saat === 'بسته' ? 'text-red-600' : 'text-orange-600'}`} dir="ltr">
                          {saat.saat}
                        </span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex justify-between items-center py-2 border-b border-orange-200">
                        <span className="text-gray-700 font-medium">شنبه - پنج‌شنبه</span>
                        <span className="font-bold text-orange-600" dir="ltr">08:00 - 20:00</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-orange-200">
                        <span className="text-gray-700 font-medium">جمعه</span>
                        <span className="font-bold text-orange-600" dir="ltr">10:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700 font-medium">تعطیلات رسمی</span>
                        <span className="font-bold text-red-600">بسته</span>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Contact Form - 3 columns */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8" dir="rtl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">پیام خود را ارسال کنید</h2>
                      <p className="text-blue-100 text-sm mt-1">ما در اسرع وقت به شما پاسخ خواهیم داد</p>
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="m-8 p-6 bg-green-50 border-2 border-green-200 rounded-xl"
                    dir="rtl"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div>
                        <div className="text-lg font-bold text-green-900">پیام شما با موفقیت ارسال شد!</div>
                        <div className="text-sm text-green-700">در اسرع وقت با شما تماس می‌گیریم</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6" dir="rtl">
                  <div className="grid md:grid-cols-2 gap-6">
                <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-bold">۱</span>
                        </div>
                        نام و نام خانوادگی *
                  </label>
                  <input
                    type="text"
                    value={formData.ad}
                    onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="نام کامل خود را وارد کنید"
                    required
                  />
                </div>

                <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-bold">۲</span>
                        </div>
                        شماره تماس
                      </label>
                      <input
                        type="tel"
                        value={formData.telefon}
                        onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="+93 XXX XXX XXX"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">۳</span>
                      </div>
                      ایمیل *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="example@email.com"
                    required
                      dir="ltr"
                  />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">۴</span>
                      </div>
                      موضوع پیام *
                  </label>
                    <select
                    value={formData.konu}
                    onChange={(e) => setFormData({ ...formData, konu: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                    >
                      <option value="">موضوع را انتخاب کنید</option>
                      <option value="general">سوالات عمومی</option>
                      <option value="support">پشتیبانی فنی</option>
                      <option value="store">سوالات مغازه</option>
                      <option value="payment">پرداخت و مالی</option>
                      <option value="complaint">شکایت</option>
                      <option value="suggestion">پیشنهاد</option>
                      <option value="other">سایر</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">۵</span>
                      </div>
                      پیام شما *
                  </label>
                  <textarea
                    value={formData.mesaj}
                    onChange={(e) => setFormData({ ...formData, mesaj: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    rows={6}
                      placeholder="پیام، سوال یا نظر خود را با جزئیات بنویسید..."
                    required
                  />
                    <div className="text-xs text-gray-500 mt-2">حداقل ۲۰ کاراکتر</div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                    className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        در حال ارسال...
                      </>
                    ) : (
                      <>
                        <span className="text-lg">ارسال پیام</span>
                        <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                </button>

                  <p className="text-center text-sm text-gray-500">
                    با ارسال این فرم، شما با 
                    <a href="/gizlilik" className="text-blue-600 hover:underline mx-1">شرایط و قوانین</a>
                    ما موافقت می‌کنید
                  </p>
              </form>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12 border border-gray-200" dir="rtl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">سوالات متداول</h2>
              <p className="text-gray-600">پاسخ سوالات رایج را اینجا پیدا کنید</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">۱</span>
                  </div>
                  چگونه آگهی ثبت کنم؟
                </h3>
                <p className="text-gray-600 text-sm">
                  روی دکمه "ثبت آگهی" کلیک کنید، فرم را پر کنید و عکس‌ها را آپلود کنید. آگهی شما پس از تایید منتشر می‌شود.
                </p>
                  </div>

              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold">۲</span>
                  </div>
                  آیا ثبت آگهی رایگان است؟
                </h3>
                <p className="text-gray-600 text-sm">
                  بله! ثبت آگهی کاملاً رایگان است. اما می‌توانید با پکیج‌های پریمیوم، آگهی خود را ویژه کنید.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold">۳</span>
                  </div>
                  چگونه مغازه باز کنم؟
                </h3>
                <p className="text-gray-600 text-sm">
                  روی "افتتاح مغازه" کلیک کنید، اطلاعات را وارد کنید و پکیج مناسب را انتخاب کنید. مغازه Basic رایگان است!
                </p>
                  </div>

              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 font-bold">۴</span>
                  </div>
                  چند وقت طول می‌کشد تا پاسخ بگیرم؟
                </h3>
                <p className="text-gray-600 text-sm">
                  تیم پشتیبانی ما معمولاً در کمتر از ۲ ساعت (در ساعات کاری) پاسخ می‌دهد. در مواقع اضطراری تماس بگیرید.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
