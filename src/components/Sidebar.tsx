"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { 
  Car, 
  Home, 
  Smartphone, 
  Sofa, 
  Shirt, 
  Music, 
  Tractor, 
  Grid,
  ChevronRight,
  Laptop,
  Tv,
  Watch,
  BookOpen,
  Briefcase,
  ShoppingCart,
  Users,
  Heart,
  Star,
  Camera,
  Bike,
  Baby,
  Dog,
  Wrench,
  Paintbrush,
  Trophy,
  Gamepad2,
  Bed,
  UtensilsCrossed,
  Package,
  TrendingUp,
  Eye,
  Store,
  Calendar
} from "lucide-react";

interface Kategori {
  id: number;
  ad: string;
  ad_dari?: string;
  slug: string;
  ikon?: string;
  aktif: boolean;
}

interface AltKategori {
  id: number;
  kategori_id: number;
  ad: string;
  ad_dari?: string;
  slug: string;
  ilan_sayisi: number;
}

interface Istatistikler {
  aktifIlanlar: number;
  aktifMagazalar: number;
  bugunEklenen: number;
  toplamKullanicilar: number;
}

const iconMap: { [key: string]: any } = {
  'car': Car,
  'home': Home,
  'smartphone': Smartphone,
  'sofa': Sofa,
  'shirt': Shirt,
  'music': Music,
  'tractor': Tractor,
  'grid': Grid,
  'laptop': Laptop,
  'tv': Tv,
  'watch': Watch,
  'book': BookOpen,
  'briefcase': Briefcase,
  'cart': ShoppingCart,
  'users': Users,
  'heart': Heart,
  'star': Star,
  'camera': Camera,
  'bike': Bike,
  'baby': Baby,
  'dog': Dog,
  'wrench': Wrench,
  'paint': Paintbrush,
  'trophy': Trophy,
  'game': Gamepad2,
  'bed': Bed,
  'food': UtensilsCrossed,
  'package': Package
};

