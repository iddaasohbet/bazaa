"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileSidebar from "@/components/ProfileSidebar";
import { MessageSquare, User, Send, Search } from "lucide-react";

interface Mesaj {
  id: number;
  ilan_id: number;
  ilan_baslik: string;
  gonderici_id: number;
  alici_id: number;
  gonderici_ad: string;
  alici_ad: string;
  mesaj: string;
  tarih: string;
  okundu: boolean;
}

export default function Mesajlar() {
  const router = useRouter();
  const [mesajlar, setMesajlar] = useState<Mesaj[]>([]);
  const [selectedMesaj, setSelectedMesaj] = useState<Mesaj | null>(null);
  const [mesajText, setMesajText] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.replace('/giris?redirect=/mesajlar');
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      loadMesajlar(userData);
    } catch (error) {
      router.replace('/giris?redirect=/mesajlar');
    }
  }, [router]);

  const loadMesajlar = async (user: any) => {
    try {
      const response = await fetch('/api/mesajlar', {
        headers: { 'x-user-id': user.id.toString() }
      });

      const data = await response.json();
      if (data.success) {
        setMesajlar(data.data || []);
        if (data.data?.length > 0 && !selectedMesaj) {
          setSelectedMesaj(data.data[0]);
          markAsRead(data.data[0].id, user);
        }
      }
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error);
    }
  };

  const markAsRead = async (mesajId: number, user?: any) => {
    try {
      const userData = user || currentUser;
      if (!userData) return;

      await fetch('/api/mesajlar', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userData.id.toString()
        },
        body: JSON.stringify({ mesajId })
      });

      setMesajlar(prev => prev.map(m => 
        m.id === mesajId ? { ...m, okundu: true } : m
      ));
      window.dispatchEvent(new Event('mesajGuncelle'));
    } catch (error) {
      console.error('Mesaj okundu işaretlenirken hata:', error);
    }
  };

  const handleSend = async () => {
    if (!mesajText.trim() || !selectedMesaj || !currentUser) return;

    try {
      const response = await fetch('/api/mesajlar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id.toString()
        },
        body: JSON.stringify({
          aliciId: selectedMesaj.gonderici_id === currentUser.id ? selectedMesaj.alici_id : selectedMesaj.gonderici_id,
          mesaj: mesajText,
          ilanId: selectedMesaj.ilan_id
        })
      });

      const data = await response.json();
      if (data.success) {
        loadMesajlar(currentUser);
        setMesajText("");
      }
    } catch (error) {
      console.error('Mesaj gönderilirken hata:', error);
    }
  };

  const selectMesaj = (mesaj: Mesaj) => {
    setSelectedMesaj(mesaj);
    if (!mesaj.okundu && mesaj.alici_id === currentUser?.id) {
      markAsRead(mesaj.id);
    }
  };

  if (!currentUser) {
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
            <ProfileSidebar userData={currentUser} activePage="mesajlar" />

            {/* Right Content */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* Page Title */}
              <div dir="rtl">
                <h1 className="text-3xl font-bold text-gray-900">پیام‌ها</h1>
                <p className="text-gray-500 mt-2 text-lg">با صاحبان آگهی‌ها گفتگو کنید</p>
              </div>

              {mesajlar.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center" dir="rtl">
                  <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="h-10 w-10 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">هنوز پیامی ندارید</h3>
                  <p className="text-gray-500 mb-8 text-lg">با صاحبان آگهی‌ها ارتباط برقرار کنید!</p>
                  <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/30"
                  >
                    <Search className="w-5 h-5" />
                    کشف آگهی‌ها
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="grid md:grid-cols-3 h-[600px]">
                    {/* Sol Taraf - Mesaj Listesi */}
                    <div className="md:col-span-1 border-l border-gray-100 overflow-hidden">
                      <div className="p-4 border-b border-gray-100">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="جستجو در پیام‌ها..."
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-gray-50"
                          />
                        </div>
                      </div>

                      <div className="overflow-y-auto h-[calc(600px-73px)]">
                        {mesajlar.map((mesaj) => {
                          const displayName = mesaj.gonderici_id === currentUser?.id ? mesaj.alici_ad : mesaj.gonderici_ad;
                          return (
                            <button
                              key={mesaj.id}
                              onClick={() => selectMesaj(mesaj)}
                              className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-right ${
                                selectedMesaj?.id === mesaj.id ? 'bg-blue-50 border-r-4 border-r-blue-600' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
                                  <User className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-gray-900 truncate">{displayName}</span>
                                    {!mesaj.okundu && mesaj.alici_id === currentUser?.id && (
                                      <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-400 mb-1 truncate">{mesaj.ilan_baslik || 'پیام عمومی'}</p>
                                  <p className="text-sm text-gray-600 truncate">{mesaj.mesaj}</p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sağ Taraf - Mesaj Detayı */}
                    <div className="md:col-span-2">
                      {selectedMesaj ? (
                        <div className="flex flex-col h-full">
                          <div className="p-5 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                <User className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-gray-900 text-lg">
                                  {selectedMesaj.gonderici_id === currentUser?.id ? selectedMesaj.alici_ad : selectedMesaj.gonderici_ad}
                                </div>
                                <div className="text-sm text-gray-500">{selectedMesaj.ilan_baslik || 'پیام عمومی'}</div>
                              </div>
                              {selectedMesaj.ilan_id && (
                                <Link 
                                  href={`/ilan/${selectedMesaj.ilan_id}`}
                                  className="text-sm text-blue-600 hover:underline font-medium"
                                >
                                  مشاهده آگهی
                                </Link>
                              )}
                            </div>
                          </div>

                          <div className="flex-1 p-5 overflow-y-auto bg-gray-50/50">
                            <div className="space-y-4">
                              {mesajlar
                                .filter(m => 
                                  (m.ilan_id === selectedMesaj.ilan_id || (!m.ilan_id && !selectedMesaj.ilan_id)) &&
                                  ((m.gonderici_id === selectedMesaj.gonderici_id && m.alici_id === selectedMesaj.alici_id) ||
                                   (m.gonderici_id === selectedMesaj.alici_id && m.alici_id === selectedMesaj.gonderici_id))
                                )
                                .map((mesaj) => (
                                  <div key={mesaj.id} className={`flex ${mesaj.gonderici_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] rounded-2xl p-4 ${
                                      mesaj.gonderici_id === currentUser?.id
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-white border border-gray-200'
                                    }`}>
                                      <p className={`text-sm ${mesaj.gonderici_id === currentUser?.id ? 'text-white' : 'text-gray-700'}`}>
                                        {mesaj.mesaj}
                                      </p>
                                      <p className={`text-xs mt-2 ${mesaj.gonderici_id === currentUser?.id ? 'text-blue-200' : 'text-gray-400'}`}>
                                        {new Date(mesaj.tarih).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>

                          <div className="p-5 border-t border-gray-100 bg-white">
                            <div className="flex gap-3">
                              <input
                                type="text"
                                value={mesajText}
                                onChange={(e) => setMesajText(e.target.value)}
                                placeholder="پیام خود را بنویسید..."
                                className="flex-1 px-5 py-3.5 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 bg-gray-50"
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                              />
                              <button
                                onClick={handleSend}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/30"
                              >
                                <Send className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                              <MessageSquare className="h-10 w-10 text-gray-300" />
                            </div>
                            <p className="text-gray-500">یک گفتگو انتخاب کنید</p>
                          </div>
                        </div>
                      )}
                    </div>
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
