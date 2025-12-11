import Image from "next/image";
import Link from "next/link";
import { Crown, ArrowLeft, Eye, Zap } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import { getPremiumIlanlar, type PremiumIlan } from "@/lib/ilan";
import { cn, getImageUrl } from "@/lib/utils";
import PriceDisplay from "@/components/PriceDisplay";
export default async function PremiumAds() {
  const ilanlar = await getPremiumIlanlar(20);

  if (ilanlar.length === 0) return null;

  const eliteIlanlar = ilanlar.filter((ilan) => ilan.store_level === "elite");
  const proIlanlar = ilanlar.filter((ilan) => ilan.store_level === "pro");

  const IlanCard = ({
    ilan,
    isElite,
    index = 99,
  }: {
    ilan: PremiumIlan;
    isElite: boolean;
    index?: number;
  }) => (
    <div>
      <Link href={`/ilan/${ilan.id}`} className="group block">
        <div
          className={cn(
            "relative rounded-2xl bg-white transition-all duration-300 group-hover:-translate-y-2 border-[3px]",
            isElite
              ? "border-[#d4a537] shadow-[0_0_20px_rgba(212,165,55,0.2),0_4px_15px_rgba(0,0,0,0.15)] group-hover:shadow-[0_0_30px_rgba(212,165,55,0.4),0_10px_30px_rgba(0,0,0,0.2)]"
              : "border-[#6b7280] shadow-[0_0_20px_rgba(107,114,128,0.2),0_4px_15px_rgba(0,0,0,0.15)] group-hover:shadow-[0_0_30px_rgba(107,114,128,0.4),0_10px_30px_rgba(0,0,0,0.2)]"
          )}
        >
          
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
              priority={index < 4}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 20vw, 200px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* VIP Badge - Top Left (RTL'de sağ üst) - Dikkat Çekici */}
            <div className={`absolute top-0 left-0 ${
              isElite 
                ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600' 
                : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600'
            } text-white text-[10px] font-black px-3 py-1.5 rounded-br-xl shadow-lg`}>
              <span className="flex items-center gap-1">
                {isElite ? <Crown className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                VIP
              </span>
            </div>

            {/* Favorite Button - Top Right (RTL'de sol üst) */}
            <FavoriteButton
              ilanId={ilan.id}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-all hover:bg-white opacity-0 group-hover:opacity-100"
            />

            {/* Package Badge - Bottom Right (RTL'de sol alt) - Renkli */}
            <div className={`absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow-lg ${
              isElite 
                ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600' 
                : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600'
            }`}>
              {isElite ? <Crown className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
              <span>{isElite ? 'پریمیوم' : 'پرو'}</span>
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

              {/* Görüntülenme Sayısı */}
              <div className="flex items-center gap-1 text-gray-400 text-[11px]">
                <Eye className="w-3.5 h-3.5" />
                <span>{ilan.goruntulenme || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="space-y-8 mb-8" dir="rtl">
      
      {/* ========== PREMIUM VİTRİN (Elite) - Kurumsal ========== */}
      {eliteIlanlar.length > 0 && (
        <div>
          {/* Premium Section Header - Sade */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-gray-800 stroke-[1.5]" />
              <div>
                <h2 className="text-base font-bold text-gray-900">ویترین پریمیوم</h2>
                <p className="text-gray-400 text-[11px]">آگهی‌های فروشگاه‌های پریمیوم</p>
              </div>
            </div>
            
            <Link 
              href="/premium-ilanlar"
              className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-xs font-medium"
            >
              <span>همه</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Premium Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
            {eliteIlanlar.slice(0, 8).map((ilan, index) => (
              <IlanCard key={ilan.id} ilan={ilan} isElite={true} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* ========== PRO VİTRİN - Kurumsal ========== */}
      {proIlanlar.length > 0 && (
        <div>
          {/* Pro Section Header - Sade */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-gray-800 stroke-[1.5]" />
              <div>
                <h2 className="text-base font-bold text-gray-900">ویترین پرو</h2>
                <p className="text-gray-400 text-[11px]">آگهی‌های فروشگاه‌های حرفه‌ای</p>
              </div>
            </div>
            
            <Link 
              href="/pro-ilanlar"
              className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-xs font-medium"
            >
              <span>همه</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Pro Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
            {proIlanlar.slice(0, 10).map((ilan, index) => (
              <IlanCard key={ilan.id} ilan={ilan} isElite={false} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile View All Buttons - Sade */}
      <div className="sm:hidden space-y-2">
        {eliteIlanlar.length > 0 && (
          <Link 
            href="/premium-ilanlar"
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium text-sm transition-colors"
          >
            <Crown className="w-4 h-4" />
            <span>همه آگهی‌های پریمیوم</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        )}
        {proIlanlar.length > 0 && (
          <Link 
            href="/pro-ilanlar"
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium text-sm transition-colors"
          >
            <Zap className="w-4 h-4" />
            <span>همه آگهی‌های پرو</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}









