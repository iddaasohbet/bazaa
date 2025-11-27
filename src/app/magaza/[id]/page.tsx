"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Store, MapPin, Eye, Phone, Star, Package, Crown, ShoppingBag, Sparkles, Zap } from "lucide-react";
import { formatPrice, getImageUrl } from "@/lib/utils";

interface Magaza {
  id: number;
  ad: string;
  ad_dari: string;
  logo: string;
  kapak_resmi: string;
  aciklama: string;
  telefon: string;
  adres: string;
  il_ad: string;
  paket_turu: "normal" | "pro" | "premium";
  store_level?: "basic" | "pro" | "elite";
  goruntulenme: number;
  ilan_sayisi: number;
}

interface Ilan {
  id: number;
  baslik: string;
  fiyat: number;
  ana_resim: string;
  kategori_ad: string;
  goruntulenme: number;
  vitrin: boolean;
}

export default function MagazaSayfasi({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [magaza, setMagaza] = useState<Magaza | null>(null);
  const [vitrinIlanlar, setVitrinIlanlar] = useState<Ilan[]>([]);
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMagaza();
  }, [resolvedParams.id]);

  const fetchMagaza = async () => {
    try {
      setLoading(true);
      
      // Mağaza bilgisi
      const magazaResponse = await fetch(`/api/magazalar/${resolvedParams.id}`);
      const magazaData = await magazaResponse.json();
      
      if (magazaData.success) {
        setMagaza(magazaData.data);
      }

      // Vitrin ilanları
      const vitrinResponse = await fetch(`/api/vitrin?turu=magaza&magaza_id=${resolvedParams.id}&limit=5`);
      const vitrinData = await vitrinResponse.json();
      if (vitrinData.success) {
        setVitrinIlanlar(vitrinData.data);
      }

      // Mağaza ilanları
      const ilanlarResponse = await fetch(`/api/magazalar/${resolvedParams.id}/ilanlar`);
      const ilanlarData = await ilanlarResponse.json();
      if (ilanlarData.success) {
        setIlanlar(ilanlarData.data);
      }
    } catch (error) {
      console.error('Mağaza yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPremium = magaza?.paket_turu === "premium";
  const isPro = magaza?.paket_turu === "pro";
  const isElite = magaza?.store_level === "elite" || isPremium;

  return (
    <div className={`min-h-screen flex flex-col ${
      isElite 
        ? 'bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50' 
        : isPro
        ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
        : 'bg-gradient-to-br from-gray-50 via-white to-purple-50'
    }`}>
      <Header />
      
      <main className="flex-1 pb-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : !magaza ? (
            <div className="flex items-center justify-center py-20">
              <div className="bg-white rounded-xl border border-gray-200 p-16 text-center max-w-md" dir="rtl">
                <div className="mb-6">
                  <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  مغازه یافت نشد
                </h2>
                <p className="text-gray-600 mb-8">
                  متأسفانه این مغازه موجود نیست یا حذف شده است
                </p>
                <Link 
                  href="/" 
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-sm"
                >
                  بازگشت به صفحه اصلی
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Kapak Bölgesi - TAM GENİŞLİK */}
              <div className="relative mb-8 mt-8">
                {/* Kapak Resmi - Tam Genişlik */}
                <div className={`relative rounded-3xl overflow-hidden shadow-2xl ${
                  isElite 
                    ? 'border-4 border-yellow-400 ring-8 ring-yellow-200/50' 
                    : isPro
                    ? 'border-4 border-blue-400 ring-8 ring-blue-200/50'
                    : 'border-4 border-white'
                }`}>
                  {/* Elite/Pro Badge */}
                  {(isElite || isPro) && (
                    <div className="absolute top-6 right-6 z-20">
                      <div className={`flex items-center gap-2 text-white px-6 py-3 rounded-2xl text-base font-bold shadow-2xl border-2 ${
                        isElite
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-300'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-300'
                      }`}>
                        {isElite ? (
                          <>
                            <Crown className="h-6 w-6 fill-white" />
                            <span>مغازه پریمیوم</span>
                            <Sparkles className="h-5 w-5" />
                          </>
                        ) : (
                          <>
                            <Star className="h-6 w-6 fill-white" />
                            <span>مغازه حرفه‌ای</span>
                            <Zap className="h-5 w-5" />
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Kapak Resmi */}
                  <div className={`relative ${isElite ? 'h-72' : isPro ? 'h-64' : 'h-48'} ${
                    isElite 
                      ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600' 
                      : isPro
                      ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'
                      : 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600'
                  }`}>
                    {magaza.kapak_resmi ? (
                      <img
                        src={getImageUrl(magaza.kapak_resmi)}
                        alt={magaza.ad}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {isElite ? (
                          <Crown className="h-40 w-40 text-white/20" />
                        ) : (
                          <Store className="h-32 w-32 text-white/20" />
                        )}
                      </div>
                    )}
                    <div className={`absolute inset-0 ${
                      isElite 
                        ? 'bg-gradient-to-t from-black/70 via-transparent to-yellow-500/20' 
                        : 'bg-gradient-to-t from-black/60 to-transparent'
                    }`}></div>
                    
                    {/* Elite Particles */}
                    {isElite && (
                      <>
                        <div className="absolute top-10 right-20 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                        <div className="absolute top-32 right-40 w-3 h-3 bg-orange-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute top-24 left-32 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                      </>
                    )}
                  </div>
                </div>

                {/* Logo - Kapaktan Taşan - ORTADA */}
                <div className="absolute bottom-36 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className={`relative ${isElite ? 'w-40 h-40' : isPro ? 'w-36 h-36' : 'w-28 h-28'} rounded-3xl overflow-hidden ${
                    isElite 
                      ? 'border-4 border-yellow-400 shadow-2xl bg-white ring-8 ring-yellow-300/50' 
                      : isPro
                      ? 'border-4 border-blue-400 shadow-2xl bg-white ring-8 ring-blue-300/50'
                      : 'border-4 border-white shadow-2xl bg-white ring-4 ring-purple-200'
                  } flex-shrink-0`}>
                    {magaza.logo ? (
                      <img
                        src={getImageUrl(magaza.logo)}
                        alt={magaza.ad}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${
                        isElite 
                          ? 'bg-gradient-to-br from-yellow-500 to-orange-600' 
                          : isPro
                          ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                          : 'bg-gradient-to-br from-gray-500 to-gray-600'
                      }`}>
                        {isElite ? (
                          <Crown className="h-16 w-16 text-white" />
                        ) : isPro ? (
                          <Star className="h-14 w-14 text-white" />
                        ) : (
                          <Store className="h-12 w-12 text-white" />
                        )}
                      </div>
                    )}
                    
                    {/* Glow Effect */}
                    {(isElite || isPro) && (
                      <div className={`absolute inset-0 animate-pulse ${
                        isElite 
                          ? 'bg-gradient-to-br from-yellow-400/20 to-orange-400/20' 
                          : 'bg-gradient-to-br from-blue-400/20 to-indigo-400/20'
                      }`}></div>
                    )}
                  </div>
                </div>

                {/* Mağaza Bilgileri */}
                <div className="relative px-8 pt-24" dir="rtl">
                  {/* Bilgiler - Elite/Pro Özel */}
                  <div className={`rounded-2xl p-8 shadow-2xl ${
                    isElite 
                      ? 'bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 border-4 border-yellow-300' 
                      : isPro
                      ? 'bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border-4 border-blue-300'
                      : 'bg-white border-2 border-gray-200'
                  }`}>
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h1 className={`font-bold ${
                              isElite 
                                ? 'text-4xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent' 
                                : isPro
                                ? 'text-4xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
                                : 'text-3xl text-gray-900'
                            }`}>
                              {magaza.ad_dari || magaza.ad}
                            </h1>
                            {(isElite || isPro) && (
                              <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold shadow-lg ${
                                isElite
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-base border-2 border-yellow-300'
                                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm'
                              }`}>
                                {isElite ? <Crown className="h-5 w-5 fill-white" /> : <Star className="h-4 w-4" />}
                                <span>{isElite ? 'ELITE PREMIUM' : 'PRO'}</span>
                                {isElite && <Sparkles className="h-4 w-4" />}
                              </div>
                            )}
                          </div>
                          
                          {isElite && (
                            <div className="inline-flex items-center gap-2 bg-yellow-100 border-2 border-yellow-300 px-4 py-2 rounded-xl mb-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-sm font-bold text-yellow-800">✓ مغازه تأیید شده</span>
                            </div>
                          )}
                          
                          <p className={`mb-4 leading-relaxed ${
                            isElite ? 'text-gray-800 text-xl' : 'text-gray-700 text-lg'
                          }`}>{magaza.aciklama}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Package className="h-5 w-5 text-blue-600" />
                          <span>{magaza.ilan_sayisi} محصول</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Eye className="h-5 w-5 text-blue-600" />
                          <span>{magaza.goruntulenme} بازدید</span>
                        </div>
                        {magaza.il_ad && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            <span>{magaza.il_ad}</span>
                          </div>
                        )}
                        {magaza.telefon && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="h-5 w-5 text-blue-600" />
                            <span dir="ltr">{magaza.telefon}</span>
                          </div>
                        )}
                      </div>

                      {magaza.telefon && (
                        <a
                          href={`tel:${magaza.telefon}`}
                          className={`inline-flex items-center gap-2 font-bold px-8 py-4 rounded-xl transition-all shadow-lg ${
                            isElite
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-2 border-yellow-400'
                              : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-2 border-green-500'
                          }`}
                        >
                          <Phone className="h-5 w-5" />
                          <span>تماس با مغازه</span>
                          {isElite && <Sparkles className="h-4 w-4" />}
                        </a>
                      )}
                  </div>
                </div>
              </div>

              {/* Vitrin İlanları - Elite Özel */}
              {vitrinIlanlar.length > 0 && (
                <section className={`mb-12 rounded-3xl p-8 shadow-2xl ${
                  isElite 
                    ? 'bg-gradient-to-br from-white via-yellow-50/50 to-orange-50/50 border-4 border-yellow-300 ring-4 ring-yellow-200/30' 
                    : 'bg-white border-2 border-yellow-200'
                }`} dir="rtl">
                  <div className="flex items-center gap-3 mb-6">
                    {isElite ? (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                          <Crown className="h-7 w-7 text-white fill-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                            ویترین پریمیوم
                          </h2>
                          <p className="text-sm text-gray-600">محصولات ویژه این مغازه</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                        <h2 className="text-3xl font-bold text-gray-900">ویترین مغازه</h2>
                      </>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {vitrinIlanlar.map((ilan, index) => (
                      <motion.div
                        key={ilan.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link href={`/ilan/${ilan.id}`} className="group block">
                          <div className="bg-white rounded-xl shadow-xl border-3 border-yellow-300 overflow-hidden hover:shadow-2xl hover:border-yellow-500 transition-all ring-2 ring-yellow-100">
                            <div className="relative aspect-square bg-gray-100">
                              <Image
                                src={getImageUrl(ilan.ana_resim)}
                                alt={ilan.baslik}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute top-2 right-2">
                                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                  ویترین
                                </div>
                              </div>
                            </div>
                            <div className="p-3">
                              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm group-hover:text-blue-600 transition-colors">
                                {ilan.baslik}
                              </h3>
                              <div className="text-lg font-bold text-gray-900">
                                {formatPrice(ilan.fiyat)}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tüm İlanlar - Elite Özel */}
              <section className={`rounded-3xl p-8 shadow-2xl ${
                isElite 
                  ? 'bg-gradient-to-br from-white to-yellow-50/30 border-4 border-yellow-200' 
                  : 'bg-white border-2 border-gray-200'
              }`} dir="rtl">
                <div className="flex items-center gap-3 mb-6">
                  {isElite ? (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                        تمام محصولات
                      </h2>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-8 w-8 text-blue-600" />
                      <h2 className="text-3xl font-bold text-gray-900">همه محصولات</h2>
                    </>
                  )}
                </div>
                {ilanlar.length === 0 ? (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 p-16 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="mb-6">
                        <svg className="w-20 h-20 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        هنوز محصولی اضافه نشده است
                      </h3>
                      <p className="text-gray-600">
                        به زودی محصولات در این مغازه قرار می‌گیرند
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {ilanlar.map((ilan) => (
                      <Link key={ilan.id} href={`/ilan/${ilan.id}`} className="group">
                        <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-purple-300 transition-all">
                          <div className="relative aspect-square bg-gray-100">
                            <Image
                              src={getImageUrl(ilan.ana_resim)}
                              alt={ilan.baslik}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {ilan.baslik}
                            </h3>
                            <div className="text-base font-bold text-gray-900">
                              {formatPrice(ilan.fiyat)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

