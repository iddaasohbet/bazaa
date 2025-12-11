import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import FeaturedAds from "@/components/FeaturedAds";
import OnecikanIlanlar from "@/components/OnecikanIlanlar";
import PremiumAds from "@/components/PremiumAds";
import AdList from "@/components/AdList";

export const revalidate = 60;

function SliderSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-8 h-[280px] rounded-2xl bg-gray-200 animate-pulse"></div>
      <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
        <div className="h-[130px] rounded-xl bg-gray-200 animate-pulse"></div>
        <div className="h-[130px] rounded-xl bg-gray-200 animate-pulse"></div>
      </div>
    </div>
  );
}

function IlanlarSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] rounded-2xl bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
      <Header />
      
      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-7xl px-4">
          {/* Slider Section */}
          <div className="mb-8 mt-6">
            <Suspense fallback={<SliderSkeleton />}>
              <FeaturedAds />
            </Suspense>
          </div>

          {/* Main Layout - RTL: Sidebar sağda (başta), İçerik solda */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Categories Sidebar - Sağ taraf (RTL'de ilk) */}
            <div className="w-full lg:w-72 flex-shrink-0">
              <Suspense fallback={<div className="h-96 rounded-2xl bg-gray-200 animate-pulse"></div>}>
                <Sidebar />
              </Suspense>
            </div>

            {/* Content Area - Sol taraf (RTL'de ikinci) */}
            <div className="flex-1 min-w-0">
              {/* Admin Öne Çıkan İlanlar - En üstte */}
              <Suspense fallback={null}>
                <OnecikanIlanlar />
              </Suspense>

              {/* Premium Ads Section */}
              <Suspense fallback={
                <div className="mb-8">
                  <div className="h-24 rounded-2xl bg-gradient-to-r from-purple-100 to-blue-100 animate-pulse mb-4"></div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="aspect-square rounded-2xl bg-gray-200 animate-pulse"></div>
                    ))}
                  </div>
                </div>
              }>
                <PremiumAds />
              </Suspense>

              {/* Products */}
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
