"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MessageSquare, User, Send, Search, Settings, FileText, Heart, LogOut } from "lucide-react";

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
    // Kullanıcı kontrolü
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
        headers: {
          'x-user-id': user.id.toString()
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setMesajlar(data.data || []);
        
        // İlk mesajı seç
        if (data.data && data.data.length > 0 && !selectedMesaj) {
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
        // Mesajları yeniden yükle
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userLogin'));
    router.push('/');
  };

  if (!currentUser) {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">پیام های من</h1>
            <p className="text-gray-600">با صاحبان آگهی پیام بدهید</p>
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
                  <h2 className="text-center font-bold text-gray-900">{currentUser.name}</h2>
                  <p className="text-center text-sm text-gray-600 mt-1">{currentUser.email}</p>
                </div>

                {/* Menu */}
                <nav className="p-2">
                  <Link
                    href="/profilim"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-md transition-colors mb-1"
                  >
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="flex-1 text-sm font-medium">حساب من</span>
                  </Link>
                  
                  <Link
                    href="/ilanlarim"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-md transition-colors mb-1"
                  >
                    <FileText className="h-5 w-5 text-gray-600" />
                    <span className="flex-1 text-sm font-medium">آگهی های من</span>
                  </Link>
                  
                  <Link
                    href="/favoriler"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-md transition-colors mb-1"
                  >
                    <Heart className="h-5 w-5 text-gray-600" />
                    <span className="flex-1 text-sm font-medium">علاقه مندی ها</span>
                  </Link>
                  
                  <Link
                    href="/mesajlar"
                    className="flex items-center gap-3 px-3 py-2.5 text-blue-600 bg-blue-50 rounded-md transition-colors mb-1"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span className="flex-1 text-sm font-medium">پیام ها</span>
                  </Link>
                  
                  <Link
                    href="/ayarlar"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-md transition-colors mb-1"
                  >
                    <Settings className="h-5 w-5 text-gray-600" />
                    <span className="flex-1 text-sm font-medium">تنظیمات</span>
                  </Link>
                </nav>

                {/* Logout */}
                <div className="p-2 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="flex-1 text-sm font-medium text-right">خروج</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 min-w-0">
              {mesajlar.length === 0 ? (
                <div className="border border-gray-200 rounded-lg p-16 text-center">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">هنوز پیامی وجود ندارد</h3>
                  <p className="text-gray-600 mb-6">
                    با صاحبان آگهی شروع به پیام دهید.
                  </p>
                  <a href="/" className="inline-block border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    کشف آگهی ها
                  </a>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="grid md:grid-cols-3 h-[600px]">
                    {/* Sol Taraf - Mesaj Listesi */}
                    <div className="md:col-span-1 border-r border-gray-200 overflow-hidden">
                      {/* Arama */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="جستجو در پیام ها..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </div>

                      {/* Mesaj Listesi */}
                      <div className="overflow-y-auto h-[calc(600px-73px)]">
                        {mesajlar.map((mesaj) => {
                          const displayName = mesaj.gonderici_id === currentUser?.id ? mesaj.alici_ad : mesaj.gonderici_ad;
                          return (
                          <button
                            key={mesaj.id}
                            onClick={() => selectMesaj(mesaj)}
                            className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors text-left ${
                              selectedMesaj?.id === mesaj.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100 flex-shrink-0">
                                <User className="h-6 w-6 text-gray-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-gray-900 truncate">{displayName}</span>
                                  {!mesaj.okundu && mesaj.alici_id === currentUser?.id && (
                                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mb-1 truncate">{mesaj.ilan_baslik || 'Genel Mesaj'}</p>
                                <p className="text-sm text-gray-600 truncate">{mesaj.mesaj}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(mesaj.tarih).toLocaleString('tr-TR', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
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
                          {/* Mesaj Header */}
                          <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100">
                                <User className="h-5 w-5 text-gray-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900">
                                  {selectedMesaj.gonderici_id === currentUser?.id ? selectedMesaj.alici_ad : selectedMesaj.gonderici_ad}
                                </div>
                                <div className="text-xs text-gray-600">{selectedMesaj.ilan_baslik || 'Genel Mesaj'}</div>
                              </div>
                              {selectedMesaj.ilan_id && (
                                <a 
                                  href={`/ilan/${selectedMesaj.ilan_id}`}
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  مشاهده آگهی
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Mesajlar */}
                          <div className="flex-1 p-4 overflow-y-auto">
                            <div className="space-y-4">
                              {mesajlar
                                .filter(m => 
                                  (m.ilan_id === selectedMesaj.ilan_id || (!m.ilan_id && !selectedMesaj.ilan_id)) &&
                                  ((m.gonderici_id === selectedMesaj.gonderici_id && m.alici_id === selectedMesaj.alici_id) ||
                                   (m.gonderici_id === selectedMesaj.alici_id && m.alici_id === selectedMesaj.gonderici_id))
                                )
                                .map((mesaj) => (
                                  <div key={mesaj.id} className={`flex ${mesaj.gonderici_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] rounded-lg p-3 ${
                                      mesaj.gonderici_id === currentUser?.id
                                        ? 'border border-blue-600 bg-blue-600 text-white' 
                                        : 'border border-gray-200'
                                    }`}>
                                      <p className={`text-sm ${mesaj.gonderici_id === currentUser?.id ? 'text-white' : 'text-gray-700'}`}>
                                        {mesaj.mesaj}
                                      </p>
                                      <p className={`text-xs mt-1 ${mesaj.gonderici_id === currentUser?.id ? 'text-blue-200' : 'text-gray-500'}`}>
                                        {new Date(mesaj.tarih).toLocaleTimeString('tr-TR', {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>

                          {/* Mesaj Gönder */}
                          <div className="p-4 border-t border-gray-200">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={mesajText}
                                onChange={(e) => setMesajText(e.target.value)}
                                placeholder="پیام خود را بنویسید..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                              />
                              <button
                                onClick={handleSend}
                                className="border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                              >
                                <Send className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <div className="text-center">
                            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-600">یک پیام انتخاب کنید</p>
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
