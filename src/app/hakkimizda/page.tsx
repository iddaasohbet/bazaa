"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Target, Users, Shield, TrendingUp } from "lucide-react";

export default function Hakkimizda() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Hakkımızda</h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">Afganistan'ın En Büyük İlan Platformu</h2>
              <p className="text-blue-100">
                2025 yılında kurulan platformumuz, Afganistan'da alıcı ve satıcıları bir araya getiren 
                güvenilir bir online pazar yeridir.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white rounded-lg shadow-md p-6">
                <Target className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Misyonumuz</h3>
                <p className="text-gray-600">
                  Afganistan'da güvenli, kolay ve hızlı bir şekilde alışveriş yapılmasını sağlamak.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <Users className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Vizyonumuz</h3>
                <p className="text-gray-600">
                  Bölgenin en çok tercih edilen ve güvenilen ilan platformu olmak.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <Shield className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Güvenlik</h3>
                <p className="text-gray-600">
                  Kullanıcılarımızın güvenliği bizim için önceliklidir. Her ilan kontrol edilir.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <TrendingUp className="h-12 w-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Büyüme</h3>
                <p className="text-gray-600">
                  Her gün binlerce yeni ilan ve kullanıcı ile büyümeye devam ediyoruz.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Neden Bizi Seçmelisiniz?</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Ücretsiz ilan verme imkanı</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Geniş kategori yelpazesi</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Kolay ve hızlı ilan verme süreci</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Mobil uyumlu tasarım</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>7/24 müşteri desteği</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Güvenli mesajlaşma sistemi</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

