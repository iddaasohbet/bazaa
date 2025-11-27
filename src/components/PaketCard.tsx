"use client";

import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import Link from "next/link";

interface PaketProps {
  id: number;
  ad: string;
  ad_dari: string;
  store_level: "basic" | "pro" | "elite";
  sure_ay: number;
  fiyat: number;
  product_limit: number;
  category_limit: number;
  ozellikler: {
    aciklama?: string;
    ozellikler: string[];
  };
  onay?: boolean;
}

export default function PaketCard({ paket, onay = false }: { paket: PaketProps; onay?: boolean }) {
  const isElite = paket.store_level === "elite";
  const isPro = paket.store_level === "pro";
  const isBasic = paket.store_level === "basic";

  const borderColor = isElite
    ? "border-yellow-500"
    : isPro
    ? "border-blue-500"
    : "border-gray-300";

  const bgGradient = isElite
    ? "from-yellow-50 to-orange-50"
    : isPro
    ? "from-blue-50 to-indigo-50"
    : "from-gray-50 to-white";

  const buttonColor = isElite
    ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
    : isPro
    ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
    : "bg-gray-600 hover:bg-gray-700";
  
  // 3 aylık indirim hesaplama
  const normalFiyat = paket.sure_ay === 3 ? (paket.fiyat / 0.7) : 0;
  const tasarruf = paket.sure_ay === 3 ? Math.round(normalFiyat - paket.fiyat) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-2xl border-2 ${borderColor} bg-gradient-to-br ${bgGradient} p-6 shadow-lg hover:shadow-2xl transition-all ${
        isElite ? "ring-4 ring-yellow-200 transform scale-105" : ""
      }`}
    >
      {isElite && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-1.5 text-sm font-bold text-white shadow-lg">
            <Star className="h-4 w-4 fill-white" />
            <span>محبوب‌ترین</span>
          </div>
        </div>
      )}

      <div className="text-center" dir="rtl">
        {/* Paket Adı */}
        <h3 className="mb-2 text-2xl font-bold text-gray-900">{paket.ad_dari}</h3>
        <p className="mb-4 text-sm text-gray-600">{paket.ad}</p>

        {/* Açıklama */}
        {paket.ozellikler.aciklama && (
          <p className="mb-6 text-sm text-gray-600 leading-relaxed px-2">
            {paket.ozellikler.aciklama}
          </p>
        )}

        {/* Fiyat */}
        <div className="mb-6 bg-white/50 rounded-xl p-4">
          {paket.fiyat === 0 ? (
            <div className="text-4xl font-bold text-gray-900">رایگان</div>
          ) : (
            <>
              {/* 3 Aylık paket indirim gösterimi */}
              {paket.sure_ay === 3 && (
                <div className="mb-2">
                  <div className="text-lg line-through text-gray-400" dir="ltr">
                    {Math.round(normalFiyat).toLocaleString("fa-AF")} AFN
                  </div>
                  <div className="inline-block rounded-full bg-green-500 text-white px-3 py-1 text-xs font-bold">
                    ۳۰٪ تخفیف - صرفه‌جویی {tasarruf.toLocaleString("fa-AF")} افغانی
                  </div>
                </div>
              )}
              
              {/* Asıl fiyat */}
              <div className="text-5xl font-bold text-gray-900" dir="ltr">
                {paket.fiyat.toLocaleString("fa-AF")}
                <span className="text-2xl text-gray-600 mr-2">AFN</span>
              </div>
              <div className="mt-1 text-sm text-gray-600">
                {paket.sure_ay === 1 ? "ماهانه" : `${paket.sure_ay.toLocaleString("fa-AF")} ماهه`}
              </div>
            </>
          )}
        </div>

        {/* Özellikler */}
        <ul className="mb-8 space-y-3 text-right">
          {paket.ozellikler.ozellikler.map((ozellik, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
              <span className="text-sm text-gray-700">{ozellik}</span>
            </li>
          ))}
        </ul>

        {/* Buton */}
        {!onay && (
          <Link
            href={`/odeme?paket=${paket.id}`}
            className={`block w-full rounded-xl ${buttonColor} px-6 py-3 text-center font-bold text-white transition-all shadow-lg hover:shadow-xl`}
          >
            {isBasic ? "شروع رایگان" : paket.sure_ay === 3 ? "خرید با ۳۰٪ تخفیف" : "خرید پکیج"}
          </Link>
        )}

        {onay && (
          <div className="rounded-xl bg-green-100 border-2 border-green-500 px-6 py-3 text-center font-bold text-green-700">
            ✓ پکیج فعال
          </div>
        )}
      </div>
    </motion.div>
  );
}


