"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Settings, FileText, Heart, LogOut, MapPin, Eye, Clock, Edit, Trash2, MessageSquare } from "lucide-react";
import { formatPrice, formatDate, getImageUrl } from "@/lib/utils";

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
    // Kullanıcı kontrolü
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
      
      // API'den kullanıcının ilanlarını çek
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userLogin'));
    router.push('/');
  };

  const handleDelete = async (id: number) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این آگهی را حذف کنید؟\n\nاین عملیات قابل بازگشت نیست!')) {
      try {
        const user = localStorage.getItem('user');
        if (!user) {
          alert('لطفاً ابتدا وارد شوید');
          return;
        }

        const userData = JSON.parse(user);

        const response = await fetch(`/api/ilanlar/${id}`, {
          method: 'DELETE',
          headers: {
            'x-user-id': userData.id.toString()
          }
        });

        const data = await response.json();
        
        if (data.success) {
          setIlanlar(prev => prev.filter(ilan => ilan.id !== id));
          alert('✅ آگهی با موفقیت حذف شد');
        } else {
          alert('⚠️ ' + (data.message || 'خطا در حذف آگهی'));
        }
      } catch (error) {
        console.error('İlan silme hatası:', error);
        alert('❌ خطا در حذف آگهی. لطفاً دوباره تلاش کنید.');
      }
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="border border-gray-200 rounded-lg p-16 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">İlanlarım</h1>
            <p className="text-gray-600">Verdiğiniz ilanları yönetin</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Menu */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="border border-gray-200 rounded-lg overflow-hidden lg:sticky lg:top-4">
                {/* Profile Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="w-20 h-20 rounded-full border-2 border-gray-300 mx-auto mb-3 flex items-center justify-center">
                    <User className="h-10 w-10 text-gray-600" />
                  </div>
                  <h2 className="text-center font-bold text-gray-900">{userData.name}</h2>
                  <p className="text-center text-sm text-gray-600 mt-1">{userData.email}</p>
                </div>

                {/* Menu */}
                <nav className="p-2">
                  <Link
                    href="/profilim"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-md transition-colors mb-1"
                  >
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="flex-1 text-sm font-medium">Profilim</span>
                  </Link>
                  
                  <Link
                    href="/ilanlarim"
                    className="flex items-center gap-3 px-3 py-2.5 text-blue-600 bg-blue-50 rounded-md transition-colors mb-1"
                  >
                    <FileText className="h-5 w-5" />
                    <span className="flex-1 text-sm font-medium">İlanlarım</span>
                  </Link>
                  
                  <Link
                    href="/favoriler"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-md transition-colors mb-1"
                  >
                    <Heart className="h-5 w-5 text-gray-600" />
                    <span className="flex-1 text-sm font-medium">Favorilerim</span>
                  </Link>
                  
                  <Link
                    href="/mesajlar"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-md transition-colors mb-1"
                  >
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    <span className="flex-1 text-sm font-medium">Mesajlar</span>
                  </Link>
                  
                  <Link
                    href="/ayarlar"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-md transition-colors mb-1"
                  >
                    <Settings className="h-5 w-5 text-gray-600" />
                    <span className="flex-1 text-sm font-medium">Ayarlar</span>
                  </Link>
                </nav>

                {/* Logout */}
                <div className="p-2 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="flex-1 text-sm font-medium text-left">Çıkış Yap</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                      <div className="aspect-video bg-gray-200"></div>
                      <div className="p-3 space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : ilanlar.length === 0 ? (
                <div className="border border-gray-200 rounded-lg p-16 text-center">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Henüz İlan Vermediniz</h3>
                  <p className="text-gray-600 mb-6">
                    İlk ilanınızı verin ve satışa başlayın!
                  </p>
                  <Link 
                    href="/ilan-ver" 
                    className="inline-block border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    İlan Ver
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1">{ilanlar.length}</div>
                      <div className="text-sm text-gray-600">Toplam İlan</div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {ilanlar.reduce((sum, i) => sum + i.goruntulenme, 0)}
                      </div>
                      <div className="text-sm text-gray-600">Toplam Görüntülenme</div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">{ilanlar.length}</div>
                      <div className="text-sm text-gray-600">Aktif İlan</div>
                    </div>
                  </div>

                  {/* İlanlar Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {ilanlar.map((ilan, index) => (
                      <motion.div
                        key={ilan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="group relative">
                          <Link href={`/ilan/${ilan.id}`} className="block h-full">
                            <div className="overflow-hidden rounded-xl border border-gray-200 transition-all hover:shadow-xl hover:border-blue-300 h-full flex flex-col">
                              {/* Image */}
                              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                <Image
                                  src={getImageUrl(ilan.resimler?.[0] || ilan.ana_resim)}
                                  alt={ilan.baslik}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                />
                                
                                {/* Badge */}
                                <div className="absolute top-2 left-2">
                                  <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
                                    {ilan.kategori_ad}
                                  </span>
                                </div>
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
                          
                          {/* Action Buttons */}
                          <div className="absolute top-2 right-2 flex gap-1 z-10">
                            <Link
                              href={`/ilan/${ilan.id}/duzenle`}
                              className="w-8 h-8 rounded-full border-2 border-white bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all shadow-sm"
                              title="Düzenle"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDelete(ilan.id);
                              }}
                              className="w-8 h-8 rounded-full border-2 border-white bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-sm"
                              title="Sil"
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

