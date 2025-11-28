"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, X, Plus, User, Heart, MessageSquare, ChevronDown, MapPin, Store } from "lucide-react";

const kategoriler = [
  { href: "/kategori/araclar", label: "خودرو", icon: "🚗" },
  { href: "/kategori/emlak", label: "املاک", icon: "🏠" },
  { href: "/kategori/elektronik", label: "لوازم الکترونیکی", icon: "📱" },
  { href: "/kategori/ev-esyalari", label: "لوازم خانه", icon: "🛋️" },
  { href: "/kategori/giyim", label: "پوشاک و اکسسوری", icon: "👕" },
  { href: "/kategori/hobi", label: "ورزش و سرگرمی", icon: "⚽" },
  { href: "/kategori/is-makineleri", label: "ماشین آلات", icon: "🚜" },
  { href: "/kategori/diger", label: "سایر", icon: "📦" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [kategorilerOpen, setKategorilerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [mesajSayisi, setMesajSayisi] = useState(0);
  const [favoriSayisi, setFavoriSayisi] = useState(0);
  const [hasMagaza, setHasMagaza] = useState(false);
  const [magazaId, setMagazaId] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Kullanıcı kontrolü
    const checkUser = () => {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          if (userData && userData.email) {
            setIsAuthenticated(true);
            setUserName(userData.ad || userData.name || 'Kullanıcı');
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };
    
    // Mesaj sayısını güncelle
    const updateMesajSayisi = async () => {
      try {
        const user = localStorage.getItem('user');
        if (!user) {
          setMesajSayisi(0);
          return;
        }

        const userData = JSON.parse(user);
        const response = await fetch('/api/mesajlar', {
          headers: {
            'x-user-id': userData.id.toString()
          }
        });

        const data = await response.json();
        if (data.success) {
          const okunmayanlar = (data.data || []).filter((m: any) => !m.okundu && m.alici_id === userData.id);
          setMesajSayisi(okunmayanlar.length);
        }
      } catch (error) {
        console.error('Mesaj sayısı yüklenirken hata:', error);
      }
    };
    
    // Favori sayısını güncelle
    const updateFavoriSayisi = async () => {
      try {
        const user = localStorage.getItem('user');
        if (!user) {
          console.log('⚠️ Header - Kullanıcı yok, favori sayısı 0');
          setFavoriSayisi(0);
          return;
        }

        const userData = JSON.parse(user);
        console.log('❤️ Header - Favori sayısı güncelleniyor - Kullanıcı ID:', userData.id);
        
        const response = await fetch('/api/favoriler', {
          headers: {
            'x-user-id': userData.id.toString()
          }
        });

        const data = await response.json();
        console.log('❤️ Header - Favori API Response:', data);
        
        if (data.success) {
          const favoriCount = (data.data || []).length;
          console.log('✅ Header - Favori sayısı güncellendi:', favoriCount);
          setFavoriSayisi(favoriCount);
        }
      } catch (error) {
        console.error('❌ Header - Favori sayısı yüklenirken hata:', error);
      }
    };
    
    checkUser();
    updateMesajSayisi();
    updateFavoriSayisi();
    
    // Storage değişikliklerini dinle
    window.addEventListener('storage', checkUser);
    window.addEventListener('userLogin', checkUser);
    window.addEventListener('mesajGuncelle', updateMesajSayisi);
    window.addEventListener('favoriGuncelle', updateFavoriSayisi);
    
    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('userLogin', checkUser);
      window.removeEventListener('mesajGuncelle', updateMesajSayisi);
      window.removeEventListener('favoriGuncelle', updateFavoriSayisi);
    };
  }, []);

  // Mağaza kontrolü - isAuthenticated değiştiğinde çalış
  useEffect(() => {
    const checkMagaza = async () => {
      if (isAuthenticated) {
        try {
          const user = localStorage.getItem('user');
          if (user) {
            const userData = JSON.parse(user);
            console.log('🔍 Header - Kullanıcı ID:', userData.id);
            // Kullanıcının mağazasını API'den kontrol et
            const response = await fetch(`/api/magazalar?kullanici_id=${userData.id}`);
            const data = await response.json();
            console.log('📦 Header - API Response:', data);
            if (data.success && data.data && data.data.length > 0) {
              console.log('✅ Header - Mağaza bulundu:', data.data[0]);
              console.log('🏪 Header - Mağaza ID:', data.data[0].id);
              console.log('👤 Header - Mağaza Kullanıcı ID:', data.data[0].kullanici_id);
              setHasMagaza(true);
              setMagazaId(data.data[0].id); // Mağaza ID'sini kaydet
            } else {
              setHasMagaza(false);
              setMagazaId(null);
            }
          }
        } catch (error) {
          console.error('Mağaza kontrolü hatası:', error);
          setHasMagaza(false);
          setMagazaId(null);
        }
      } else {
        setHasMagaza(false);
        setMagazaId(null);
      }
    };

    checkMagaza();

    // magazaGuncelle event'ini dinle
    window.addEventListener('magazaGuncelle', checkMagaza);
    
    return () => {
      window.removeEventListener('magazaGuncelle', checkMagaza);
    };
  }, [isAuthenticated]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/arama?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mr-6 lg:mr-8 group">
              {/* Icon */}
              <div className="relative w-10 h-10 lg:w-12 lg:h-12">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Store className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                </div>
              </div>
              {/* Text */}
              <div className="flex items-center">
                <span className="text-xl lg:text-2xl font-bold text-gray-900">Bazaare</span>
                <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Watan</span>
              </div>
            </Link>

            {/* Desktop: Kategoriler Dropdown */}
            <div 
              className="hidden lg:block relative"
              onMouseEnter={() => setKategorilerOpen(true)}
              onMouseLeave={() => setKategorilerOpen(false)}
            >
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                <Menu className="h-4 w-4" />
                <span>دسته بندی ها</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${kategorilerOpen ? 'rotate-180' : ''}`} />
              </button>

              {kategorilerOpen && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                    {kategoriler.map((kat) => (
                      <Link
                        key={kat.href}
                        href={kat.href}
                        className="block px-4 py-2.5 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-700 hover:text-blue-600">{kat.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar - Merkez */}
            <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-2xl mx-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی خودرو، املاک، لوازم الکترونیکی و بیشتر..."
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Mağaza Aç - NEW! */}
              {hasMagaza ? (
                <Link
                  href="/magazam"
                  className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:from-green-700 hover:to-emerald-800 transition-colors shadow-sm"
                >
                  <Store className="h-5 w-5" />
                  <span className="text-sm font-medium">مغازه من</span>
                </Link>
              ) : (
                <Link
                  href="/magaza-ac"
                  className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors shadow-sm"
                >
                  <Plus className="h-5 w-5" />
                  <span className="text-sm font-medium">افتتاح مغازه</span>
                </Link>
              )}

              {/* İlan Ver */}
              <Link
                href="/ilan-ver"
                className="hidden sm:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">ثبت آگهی</span>
              </Link>

              {/* Favoriler */}
              <Link
                href="/favoriler"
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors relative"
                title="Favoriler"
              >
                <Heart className="h-5 w-5 text-gray-600" />
                {favoriSayisi > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {favoriSayisi > 9 ? '9+' : favoriSayisi}
                  </span>
                )}
              </Link>

              {/* Mesajlar */}
              <Link
                href="/mesajlar"
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors relative"
                title="Mesajlar"
              >
                <MessageSquare className="h-5 w-5 text-gray-600" />
                {mesajSayisi > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {mesajSayisi > 9 ? '9+' : mesajSayisi}
                  </span>
                )}
              </Link>

              {/* Giriş Yap / Profil */}
              {isAuthenticated ? (
                <Link
                  href="/profilim"
                  className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">حساب من</span>
                </Link>
              ) : (
                <Link
                  href="/giris"
                  className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">ورود</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی آگهی..."
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Sidebar Style */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel - SOLDAN AÇILAN */}
          <div className="absolute top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between border-b border-blue-500 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">BazaareWatan</div>
                  <div className="text-blue-100 text-xs">بازار وطن</div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="px-4 py-6">
              {/* User Section */}
              <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{userName}</div>
                      <Link href="/profilim" className="text-sm text-blue-600 hover:underline">
                        مشاهده پروفایل
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/giris"
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-bold transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>ورود / ثبت نام</span>
                  </Link>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mb-6 space-y-3">
                <Link
                  href="/ilan-ver"
                  className="flex items-center gap-3 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-3.5 rounded-xl font-bold transition-all shadow-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Plus className="h-5 w-5" />
                  <span>ثبت آگهی جدید</span>
                </Link>
                
                {hasMagaza ? (
                  <Link
                    href="/magazam"
                    className="flex items-center gap-3 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-3.5 rounded-xl font-bold transition-all shadow-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Store className="h-5 w-5" />
                    <span>مغازه من</span>
                  </Link>
                ) : (
                  <Link
                    href="/magaza-ac"
                    className="flex items-center gap-3 w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-5 py-3.5 rounded-xl font-bold transition-all shadow-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Plus className="h-5 w-5" />
                    <span>افتتاح مغازه</span>
                  </Link>
                )}
              </div>

              {/* Kategoriler */}
              <div className="mb-6">
                <div className="text-sm font-bold text-gray-900 mb-3 px-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  دسته بندی ها
                </div>
                <div className="space-y-1">
                  {kategoriler.map((kat) => (
                    <Link
                      key={kat.href}
                      href={kat.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-2xl">{kat.icon}</span>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{kat.label}</span>
                      <ChevronDown className="h-4 w-4 text-gray-400 mr-auto -rotate-90" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Diğer Linkler */}
              <div className="border-t border-gray-200 pt-4 space-y-1">
                <Link
                  href="/"
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  صفحه اصلی
                </Link>
                <Link
                  href="/hakkimizda"
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  درباره ما
                </Link>
                <Link
                  href="/iletisim"
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  تماس با ما
                </Link>
              </div>

              {/* Kullanıcı İşlemleri */}
              <div className="border-t border-gray-200 mt-3 pt-3 grid grid-cols-2 gap-2">
                <Link
                  href="/favoriler"
                  className="flex flex-col items-center justify-center gap-1 py-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="h-5 w-5 text-gray-600" />
                  <span className="text-xs font-medium text-gray-700">علاقه مندی ها</span>
                </Link>
                <Link
                  href="/mesajlar"
                  className="flex flex-col items-center justify-center gap-1 py-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MessageSquare className="h-5 w-5 text-gray-600" />
                  <span className="text-xs font-medium text-gray-700">پیام ها</span>
                </Link>
                <Link
                  href="/profilim"
                  className="flex flex-col items-center justify-center gap-1 py-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-xs font-medium text-gray-700">حساب من</span>
                </Link>
                <Link
                  href="/giris"
                  className="flex flex-col items-center justify-center gap-1 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">ورود</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