export default function Sidebar() {
  const pathname = usePathname();
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [altKategoriler, setAltKategoriler] = useState<{ [key: number]: AltKategori[] }>({});
  const [expandedKategori, setExpandedKategori] = useState<number | null>(null);
  const [istatistikler, setIstatistikler] = useState<Istatistikler>({
    aktifIlanlar: 0,
    aktifMagazalar: 0,
    bugunEklenen: 0,
    toplamKullanicilar: 0,
  });
  const [loading, setLoading] = useState(true);
  const [hasMagaza, setHasMagaza] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchKategoriler();
    fetchIstatistikler();
    checkUserAndMagaza();
    
    // Event listener'lar
    window.addEventListener('magazaGuncelle', checkUserAndMagaza);
    window.addEventListener('userLogin', checkUserAndMagaza);
    window.addEventListener('storage', checkUserAndMagaza);
    
    return () => {
      window.removeEventListener('magazaGuncelle', checkUserAndMagaza);
      window.removeEventListener('userLogin', checkUserAndMagaza);
      window.removeEventListener('storage', checkUserAndMagaza);
    };
  }, []);

  const checkUserAndMagaza = async () => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        if (userData && userData.id) {
          setIsAuthenticated(true);
          // Mağaza kontrolü
          const response = await fetch(`/api/magazalar?kullanici_id=${userData.id}`);
          const data = await response.json();
          if (data.success && data.data && data.data.length > 0) {
            setHasMagaza(true);
          } else {
            setHasMagaza(false);
          }
        } else {
          setIsAuthenticated(false);
          setHasMagaza(false);
        }
      } else {
        setIsAuthenticated(false);
        setHasMagaza(false);
      }
    } catch (error) {
      console.error('Kullanıcı/Mağaza kontrolü hatası:', error);
      setHasMagaza(false);
    }
  };

  useEffect(() => {
    if (pathname?.startsWith('/kategori/') && kategoriler.length > 0) {
      const slug = pathname.split('/kategori/')[1];
      const aktifKategori = kategoriler.find(k => k.slug === slug);
      if (aktifKategori) {
        setExpandedKategori(aktifKategori.id);
        if (!altKategoriler[aktifKategori.id]) {
          fetchAltKategoriler(aktifKategori.id);
        }
      }
    }
  }, [pathname, kategoriler]);

  const fetchKategoriler = async () => {
    try {
      const response = await fetch('/api/kategoriler');
      const data = await response.json();
      if (data.success) {
        setKategoriler(data.data);
      }
    } catch (error) {
      console.error('خطا در بارگذاری دسته بندی ها:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIstatistikler = async () => {
    try {
      const response = await fetch('/api/istatistikler');
      const data = await response.json();
      if (data.success) {
        setIstatistikler(data.data);
      }
    } catch (error) {
      console.error('خطا در بارگذاری آمار:', error);
    }
  };

  const fetchAltKategoriler = async (kategoriId: number) => {
    try {
      const response = await fetch(`/api/alt-kategoriler?kategori_id=${kategoriId}`);
      const data = await response.json();
      if (data.success) {
        setAltKategoriler(prev => ({
          ...prev,
          [kategoriId]: data.data
        }));
      }
    } catch (error) {
      console.error('خطا در بارگذاری زیر دسته‌ها:', error);
    }
  };

  const toggleKategori = (e: React.MouseEvent, kategoriId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (expandedKategori === kategoriId) {
      setExpandedKategori(null);
    } else {
      setExpandedKategori(kategoriId);
      if (!altKategoriler[kategoriId]) {
        fetchAltKategoriler(kategoriId);
      }
    }
  };

  if (loading) {
    return (
      <aside className="categories-sidebar">
        <div className="animate-pulse space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </aside>
    );
  }

  // Kategori renkleri
  const categoryColors: { [key: string]: string } = {
    'car': 'from-blue-500 to-blue-600',
    'home': 'from-emerald-500 to-emerald-600',
    'smartphone': 'from-purple-500 to-purple-600',
    'sofa': 'from-amber-500 to-amber-600',
    'shirt': 'from-pink-500 to-pink-600',
    'laptop': 'from-indigo-500 to-indigo-600',
    'tractor': 'from-green-500 to-green-600',
    'briefcase': 'from-slate-500 to-slate-600',
  };

  const isHomePage = pathname === '/';

  return (
    <aside className="space-y-3 md:space-y-4">
      {/* Mağaza Aç/Mağazam - Sadece Anasayfada - Mobilde Gizli */}
      {isHomePage && (
      <Link href={hasMagaza ? "/magazam" : "/magaza-ac"} className="hidden md:block">
        <div className={`relative rounded-2xl border-2 p-6 text-center group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 overflow-hidden ${
          hasMagaza 
            ? 'bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/5 border-amber-300/50 hover:border-amber-400' 
            : 'bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-blue-500/5 border-blue-300/50 hover:border-blue-400'
        }`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${
              hasMagaza ? 'bg-amber-500' : 'bg-blue-500'
            } blur-3xl`}></div>
            <div className={`absolute -bottom-10 -left-10 w-32 h-32 rounded-full ${
              hasMagaza ? 'bg-orange-500' : 'bg-indigo-500'
            } blur-3xl`}></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Icon with Animation */}
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ${
              hasMagaza 
                ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30' 
                : 'bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30'
            }`}>
              <Store className="w-8 h-8 text-white stroke-[1.5] group-hover:scale-110 transition-transform duration-500" />
            </div>

            {/* Title */}
            <h3 className={`font-bold text-base mb-2 ${
              hasMagaza ? 'text-amber-900' : 'text-blue-900'
            }`}>
              {hasMagaza ? 'مغازه من' : 'مغازه باز کنید!'}
            </h3>

            {/* Description */}
            <p className={`text-xs mb-4 font-medium ${
              hasMagaza ? 'text-amber-700/80' : 'text-blue-700/80'
            }`}>
              {hasMagaza ? 'مدیریت مغازه و آگهی‌ها' : 'رایگان شروع کنید و بفروشید'}
            </p>

            {/* Button */}
            <div className={`relative font-bold text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 transition-all duration-300 group-hover:gap-3 shadow-lg ${
              hasMagaza 
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white hover:shadow-amber-500/50' 
                : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 text-white hover:shadow-blue-500/50'
            }`}>
              <span>{hasMagaza ? 'مغازه من' : 'شروع کنید'}</span>
              <ChevronRight className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </div>
        </div>
      </Link>
      )}

      {/* Stats - Sadece Anasayfada - Kurumsal - Mobilde Compact */}
      {isHomePage && (
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <h4 className="text-gray-400 text-[10px] md:text-[11px] font-medium mb-3 tracking-wide">آمار سایت</h4>
        <div className="grid grid-cols-3 md:grid-cols-1 gap-2 md:space-y-3 md:gap-0">
          <div className="flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-3 text-center md:text-right">
            <Users className="w-4 h-4 md:w-5 md:h-5 text-gray-400 stroke-[1.5]" />
            <div className="flex-1">
              <p className="text-[9px] md:text-[10px] text-gray-400">کاربران</p>
              <p className="text-base md:text-xl font-bold text-gray-900">{istatistikler.toplamKullanicilar.toLocaleString('fa-IR')}</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-3 text-center md:text-right">
            <Store className="w-4 h-4 md:w-5 md:h-5 text-gray-400 stroke-[1.5]" />
            <div className="flex-1">
              <p className="text-[9px] md:text-[10px] text-gray-400">مغازه ها</p>
              <p className="text-base md:text-xl font-bold text-gray-900">{istatistikler.aktifMagazalar.toLocaleString('fa-IR')}</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-3 text-center md:text-right">
            <Package className="w-4 h-4 md:w-5 md:h-5 text-gray-400 stroke-[1.5]" />
            <div className="flex-1">
              <p className="text-[9px] md:text-[10px] text-gray-400">آگهی ها</p>
              <p className="text-base md:text-xl font-bold text-gray-900">{istatistikler.aktifIlanlar.toLocaleString('fa-IR')}</p>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Categories - Kurumsal */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 md:mb-4 pb-2 md:pb-3 border-b border-gray-50">
          <Grid className="w-4 h-4 md:w-5 md:h-5 text-gray-400 stroke-[1.5]" />
          <h3 className="font-semibold text-gray-900 text-xs md:text-sm">دسته بندی ها</h3>
        </div>
        
        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {/* All Ads - Mobile */}
            <Link
              href="/"
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-medium transition-all ${
                pathname === '/' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>همه</span>
            </Link>
            
            {kategoriler.map((kategori) => {
              const Icon = iconMap[kategori.ikon || 'grid'] || Grid;
              const isActive = pathname?.includes(`/kategori/${kategori.slug}`);
              
              return (
                <Link
                  key={kategori.id}
                  href={`/kategori/${kategori.slug}`}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-medium transition-all ${
                    isActive 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{kategori.ad_dari || kategori.ad}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop: Vertical List */}
        <div className="hidden md:block">
          {/* All Ads */}
          <Link
            href="/"
            className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition-all duration-200 ${
              pathname === '/' 
                ? 'bg-gray-900 text-white' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <Grid className={`w-5 h-5 stroke-[1.5] ${pathname === '/' ? 'text-white' : 'text-gray-500'}`} />
            <span className="flex-1 text-sm font-medium">همه آگهی ها</span>
            <ChevronRight className={`w-4 h-4 rotate-180 ${pathname === '/' ? 'text-white/50' : 'text-gray-300'}`} />
          </Link>

          {/* Categories List */}
          <div className="space-y-1">
            {kategoriler.map((kategori) => {
              const Icon = iconMap[kategori.ikon || 'grid'] || Grid;
              const isActive = pathname?.includes(`/kategori/${kategori.slug}`);
              
              return (
                <Link
                  key={kategori.id}
                  href={`/kategori/${kategori.slug}`}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-gray-900 text-white' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 stroke-[1.5] ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span className="flex-1 text-sm font-medium">{kategori.ad_dari || kategori.ad}</span>
                  <ChevronRight className={`w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1 ${
                    isActive ? 'text-white/50' : 'text-gray-300'
                  }`} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
