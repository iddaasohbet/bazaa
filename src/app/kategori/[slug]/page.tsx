"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import VitrinAds from "@/components/VitrinAds";
import { MapPin, Eye, Clock, Heart } from "lucide-react";
import { formatPrice, formatDate, getImageUrl } from "@/lib/utils";

interface Ilan {
  id: number;
  baslik: string;
  fiyat: number;
  fiyat_tipi: string;
  ana_resim: string;
  kategori_ad: string;
  alt_kategori_id?: number;
  il_ad: string;
  durum: string;
  goruntulenme: number;
  created_at: string;
  resimler?: string[];
  resim_sayisi: number;
}

interface Kategori {
  id: number;
  ad: string;
  ad_dari?: string;
  aciklama?: string;
}

interface AltKategori {
  id: number;
  ad: string;
  ad_dari?: string;
  slug: string;
  ilan_sayisi: number;
}

export default function KategoriSayfasi({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [kategori, setKategori] = useState<Kategori | null>(null);
  const [altKategoriler, setAltKategoriler] = useState<AltKategori[]>([]);
  const [selectedAltKategori, setSelectedAltKategori] = useState<number | null>(null);
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [allIlanlar, setAllIlanlar] = useState<Ilan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    
    // URL'den alt kategori slug'ını al
    const urlParams = new URLSearchParams(window.location.search);
    const altSlug = urlParams.get('alt');
    if (altSlug) {
      // Alt kategori listesi yüklendikten sonra seçili yap
      setTimeout(() => {
        const altKat = altKategoriler.find(ak => ak.slug === altSlug);
        if (altKat) {
          handleAltKategoriFilter(altKat.id);
        }
      }, 500);
    }
  }, [resolvedParams.slug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Kategori bilgisi ve ilanları getir
      const response = await fetch(`/api/ilanlar?kategori=${resolvedParams.slug}`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        setAllIlanlar(data.data);
        setIlanlar(data.data);
        const kategoriInfo = {
          id: data.data[0].kategori_id,
          ad: data.data[0].kategori_ad,
        };
        setKategori(kategoriInfo);
        
        // Alt kategorileri getir
        if (kategoriInfo.id) {
          const altKatResponse = await fetch(`/api/alt-kategoriler?kategori_id=${kategoriInfo.id}`);
          const altKatData = await altKatResponse.json();
          if (altKatData.success) {
            setAltKategoriler(altKatData.data);
          }
        }
      }
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAltKategoriFilter = (altKategoriId: number | null) => {
    setSelectedAltKategori(altKategoriId);
    
    if (altKategoriId === null) {
      setIlanlar(allIlanlar);
    } else {
      const filtered = allIlanlar.filter(ilan => ilan.alt_kategori_id === altKategoriId);
      setIlanlar(filtered);
    }
  };

  const durumBadges: { [key: string]: { text: string; color: string } } = {
    'yeni': { text: 'Sıfır', color: 'bg-green-100 text-green-700' },
    'az_kullanilmis': { text: 'Az Kullanılmış', color: 'bg-blue-100 text-blue-700' },
    'kullanilmis': { text: 'Kullanılmış', color: 'bg-gray-100 text-gray-700' },
    'hasarli': { text: 'Hasarlı', color: 'bg-red-100 text-red-700' },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="flex-1 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6 mt-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{kategori?.ad || 'Kategori'}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <Sidebar />
            </div>

            {/* Main Content - Ads List */}
            <div className="flex-1 min-w-0">
              {/* Alt Kategoriler */}
              {altKategoriler.length > 0 && (
                <div className="mb-6" dir="rtl">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">زیر دسته‌بندی‌ها</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleAltKategoriFilter(null)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          selectedAltKategori === null
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        همه ({allIlanlar.length})
                      </button>
                      {altKategoriler.map(altKat => (
                        <button
                          key={altKat.id}
                          onClick={() => handleAltKategoriFilter(altKat.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            selectedAltKategori === altKat.id
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {altKat.ad_dari || altKat.ad} ({altKat.ilan_sayisi || 0})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Kategori Vitrin İlanları */}
              {kategori && (
                <div className="mb-8">
                  <VitrinAds 
                    vitrinTuru="kategori" 
                    kategoriId={kategori.id}
                    title={`${kategori.ad} - ویترین آگهی ها`}
                    limit={6}
                  />
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {[...Array(24)].map((_, i) => (
                    <div key={i} className="card animate-pulse">
                      <div className="aspect-video bg-gray-200"></div>
                      <div className="p-3 space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : ilanlar.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-16 text-center" dir="rtl">
                  <div className="max-w-md mx-auto">
                    <div className="mb-6">
                      <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      هنوز آگهی موجود نیست
                    </h3>
                    <p className="text-gray-600 mb-8 text-lg">
                      اولین آگهی را شما ثبت کنید
                    </p>
                    <Link 
                      href="/ilan-ver" 
                      className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-sm"
                    >
                      ثبت آگهی
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {ilanlar.map((ilan, index) => {
                    const durumBadge = durumBadges[ilan.durum] || durumBadges['kullanilmis'];
                    
                    return (
                      <motion.div
                        key={ilan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link href={`/ilan/${ilan.id}`} className="group block h-full">
                          <div className="overflow-hidden rounded-xl bg-white border border-gray-200 transition-all hover:shadow-xl hover:border-blue-300 h-full flex flex-col">
                            {/* Image */}
                            <div className="relative aspect-video bg-gray-100 overflow-hidden">
                              <Image
                                src={getImageUrl(ilan.resimler?.[0] || ilan.ana_resim)}
                                alt={ilan.baslik}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                              />
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              
                              {/* Badge */}
                              <div className="absolute top-2 left-2">
                                <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
                                  {ilan.kategori_ad}
                                </span>
                              </div>
                              
                              {/* Favorite Button */}
                              <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-all"
                              >
                                <Heart className="h-4 w-4 text-gray-600" />
                              </button>
                            </div>

                            {/* Content */}
                            <div className="p-3 flex-1 flex flex-col">
                              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                                {ilan.baslik}
                              </h3>
                              
                              <div className="flex items-baseline gap-1 mb-3">
                                <span className="text-lg font-bold text-blue-600">
                                  {formatPrice(ilan.fiyat)}
                                </span>
                              </div>

                              <div className="mt-auto space-y-2 text-xs text-gray-600">
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                                  <span className="truncate">{ilan.il_ad}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-3.5 w-3.5 text-gray-400" />
                                    <span>{ilan.goruntulenme}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                                    <span>{formatDate(ilan.created_at)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

