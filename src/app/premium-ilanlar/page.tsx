import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FavoriteButton from "@/components/FavoriteButton";
import { Crown, Eye, ArrowRight } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import PriceDisplay from "@/components/PriceDisplay";
import { getPremiumIlanlar } from "@/lib/ilan";

export default async function PremiumIlanlarPage() {
  const all = await getPremiumIlanlar(50);
  const ilanlar = all.filter((ilan) => ilan.store_level === "elite");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">آگهی‌های پریمیوم</h1>
              <p className="text-gray-500 text-sm">آگهی‌های فروشگاه‌های پریمیوم</p>
            </div>
          </div>

          {ilanlar.length === 0 ? (
            <div className="text-center py-16">
              <Crown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">هنوز آگهی پریمیوم وجود ندارد</h3>
              <p className="text-gray-500 mb-6">به زودی آگهی‌های پریمیوم اضافه خواهند شد</p>
              <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2">
                بازگشت به صفحه اصلی
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {ilanlar.map((ilan, index) => (
                <div key={ilan.id}>
                  <Link href={`/ilan/${ilan.id}`} className="group block">
                    <div className="relative rounded-2xl bg-white shadow-[0_4px_15px_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:-translate-y-2 transition-all duration-300">
                      
                      {/* Image Area */}
                      <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-t-2xl">
                        <Image
                          src={getImageUrl(
                            (ilan.resimler && ilan.resimler.length > 0 && ilan.resimler[0])
                              ? ilan.resimler[0]
                              : ilan.ana_resim
                          )}
                          alt={ilan.baslik}
                          fill
                          priority={index < 10}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 20vw, 200px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* VIP Badge */}
                        <div className="absolute top-0 left-0 bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white text-[10px] font-black px-3 py-1.5 rounded-br-xl shadow-lg">
                          <span className="flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            VIP
                          </span>
                        </div>

                        {/* Favorite Button */}
                        <FavoriteButton
                          ilanId={ilan.id}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-all hover:bg-white opacity-0 group-hover:opacity-100"
                        />

                        {/* Premium Badge */}
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow-lg bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600">
                          <Crown className="w-3 h-3" />
                          <span>پریمیوم</span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-3">
                        <h3 className="font-medium text-gray-900 text-xs mb-2 line-clamp-2 min-h-[32px] leading-tight">
                          {ilan.baslik}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                          <PriceDisplay 
                            price={ilan.para_birimi === 'USD' && ilan.fiyat_usd ? ilan.fiyat_usd : ilan.fiyat}
                            currency={(ilan.para_birimi as 'AFN' | 'USD') || 'AFN'}
                            className="text-sm font-bold text-blue-600"
                          />
                          
                          <div className="flex items-center gap-1 text-gray-400 text-[11px]">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{ilan.goruntulenme || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}





