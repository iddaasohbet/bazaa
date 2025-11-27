"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Download } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      {/* Android App Download Section */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right" dir="rtl">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                اپلیکیشن موبایل ما را دانلود کنید
              </h3>
              <p className="text-gray-600">
                آگهی ها را سریعتر کشف کنید، از هر جا دسترسی داشته باشید
              </p>
            </div>
            <div className="flex items-center gap-6">
              {/* QR Code */}
              <div className="bg-white p-2 rounded-lg border border-gray-300 shadow-md">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://cihatcengiz.com" 
                  alt="QR Code"
                  className="w-20 h-20"
                />
                <p className="text-center text-[10px] text-gray-500 mt-1">اسکن کنید</p>
              </div>
              
              {/* Download Button */}
              <a
                href="#"
                className="flex items-center gap-3 bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white px-8 py-4 rounded-xl transition-all shadow-lg border-2 border-gray-700"
              >
                <Download className="h-6 w-6" />
                <div className="text-right">
                  <div className="text-xs text-gray-300">دانلود برای اندروید</div>
                  <div className="text-base font-bold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="mb-4">
              <span className="text-2xl font-bold text-gray-900">Afghanistan</span>
              <span className="text-2xl font-bold text-blue-600">.</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              معتبرترین پلتفرم آگهی در افغانستان. کالای دست دوم، خودرو، املاک و بیشتر.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4">لینک های سریع</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/hakkimizda" className="text-gray-600 hover:text-blue-600 transition-colors">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/nasil-calisir" className="text-gray-600 hover:text-blue-600 transition-colors">
                  چگونه کار می کند؟
                </Link>
              </li>
              <li>
                <Link href="/guvenli-alisveris" className="text-gray-600 hover:text-blue-600 transition-colors">
                  خرید امن
                </Link>
              </li>
              <li>
                <Link href="/sss" className="text-gray-600 hover:text-blue-600 transition-colors">
                  سوالات متداول
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4">دسته بندی ها</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/kategori/araclar" className="text-gray-600 hover:text-blue-600 transition-colors">
                  خودرو
                </Link>
              </li>
              <li>
                <Link href="/kategori/emlak" className="text-gray-600 hover:text-blue-600 transition-colors">
                  املاک
                </Link>
              </li>
              <li>
                <Link href="/kategori/elektronik" className="text-gray-600 hover:text-blue-600 transition-colors">
                  لوازم الکترونیکی
                </Link>
              </li>
              <li>
                <Link href="/kategori/ev-esyalari" className="text-gray-600 hover:text-blue-600 transition-colors">
                  لوازم خانه
                </Link>
              </li>
              <li>
                <Link href="/kategori/giyim" className="text-gray-600 hover:text-blue-600 transition-colors">
                  پوشاک
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4">تماس با ما</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">کابل، افغانستان</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a href="tel:+93700000000" className="text-gray-600 hover:text-blue-600 transition-colors">
                  +93 700 000 000
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a href="mailto:info@afghanistan-ilanlar.com" className="text-gray-600 hover:text-blue-600 transition-colors">
                  info@afghanistan-ilanlar.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div>
              &copy; {new Date().getFullYear()} آگهی های افغانستان. تمامی حقوق محفوظ است.
            </div>
            <div className="flex gap-6">
              <Link href="/gizlilik" className="hover:text-blue-600 transition-colors">
                سیاست حفظ حریم خصوصی
              </Link>
              <Link href="/kullanim-kosullari" className="hover:text-blue-600 transition-colors">
                شرایط استفاده
              </Link>
              <Link href="/kvkk" className="hover:text-blue-600 transition-colors">
                حریم خصوصی
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
