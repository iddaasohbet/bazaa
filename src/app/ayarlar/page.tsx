"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Settings, FileText, Heart, LogOut, Lock, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";

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
      
      // API'den güncel kullanıcı bilgilerini yükle
      const response = await fetch('/api/kullanici', {
        headers: {
          'x-user-id': localUser.id.toString()
        }
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
      console.error('Kullanıcı bilgileri yüklenirken hata:', error);
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userLogin'));
    router.push('/');
  };

  const handleSifreDegistir = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (sifreData.yeniSifre !== sifreData.yeniSifreTekrar) {
      alert('رمزهای عبور جدید مطابقت ندارند!');
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
        alert('✅ رمز عبور شما با موفقیت تغییر کرد!');
        setSifreData({ eskiSifre: "", yeniSifre: "", yeniSifreTekrar: "" });
      } else {
        alert(data.message || 'تغییر رمز عبور ناموفق بود!');
      }
    } catch (error) {
      console.error('Şifre değiştirme hatası:', error);
      alert('خطا در تغییر رمز عبور!');
    }
  };

  const handleEmailDegistir = async (e: React.FormEvent) => {
    e.preventDefault();
    
    alert('ویژگی تغییر ایمیل به دلایل امنیتی در حال حاضر غیرفعال است. لطفاً با مدیریت تماس بگیرید.');
    // Email değiştirme işlemi genellikle doğrulama gerektirdiği için şimdilik devre dışı bırakıyoruz
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">تنظیمات</h1>
            <p className="text-gray-600">تنظیمات حساب خود را مدیریت کنید</p>
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
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-md transition-colors mb-1"
                  >
                    <User className="h-5 w-5 text-gray-600" />
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
                    className="flex items-center gap-3 px-3 py-2.5 text-blue-600 bg-blue-50 rounded-md transition-colors mb-1"
                  >
                    <Settings className="h-5 w-5" />
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
              {/* Şifre Değiştir */}
              <div className="border border-gray-200 rounded-lg p-6" dir="rtl">
                <h3 className="text-lg font-bold text-gray-900 mb-6">تغییر رمز عبور</h3>
                <form onSubmit={handleSifreDegistir} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رمز عبور فعلی
                    </label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={sifreData.eskiSifre}
                        onChange={(e) => setSifreData({ ...sifreData, eskiSifre: e.target.value })}
                        className="w-full pr-11 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="رمز عبور فعلی شما"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رمز عبور جدید
                    </label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={sifreData.yeniSifre}
                        onChange={(e) => setSifreData({ ...sifreData, yeniSifre: e.target.value })}
                        className="w-full pr-11 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="رمز عبور جدید شما"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تکرار رمز عبور جدید
                    </label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={sifreData.yeniSifreTekrar}
                        onChange={(e) => setSifreData({ ...sifreData, yeniSifreTekrar: e.target.value })}
                        className="w-full pr-11 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="تکرار رمز عبور جدید"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    تغییر رمز عبور
                  </button>
                </form>
              </div>

              {/* E-posta Değiştir */}
              <div className="border border-gray-200 rounded-lg p-6" dir="rtl">
                <h3 className="text-lg font-bold text-gray-900 mb-6">تغییر ایمیل</h3>
                <form onSubmit={handleEmailDegistir} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ایمیل فعلی
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={userData.email}
                        className="w-full pr-11 pl-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ایمیل جدید
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={emailData.yeniEmail}
                        onChange={(e) => setEmailData({ yeniEmail: e.target.value })}
                        className="w-full pr-11 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="new@email.com"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    تغییر ایمیل
                  </button>
                </form>
              </div>

              {/* Hesap Güvenliği */}
              <div className="border-2 border-red-200 rounded-lg p-6" dir="rtl">
                <h3 className="text-lg font-bold text-red-600 mb-4">منطقه خطرناک</h3>
                <p className="text-sm text-gray-600 mb-4">
                  اگر می‌خواهید حساب خود را برای همیشه حذف کنید، می‌توانید از دکمه زیر استفاده کنید. این عمل قابل بازگشت نیست!
                </p>
                <button
                  onClick={() => {
                    if (confirm('آیا مطمئن هستید که می‌خواهید حساب خود را حذف کنید؟ این عمل قابل بازگشت نیست!')) {
                      localStorage.removeItem('user');
                      window.dispatchEvent(new Event('userLogin'));
                      alert('حساب شما حذف شد');
                      router.push('/');
                    }
                  }}
                  className="border-2 border-red-600 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  حذف حساب
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


