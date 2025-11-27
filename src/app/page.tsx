"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import FeaturedAds from "@/components/FeaturedAds";
import BannerReklam from "@/components/BannerReklam";
import EliteIlanlar from "@/components/EliteIlanlar";
import ProIlanlar from "@/components/ProIlanlar";
import AdList from "@/components/AdList";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section - Full Width */}
          <div className="mb-10 mt-8">
            <FeaturedAds />
          </div>

          {/* Header Banner Reklam */}
          <BannerReklam konum="header" />

          {/* Vitrin İlanları - Ana Sayfa */}
          <div className="mb-10">
            <VitrinAds 
              vitrinTuru="anasayfa" 
              title="آگهی های ویژه"
              limit={12}
            />
          </div>

          {/* Sponsorlu Mağazalar */}
          <SponsorluMagazalar />

          {/* Main Layout with Sidebar */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Categories */}
            <div className="lg:w-64 flex-shrink-0">
              <Sidebar />
            </div>

            {/* Main Content Area - Elite + Pro + Normal Ads */}
            <div className="flex-1 min-w-0">
              {/* Elite Mağaza İlanları - %100 */}
              <EliteIlanlar />
              
              {/* Pro Mağaza İlanları - %25 */}
              <ProIlanlar />
              
              {/* Normal İlanlar */}
              <AdList />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

