"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Grid,
  Users,
  Store,
  Star,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Package,
  ShieldCheck,
  Tag,
  TrendingUp,
  Image
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  icon: any;
  label: string;
  href: string;
  badge?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Admin authentication kontrolü
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('admin_token');
      const user = localStorage.getItem('user');

      if (!token) {
        router.push('/admin/giris');
        return;
      }

      if (user) {
        try {
          const userData = JSON.parse(user);
          if (userData.rol !== 'admin') {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('user');
            router.push('/admin/giris');
            return;
          }
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('user');
          router.push('/admin/giris');
        }
      } else {
        router.push('/admin/giris');
      }
    };

    checkAuth();
  }, [router]);

  const menuItems: MenuSection[] = [
    {
      title: "عمومی",
      items: [
        { icon: LayoutDashboard, label: "داشبورد", href: "/admin/dashboard" },
      ]
    },
    {
      title: "مدیریت محتوا",
      items: [
        { icon: FileText, label: "آگهی‌ها", href: "/admin/ilanlar" },
        { icon: Grid, label: "دسته‌بندی‌ها", href: "/admin/kategoriler" },
        { icon: Star, label: "آگهی‌های ویژه", href: "/admin/onecikan" },
        { icon: FileText, label: "صفحات", href: "/admin/sayfalar" },
      ]
    },
    {
      title: "کاربران و مغازه‌ها",
      items: [
        { icon: Users, label: "کاربران", href: "/admin/kullanicilar" },
        { icon: Store, label: "مغازه‌ها", href: "/admin/magazalar" },
        { icon: Package, label: "مغازه جوړ کړئ", href: "/admin/magaza-olustur" },
      ]
    },
    {
      title: "تبلیغات و درآمد",
      items: [
        { icon: TrendingUp, label: "مدیریت ویترین", href: "/admin/vitrin" },
        { icon: Tag, label: "تبلیغات", href: "/admin/reklamlar" },
        { icon: Package, label: "پکیج‌ها", href: "/admin/paketler" },
        { icon: CreditCard, label: "پرداخت‌ها", href: "/admin/odemeler" },
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
        { icon: Image, label: "مدیریت اسلایدر", href: "/admin/slider" },
        { icon: Package, label: "تنظیمات Footer", href: "/admin/footer-ayarlari" },
      ]
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user');
    router.push('/admin/giris');
  };

  // Authentication kontrolü tamamlanana kadar loading göster
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yetkilendiriliyor...</p>
        </div>
      </div>
    );
  }

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

