"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Target, Users, Shield, TrendingUp, Award, Heart, Zap, CheckCircle } from "lucide-react";

export default function Hakkimizda() {
  const degerler = [
    {
      icon: Target,
      title: "مأموریت ما",
      description: "ایجاد یک بازار آنلاین امن، آسان و سریع در افغانستان که خریداران و فروشندگان را به هم متصل کند."
    },
    {
      icon: Users,
      title: "چشم‌انداز ما",
      description: "تبدیل شدن به معتبرترین و محبوب‌ترین پلتفرم آگهی در منطقه با ارائه بهترین تجربه کاربری."
    },
    {
      icon: Shield,
      title: "امنیت",
      description: "امنیت کاربران ما اولویت اصلی ماست. هر آگهی به دقت بررسی می‌شود و حریم خصوصی محافظت می‌شود."
    },
    {
      icon: TrendingUp,
      title: "رشد پایدار",
      description: "هر روز هزاران آگهی و کاربر جدید به ما می‌پیوندند. ما در حال رشد مستمر هستیم."
    }
  ];

  const ozellikler = [
    {
      icon: Award,
      title: "کیفیت بالا",
      description: "تمام آگهی‌ها قبل از انتشار بررسی می‌شوند"
    },
    {
      icon: Heart,
      title: "پشتیبانی عالی",
      description: "تیم پشتیبانی ما ۷/۲۴ در خدمت شماست"
    },
    {
      icon: Zap,
      title: "سرعت بالا",
      description: "پلتفرم سریع و بهینه‌شده برای بهترین تجربه"
    },
    {
      icon: CheckCircle,
      title: "استفاده آسان",
      description: "رابط کاربری ساده و کاربرپسند"
    }
  ];

  const avantajlar = [
    "ثبت آگهی رایگان",
    "دسته‌بندی‌های متنوع و کامل",
    "فرآیند آسان و سریع ثبت آگهی",
    "طراحی موبایل‌دوست و ریسپانسیو",
    "پشتیبانی ۲۴ ساعته",
    "سیستم پیام‌رسانی امن",
    "افتتاح مغازه آنلاین",
    "پکت‌های ویژه برای کسب‌وکارها"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">درباره ما</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              بزرگترین پلتفرم آگهی در افغانستان
            </p>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              از سال ۲۰۲۵، ما یک بازار آنلاین قابل اعتماد هستیم که خریداران و فروشندگان را در سراسر افغانستان به هم متصل می‌کنیم.
            </p>
          </div>

          {/* ارزش‌ها */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
              ارزش‌های ما
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {degerler.map((deger, index) => {
                const Icon = deger.icon;
                return (
                  <div key={index} className="flex gap-4 pb-6 border-b border-gray-200">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {deger.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {deger.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ویژگی‌ها */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
              چرا BazaareWatan؟
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              {ozellikler.map((ozellik, index) => {
                const Icon = ozellik.icon;
                return (
                  <div key={index} className="text-center pb-6 border-b border-gray-200">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {ozellik.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {ozellik.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* مزایا */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
              چرا ما را انتخاب کنید؟
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {avantajlar.map((avantaj, index) => (
                <div key={index} className="flex items-start gap-3 py-3 border-b border-gray-200">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-lg text-right flex-1">
                    {avantaj}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="border-t border-gray-300 pt-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                آماده شروع هستید؟
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                به جامعه بزرگ ما بپیوندید و خرید و فروش خود را امروز شروع کنید
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/kayit"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  ثبت نام رایگان
                </a>
                <a
                  href="/iletisim"
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-3 rounded-lg font-bold border-2 border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  تماس با ما
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

