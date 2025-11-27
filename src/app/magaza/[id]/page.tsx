"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Store, MapPin, Eye, Phone, Star, Package, Crown, ShoppingBag } from "lucide-react";
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-purple-50">
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
              {/* Kapak Bölgesi */}
              <div className="relative mb-8 mt-8 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                {/* Kapak Resmi - Fixed Aspect Ratio */}
                <div className={`relative ${isPremium ? 'aspect-[4/1]' : 'aspect-[5/1]'} max-h-80 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600`}>
                  {magaza.kapak_resmi ? (
                    <img
                      src={getImageUrl(magaza.kapak_resmi)}
                      alt={magaza.ad}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center' }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Store className="h-32 w-32 text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                {/* Mağaza Bilgileri */}
                <div className="relative px-8 pb-8 -mt-20" dir="rtl">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Logo */}
                    <div className={`relative ${isPremium ? 'w-40 h-40' : 'w-32 h-32'} rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white flex-shrink-0 ring-4 ring-purple-200`}>
                      {magaza.logo ? (
                        <img
                          src={getImageUrl(magaza.logo)}
                          alt={magaza.ad}
                          className="w-full h-full object-contain p-2"
                          style={{ objectPosition: 'center' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                          <Store className="h-16 w-16 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Bilgiler */}
                    <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">
                              {magaza.ad_dari || magaza.ad}
                            </h1>
                            {(isPremium || isPro) && (
                              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                                isPremium 
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                              }`}>
                                {isPremium ? <Crown className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                                <span>{isPremium ? 'ممتاز' : 'حرفه‌ای'}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-700 text-lg mb-3">{magaza.aciklama}</p>
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
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg border-2 border-green-500"
                        >
                          <Phone className="h-5 w-5" />
                          <span>تماس با مغازه</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vitrin İlanları */}
              {vitrinIlanlar.length > 0 && (
                <section className="mb-12 bg-white rounded-2xl border-2 border-yellow-200 p-8 shadow-lg" dir="rtl">
                  <div className="flex items-center gap-3 mb-6">
                    <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                    <h2 className="text-3xl font-bold text-gray-900">ویترین مغازه</h2>
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

              {/* Tüm İlanlar */}
              <section className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg" dir="rtl">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <ShoppingBag className="h-8 w-8 text-blue-600" />
                  همه محصولات
                </h2>
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

