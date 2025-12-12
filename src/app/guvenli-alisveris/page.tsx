"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, CheckCircle, AlertTriangle, Eye, Lock, UserCheck, MessageCircle, CreditCard, MapPin } from "lucide-react";

export default function GuvenliAlisveris() {
  const guvenlikIpuclari = [
    {
      icon: Eye,
      title: "محصول را قبل از خرید ببینید",
      description: "همیشه قبل از پرداخت، محصول را شخصاً بررسی کنید. از خرید محصولاتی که ندیده‌اید خودداری کنید."
    },
    {
      icon: MapPin,
      title: "در مکان‌های عمومی ملاقات کنید",
      description: "برای ملاقات با فروشنده، همیشه مکان‌های عمومی و شلوغ را انتخاب کنید. از ملاقات در خانه یا مکان‌های خلوت پرهیز کنید."
    },
    {
      icon: CreditCard,
      title: "از روش‌های پرداخت امن استفاده کنید",
      description: "ترجیحاً پرداخت را پس از دریافت محصول انجام دهید. از پرداخت‌های قابل ردیابی استفاده کنید."
    },
    {
      icon: UserCheck,
      title: "پروفایل فروشنده را بررسی کنید",
      description: "نظرات و امتیاز فروشنده را بخوانید. از فروشندگان با تاریخچه خوب خرید کنید."
    },
    {
      icon: MessageCircle,
      title: "از سیستم پیام‌رسانی سایت استفاده کنید",
      description: "برای ارتباط اولیه از سیستم پیام‌رسانی داخل سایت استفاده کنید تا سابقه‌ای از مکالمات داشته باشید."
    },
    {
      icon: Lock,
      title: "اطلاعات شخصی خود را حفظ کنید",
      description: "اطلاعات حساس مانند شماره کارت بانکی، رمز عبور یا اطلاعات کامل شخصی را به اشتراک نگذارید."
    },
    {
      icon: AlertTriangle,
      title: "به قیمت‌های غیرواقعی مشکوک باشید",
      description: "اگر قیمتی خیلی پایین‌تر از بازار است، احتمالاً کلاهبرداری است. همیشه قیمت‌ها را با بازار مقایسه کنید."
    },
    {
      icon: Shield,
      title: "فعالیت مشکوک را گزارش دهید",
      description: "هرگونه رفتار مشکوک، کلاهبرداری یا آگهی جعلی را فوراً به ما گزارش دهید."
    }
  ];

  const tehditlar = [
    {
      title: "کلاهبرداری با پیش‌پرداخت",
      description: "فروشنده از شما می‌خواهد قبل از دیدن محصول پول پرداخت کنید.",
      solution: "هرگز قبل از دیدن و بررسی محصول پرداخت نکنید."
    },
    {
      title: "محصولات جعلی",
      description: "محصول اصل نیست یا متفاوت از توضیحات آگهی است.",
      solution: "محصول را به دقت بررسی کنید. از فروشندگان معتبر خرید کنید."
    },
    {
      title: "سرقت اطلاعات",
      description: "تلاش برای دریافت اطلاعات حساس مانند رمز عبور یا شماره کارت.",
      solution: "هرگز اطلاعات حساس را به اشتراک نگذارید. از لینک‌های مشکوک دوری کنید."
    },
    {
      title: "آگهی‌های جعلی",
      description: "آگهی‌هایی با عکس‌های دزدیده شده یا اطلاعات نادرست.",
      solution: "آگهی‌های مشکوک را گزارش دهید. از عکس‌های واضح و معتبر اطمینان حاصل کنید."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Shield className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">خرید امن</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              امنیت شما برای ما اولویت است. این دستورالعمل‌ها را دنبال کنید تا خرید امن و اطمینان‌بخشی داشته باشید
            </p>
          </div>

          {/* نکات امنیتی */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              نکات امنیتی مهم
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {guvenlikIpuclari.map((ipucu, index) => {
                const Icon = ipucu.icon;
                return (
                  <div key={index} className="flex gap-4 pb-6 border-b border-gray-200">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {ipucu.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {ipucu.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* تهدیدات رایج */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              تهدیدات رایج و راه‌حل‌ها
            </h2>
            
            <div className="space-y-6">
              {tehditlar.map((tehdit, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <div className="flex items-start gap-3 mb-2">
                    <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                    <div className="flex-1 text-right">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {tehdit.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {tehdit.description}
                      </p>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-green-700 font-semibold">
                          راه‌حل: {tehdit.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* قوانین طلایی */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              قوانین طلایی خرید امن
            </h2>
            
            <div className="space-y-4">
              {[
                "اگر خیلی خوب به نظر می‌رسد که واقعی باشد، احتمالاً واقعی نیست",
                "هرگز تحت فشار تصمیم نگیرید",
                "به غریزه خود اعتماد کنید - اگر چیزی مشکوک به نظر می‌رسد، احتمالاً مشکوک است",
                "همیشه مدارک و رسیدها را نگه دارید",
                "اطلاعات تماس واقعی فروشنده را یادداشت کنید",
                "پیش از خرید، سوالات خود را بپرسید",
                "برای موارد گران‌قیمت، یک نفر همراه ببرید",
                "به قوانین و مقررات سایت احترام بگذارید"
              ].map((rule, index) => (
                <div key={index} className="flex items-start gap-3 py-3 border-b border-gray-200">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <p className="flex-1 text-gray-800 text-lg text-right pt-1">
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* تماس با پشتیبانی */}
          <div className="border-t border-gray-300 pt-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                در صورت مشاهده فعالیت مشکوک
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                امنیت و آرامش خیال شما برای ما مهم است. اگر با هرگونه فعالیت مشکوک مواجه شدید، فوراً با ما تماس بگیرید
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/iletisim"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  تماس با پشتیبانی
                </a>
                <a
                  href="/sss"
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-3 rounded-lg font-bold border-2 border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  سوالات متداول
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

