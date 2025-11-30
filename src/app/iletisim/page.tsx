"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Iletisim() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ad: "",
    email: "",
    konu: "",
    mesaj: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // API çağrısı yapılacak
    setTimeout(() => {
      alert('Mesajınız alındı. En kısa sürede size dönüş yapacağız.');
      setFormData({ ad: "", email: "", konu: "", mesaj: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-6" dir="rtl">تماس با ما</h1>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8" dir="rtl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">با ما در تماس باشید</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام و نام خانوادگی
                  </label>
                  <input
                    type="text"
                    value={formData.ad}
                    onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
                    className="input"
                    placeholder="نام شما"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    موضوع
                  </label>
                  <input
                    type="text"
                    value={formData.konu}
                    onChange={(e) => setFormData({ ...formData, konu: e.target.value })}
                    className="input"
                    placeholder="موضوع پیام شما"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    پیام شما
                  </label>
                  <textarea
                    value={formData.mesaj}
                    onChange={(e) => setFormData({ ...formData, mesaj: e.target.value })}
                    className="input"
                    rows={6}
                    placeholder="پیام خود را اینجا بنویسید..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                  {loading ? 'در حال ارسال...' : 'ارسال پیام'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8" dir="rtl">
                <h2 className="text-2xl font-bold mb-4">اطلاعات تماس</h2>
                <p className="text-blue-100 mb-6">
                  چگونه می‌توانیم به شما کمک کنیم؟ برای سوالات خود با ما تماس بگیرید.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-6 w-6 flex-shrink-0" />
                    <div>
                      <div className="font-semibold mb-1">آدرس</div>
                      <div className="text-blue-100">کابل، افغانستان</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-6 w-6 flex-shrink-0" />
                    <div>
                      <div className="font-semibold mb-1">تلفن</div>
                      <a href="tel:+93700000000" className="text-blue-100 hover:text-white">
                        +93 700 000 000
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-6 w-6 flex-shrink-0" />
                    <div>
                      <div className="font-semibold mb-1">ایمیل</div>
                      <a href="mailto:info@bazaarewatan.com" className="text-blue-100 hover:text-white">
                        info@bazaarewatan.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-8" dir="rtl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">ساعات کاری</h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>دوشنبه - جمعه</span>
                    <span className="font-semibold">۰۸:۰۰ - ۱۸:۰۰</span>
                  </div>
                  <div className="flex justify-between">
                    <span>شنبه</span>
                    <span className="font-semibold">۰۹:۰۰ - ۱۵:۰۰</span>
                  </div>
                  <div className="flex justify-between">
                    <span>یکشنبه</span>
                    <span className="font-semibold text-red-600">بسته</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

