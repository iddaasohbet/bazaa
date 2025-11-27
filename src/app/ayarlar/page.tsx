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
    // Kullanıcı kontrolü
    const user = localStorage.getItem('user');
    if (!user) {
      router.replace('/giris?redirect=/ayarlar');
      return;
    }
    
    try {
      const data = JSON.parse(user);
      setUserData(data);
      setEmailData({ yeniEmail: data.email });
      setLoading(false);
    } catch (error) {
      router.replace('/giris?redirect=/ayarlar');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userLogin'));
    router.push('/');
  };

  const handleSifreDegistir = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (sifreData.yeniSifre !== sifreData.yeniSifreTekrar) {
      alert('Yeni şifreler eşleşmiyor!');
      return;
    }
    
    if (sifreData.yeniSifre.length < 6) {
      alert('Şifre en az 6 karakter olmalıdır!');
      return;
    }
    
    alert('Şifreniz başarıyla değiştirildi!');
    setSifreData({ eskiSifre: "", yeniSifre: "", yeniSifreTekrar: "" });
  };

  const handleEmailDegistir = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedData = { ...userData, email: emailData.yeniEmail };
    setUserData(updatedData);
    localStorage.setItem('user', JSON.stringify(updatedData));
    window.dispatchEvent(new Event('userLogin'));
    
    alert('E-posta adresiniz başarıyla değiştirildi!');
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ayarlar</h1>
            <p className="text-gray-600">Hesap ayarlarınızı yönetin</p>
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
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-md transition-colors mb-1"
                  >
                    <FileText className="h-5 w-5 text-gray-600" />
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
                    className="flex items-center gap-3 px-3 py-2.5 text-blue-600 bg-blue-50 rounded-md transition-colors mb-1"
                  >
                    <Settings className="h-5 w-5" />
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
            <div className="flex-1 min-w-0 space-y-6">
              {/* Şifre Değiştir */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Şifre Değiştir</h3>
                <form onSubmit={handleSifreDegistir} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mevcut Şifre
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={sifreData.eskiSifre}
                        onChange={(e) => setSifreData({ ...sifreData, eskiSifre: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Mevcut şifreniz"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yeni Şifre
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={sifreData.yeniSifre}
                        onChange={(e) => setSifreData({ ...sifreData, yeniSifre: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Yeni şifreniz"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yeni Şifre (Tekrar)
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={sifreData.yeniSifreTekrar}
                        onChange={(e) => setSifreData({ ...sifreData, yeniSifreTekrar: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Yeni şifreniz (tekrar)"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Şifreyi Değiştir
                  </button>
                </form>
              </div>

              {/* E-posta Değiştir */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">E-posta Değiştir</h3>
                <form onSubmit={handleEmailDegistir} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mevcut E-posta
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={userData.email}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yeni E-posta
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={emailData.yeniEmail}
                        onChange={(e) => setEmailData({ yeniEmail: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="yeni@email.com"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    E-postayı Değiştir
                  </button>
                </form>
              </div>

              {/* Hesap Güvenliği */}
              <div className="border-2 border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-red-600 mb-4">Tehlikeli Bölge</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Hesabınızı kalıcı olarak silmek isterseniz aşağıdaki butonu kullanabilirsiniz. 
                  Bu işlem geri alınamaz!
                </p>
                <button
                  onClick={() => {
                    if (confirm('Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
                      localStorage.removeItem('user');
                      window.dispatchEvent(new Event('userLogin'));
                      alert('Hesabınız silindi');
                      router.push('/');
                    }
                  }}
                  className="border-2 border-red-600 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Hesabı Sil
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


