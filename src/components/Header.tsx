"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, Search, X, Plus, User, Heart, MessageSquare, ChevronDown, Store, Globe, MapPin, Grid, LogIn, ShoppingBag } from "lucide-react";
import FeedbackWidget from "./FeedbackWidget";

interface Kategori {
  id: number;
  ad: string;
  ad_dari?: string;
  slug: string;
  ikon: string;
  aktif: boolean;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [kategorilerOpen, setKategorilerOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'dari' | 'pashto' | 'en'>('dari');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [mesajSayisi, setMesajSayisi] = useState(0);
  const [favoriSayisi, setFavoriSayisi] = useState(0);
  const [hasMagaza, setHasMagaza] = useState(false);
  const [magazaId, setMagazaId] = useState<number | null>(null);
  const [headerLogo, setHeaderLogo] = useState<string>("");
  const [logoLoading, setLogoLoading] = useState(true);
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);

  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/ara?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Kategorileri yükle
    const fetchKategoriler = async () => {
      try {
        const response = await fetch('/api/kategoriler');
        const data = await response.json();
        if (data.success) {
          setKategoriler(data.data.filter((k: Kategori) => k.aktif));
        }
      } catch (error) {
        console.error('Kategoriler yüklenemedi:', error);
      }
    };

    fetchKategoriler();
  }, []);

  useEffect(() => {
    // Logo'yu API'den yükle
    const loadLogo = async () => {
      try {
        console.log('🔍 Header: Logo yükleniyor...');
        setLogoLoading(true);
        
        const response = await fetch('/api/admin/logo');
        const data = await response.json();
        
        console.log('📥 Header: API Response:', data);
        
        if (data.success && data.data.header_logo && data.data.header_logo.trim() !== '') {
          console.log('✅ Header: Logo bulundu, uzunluk:', data.data.header_logo.length);
          setHeaderLogo(data.data.header_logo);
        } else {
          console.log('⚠️ Header: Logo yok');
          setHeaderLogo('');
        }
      } catch (error) {
        console.error('❌ Header logo yüklenemedi:', error);
        setHeaderLogo('');
      } finally {
        setLogoLoading(false);
      }
    };

    loadLogo();

    // Logo güncellendiğinde yeniden yükle
    const handleLogoUpdate = () => {
      console.log('🔄 Header: Logo güncelleme eventi alındı, yeniden yükleniyor...');
      loadLogo();
    };

    window.addEventListener('logoUpdated', handleLogoUpdate);
    return () => window.removeEventListener('logoUpdated', handleLogoUpdate);
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
        if (!userData?.id) return;
        
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
        if (!userData?.id) {
          console.log('⚠️ Header - userData.id bulunamadı');
          return;
        }
        
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

  return (
    <>
      <header className="bg-white border-b border-gray-100" dir="rtl">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between h-14 lg:h-16">
            
            {/* Right Side - Logo & Language */}
            <div className="flex items-center gap-4">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                {logoLoading ? (
                  <div className="h-8 lg:h-9 w-24 bg-gray-100 animate-pulse rounded"></div>
                ) : headerLogo ? (
                  <img 
                    src={headerLogo} 
                    alt="Logo" 
                    className="h-8 lg:h-9 w-auto object-contain"
                  />
                ) : (
                  <span className="text-lg font-bold text-gray-900">بازار وطن</span>
                )}
              </Link>

              {/* Language Dropdown - Logo yanında */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1.5 h-9 px-2.5 rounded-lg hover:bg-gray-100 transition-all border border-gray-200"
                >
                  <Globe className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-600 hidden sm:inline">
                    {currentLang === 'dari' ? 'دری' : currentLang === 'pashto' ? 'پښتو' : 'EN'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {langDropdownOpen && (
                  <div className="absolute top-11 right-0 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[140px] z-50">
                    <button onClick={() => { setCurrentLang('dari'); setLangDropdownOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 ${currentLang === 'dari' ? 'bg-gray-50 font-medium' : ''}`}>
                      <span>🇦🇫</span><span>دری</span>
                    </button>
                    <button onClick={() => { setCurrentLang('pashto'); setLangDropdownOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 ${currentLang === 'pashto' ? 'bg-gray-50 font-medium' : ''}`}>
                      <span>🇦🇫</span><span>پښتو</span>
                    </button>
                    <button onClick={() => { setCurrentLang('en'); setLangDropdownOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 ${currentLang === 'en' ? 'bg-gray-50 font-medium' : ''}`}>
                      <span>🇬🇧</span><span>English</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px h-6 bg-gray-200"></div>

              {/* Categories Button */}
              <div 
                className="hidden lg:block relative"
                onMouseEnter={() => setKategorilerOpen(true)}
                onMouseLeave={() => setKategorilerOpen(false)}
              >
                <button className="flex items-center gap-2 h-10 px-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all">
                  <Grid className="h-5 w-5" />
                  <span className="text-sm font-medium">دسته‌بندی‌ها</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${kategorilerOpen ? 'rotate-180' : ''}`} />
                </button>

                {kategorilerOpen && (
                  <div className="absolute top-full right-0 pt-2 z-50">
                    <div className="w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                      {kategoriler.map((kat) => (
                        <Link
                          key={kat.id}
                          href={`/kategori/${kat.slug}`}
                          className="flex items-center h-11 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          {kat.ad_dari || kat.ad}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Left Side - Actions */}
            <div className="flex items-center gap-1.5">
              {/* Profile Dropdown */}
              <div 
                className="hidden md:block relative"
                onMouseEnter={() => setProfileMenuOpen(true)}
                onMouseLeave={() => setProfileMenuOpen(false)}
              >
                <button className="flex items-center gap-2 h-10 px-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all relative">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{isAuthenticated ? 'حساب من' : 'ورود'}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                  {(favoriSayisi > 0 || mesajSayisi > 0) && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {(favoriSayisi + mesajSayisi) > 9 ? '9+' : (favoriSayisi + mesajSayisi)}
                    </span>
                  )}
                </button>

                {profileMenuOpen && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <div className="w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                      {/* User Info */}
                      {isAuthenticated ? (
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">{userName}</div>
                              <div className="text-xs text-gray-500">حساب کاربری</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="px-4 py-3 border-b border-gray-100">
                          <Link
                            href="/giris"
                            className="flex items-center justify-center gap-2 w-full h-10 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium text-sm transition-colors"
                          >
                            <LogIn className="h-4 w-4" />
                            <span>ورود / ثبت نام</span>
                          </Link>
                        </div>
                      )}

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          href="/favoriler"
                          className="flex items-center gap-3 h-11 px-4 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          <Heart className="h-5 w-5 text-gray-400" />
                          <span className="flex-1">علاقه‌مندی‌ها</span>
                          {favoriSayisi > 0 && (
                            <span className="w-6 h-6 bg-red-100 text-red-600 text-xs rounded-full flex items-center justify-center font-bold">
                              {favoriSayisi > 9 ? '9+' : favoriSayisi}
                            </span>
                          )}
                        </Link>
                        <Link
                          href="/mesajlar"
                          className="flex items-center gap-3 h-11 px-4 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          <MessageSquare className="h-5 w-5 text-gray-400" />
                          <span className="flex-1">پیام‌ها</span>
                          {mesajSayisi > 0 && (
                            <span className="w-6 h-6 bg-blue-100 text-blue-600 text-xs rounded-full flex items-center justify-center font-bold">
                              {mesajSayisi > 9 ? '9+' : mesajSayisi}
                            </span>
                          )}
                        </Link>
                        <Link
                          href="/ilanlarim"
                          className="flex items-center gap-3 h-11 px-4 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          <ShoppingBag className="h-5 w-5 text-gray-400" />
                          <span>آگهی‌های من</span>
                        </Link>
                        {isAuthenticated && (
                          <Link
                            href="/profilim"
                            className="flex items-center gap-3 h-11 px-4 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                          >
                            <User className="h-5 w-5 text-gray-400" />
                            <span>تنظیمات حساب</span>
                          </Link>
                        )}
                      </div>

                      {/* Logout */}
                      {isAuthenticated && (
                        <div className="border-t border-gray-100 pt-1">
                          <button
                            onClick={() => {
                              localStorage.removeItem('user');
                              window.location.reload();
                            }}
                            className="flex items-center gap-3 h-11 px-4 w-full text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogIn className="h-5 w-5 rotate-180" />
                            <span>خروج از حساب</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px h-6 bg-gray-200 mx-1"></div>

              {/* Mağaza Aç */}
              {hasMagaza ? (
                <Link
                  href="/magazam"
                  className="hidden lg:flex items-center gap-2 h-10 px-4 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 transition-all shadow-md shadow-amber-500/20"
                >
                  <Store className="h-5 w-5" />
                  <span className="text-sm font-medium">مغازه من</span>
                </Link>
              ) : (
                <Link
                  href="/magaza-ac"
                  className="hidden lg:flex items-center gap-2 h-10 px-4 rounded-lg text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  <Store className="h-5 w-5" />
                  <span className="text-sm font-medium">افتتاح مغازه</span>
                </Link>
              )}

              {/* İlan Ver - Primary */}
              <Link
                href="/ilan-ver"
                className="hidden sm:flex items-center gap-2 h-10 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
              >
                <Plus className="h-5 w-5" />
                <span className="text-sm font-medium">ثبت آگهی</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
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
          
          {/* Menu Panel - SAĞDAN AÇILAN (RTL) */}
          <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gray-900 px-5 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                {logoLoading ? (
                  <div className="h-8 w-24 bg-gray-700 animate-pulse rounded"></div>
                ) : headerLogo ? (
                  <img 
                    src={headerLogo} 
                    alt="Logo" 
                    className="h-8 w-auto object-contain brightness-0 invert"
                  />
                ) : (
                  <span className="text-lg font-bold text-white">بازار وطن</span>
                )}
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="p-4">
              {/* User Section */}
              <div className="mb-5 bg-gray-50 rounded-xl p-4">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{userName}</div>
                      <Link href="/profilim" className="text-xs text-gray-500 hover:text-gray-700">
                        مشاهده پروفایل
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/giris"
                    className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white h-11 rounded-lg font-medium text-sm transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="h-5 w-5" />
                    <span>ورود / ثبت نام</span>
                  </Link>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mb-5 space-y-2">
                <Link
                  href="/ilan-ver"
                  className="flex items-center gap-3 w-full bg-gray-900 hover:bg-gray-800 text-white h-12 px-4 rounded-xl font-medium text-sm transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span>ثبت آگهی جدید</span>
                </Link>
                
                {hasMagaza ? (
                  <Link
                    href="/magazam"
                    className="flex items-center gap-3 w-full bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white h-12 px-4 rounded-xl font-medium text-sm transition-all shadow-md shadow-amber-500/20"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <Store className="h-5 w-5 text-white" />
                    </div>
                    <span>مغازه من</span>
                  </Link>
                ) : (
                  <Link
                    href="/magaza-ac"
                    className="flex items-center gap-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 h-12 px-4 rounded-xl font-medium text-sm transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                      <Store className="h-5 w-5 text-gray-600" />
                    </div>
                    <span>افتتاح مغازه</span>
                  </Link>
                )}
              </div>

              {/* User Actions Grid */}
              <div className="mb-5 grid grid-cols-4 gap-2">
                <Link
                  href="/favoriler"
                  className="flex flex-col items-center gap-1.5 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="h-5 w-5 text-gray-600" />
                  <span className="text-[10px] font-medium text-gray-600">علاقه‌مندی</span>
                </Link>
                <Link
                  href="/mesajlar"
                  className="flex flex-col items-center gap-1.5 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MessageSquare className="h-5 w-5 text-gray-600" />
                  <span className="text-[10px] font-medium text-gray-600">پیام‌ها</span>
                </Link>
                <Link
                  href="/profilim"
                  className="flex flex-col items-center gap-1.5 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-[10px] font-medium text-gray-600">حساب</span>
                </Link>
                <Link
                  href="/ilanlarim"
                  className="flex flex-col items-center gap-1.5 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingBag className="h-5 w-5 text-gray-600" />
                  <span className="text-[10px] font-medium text-gray-600">آگهی‌ها</span>
                </Link>
              </div>

              {/* Kategoriler */}
              <div className="mb-5">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1 flex items-center gap-2">
                  <Grid className="h-3.5 w-3.5" />
                  دسته بندی‌ها
                </div>
                <div className="space-y-1">
                  {kategoriler.map((kat) => (
                    <Link
                      key={kat.id}
                      href={`/kategori/${kat.slug}`}
                      className="flex items-center justify-between h-11 px-3 hover:bg-gray-50 rounded-lg transition-colors group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {kat.ad_dari || kat.ad}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-300 -rotate-90 group-hover:text-gray-500" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Diğer Linkler */}
              <div className="border-t border-gray-100 pt-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                  صفحات
                </div>
                <div className="space-y-1">
                  <Link
                    href="/"
                    className="flex items-center h-11 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    صفحه اصلی
                  </Link>
                  <Link
                    href="/hakkimizda"
                    className="flex items-center h-11 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    درباره ما
                  </Link>
                  <Link
                    href="/iletisim"
                    className="flex items-center h-11 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    تماس با ما
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Feedback Widget */}
      <FeedbackWidget />
    </>
  );
}


