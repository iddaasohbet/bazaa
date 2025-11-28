"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Grid,
  Users,
  Store,
  Star,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Package,
  MapPin,
  ShieldCheck,
  Tag,
  TrendingUp
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      title: "عمومی",
      items: [
        { icon: LayoutDashboard, label: "داشبورد", href: "/admin/dashboard" },
        { icon: BarChart3, label: "آمار و گزارشات", href: "/admin/istatistikler" },
      ]
    },
    {
      title: "مدیریت محتوا",
      items: [
        { icon: FileText, label: "آگهی‌ها", href: "/admin/ilanlar", badge: "۱۲۳۴" },
        { icon: Grid, label: "دسته‌بندی‌ها", href: "/admin/kategoriler" },
        { icon: MapPin, label: "شهرها", href: "/admin/iller" },
        { icon: Star, label: "آگهی‌های ویژه", href: "/admin/onecikan", badge: "۴۵" },
      ]
    },
    {
      title: "کاربران و مغازه‌ها",
      items: [
        { icon: Users, label: "کاربران", href: "/admin/kullanicilar", badge: "۵۶۷۸" },
        { icon: Store, label: "مغازه‌ها", href: "/admin/magazalar", badge: "۲۳۴" },
      ]
    },
    {
      title: "تبلیغات و درآمد",
      items: [
        { icon: TrendingUp, label: "مدیریت ویترین", href: "/admin/vitrin" },
        { icon: Tag, label: "تبلیغات", href: "/admin/reklamlar" },
        { icon: Package, label: "پکیج‌ها", href: "/admin/paketler" },
        { icon: CreditCard, label: "پرداخت‌ها", href: "/admin/odemeler", badge: "۱۲" },
      ]
    },
    {
      title: "سیستم",
      items: [
        { icon: Settings, label: "تنظیمات", href: "/admin/ayarlar" },
        { icon: ShieldCheck, label: "امنیت", href: "/admin/guvenlik" },
      ]
    },
    {
      title: "ظاهر سایت",
      items: [
        { icon: Package, label: "تنظیمات Footer", href: "/admin/footer-ayarlari" },
      ]
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/giris');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Link href="/admin/dashboard" className="flex mr-2 md:ml-24">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-gray-900">
                    بازارواتان
                  </span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="hidden md:block">
                <div className="relative" dir="rtl">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Search className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="جستجوی آگهی، کاربر، مغازه..."
                  />
                </div>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-500 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer" dir="rtl">
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                  <div className="hidden md:block text-right">
                    <div className="text-sm font-semibold text-gray-900">ادمین</div>
                    <div className="text-xs text-gray-500">مدیر سیستم</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">م</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 z-40 w-64 h-screen pt-20 transition-transform ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } bg-white border-l border-gray-200 lg:translate-x-0`}
        dir="rtl"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <div className="space-y-2 font-medium">
            {menuItems.map((section, sectionIndex) => (
              <div key={sectionIndex} className="pt-4">
                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
                {section.items.map((item, itemIndex) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={itemIndex}
                      href={item.href}
                      className={`flex items-center justify-between p-2 rounded-lg group ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 transition duration-75 ${
                          isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-900"
                        }`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-blue-600 bg-blue-100 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}

            {/* Logout */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full p-2 text-red-600 rounded-lg hover:bg-red-50 group"
              >
                <LogOut className="w-5 h-5" />
                <span>خروج از سیستم</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`p-4 ${sidebarOpen ? "lg:mr-64" : ""} pt-20`}>
        {children}
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

