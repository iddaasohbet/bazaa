"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileSidebar from "@/components/ProfileSidebar";
import { FileText, MapPin, Eye, Clock, Edit, Trash2, Plus, TrendingUp, BarChart3 } from "lucide-react";
import { formatDate, getImageUrl } from "@/lib/utils";
import PriceDisplay from "@/components/PriceDisplay";

interface Ilan {
  id: number;
  baslik: string;
  fiyat: number;
  fiyat_tipi: string;
  ana_resim: string;
  kategori_ad: string;
  il_ad: string;
  goruntulenme: number;
  created_at: string;
  resimler?: string[];
  resim_sayisi: number;
  durum: string;
}

export default function Ilanlarim() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.replace('/giris?redirect=/ilanlarim');
      return;
    }
    
    try {
      const data = JSON.parse(user);
      setUserData(data);
      fetchIlanlar();
    } catch (error) {
      router.replace('/giris?redirect=/ilanlarim');
    }
  }, [router]);

  const fetchIlanlar = async () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) return;

      const userData = JSON.parse(user);
      const response = await fetch(`/api/ilanlar/kullanici/${userData.id}`);
      const data = await response.json();
      
      if (data.success) {
        setIlanlar(data.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('İlanlar yüklenirken hata:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این آگهی را حذف کنید؟')) {
      try {
        const user = localStorage.getItem('user');
        if (!user) return;

        const userData = JSON.parse(user);
        const response = await fetch(`/api/ilanlar/${id}`, {
          method: 'DELETE',
          headers: { 'x-user-id': userData.id.toString() }
        });

        const data = await response.json();
        if (data.success) {
          setIlanlar(prev => prev.filter(ilan => ilan.id !== id));
        }
      } catch (error) {
        console.error('İlan silme hatası:', error);
      }
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />
      
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-10">
            <ProfileSidebar userData={userData} activePage="ilanlarim" />

            {/* Right Content */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* Page Title */}
              <div className="flex items-center justify-between" dir="rtl">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">آگهی‌های من</h1>
                  <p className="text-gray-500 mt-2 text-lg">آگهی‌های خود را مدیریت کنید</p>
                </div>
                <Link
                  href="/ilan-ver"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/30"
                >
                  <Plus className="w-5 h-5" />
                  ثبت آگهی جدید
                </Link>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                      <div className="aspect-[4/3] bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : ilanlar.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center" dir="rtl">
                  <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">هنوز آگهی ثبت نکرده‌اید</h3>
                  <p className="text-gray-500 mb-8 text-lg">اولین آگهی خود را ثبت کنید!</p>
                  <Link 
                    href="/ilan-ver" 
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/30"
                  >
                    <Plus className="w-5 h-5" />
                    ثبت آگهی
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Stats - Premium */}
                  <div className="grid grid-cols-3 gap-4" dir="rtl">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-gray-900">{ilanlar.length}</div>
                          <div className="text-sm text-gray-500">کل آگهی‌ها</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                          <Eye className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-gray-900">
                            {ilanlar.reduce((sum, i) => sum + i.goruntulenme, 0)}
                          </div>
                          <div className="text-sm text-gray-500">کل بازدیدها</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-green-600">{ilanlar.length}</div>
                          <div className="text-sm text-gray-500">آگهی فعال</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* İlanlar Grid - Premium */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {ilanlar.map((ilan, index) => (
                      <motion.div
                        key={ilan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all">
                          <Link href={`/ilan/${ilan.id}`} className="block">
                            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                              <img
                                src={getImageUrl((ilan.resimler?.[0]) || ilan.ana_resim)}
                                alt={ilan.baslik}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                }}
                              />
                              <div className="absolute top-3 left-3">
                                <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                                  {ilan.kategori_ad}
                                </span>
                              </div>
                            </div>

                            <div className="p-4">
                              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm group-hover:text-blue-600 transition-colors">
                                {ilan.baslik}
                              </h3>
                              
                              <PriceDisplay 
                                price={ilan.fiyat}
                                currency="AFN"
                                className="text-lg font-bold text-blue-600 mb-3"
                              />

                              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>{ilan.goruntulenme}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>{formatDate(ilan.created_at)}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                          
                          {/* Action Buttons */}
                          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/ilan/${ilan.id}/duzenle`}
                              className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors shadow-lg"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={(e) => { e.preventDefault(); handleDelete(ilan.id); }}
                              className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
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
