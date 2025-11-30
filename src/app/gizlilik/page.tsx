"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lock, Database, Shield, Users, Eye, FileText, UserCheck } from "lucide-react";

export default function Gizlilik() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Lock className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">سیاست حفظ حریم خصوصی</h1>
            <p className="text-lg text-gray-600">
              چگونه از اطلاعات شما محافظت می‌کنیم
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
                    هنگام استفاده از سایت، اطلاعات زیر را جمع‌آوری می‌کنیم:
                  </p>
                  <ul className="space-y-2 text-gray-700 mr-6">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>نام، نام خانوادگی و اطلاعات تماس</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>آدرس ایمیل و شماره تلفن</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>محتوا و تصاویر آگهی‌ها</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>آمار استفاده و کوکی‌ها</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2. Bilgilerin Kullanımı */}
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
                      <span className="text-green-600 mt-1">•</span>
                      <span>ارائه و بهبود خدمات</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>مدیریت حساب کاربری</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>انتشار و مدیریت آگهی‌ها</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>ارسال اطلاعیه‌های مهم</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Bilgi Güvenliği */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <Shield className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">۳. امنیت اطلاعات</h2>
                  <p className="text-gray-700">
                    برای محافظت از اطلاعات شخصی شما از اقدامات امنیتی استاندارد صنعت استفاده می‌کنیم. اطلاعات از طریق اتصالات رمزگذاری شده منتقل و در سرورهای امن ذخیره می‌شود.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Üçüncü Taraflarla Paylaşım */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <Users className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">۴. اشتراک‌گذاری با اشخاص ثالث</h2>
                  <p className="text-gray-700">
                    ما اطلاعات شخصی شما را بدون اجازه شما با اشخاص ثالث به اشتراک نمی‌گذاریم. به جز الزامات قانونی، اطلاعات شما محرمانه نگه داشته می‌شود.
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Çerezler */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <FileText className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">۵. کوکی‌ها</h2>
                  <p className="text-gray-700 mb-3">
                    سایت ما از کوکی‌ها برای بهبود تجربه کاربری استفاده می‌کند. شما می‌توانید کوکی‌ها را از طریق تنظیمات مرورگر خود مدیریت کنید.
                  </p>
                </div>
              </div>
            </div>

            {/* 6. Haklarınız */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <UserCheck className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">۶. حقوق شما</h2>
                  <p className="text-gray-700">
                    شما حق دسترسی، تصحیح یا حذف اطلاعات شخصی خود را دارید. برای استفاده از این حقوق، با ما تماس بگیرید.
                  </p>
                </div>
              </div>
            </div>

            {/* 7. İletişim */}
            <div className="pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">۷. تماس با ما</h2>
              <p className="text-gray-700 mb-4">
                برای سوالات درباره سیاست حفظ حریم خصوصی:
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
              با استفاده از سایت ما، شما با این سیاست حفظ حریم خصوصی موافقت می‌کنید.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

