"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileSidebar from "@/components/ProfileSidebar";
import { Lock, Mail, Shield, AlertTriangle, Key, Trash2 } from "lucide-react";

export default function Ayarlar() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [sifreData, setSifreData] = useState({
    eskiSifre: "",
    yeniSifre: "",
    yeniSifreTekrar: "",
  });

  const [emailData, setEmailData] = useState({
    yeniEmail: "",
  });

  useEffect(() => {
    loadUserData();
  }, [router]);

  const loadUserData = async () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) {
        router.replace('/giris?redirect=/ayarlar');
        return;
      }
      
      const localUser = JSON.parse(user);
      const response = await fetch('/api/kullanici', {
        headers: { 'x-user-id': localUser.id.toString() }
      });

      const data = await response.json();
      if (data.success && data.data) {
        setUserData(data.data);
        setEmailData({ yeniEmail: data.data.email });
      } else {
        setUserData(localUser);
        setEmailData({ yeniEmail: localUser.email });
      }
    } catch (error) {
      const user = localStorage.getItem('user');
      if (user) {
        const localUser = JSON.parse(user);
        setUserData(localUser);
        setEmailData({ yeniEmail: localUser.email });
      } else {
        router.replace('/giris?redirect=/ayarlar');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSifreDegistir = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (sifreData.yeniSifre !== sifreData.yeniSifreTekrar) {
      alert('رمزهای عبور مطابقت ندارند!');
      return;
    }
    
    if (sifreData.yeniSifre.length < 6) {
      alert('رمز عبور باید حداقل ۶ کاراکتر باشد!');
      return;
    }
    
    try {
      const user = localStorage.getItem('user');
      if (!user) return;

      const localUser = JSON.parse(user);
      const response = await fetch('/api/kullanici', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': localUser.id.toString()
        },
        body: JSON.stringify({
          eskiSifre: sifreData.eskiSifre,
          yeniSifre: sifreData.yeniSifre
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ رمز عبور با موفقیت تغییر کرد!');
        setSifreData({ eskiSifre: "", yeniSifre: "", yeniSifreTekrar: "" });
      } else {
        alert(data.message || 'خطا در تغییر رمز عبور!');
      }
    } catch (error) {
      alert('خطا در تغییر رمز عبور!');
    }
  };

  const handleEmailDegistir = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('این ویژگی به دلایل امنیتی غیرفعال است.');
  };

  if (loading || !userData) {
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
            <ProfileSidebar userData={userData} activePage="ayarlar" />

            {/* Right Content */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* Page Title */}
              <div dir="rtl">
                <h1 className="text-3xl font-bold text-gray-900">تنظیمات</h1>
                <p className="text-gray-500 mt-2 text-lg">تنظیمات حساب خود را مدیریت کنید</p>
              </div>

              {/* Şifre Değiştir - Premium Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" dir="rtl">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Key className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">تغییر رمز عبور</h3>
                    <p className="text-sm text-gray-500">رمز عبور خود را تغییر دهید</p>
                  </div>
                </div>
                <form onSubmit={handleSifreDegistir} className="p-8 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رمز عبور فعلی</label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={sifreData.eskiSifre}
                        onChange={(e) => setSifreData({ ...sifreData, eskiSifre: e.target.value })}
                        className="w-full pr-12 pl-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-gray-50 hover:bg-white"
                        placeholder="رمز عبور فعلی"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رمز عبور جدید</label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={sifreData.yeniSifre}
                        onChange={(e) => setSifreData({ ...sifreData, yeniSifre: e.target.value })}
                        className="w-full pr-12 pl-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-gray-50 hover:bg-white"
                        placeholder="رمز عبور جدید (حداقل ۶ کاراکتر)"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">تکرار رمز عبور جدید</label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={sifreData.yeniSifreTekrar}
                        onChange={(e) => setSifreData({ ...sifreData, yeniSifreTekrar: e.target.value })}
                        className="w-full pr-12 pl-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-gray-50 hover:bg-white"
                        placeholder="تکرار رمز عبور جدید"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/30"
                  >
                    تغییر رمز عبور
                  </button>
                </form>
              </div>

              {/* E-posta Değiştir - Premium Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" dir="rtl">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">تغییر ایمیل</h3>
                    <p className="text-sm text-gray-500">آدرس ایمیل خود را تغییر دهید</p>
                  </div>
                </div>
                <form onSubmit={handleEmailDegistir} className="p-8 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل فعلی</label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={userData.email}
                        className="w-full pr-12 pl-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-500"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل جدید</label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={emailData.yeniEmail}
                        onChange={(e) => setEmailData({ yeniEmail: e.target.value })}
                        className="w-full pr-12 pl-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-gray-50 hover:bg-white"
                        placeholder="ایمیل جدید"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-lg shadow-green-500/30"
                  >
                    تغییر ایمیل
                  </button>
                </form>
              </div>

              {/* Hesap Güvenliği - Danger Zone */}
              <div className="bg-white rounded-2xl shadow-sm border-2 border-red-100 overflow-hidden" dir="rtl">
                <div className="px-8 py-6 border-b border-red-100 bg-red-50/50 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-600">منطقه خطرناک</h3>
                    <p className="text-sm text-red-500">این عملیات قابل بازگشت نیست!</p>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-gray-600 mb-6">
                    با حذف حساب، تمام اطلاعات، آگهی‌ها و پیام‌های شما برای همیشه حذف خواهد شد.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('آیا مطمئن هستید؟ این عملیات قابل بازگشت نیست!')) {
                        localStorage.removeItem('user');
                        window.dispatchEvent(new Event('userLogin'));
                        router.push('/');
                      }
                    }}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-lg shadow-red-500/30"
                  >
                    <Trash2 className="w-5 h-5" />
                    حذف حساب کاربری
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

