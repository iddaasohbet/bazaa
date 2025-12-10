"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lock, Database, Shield, Users, Eye, FileText, UserCheck, MapPin, Baby, Globe, Mail, Edit } from "lucide-react";

export default function Gizlilik() {
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Header />
      
      <main className="flex-1 pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Lock className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">سیاست حفظ حریم خصوصی</h1>
            <p className="text-xl text-blue-600 font-semibold mb-2">BazaareWatan</p>
            <p className="text-lg text-gray-600">چگونه از اطلاعات شما محافظت می‌کنیم</p>
          </div>

          {/* Güncellenme Tarihi */}
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              <Edit className="w-4 h-4" />
              تاریخ به‌روزرسانی: ۲۰۲۵.۱۱.۲۰
            </span>
          </div>
          
          {/* Validite */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-6 mb-8">
            <p className="text-gray-700 text-center"><strong>معتبر برای:</strong> اپلیکیشن موبایل (اندروید) - BazaareWatan</p>
            <p className="text-gray-600 text-center mt-2 text-sm">این سیاست حفظ حریم خصوصی توضیح می‌دهد که اپلیکیشن BazaareWatan چگونه اطلاعات کاربران را جمع‌آوری، استفاده، ذخیره و محافظت می‌کند.</p>
          </div>

          {/* İçerik */}
          <div className="space-y-8">
            {/* 1. Kullanıcının Sağladığı Bilgiler */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">۱. اطلاعاتی که کاربر ارائه می‌دهد</h2>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2"><span className="text-blue-600">•</span><span>نام و نام خانوادگی (اختیاری)</span></li>
                    <li className="flex items-start gap-2"><span className="text-blue-600">•</span><span>شماره تلفن</span></li>
                    <li className="flex items-start gap-2"><span className="text-blue-600">•</span><span>ایمیل</span></li>
                    <li className="flex items-start gap-2"><span className="text-blue-600">•</span><span>اطلاعات مربوط به اعلان‌ها (عنوان، توضیحات، قیمت، موقعیت، عکس‌ها)</span></li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* 2. Otomatik Toplanan Bilgiler */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">۲. اطلاعات جمع‌آوری شده به صورت خودکار</h2>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2"><span className="text-green-600">•</span><span>مدل دستگاه و نسخه سیستم عامل</span></li>
                    <li className="flex items-start gap-2"><span className="text-green-600">•</span><span>آدرس IP</span></li>
                    <li className="flex items-start gap-2"><span className="text-green-600">•</span><span>داده‌های استفاده از اپلیکیشن</span></li>
                    <li className="flex items-start gap-2"><span className="text-green-600">•</span><span>کوکی‌ها و تکنولوژی‌های مشابه</span></li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* 3. Konum Bilgisi */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">۳. اطلاعات موقعیت مکانی (اختیاری)</h2>
                  <p className="text-gray-700 mb-2">موقعیت مکانی فقط برای فیلتر کردن اعلان‌ها یا ثبت اعلان‌های نزدیک استفاده می‌شود.</p>
                  <p className="text-orange-600 font-medium">این اطلاعات با هیچ شخص ثالثی به اشتراک گذاشته نمی‌شود.</p>
                </div>
              </div>
            </div>

            {/* 4. Bilgilerin Kullanımı */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">۴. نحوه استفاده از اطلاعات</h2>
                  <p className="text-gray-700 mb-3">اطلاعات جمع‌آوری شده ممکن است برای اهداف زیر استفاده شود:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2"><span className="text-purple-600">•</span><span>ایجاد حساب کاربری و ورود</span></li>
                    <li className="flex items-start gap-2"><span className="text-purple-600">•</span><span>افزودن، ویرایش و مشاهده اعلان‌ها</span></li>
                    <li className="flex items-start gap-2"><span className="text-purple-600">•</span><span>ارائه خدمات پشتیبانی</span></li>
                    <li className="flex items-start gap-2"><span className="text-purple-600">•</span><span>تأمین امنیت و جلوگیری از کلاهبرداری</span></li>
                    <li className="flex items-start gap-2"><span className="text-purple-600">•</span><span>بهبود کیفیت خدمات و تحلیل داده‌ها</span></li>
                    <li className="flex items-start gap-2"><span className="text-purple-600">•</span><span>رعایت الزامات قانونی</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 5. Bilgi Paylaşımı */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">۵. اشتراک‌گذاری اطلاعات</h2>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
                    <p className="text-red-700 font-bold">BazaareWatan اطلاعات کاربران را نمی‌فروشد و کرایه نمی‌دهد.</p>
                  </div>
                  <p className="text-gray-700 mb-3">اطلاعات فقط در شرایط زیر به اشتراک گذاشته می‌شود:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2"><span className="text-red-600">•</span><span>درخواست قانونی (دادگاه یا مقامات رسمی)</span></li>
                    <li className="flex items-start gap-2"><span className="text-red-600">•</span><span>ارائه دهندگان خدمات (اعلان‌ها، ابزار تحلیل و غیره)</span></li>
                    <li className="flex items-start gap-2"><span className="text-red-600">•</span><span>با رضایت کاربر</span></li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* 6. Bilgi Güvenliği */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">۶. نگهداری و امنیت اطلاعات</h2>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2"><span className="text-indigo-600">•</span><span>اطلاعات روی سرورهای امن ذخیره می‌شود.</span></li>
                    <li className="flex items-start gap-2"><span className="text-indigo-600">•</span><span>برای جلوگیری از دسترسی غیرمجاز از تکنولوژی رمزگذاری و سیستم‌های امنیتی استفاده می‌شود.</span></li>
                    <li className="flex items-start gap-2"><span className="text-indigo-600">•</span><span>پس از حذف حساب کاربری، اطلاعات شما در مدت زمان معقول حذف خواهد شد.</span></li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* 7. Çocukların Gizliliği */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Baby className="h-6 w-6 text-pink-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">۷. حفظ حریم خصوصی کودکان</h2>
                  <p className="text-gray-700 mb-2">اپلیکیشن ما برای کودکان زیر ۱۳ سال طراحی نشده است.</p>
                  <p className="text-gray-700">در صورت تشخیص جمع‌آوری اطلاعات کودکان، حساب مربوطه حذف خواهد شد.</p>
                </div>
              </div>
            </div>
            
            {/* 8. Üçüncü Taraf Hizmetleri */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe className="h-6 w-6 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">۸. خدمات شخص ثالث</h2>
                  <p className="text-gray-700">اپلیکیشن ممکن است از سرویس‌های ثالث مانند Google Play Services، سرویس نقشه و غیره استفاده کند. قوانین مربوط به حفظ حریم خصوصی این سرویس‌ها نیز قابل اجرا است.</p>
                </div>
              </div>
            </div>
            
            {/* 9. Kullanıcı Hakları */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <UserCheck className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">۹. حقوق کاربران</h2>
                  <p className="text-gray-700 mb-3">کاربران حق دارند:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2"><span className="text-emerald-600">•</span><span>مشاهده اطلاعات خود</span></li>
                    <li className="flex items-start gap-2"><span className="text-emerald-600">•</span><span>درخواست حذف اطلاعات</span></li>
                    <li className="flex items-start gap-2"><span className="text-emerald-600">•</span><span>اصلاح اطلاعات نادرست</span></li>
                    <li className="flex items-start gap-2"><span className="text-emerald-600">•</span><span>بستن کامل حساب</span></li>
                    <li className="flex items-start gap-2"><span className="text-emerald-600">•</span><span>اعتراض به نحوه استفاده از داده‌ها</span></li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* 10. Politika Değişiklikleri */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Edit className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">۱۰. تغییرات در سیاست حفظ حریم خصوصی</h2>
                  <p className="text-gray-700">این سیاست ممکن است گاهی اوقات به‌روزرسانی شود. تغییرات پس از انتشار در داخل اپلیکیشن یا وب‌سایت رسمی معتبر خواهد بود.</p>
                </div>
              </div>
            </div>

            {/* 11. İletişim */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-center">۱۱. برای هرگونه سؤال یا درخواست</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <a href="mailto:arianzekrullah@gmail.com" className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-colors">
                  <Mail className="h-6 w-6" />
                  <div>
                    <p className="text-sm text-white/80">ایمیل</p>
                    <p className="font-medium">arianzekrullah@gmail.com</p>
                  </div>
                </a>
                <a href="https://www.bazaarewatan.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-colors">
                  <Globe className="h-6 w-6" />
                  <div>
                    <p className="text-sm text-white/80">وب‌سایت</p>
                    <p className="font-medium">www.bazaarewatan.com</p>
                  </div>
                </a>
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

