"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import VitrinAds from "@/components/VitrinAds";
import { MapPin, Eye, Clock, Heart, Search } from "lucide-react";
import { formatDate, getImageUrl } from "@/lib/utils";
import PriceDisplay from "@/components/PriceDisplay";

interface Ilan {
  id: number;
  baslik: string;
  fiyat: number;
  ana_resim: string;
  kategori_ad: string;
  il_ad: string;
  goruntulenme: number;
  created_at: string;
  resimler?: string[];
  resim_sayisi: number;
}

function AramaContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetchResults();
    }
  }, [query]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ilanlar?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.success) {
        setIlanlar(data.data);
      }
    } catch (error) {
      console.error('Arama sonuçları yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center gap-3 text-gray-600 mb-2">
                  <Search className="h-6 w-6" />
                  <span className="text-lg">Arama Sonuçları</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  "{query}"
                </h1>
                <p className="text-gray-600">
                  {loading ? 'Aranıyor...' : `${ilanlar.length} sonuç bulundu`}
                </p>
              </div>

              {/* Arama Sonuçlarında Sponsorlu İlanlar */}
              <div className="mb-8">
                <VitrinAds 
                  vitrinTuru="arama" 
                  title="آگهی های اسپانسر شده"
                  limit={4}
                />
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="card animate-pulse">
                      <div className="aspect-video bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : ilanlar.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-16 text-center" dir="rtl">
                  <div className="max-w-md mx-auto">
                    <div className="mb-6">
                      <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      نتیجه‌ای یافت نشد
                    </h3>
                    <p className="text-gray-600 mb-2 text-lg">
                      برای "{query}" هیچ آگهی یافت نشد
                    </p>
                    <p className="text-gray-500 mb-8">
                      لطفاً کلمات کلیدی دیگری را امتحان کنید
                    </p>
                    <Link 
                      href="/" 
                      className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-sm"
                    >
                      مشاهده همه آگهی‌ها
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ilanlar.map((ilan) => (
                    <Link key={ilan.id} href={`/ilan/${ilan.id}`} className="card group">
                      <div className="relative aspect-video bg-gray-100">
                        <Image
                          src={getImageUrl(ilan.resimler?.[0] || ilan.ana_resim)}
                          alt={ilan.baslik}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-50">
                          <Heart className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="inline-block bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold mb-2">
                          {ilan.kategori_ad}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {ilan.baslik}
                        </h3>
                        <PriceDisplay 
                          price={ilan.fiyat}
                          currency="AFN"
                          className="text-2xl font-bold text-blue-600 mb-3"
                        />
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{ilan.il_ad}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{ilan.goruntulenme}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{formatDate(ilan.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
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

export default function AramaSayfasi() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    }>
      <AramaContent />
    </Suspense>
  );
}

