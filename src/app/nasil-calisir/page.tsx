"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UserPlus, Search, PlusCircle, MessageCircle, HandshakeIcon, Store, TrendingUp, Shield } from "lucide-react";

export default function NasilCalisir() {
  const adimlar = [
    {
      icon: UserPlus,
      title: "۱. ثبت نام کنید",
      description: "با ایمیل یا شماره تلفن خود به راحتی یک حساب کاربری رایگان ایجاد کنید.",
      details: [
        "ثبت نام رایگان و سریع",
        "تایید با پیامک",
        "پروفایل شخصی اختصاصی"
      ]
    },
    {
      icon: Search,
      title: "۲. آگهی مورد نظر را پیدا کنید",
      description: "در میان هزاران آگهی، محصول یا خدمات مورد نظر خود را با فیلترهای پیشرفته جستجو کنید.",
      details: [
        "جستجوی پیشرفته با فیلتر",
        "دسته‌بندی‌های متنوع",
        "مرتب‌سازی بر اساس قیمت و تاریخ"
      ]
    },
    {
      icon: MessageCircle,
      title: "۳. با فروشنده تماس بگیرید",
      description: "از طریق سیستم پیام‌رسانی امن ما، با فروشنده ارتباط برقرار کنید و سوالات خود را بپرسید.",
      details: [
        "سیستم پیام‌رسانی ایمن",
        "حفظ حریم خصوصی",
        "اعلان‌های فوری"
      ]
    },
    {
      icon: HandshakeIcon,
      title: "۴. ملاقات و خرید",
      description: "در یک مکان عمومی با فروشنده ملاقات کنید، محصول را بررسی کنید و معامله را انجام دهید.",
      details: [
        "ملاقات در مکان امن",
        "بررسی دقیق محصول",
        "پرداخت امن"
      ]
    }
  ];

  const satisAdimlar = [
    {
      icon: PlusCircle,
      title: "۱. آگهی خود را ثبت کنید",
      description: "با چند کلیک ساده، آگهی خود را با عکس‌های واضح و توضیحات کامل ثبت کنید.",
      details: [
        "آگهی رایگان",
        "تا ۸ عکس",
        "توضیحات کامل"
      ]
    },
    {
      icon: TrendingUp,
      title: "۲. آگهی خود را ارتقا دهید",
      description: "برای دید بیشتر، آگهی خود را ویژه کنید یا از پکت‌های ویژه استفاده کنید.",
      details: [
        "آگهی ویژه",
        "نمایش در صفحه اول",
        "دید ۱۰۰٪ بیشتر"
      ]
    },
    {
      icon: MessageCircle,
      title: "۳. به پیام‌ها پاسخ دهید",
      description: "به سوالات خریداران به سرعت پاسخ دهید و اعتماد آنها را جلب کنید.",
      details: [
        "پاسخ سریع",
        "ارتباط مستقیم",
        "افزایش فروش"
      ]
    },
    {
      icon: HandshakeIcon,
      title: "۴. معامله را انجام دهید",
      description: "با خریدار ملاقات کنید و معامله را با امنیت کامل نهایی کنید.",
      details: [
        "ملاقات امن",
        "پرداخت مطمئن",
        "رضایت مشتری"
      ]
    }
  ];

  const ozellikler = [
    {
      icon: Shield,
      title: "امنیت بالا",
      description: "تمام اطلاعات شما محافظت شده و محرمانه است"
    },
    {
      icon: Store,
      title: "افتتاح مغازه",
      description: "کسب‌وکار خود را با افتتاح مغازه حرفه‌ای گسترش دهید"
    },
    {
      icon: TrendingUp,
      title: "رشد سریع",
      description: "به هزاران خریدار بالقوه در سراسر افغانستان دسترسی داشته باشید"
    },
    {
      icon: MessageCircle,
      title: "پشتیبانی ۷/۲۴",
      description: "تیم پشتیبانی ما همیشه آماده کمک به شماست"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">چگونه کار می‌کند؟</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              خرید و فروش در BazaareWatan بسیار آسان است. این مراحل ساده را دنبال کنید
            </p>
          </div>

          {/* خرید کردن */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                چگونه خرید کنم؟
              </h2>
              <p className="text-gray-600">
                چهار مرحله ساده تا خرید موفق
              </p>
            </div>
            
            <div className="space-y-8">
              {adimlar.map((adim, index) => {
                const Icon = adim.icon;
                return (
                  <div key={index} className="border-b border-gray-200 pb-8">
                    <div className="flex gap-6 items-start">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 text-right">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {adim.title}
                        </h3>
                        <p className="text-gray-600 mb-4 text-lg">
                          {adim.description}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {adim.details.map((detail, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-2 text-blue-600 text-sm"
                            >
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                              {detail}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* فروش کردن */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                چگونه بفروشم؟
              </h2>
              <p className="text-gray-600">
                محصول خود را در چند دقیقه بفروشید
              </p>
            </div>
            
            <div className="space-y-8">
              {satisAdimlar.map((adim, index) => {
                const Icon = adim.icon;
                return (
                  <div key={index} className="border-b border-gray-200 pb-8">
                    <div className="flex gap-6 items-start">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 text-right">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {adim.title}
                        </h3>
                        <p className="text-gray-600 mb-4 text-lg">
                          {adim.description}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {adim.details.map((detail, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-2 text-green-600 text-sm"
                            >
                              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                              {detail}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ویژگی‌های پلتفرم */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                چرا BazaareWatan؟
              </h2>
              <p className="text-gray-600">
                ویژگی‌هایی که ما را متمایز می‌کند
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {ozellikler.map((ozellik, index) => {
                const Icon = ozellik.icon;
                return (
                  <div key={index} className="flex gap-4 pb-6 border-b border-gray-200">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {ozellik.title}
                      </h3>
                      <p className="text-gray-600">
                        {ozellik.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="border-t border-gray-300 pt-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                آماده شروع هستید؟
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                همین حالا ثبت نام کنید و به جامعه بزرگ خریداران و فروشندگان ما بپیوندید
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/kayit"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <UserPlus className="h-5 w-5" />
                  ثبت نام رایگان
                </a>
                <a
                  href="/ilan-ver"
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-3 rounded-lg font-bold border-2 border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <PlusCircle className="h-5 w-5" />
                  آگهی دادن
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







