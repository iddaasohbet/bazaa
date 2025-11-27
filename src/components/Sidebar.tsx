"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Car, 
  Home, 
  Smartphone, 
  Sofa, 
  Shirt, 
  Music, 
  Tractor, 
  Grid,
  ChevronRight 
} from "lucide-react";

interface Kategori {
  id: number;
  ad: string;
  ad_dari?: string;
  slug: string;
  ikon?: string;
  aktif: boolean;
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
};

export default function Sidebar() {
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKategoriler();
  }, []);

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
          
          return (
            <Link
              key={kategori.id}
              href={`/kategori/${kategori.slug}`}
              className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-md transition-colors mb-1"
            >
              <Icon className="h-5 w-5 text-gray-600" />
              <span className="flex-1 text-sm font-medium">{kategori.ad}</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="border-t border-gray-200 p-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">آگهی های فعال</span>
            <span className="font-bold text-gray-900">1,234</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">امروز</span>
            <span className="font-bold text-gray-900">+45</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">کاربران</span>
            <span className="font-bold text-gray-900">5,678</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

