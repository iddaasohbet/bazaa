"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, Database, UserCheck, FileText, AlertTriangle, CheckCircle } from "lucide-react";

export default function KVKK() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Shield className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">حفاظت از داده‌های شخصی</h1>
            <p className="text-lg text-gray-600">
              سیاست حریم خصوصی و حفاظت از اطلاعات شخصی شما
            </p>
          </div>

          {/* Güncellenme Tarihi */}
          <div className="mb-8 text-center text-sm text-gray-500">
            آخرین به‌روزرسانی: ۳۰ نوامبر ۲۰۲۵
          </div>

          {/* İçerik */}
          <div className="space-y-8">
            {/* 1. Toplanan Bilgiler */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <Database className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">۱. اطلاعات جمع‌آوری شده</h2>
                  <p className="text-gray-700 mb-4">
                    هنگام استفاده از سایت ما، اطلاعات زیر را جمع‌آوری می‌کنیم:
                  </p>
                  <ul className="space-y-2 text-gray-700 mr-6">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>نام و نام خانوادگی</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>آدرس ایمیل و شماره تلفن</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>محتوای آگهی‌ها و تصاویر</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>آمار استفاده و کوکی‌ها</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>آدرس IP و اطلاعات دستگاه</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2. Kullanım Amaçları */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <Eye className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">۲. استفاده از اطلاعات</h2>
                  <p className="text-gray-700 mb-4">
                    اطلاعات جمع‌آوری شده برای موارد زیر استفاده می‌شود:
                  </p>
                  <ul className="space-y-2 text-gray-700 mr-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>ارائه و بهبود خدمات ما</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>مدیریت حساب کاربری شما</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>انتشار و مدیریت آگهی‌ها</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>ارسال اطلاعیه‌های مهم</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>جلوگیری از تقلب و سوء استفاده</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Güvenlik */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <Lock className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">۳. امنیت اطلاعات</h2>
                  <p className="text-gray-700 mb-4">
                    ما از تمام اقدامات امنیتی استاندارد صنعت برای محافظت از اطلاعات شخصی شما استفاده می‌کنیم:
                  </p>
                  <ul className="space-y-2 text-gray-700 mr-6">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>رمزگذاری داده‌ها با SSL/TLS</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>ذخیره‌سازی امن در سرورهای محافظت شده</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>دسترسی محدود به اطلاعات</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>نظارت منظم بر امنیت سیستم</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 4. Paylaşım */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <UserCheck className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">۴. اشتراک‌گذاری با اشخاص ثالث</h2>
                  <p className="text-gray-700 mb-4">
                    ما اطلاعات شخصی شما را بدون اجازه شما به اشخاص ثالث ارائه نمی‌دهیم، مگر در موارد زیر:
                  </p>
                  <ul className="space-y-2 text-gray-700 mr-6">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span>با رضایت صریح شما</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span>برای رعایت قوانین و مقررات</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span>برای محافظت از حقوق و امنیت ما و کاربران</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span>با ارائه‌دهندگان خدمات قابل اعتماد ما</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 5. Çerezler */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <FileText className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">۵. کوکی‌ها</h2>
                  <p className="text-gray-700 mb-4">
                    سایت ما از کوکی‌ها برای بهبود تجربه کاربری استفاده می‌کند:
                  </p>
                  <ul className="space-y-2 text-gray-700 mr-6">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-1">•</span>
                      <span>کوکی‌های ضروری برای عملکرد سایت</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-1">•</span>
                      <span>کوکی‌های تحلیلی برای آمار بازدید</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-1">•</span>
                      <span>کوکی‌های تبلیغاتی برای محتوای شخصی‌سازی شده</span>
                    </li>
                  </ul>
                  <p className="text-gray-700 mt-3">
                    شما می‌توانید کوکی‌ها را از طریق تنظیمات مرورگر خود مدیریت کنید.
                  </p>
                </div>
              </div>
            </div>

            {/* 6. Haklarınız */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">۶. حقوق شما</h2>
                  <p className="text-gray-700 mb-4">
                    شما نسبت به اطلاعات شخصی خود دارای حقوق زیر هستید:
                  </p>
                  <ul className="space-y-2 text-gray-700 mr-6">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>دسترسی به اطلاعات شخصی خود</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>تصحیح اطلاعات نادرست</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>درخواست حذف اطلاعات</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>محدود کردن پردازش داده‌ها</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>اعتراض به استفاده از اطلاعات</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 7. Değişiklikler */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">۷. تغییرات در سیاست حریم خصوصی</h2>
              <p className="text-gray-700">
                ما ممکن است این سیاست حریم خصوصی را به‌روزرسانی کنیم. هرگونه تغییر مهم از طریق ایمیل یا اطلاعیه در سایت به شما اطلاع داده می‌شود.
              </p>
            </div>

            {/* 8. İletişim */}
            <div className="pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">۸. تماس با ما</h2>
              <p className="text-gray-700 mb-4">
                اگر سوالی درباره این سیاست حریم خصوصی دارید، لطفاً با ما تماس بگیرید:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-gray-700">
                <p><strong>ایمیل:</strong> privacy@bazaarewatan.com</p>
                <p><strong>تلفن:</strong> +93 700 000 000</p>
                <p><strong>آدرس:</strong> کابل، افغانستان</p>
              </div>
            </div>
          </div>

          {/* Alt Bilgi */}
          <div className="mt-12 border-t border-gray-300 pt-8 text-center">
            <p className="text-gray-600">
              با استفاده از سایت ما، شما با این سیاست حریم خصوصی موافقت می‌کنید.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}




