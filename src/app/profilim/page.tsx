"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Settings, FileText, Heart, LogOut, Mail, Phone, MapPin, MessageSquare, Shield, ChevronLeft, Camera, Edit3, Check, X } from "lucide-react";
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
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <p className="text-gray-400 mt-4">در حال بارگذاری...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const menuItems = [
    { href: '/profilim', icon: User, label: 'پروفایل من', active: true },
    { href: '/ilanlarim', icon: FileText, label: 'آگهی‌های من', active: false },
    { href: '/favoriler', icon: Heart, label: 'علاقه‌مندی‌ها', active: false },
    { href: '/mesajlar', icon: MessageSquare, label: 'پیام‌ها', active: false },
    { href: '/ayarlar', icon: Settings, label: 'تنظیمات', active: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />
      
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Sidebar - Premium Design */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:sticky lg:top-6">
                {/* Profile Header - Premium */}
                <div className="relative">
                  <div className="h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600"></div>
                  <div className="px-6 pb-6">
                    <div className="relative -mt-12 mb-4">
                      <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg mx-auto flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <User className="h-10 w-10 text-gray-400" />
                        </div>
                      </div>
                      <button className="absolute bottom-0 right-1/2 translate-x-8 translate-y-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-center">
                      <h2 className="text-lg font-bold text-gray-900">{userData.ad || userData.name}</h2>
                      <p className="text-sm text-gray-500 mt-1">{userData.email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu - Premium */}
                <nav className="px-3 pb-3">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 ${
                        item.active 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className={`h-5 w-5 ${item.active ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                      {item.active && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
                    </Link>
                  ))}
                </nav>

                {/* Logout - Premium */}
                <div className="px-3 pb-4 pt-2 border-t border-gray-100 mx-3">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="flex-1 text-sm font-medium text-right">خروج از حساب</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Content - Premium */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* Page Title */}
              <div dir="rtl">
                <h1 className="text-3xl font-bold text-gray-900">پروفایل من</h1>
                <p className="text-gray-500 mt-2 text-lg">اطلاعات حساب خود را مشاهده و مدیریت کنید</p>
              </div>

              {/* Kişisel Bilgiler - Premium Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" dir="rtl">
                <div className="px-8 py-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900">اطلاعات شخصی</h3>
                </div>
                <div className="p-8 space-y-2">
                  {/* Ad Soyad */}
                  <div className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors -mx-2">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-400 mb-1">نام و نام خانوادگی</div>
                      {editing === 'ad' ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-3 py-2 text-sm border-2 border-blue-500 rounded-lg focus:outline-none bg-white"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit('ad')}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="font-semibold text-gray-900 text-lg">{userData.ad || userData.name}</div>
                      )}
                    </div>
                    {editing !== 'ad' && (
                      <button
                        onClick={() => startEdit('ad', userData.ad || userData.name)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* E-posta */}
                  <div className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors -mx-2">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-400 mb-1">ایمیل</div>
                      {editing === 'email' ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="email"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-3 py-2 text-sm border-2 border-blue-500 rounded-lg focus:outline-none bg-white"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit('email')}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="font-semibold text-gray-900 text-lg">{userData.email}</div>
                      )}
                    </div>
                    {editing !== 'email' && (
                      <button
                        onClick={() => startEdit('email', userData.email)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Telefon */}
                  <div className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors -mx-2">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-400 mb-1">تلفن</div>
                      {editing === 'telefon' ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="tel"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-3 py-2 text-sm border-2 border-blue-500 rounded-lg focus:outline-none bg-white"
                            placeholder="+93 700 000 000"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit('telefon')}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="font-semibold text-gray-900 text-lg">{userData.telefon || <span className="text-gray-400 font-normal">مشخص نشده</span>}</div>
                      )}
                    </div>
                    {editing !== 'telefon' && (
                      <button
                        onClick={() => startEdit('telefon', userData.telefon || '')}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Konum */}
                  <div className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors -mx-2">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-400 mb-1">موقعیت</div>
                      {editing === 'il' ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-3 py-2 text-sm border-2 border-blue-500 rounded-lg focus:outline-none bg-white"
                            placeholder="کابل، افغانستان"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit('il')}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="font-semibold text-gray-900 text-lg">{userData.il || 'کابل، افغانستان'}</div>
                      )}
                    </div>
                    {editing !== 'il' && (
                      <button
                        onClick={() => startEdit('il', userData.il || 'کابل، افغانستان')}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Hesap Güvenliği - Premium Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" dir="rtl">
                <div className="px-8 py-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900">امنیت حساب</h3>
                </div>
                <div className="p-6">
                  <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-red-500" />
                    </div>
                    <div className="flex-1 text-right">
                      <div className="font-medium text-gray-900">تغییر رمز عبور</div>
                      <div className="text-xs text-gray-400 mt-0.5">آخرین تغییر: نامشخص</div>
                    </div>
                    <ChevronLeft className="h-5 w-5 text-gray-300 group-hover:text-gray-400 transition-colors" />
                  </button>
                  
                  <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div className="flex-1 text-right">
                      <div className="font-medium text-gray-900">تأیید ایمیل</div>
                      <div className="text-xs text-gray-400 mt-0.5">ایمیل شما تأیید شده است</div>
                    </div>
                    <div className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">تأیید شده</div>
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
