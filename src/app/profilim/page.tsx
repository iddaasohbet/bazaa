"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Settings, FileText, Heart, LogOut, Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function Profilim() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (field: string, currentValue: string) => {
    setEditing(field);
    setEditValue(currentValue);
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditValue("");
  };

  const saveEdit = async (field: string) => {
    try {
      const user = localStorage.getItem('user');
      if (!user) return;

      const localUser = JSON.parse(user);
      
      if (!localUser?.id) {
        alert('Kullanıcı bilgisi bulunamadı');
        return;
      }
      
      const response = await fetch('/api/kullanici', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': localUser.id.toString()
        },
        body: JSON.stringify({
          [field]: editValue
        })
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        setUserData(data.data);
        // LocalStorage'daki kullanıcı bilgilerini güncelle
        localStorage.setItem('user', JSON.stringify({
          ...localUser,
          ...data.data
        }));
        window.dispatchEvent(new Event('userLogin'));
      }
      
      setEditing(null);
      setEditValue("");
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      alert('Güncelleme başarısız oldu');
    }
  };

  useEffect(() => {
    loadUserData();
  }, [router]);

  const loadUserData = async () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) {
        router.replace('/giris?redirect=/profilim');
        return;
      }
      
      const localUser = JSON.parse(user);
      
      if (!localUser?.id) {
        console.error('localUser.id bulunamadı');
        return;
      }
      
      // API'den güncel kullanıcı bilgilerini yükle
      const response = await fetch('/api/kullanici', {
        headers: {
          'x-user-id': localUser.id.toString()
        }
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        setUserData(data.data);
      } else {
        // API'den yüklenemezse localStorage'dan yükle
        setUserData(localUser);
      }
    } catch (error) {
      console.error('Kullanıcı bilgileri yüklenirken hata:', error);
      // Hata durumunda localStorage'dan yükle
      const user = localStorage.getItem('user');
      if (user) {
        setUserData(JSON.parse(user));
      } else {
        router.replace('/giris?redirect=/profilim');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userLogin'));
    router.push('/');
  };

  if (loading || !userData) {
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
          <div className="mb-8" dir="rtl">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">پروفایل من</h1>
            <p className="text-gray-600">اطلاعات حساب خود را مشاهده و مدیریت کنید</p>
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
                  <h2 className="text-center font-bold text-gray-900">{userData.ad || userData.name}</h2>
                  <p className="text-center text-sm text-gray-600 mt-1">{userData.email}</p>
                </div>

                {/* Menu */}
                <nav className="p-2">
                  <Link
                    href="/profilim"
                    className="flex items-center gap-3 px-3 py-2.5 text-blue-600 bg-blue-50 rounded-md transition-colors mb-1"
                  >
                    <User className="h-5 w-5" />
                    <span className="flex-1 text-sm font-medium">پروفایل من</span>
                  </Link>
                  
                  <Link
                    href="/ilanlarim"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-md transition-colors mb-1"
                  >
                    <FileText className="h-5 w-5 text-gray-600" />
                    <span className="flex-1 text-sm font-medium">آگهی‌های من</span>
                  </Link>
                  
                  <Link
                    href="/favoriler"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-md transition-colors mb-1"
                  >
                    <Heart className="h-5 w-5 text-gray-600" />
                    <span className="flex-1 text-sm font-medium">علاقه‌مندی‌ها</span>
                  </Link>
                  
                  <Link
                    href="/mesajlar"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-md transition-colors mb-1"
                  >
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    <span className="flex-1 text-sm font-medium">پیام‌ها</span>
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
            <div className="flex-1 min-w-0 space-y-6">
              {/* Kişisel Bilgiler */}
              <div className="border border-gray-200 rounded-lg p-6" dir="rtl">
                <h3 className="text-lg font-bold text-gray-900 mb-6">اطلاعات شخصی</h3>
                <div className="space-y-4">
                  {/* Ad Soyad */}
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-1">نام و نام خانوادگی</div>
                      {editing === 'ad' ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit('ad')}
                            className="px-4 py-2 border-2 border-blue-600 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            ذخیره
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                          >
                            لغو
                          </button>
                        </div>
                      ) : (
                        <div className="font-semibold text-gray-900">{userData.ad || userData.name}</div>
                      )}
                    </div>
                    {editing !== 'ad' && (
                      <button
                        onClick={() => startEdit('ad', userData.ad || userData.name)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        ویرایش
                      </button>
                    )}
                  </div>
                  
                  {/* E-posta */}
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-1">ایمیل</div>
                      {editing === 'email' ? (
                        <div className="flex gap-2">
                          <input
                            type="email"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit('email')}
                            className="px-4 py-2 border-2 border-blue-600 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            ذخیره
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                          >
                            لغو
                          </button>
                        </div>
                      ) : (
                        <div className="font-semibold text-gray-900">{userData.email}</div>
                      )}
                    </div>
                    {editing !== 'email' && (
                      <button
                        onClick={() => startEdit('email', userData.email)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        ویرایش
                      </button>
                    )}
                  </div>
                  
                  {/* Telefon */}
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-1">تلفن</div>
                      {editing === 'telefon' ? (
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="+93 700 000 000"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit('telefon')}
                            className="px-4 py-2 border-2 border-blue-600 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            ذخیره
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                          >
                            لغو
                          </button>
                        </div>
                      ) : (
                        <div className="font-semibold text-gray-900">{userData.telefon || 'مشخص نشده'}</div>
                      )}
                    </div>
                    {editing !== 'telefon' && (
                      <button
                        onClick={() => startEdit('telefon', userData.telefon || '')}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        ویرایش
                      </button>
                    )}
                  </div>
                  
                  {/* Konum */}
                  <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-1">موقعیت</div>
                      {editing === 'il' ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="کابل، افغانستان"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit('il')}
                            className="px-4 py-2 border-2 border-blue-600 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            ذخیره
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                          >
                            لغو
                          </button>
                        </div>
                      ) : (
                        <div className="font-semibold text-gray-900">{userData.il || 'کابل، افغانستان'}</div>
                      )}
                    </div>
                    {editing !== 'il' && (
                      <button
                        onClick={() => startEdit('il', userData.il || 'کابل، افغانستان')}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        ویرایش
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Hesap Güvenliği */}
              <div className="border border-gray-200 rounded-lg p-6" dir="rtl">
                <h3 className="text-lg font-bold text-gray-900 mb-6">امنیت حساب</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-gray-900">تغییر رمز عبور</div>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-gray-900">تأیید ایمیل</div>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
