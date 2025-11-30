"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, CheckCircle, AlertTriangle, UserCheck, Shield, DollarSign, Ban, Settings } from "lucide-react";

export default function KullanimKosullari() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <FileText className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">شرایط استفاده</h1>
            <p className="text-lg text-gray-600">
              قوانین و مقررات استفاده از پلتفرم
            </p>
          </div>

          {/* Güncellenme Tarihi */}
          <div className="mb-8 text-center text-sm text-gray-500">
            آخرین به‌روزرسانی: ۳۰ نوامبر ۲۰۲۵
          </div>

          {/* İçerik */}
          <div className="space-y-8">
            {/* 1. Hizmet Kullanımı */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <UserCheck className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">۱. استفاده از خدمات</h2>
                  <p className="text-gray-700 mb-4">
                    با استفاده از این پلتفرم، شما شرایط زیر را می‌پذیرید:
                  </p>
                  <ul className="space-y-2 text-gray-700 mr-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>بالای ۱۸ سال سن دارید</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>اطلاعات ارائه شده صحیح و به‌روز است</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>طبق قوانین کشور عمل خواهید کرد</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2. İlan Verme Kuralları */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <FileText className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">۲. قوانین ثبت آگهی</h2>
                  <p className="text-gray-700 mb-4">
                    هنگام ثبت آگهی باید به موارد زیر توجه کنید:
                  </p>
                  <ul className="space-y-2 text-gray-700 mr-6">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>فقط برای محصولات و خدمات قانونی آگهی ثبت کنید</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>آگهی‌های گمراه‌کننده یا نادرست ممنوع است</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>استفاده از تصاویر متعلق به دیگران مجاز نیست</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>محتوای مستهجن یا نامناسب ممنوع است</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>دسته‌بندی صحیح را انتخاب کنید</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Hesap Sorumluluğu */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <Shield className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">۳. مسئولیت حساب کاربری</h2>
                  <p className="text-gray-700">
                    شما مسئول امنیت حساب کاربری و رمز عبور خود هستید. تمام فعالیت‌های انجام شده از حساب شما مسئولیت شماست.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Yasak Faaliyetler */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <Ban className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">۴. فعالیت‌های ممنوع</h2>
                  <p className="text-gray-700 mb-4">
                    فعالیت‌های زیر به شدت ممنوع است:
                  </p>
                  <ul className="space-y-2 text-gray-700 mr-6">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>ثبت آگهی‌های جعلی یا فریبنده</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>ارسال پیام‌های اسپم یا انبوه</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>دسترسی غیرمجاز به حساب دیگران</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>فعالیت‌هایی که امنیت سایت را تهدید می‌کند</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>نقض حق نسخه‌برداری</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 5. Ücretler */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <DollarSign className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">۵. هزینه‌ها و پرداخت‌ها</h2>
                  <p className="text-gray-700">
                    خدمات پایه ثبت آگهی رایگان است. برای ویژگی‌های پیشرفته ممکن است هزینه دریافت شود. شرایط پرداخت و سیاست بازگشت وجه جداگانه مشخص می‌شود.
                  </p>
                </div>
              </div>
            </div>

            {/* 6. İçerik Sahipliği */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">۶. مالکیت محتوا</h2>
              <p className="text-gray-700">
                آگهی‌ها و محتوای ثبت شده متعلق به شماست. با این حال، با انتشار محتوا در پلتفرم، حق استفاده، نمایش و توزیع آن را به ما می‌دهید.
              </p>
            </div>

            {/* 7. Değişiklikler */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <Settings className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">۷. تغییرات در خدمات</h2>
                  <p className="text-gray-700">
                    ما حق تغییر در پلتفرم و شرایط استفاده را محفوظ می‌داریم. تغییرات مهم به کاربران اطلاع داده می‌شود.
                  </p>
                </div>
              </div>
            </div>

            {/* 8. Sorumluluk Reddi */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">۸. رد مسئولیت</h2>
              <p className="text-gray-700">
                پلتفرم صرفاً واسطه‌ای برای اتصال خریداران و فروشندگان است. ما مسئولیتی در قبال معاملات انجام شده نداریم.
              </p>
            </div>

            {/* 9. Hesap Askıya Alma */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">۹. تعلیق حساب</h2>
              <p className="text-gray-700">
                حساب کاربران متخلف ممکن است بدون اخطار قبلی تعلیق یا حذف شود.
              </p>
            </div>

            {/* 10. İletişim */}
            <div className="pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">۱۰. تماس با ما</h2>
              <p className="text-gray-700 mb-4">
                برای سوالات درباره شرایط استفاده:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-gray-700">
                <p><strong>ایمیل:</strong> info@bazaarewatan.com</p>
                <p><strong>تلفن:</strong> +93 700 000 000</p>
                <p><strong>آدرس:</strong> کابل، افغانستان</p>
              </div>
            </div>
          </div>

          {/* Alt Bilgi */}
          <div className="mt-12 border-t border-gray-300 pt-8 text-center">
            <p className="text-gray-600">
              با استفاده از سایت ما، شما با این شرایط استفاده موافقت می‌کنید.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

