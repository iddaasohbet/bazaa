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
  Package
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

  useEffect(() => {
    fetchKategoriler();
    fetchIstatistikler();
  }, []);

  // URL'den aktif kategoriyi algıla ve alt kategorilerini aç
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
      <aside className="w-full lg:w-64 bg-white rounded-lg shadow-md p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full lg:w-64 border border-gray-200 rounded-lg overflow-hidden lg:sticky lg:top-4">
      <nav className="p-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-md transition-colors mb-1"
        >
          <Grid className="h-5 w-5 text-gray-600" />
          <span className="flex-1 text-sm font-medium">تمام آگهی ها</span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Link>
        
        {kategoriler.map((kategori) => {
          const Icon = iconMap[kategori.ikon || 'grid'] || Grid;
          const isExpanded = expandedKategori === kategori.id;
          const altKats = altKategoriler[kategori.id] || [];
          const isActive = pathname?.includes(`/kategori/${kategori.slug}`);
          
          return (
            <div key={kategori.id}>
              <div className={`flex items-center gap-1 mb-1 ${isActive ? 'bg-blue-50' : ''} rounded-md`}>
                {altKats.length > 0 && (
                  <button
                    onClick={(e) => toggleKategori(e, kategori.id)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                )}
                <Link
                  href={`/kategori/${kategori.slug}`}
                  className={`flex-1 flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 rounded-md transition-colors ${
                    isActive ? 'text-blue-700 font-semibold' : 'text-gray-700'
                  } ${altKats.length === 0 ? 'mr-6' : ''}`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                  <span className="flex-1 text-sm">{kategori.ad}</span>
                </Link>
              </div>
              
              {/* Alt Kategoriler */}
              {isExpanded && altKats.length > 0 && (
                <div className="mr-9 mb-2 space-y-1">
                  {altKats.map((altKat) => (
                    <Link
                      key={altKat.id}
                      href={`/kategori/${kategori.slug}?alt=${altKat.slug}`}
                      className="flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors text-xs"
                    >
                      <span>{altKat.ad_dari || altKat.ad}</span>
                      <span className="text-gray-400">({altKat.ilan_sayisi || 0})</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="border-t border-gray-200 p-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">آگهی های فعال</span>
            <span className="font-bold text-gray-900">{istatistikler.aktifIlanlar.toLocaleString('fa-IR')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">مغازه ها</span>
            <span className="font-bold text-gray-900">{istatistikler.aktifMagazalar.toLocaleString('fa-IR')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">امروز</span>
            <span className="font-bold text-gray-900">+{istatistikler.bugunEklenen.toLocaleString('fa-IR')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">کاربران</span>
            <span className="font-bold text-gray-900">{istatistikler.toplamKullanicilar.toLocaleString('fa-IR')}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

