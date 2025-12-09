"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Settings, FileText, Heart, LogOut, MessageSquare, Camera } from "lucide-react";

interface ProfileSidebarProps {
  userData: {
    ad?: string;
    name?: string;
    email: string;
  };
  activePage: 'profilim' | 'ilanlarim' | 'favoriler' | 'mesajlar' | 'ayarlar';
}

export default function ProfileSidebar({ userData, activePage }: ProfileSidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userLogin'));
    router.push('/');
  };

  const menuItems = [
    { href: '/profilim', icon: User, label: 'پروفایل من', id: 'profilim' },
    { href: '/ilanlarim', icon: FileText, label: 'آگهی‌های من', id: 'ilanlarim' },
    { href: '/favoriler', icon: Heart, label: 'علاقه‌مندی‌ها', id: 'favoriler' },
    { href: '/mesajlar', icon: MessageSquare, label: 'پیام‌ها', id: 'mesajlar' },
    { href: '/ayarlar', icon: Settings, label: 'تنظیمات', id: 'ayarlar' },
  ];

  return (
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
                activePage === item.id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className={`h-5 w-5 ${activePage === item.id ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className="flex-1 text-sm font-medium">{item.label}</span>
              {activePage === item.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
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
  );
}









