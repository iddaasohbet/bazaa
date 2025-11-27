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
            setUserName(userData.name || 'Kullanıcı');
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
    const updateMesajSayisi = () => {
      const mesajlar = JSON.parse(localStorage.getItem('mesajlar') || '[]');
      const okunmayanlar = mesajlar.filter((m: any) => !m.okundu);
      setMesajSayisi(okunmayanlar.length);
    };
    
    // Favori sayısını güncelle
    const updateFavoriSayisi = () => {
      const favoriler = JSON.parse(localStorage.getItem('favoriler') || '[]');
      setFavoriSayisi(favoriler.length);
    };
    
    // Mağaza kontrolü
    const checkMagaza = () => {
      const magazaBilgileri = localStorage.getItem('magazaBilgileri');
      setHasMagaza(!!magazaBilgileri);
    };
    
    checkUser();
    updateMesajSayisi();
    updateFavoriSayisi();
    checkMagaza();
    
    // Storage değişikliklerini dinle
    window.addEventListener('storage', checkUser);
    window.addEventListener('userLogin', checkUser);
    window.addEventListener('mesajGuncelle', updateMesajSayisi);
    window.addEventListener('favoriGuncelle', updateFavoriSayisi);
    window.addEventListener('magazaGuncelle', checkMagaza);
    
    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('userLogin', checkUser);
      window.removeEventListener('mesajGuncelle', updateMesajSayisi);
      window.removeEventListener('favoriGuncelle', updateFavoriSayisi);
      window.removeEventListener('magazaGuncelle', checkMagaza);
    };
  }, []);

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
            <Link href="/" className="flex items-center mr-6 lg:mr-8">
              <div className="flex items-center">
                <span className="text-2xl lg:text-3xl font-bold text-gray-900">Afghanistan</span>
                <span className="text-2xl lg:text-3xl font-bold text-blue-600">.</span>
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="container mx-auto px-4 py-4">
              {/* İlan Ver - Mobile */}
              <Link
                href="/ilan-ver"
                className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold mb-4 sm:hidden"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Plus className="h-5 w-5" />
                <span>ثبت آگهی</span>
              </Link>

              {/* Kategoriler */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                  دسته بندی ها
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {kategoriler.map((kat) => (
                    <Link
                      key={kat.href}
                      href={kat.href}
                      className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{kat.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{kat.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Diğer Linkler */}
              <div className="border-t border-gray-200 pt-3 space-y-1">
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
