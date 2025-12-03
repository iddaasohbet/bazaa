import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import FeaturedAds from "@/components/FeaturedAds";
import BannerReklam from "@/components/BannerReklam";
import OnecikanIlanlar from "@/components/OnecikanIlanlar";
import EliteIlanlar from "@/components/EliteIlanlar";
import ProIlanlar from "@/components/ProIlanlar";
import AdList from "@/components/AdList";

// Server Component - SEO ve performans için
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Her 60 saniyede bir revalidate et

// Loading Components
function SliderSkeleton() {
  return (
    <div className="h-[400px] sm:h-[450px] lg:h-[500px] bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );
}

function IlanlarSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-video bg-gray-200 rounded-xl mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section - Full Width with Suspense */}
          <div className="mb-10 mt-8">
            <Suspense fallback={<SliderSkeleton />}>
              <FeaturedAds />
            </Suspense>
          </div>

          {/* Header Banner Reklam */}
          <Suspense fallback={<div className="h-24 bg-gray-100 rounded-lg animate-pulse mb-8"></div>}>
            <BannerReklam konum="header" />
          </Suspense>

          {/* Main Layout with Sidebar */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Categories */}
            <div className="lg:w-64 flex-shrink-0">
              <Suspense fallback={<div className="h-96 bg-gray-100 rounded-lg animate-pulse"></div>}>
                <Sidebar />
              </Suspense>
            </div>

            {/* Main Content Area - Onecikan + Elite + Pro + Normal Ads */}
            <div className="flex-1 min-w-0">
              {/* Öne Çıkan İlanlar */}
              <Suspense fallback={<IlanlarSkeleton />}>
                <OnecikanIlanlar />
              </Suspense>
              
              {/* Elite Mağaza İlanları - %100 */}
              <Suspense fallback={<IlanlarSkeleton />}>
                <EliteIlanlar />
              </Suspense>
              
              {/* Pro Mağaza İlanları - %25 */}
              <Suspense fallback={<IlanlarSkeleton />}>
                <ProIlanlar />
              </Suspense>
              
              {/* Normal İlanlar */}
              <Suspense fallback={<IlanlarSkeleton />}>
                <AdList />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

