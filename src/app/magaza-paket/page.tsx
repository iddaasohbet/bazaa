"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaketCard from "@/components/PaketCard";
import { motion } from "framer-motion";
// Icons artık kullanılmıyor - 2x2 grid için gereksiz

interface Paket {
  id: number;
  ad: string;
  ad_dari: string;
  store_level: "basic" | "pro" | "elite";
  sure_ay: number;
  fiyat: number;
  eski_fiyat?: number;
  product_limit: number;
  category_limit: number;
  ozellikler: {
    aciklama: string;
    ozellikler: string[];
  };
}

export default function MagazaPaketPage() {
  const [paketler, setPaketler] = useState<Paket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaketler();
  }, []);

  const fetchPaketler = async () => {
    try {
      const response = await fetch('/api/paketler');
      const data = await response.json();
      if (data.success) {
        setPaketler(data.data);
      }
    } catch (error) {
      console.error('Paket yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sadece ücretli paketleri göster (basic hariç)
  const proPaketler = paketler.filter(p => p.store_level === 'pro');
  const elitePaketler = paketler.filter(p => p.store_level === 'elite');
  const ucretliPaketler = [...proPaketler, ...elitePaketler];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
            dir="rtl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              بسته‌های ارتقای مغازه
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              مغازه خود را ارتقا دهید و فروش بیشتری داشته باشید
            </p>
          </motion.div>

          {/* Paketler Grid - 2x2 */}
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {ucretliPaketler.map((paket, index) => (
                <motion.div
                  key={paket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <PaketCard paket={paket} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Özellikler Karşılaştırma Tablosu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8"
            dir="rtl"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              مقایسه امکانات پکیج‌ها
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-4 px-6 text-right text-gray-700 font-semibold">ویژگی</th>
                    <th className="py-4 px-6 text-center text-blue-700 font-semibold">پکیج پرو</th>
                    <th className="py-4 px-6 text-center text-yellow-700 font-semibold">پکیج پریمیوم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-4 px-6 text-gray-700 font-medium">تعداد محصولات</td>
                    <td className="py-4 px-6 text-center">۲۰۰</td>
                    <td className="py-4 px-6 text-center font-bold text-green-600">نامحدود ∞</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-4 px-6 text-gray-700 font-medium">تعداد دسته‌بندی</td>
                    <td className="py-4 px-6 text-center">۳</td>
                    <td className="py-4 px-6 text-center font-bold text-green-600">نامحدود ∞</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700 font-medium">نمایش تخفیف محصولات</td>
                    <td className="py-4 px-6 text-center">✅</td>
                    <td className="py-4 px-6 text-center">✅</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-4 px-6 text-gray-700 font-medium">ویترین صفحه اصلی</td>
                    <td className="py-4 px-6 text-center">❌</td>
                    <td className="py-4 px-6 text-center">✅ ثابت</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700 font-medium">اولویت در جستجو</td>
                    <td className="py-4 px-6 text-center">+۵۰٪</td>
                    <td className="py-4 px-6 text-center font-bold text-yellow-600">x۲ (بالاترین)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-4 px-6 text-gray-700 font-medium">آدرس اختصاصی مغازه</td>
                    <td className="py-4 px-6 text-center">❌</td>
                    <td className="py-4 px-6 text-center">✅</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700 font-medium">بارگذاری دسته‌ای (CSV)</td>
                    <td className="py-4 px-6 text-center">✅</td>
                    <td className="py-4 px-6 text-center">✅</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-4 px-6 text-gray-700 font-medium">آپلود ویدیو</td>
                    <td className="py-4 px-6 text-center">❌</td>
                    <td className="py-4 px-6 text-center">✅ نامحدود</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700 font-medium">تحلیل و گزارش</td>
                    <td className="py-4 px-6 text-center text-sm">پیشرفته</td>
                    <td className="py-4 px-6 text-center text-sm font-bold">حرفه‌ای (Heatmap)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-4 px-6 text-gray-700 font-medium">اعتبار تبلیغاتی</td>
                    <td className="py-4 px-6 text-center">❌</td>
                    <td className="py-4 px-6 text-center font-bold text-yellow-600">۵۰۰-۱۵۰۰ افغانی</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700 font-medium">نشان تأیید کسب‌وکار</td>
                    <td className="py-4 px-6 text-center">❌</td>
                    <td className="py-4 px-6 text-center">✅</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-4 px-6 text-gray-700 font-medium">پشتیبانی</td>
                    <td className="py-4 px-6 text-center text-sm">سریع (۱۲ ساعت)</td>
                    <td className="py-4 px-6 text-center text-sm font-bold">VIP (۲۴/۷)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white"
            dir="rtl"
          >
            <h2 className="text-3xl font-bold mb-4">سوال دارید؟</h2>
            <p className="text-xl mb-6 opacity-90">
              تیم ما آماده پاسخگویی به سوالات شماست
            </p>
            <a
              href="/iletisim"
              className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              تماس با ما
            </a>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


