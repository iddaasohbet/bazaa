"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Store, MapPin, Phone, Eye, Package, ExternalLink, MessageSquare, Star, Crown, Sparkles, BarChart3, Users, Plus, Settings, CheckCircle, ArrowUp, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import PriceDisplay from "@/components/PriceDisplay";
import {
  LineChart,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  LabelList,
} from "recharts";

type DashboardData = {
  kpis: {
    totalRevenue: number;
    newVipMembers: number;
    activeProducts: number;
    totalCustomers: number;
  };
  performance: Array<{ key: string; label: string; value: number }>;
  ai: Array<{ text: string; score: number }>;
  products: Array<{
    id: number;
    baslik: string;
    fiyat: string | number;
    ana_resim?: string | null;
    goruntulenme?: number;
    created_at?: string;
  }>;
  segments: {
    category: Array<{ name: string | null; value: number }>;
    city: Array<{ name: string | null; value: number }>;
    status: Array<{ name: string | null; value: number }>;
  };
};

interface MagazaBilgileri {
  id: number;
  kullanici_id: number;
  ad: string;
  ad_dari: string;
  slug: string;
  aciklama?: string;
  adres?: string;
  telefon?: string;
  il_ad?: string;
  logo?: string;
  kapak_resmi?: string;
  store_level: string;
  onay_durumu: string;
  paket_baslangic?: string;
  paket_bitis?: string;
  goruntulenme?: number;
  created_at?: string;
}

export default function MagazamPage() {
  const router = useRouter();
  const [magazaBilgileri, setMagazaBilgileri] = useState<MagazaBilgileri | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("—");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [dashLoading, setDashLoading] = useState(false);

  useEffect(() => {
    checkMagaza();
  }, []);

  const checkMagaza = async () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) {
        router.push('/giris');
        return;
      }

      const userData = JSON.parse(user);
      setUserName(userData?.ad || userData?.name || userData?.email || "—");
      
      const response = await fetch(`/api/magazalar?kullanici_id=${userData.id}`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const magaza = data.data[0];
        setMagazaBilgileri(magaza);
        await fetchDashboard(userData.id, magaza.id);
      } else {
        router.push('/magaza-ac');
      }
    } catch (error) {
      console.error('Mağaza bilgileri yüklenirken hata:', error);
      router.push('/magaza-ac');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async (kullaniciId: number, magazaId: number) => {
    try {
      setDashLoading(true);
      const res = await fetch(`/api/magazam/dashboard?kullanici_id=${kullaniciId}&magaza_id=${magazaId}`, { cache: "no-store" });
      const json = await res.json();
      if (json?.success && json?.data) {
        setDashboard(json.data as DashboardData);
      }
    } catch (error) {
      console.error("Dashboard yüklenemedi:", error);
      setDashboard(null);
    } finally {
      setDashLoading(false);
    }
  };

  const getStoreLevelInfo = (level: string) => {
    switch(level) {
      case 'basic':
        return { text: 'عادی', icon: Store, color: 'from-gray-500 to-gray-600', bg: 'bg-gray-100' };
      case 'pro':
        return { text: 'پرو', icon: Star, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-100' };
      case 'elite':
        return { text: 'پریمیوم', icon: Crown, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-100' };
      default:
        return { text: level, icon: Store, color: 'from-gray-500 to-gray-600', bg: 'bg-gray-100' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0B0F14" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto" style={{ borderColor: "rgba(212,165,55,0.25)", borderTopColor: "#d4a537" }} />
          <p className="mt-4 text-sm" style={{ color: "rgba(245,215,142,0.9)" }}>در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!magazaBilgileri) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-4" dir="rtl">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center mb-6">
              <Store className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">مغازه خود را بسازید</h2>
            <p className="text-gray-600 mb-6">با افتتاح مغازه، محصولات خود را به مشتریان نشان دهید</p>
            <Link
              href="/magaza-ac"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-8 py-4 rounded-xl"
            >
              <Store className="h-5 w-5" />
              افتتاح مغازه
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const levelInfo = getStoreLevelInfo(magazaBilgileri.store_level);
  const isElite = magazaBilgileri.store_level === "elite";

  const GOLD = "#d4a537";
  const GOLD2 = "#f5d78e";
  const panelStyle: React.CSSProperties = {
    background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
    border: "1px solid rgba(245,215,142,0.10)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
  };

  const kpis = dashboard?.kpis;
  const perf = dashboard?.performance ?? [];
  const ai = dashboard?.ai ?? [];
  const products = dashboard?.products ?? [];

  const gauge = (pct: number) => [
    { name: "done", value: Math.max(0, Math.min(100, pct)) },
    { name: "rest", value: Math.max(0, 100 - Math.max(0, Math.min(100, pct))) },
  ];

  const kpiPctRevenue = Math.min(100, Math.round(((kpis?.totalRevenue || 0) / 5000) * 100));
  const kpiPctVip = Math.min(100, Math.round(((kpis?.newVipMembers || 0) / 50) * 100));

  const segToPct = (arr: Array<{ name: any; value: number }>) => {
    const total = arr.reduce((s, a) => s + Number(a.value || 0), 0) || 0;
    const top = Number(arr?.[0]?.value || 0);
    return total > 0 ? Math.round((top / total) * 100) : 0;
  };

  const segCategory = dashboard?.segments?.category ?? [];
  const segCity = dashboard?.segments?.city ?? [];
  const segStatus = dashboard?.segments?.status ?? [];

  const donutColors = [GOLD, "rgba(245,215,142,0.35)", "rgba(212,165,55,0.22)", "rgba(245,215,142,0.18)"];

  return (
    <div className="min-h-screen" dir="ltr" style={{ background: "radial-gradient(1200px 600px at 20% 10%, rgba(212,165,55,0.10) 0%, rgba(11,15,20,0) 55%), #0B0F14" }}>
      <div className="mx-auto max-w-[1400px] px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="rounded-3xl p-5" style={panelStyle}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 60%, ${GOLD} 100%)` }}>
                <Crown className="w-6 h-6 text-black" />
              </div>
              <div>
                <div className="text-sm font-black tracking-wide" style={{ color: GOLD2 }}>VIP {isElite ? "PREMIUME" : "STORE"}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.60)" }}>{levelInfo.text} ADMIN</div>
              </div>
            </div>

            <nav className="space-y-2" dir="rtl">
              {[
                { label: "داشبورد", icon: BarChart3, href: "/magazam", active: true },
                { label: "آگهی جدید", icon: Plus, href: "/ilan-ver" },
                { label: "آگهی‌های من", icon: Package, href: "/ilanlarim" },
                { label: "پیام‌ها", icon: MessageSquare, href: "/mesajlar" },
                { label: "علاقه‌مندی‌ها", icon: Heart, href: "/favoriler" },
                { label: "پلن‌ها", icon: Crown, href: "/magaza-paket" },
                { label: "تنظیمات", icon: Settings, href: "/magazam/duzenle" },
              ].map((it) => {
                const Icon = it.icon;
                return (
                  <a
                    key={it.label}
                    href={it.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors"
                    style={{
                      background: it.active ? "rgba(245,215,142,0.12)" : "transparent",
                      border: it.active ? "1px solid rgba(245,215,142,0.18)" : "1px solid transparent",
                      color: it.active ? GOLD2 : "rgba(255,255,255,0.75)",
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: it.active ? GOLD : "rgba(255,255,255,0.55)" }} />
                    <span className="text-sm font-semibold">{it.label}</span>
                  </a>
                );
              })}
            </nav>

            <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl overflow-hidden" style={{ border: `1px solid rgba(245,215,142,0.20)` }}>
                  {magazaBilgileri.logo ? (
                    <img src={magazaBilgileri.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <Store className="w-5 h-5" style={{ color: "rgba(255,255,255,0.55)" }} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold truncate" style={{ color: "rgba(255,255,255,0.92)" }} dir="rtl">
                    {magazaBilgileri.ad_dari || magazaBilgileri.ad}
                  </div>
                  <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {magazaBilgileri.il_ad || "—"}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <section className="space-y-6">
            {/* Top bar */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold" style={{ color: "rgba(255,255,255,0.92)" }}>Dashboard</div>
                <div className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }} dir="rtl">
                  خوش آمدید، {userName}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/magaza/${magazaBilgileri.id}`}
                  target="_blank"
                  className="px-4 py-2 rounded-2xl text-sm font-semibold"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.85)" }}
                >
                  <span className="inline-flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" style={{ color: GOLD2 }} />
                    مشاهده مغازه
                  </span>
                </Link>
                <Link
                  href="/ilan-ver"
                  className="px-4 py-2 rounded-2xl text-sm font-bold"
                  style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 55%, ${GOLD} 100%)`, color: "#0B0F14" }}
                >
                  <span className="inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    آگهی جدید
                  </span>
                </Link>
              </div>
            </div>

            {/* Row 1: line chart + gauges */}
            <div id="analytics" className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
              <div className="rounded-3xl p-5" style={panelStyle}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.70)" }}>
                    Sales Performance
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.70)" }}>1 Day</span>
                    <span className="px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.70)" }}>Month</span>
                  </div>
                </div>

                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={perf} margin={{ top: 14, right: 12, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={GOLD} stopOpacity={0.32} />
                          <stop offset="70%" stopColor={GOLD} stopOpacity={0.08} />
                          <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                        </linearGradient>
                        <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                      <XAxis
                        dataKey="label"
                        stroke="rgba(255,255,255,0.35)"
                        tick={{ fontSize: 12, fill: "rgba(255,255,255,0.55)" }}
                      />
                      <YAxis stroke="rgba(255,255,255,0.20)" tick={{ fontSize: 12, fill: "rgba(255,255,255,0.55)" }} />
                      <Tooltip
                        contentStyle={{
                          background: "rgba(11,15,20,0.92)",
                          border: "1px solid rgba(245,215,142,0.15)",
                          borderRadius: 14,
                          color: "rgba(255,255,255,0.9)",
                        }}
                        formatter={(v: any) => [Number(v || 0).toLocaleString("en-US"), "Views"]}
                      />
                      <Area type="monotone" dataKey="value" stroke="transparent" fill="url(#perfFill)" />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={GOLD}
                        strokeWidth={3}
                        dot={{ r: 4, fill: GOLD2, stroke: GOLD, strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: GOLD, stroke: GOLD2, strokeWidth: 2 }}
                        filter="url(#goldGlow)"
                      >
                        <LabelList
                          dataKey="value"
                          position="top"
                          formatter={(v: any) => (Number(v || 0) > 0 ? Number(v).toFixed(0) : "")}
                          style={{ fill: "rgba(245,215,142,0.95)", fontSize: 11, fontWeight: 800 }}
                        />
                      </Line>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 xl:grid-cols-1 gap-6">
                {/* Total Revenue gauge */}
                <div className="rounded-3xl p-5" style={panelStyle}>
                  <div className="text-sm font-semibold mb-3" style={{ color: "rgba(255,255,255,0.70)" }}>Total Revenue</div>
                  <div className="flex items-center justify-center" style={{ height: 140 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={gauge(kpiPctRevenue)}
                          startAngle={210}
                          endAngle={-30}
                          innerRadius={46}
                          outerRadius={58}
                          dataKey="value"
                          stroke="none"
                        >
                          <Cell fill={GOLD} />
                          <Cell fill="rgba(255,255,255,0.08)" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center">
                      <div className="text-xl font-black" style={{ color: "rgba(255,255,255,0.92)" }}>
                        ${Number(kpis?.totalRevenue || 0).toLocaleString("en-US")}
                      </div>
                      <div className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>Revenue</div>
                    </div>
                  </div>
                </div>

                {/* New VIP Members gauge */}
                <div className="rounded-3xl p-5" style={panelStyle}>
                  <div className="text-sm font-semibold mb-3" style={{ color: "rgba(255,255,255,0.70)" }}>New VIP Members</div>
                  <div className="flex items-center justify-center" style={{ height: 140 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={gauge(kpiPctVip)}
                          startAngle={210}
                          endAngle={-30}
                          innerRadius={46}
                          outerRadius={58}
                          dataKey="value"
                          stroke="none"
                        >
                          <Cell fill={GOLD} />
                          <Cell fill="rgba(255,255,255,0.08)" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center">
                      <div className="text-xl font-black" style={{ color: "rgba(255,255,255,0.92)" }}>
                        {Number(kpis?.newVipMembers || 0).toLocaleString("en-US")}
                      </div>
                      <div className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>Members</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: table + AI */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
              <div id="products" className="rounded-3xl p-5" style={panelStyle}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>Product Management</div>
                  <div className="text-xs px-3 py-1.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.60)" }}>
                    Search
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ color: "rgba(255,255,255,0.55)" }}>
                        <th className="text-left font-semibold py-3">Product</th>
                        <th className="text-left font-semibold py-3">Amount</th>
                        <th className="text-left font-semibold py-3">Price</th>
                        <th className="text-right font-semibold py-3"> </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(products || []).slice(0, 6).map((p, idx) => (
                        <tr key={p.id} style={{ borderTop: idx === 0 ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(255,255,255,0.06)" }}>
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <Image
                                  src={getImageUrl(p.ana_resim)}
                                  alt={p.baslik}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold truncate" style={{ color: "rgba(255,255,255,0.88)" }} dir="rtl">
                                  {p.baslik}
                                </div>
                                <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                                  #{p.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3" style={{ color: "rgba(255,255,255,0.70)" }}>
                            {Number(p.goruntulenme || 0).toLocaleString("en-US")}
                          </td>
                          <td className="py-3" style={{ color: "rgba(255,255,255,0.70)" }}>
                            <PriceDisplay price={Number(p.fiyat) || 0} currency="AFN" className="text-sm font-semibold" />
                          </td>
                          <td className="py-3 text-right">
                            <Link
                              href={`/ilan/${p.id}/duzenle`}
                              className="inline-flex items-center justify-center px-4 py-2 rounded-2xl text-xs font-bold"
                              style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 55%, ${GOLD} 100%)`, color: "#0B0F14" }}
                            >
                              Download
                            </Link>
                          </td>
                        </tr>
                      ))}
                      {!dashLoading && (products || []).length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-10 text-center" style={{ color: "rgba(255,255,255,0.55)" }} dir="rtl">
                            هیچ آگهی‌ای پیدا نشد
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div id="ai" className="rounded-3xl p-5" style={panelStyle}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>AI Suggestions</div>
                  <div className="text-xl" style={{ color: "rgba(255,255,255,0.55)" }}>…</div>
                </div>

                <div className="space-y-3">
                  {ai.slice(0, 3).map((s, i) => (
                    <div
                      key={`${s.text}-${i}`}
                      className="rounded-2xl px-4 py-3"
                      style={{ background: "rgba(245,215,142,0.07)", border: "1px solid rgba(245,215,142,0.12)" }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.82)" }} dir="rtl">
                          {s.text}
                        </div>
                        <div className="text-sm font-black" style={{ color: GOLD2 }}>
                          {Math.round(s.score)}%
                        </div>
                      </div>
                      <div className="mt-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-2 rounded-full" style={{ width: `${Math.max(0, Math.min(100, s.score))}%`, background: GOLD }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-center">
                  <a href="#ai" className="text-xs font-semibold" style={{ color: GOLD2 }}>Show more</a>
                </div>
              </div>
            </div>

            {/* Row 3: segmentation */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
              <div className="rounded-3xl p-5" style={panelStyle}>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.85)" }} dir="rtl">
                    اطلاعات مغازه
                  </div>
                  <Link href="/magazam/duzenle" className="text-xs font-semibold" style={{ color: GOLD2 }}>
                    ویرایش
                  </Link>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4" dir="rtl">
                  <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                      <Phone className="w-4 h-4" style={{ color: GOLD2 }} />
                      تلفن
                    </div>
                    <div className="mt-2 font-bold" style={{ color: "rgba(255,255,255,0.85)" }} dir="ltr">
                      {magazaBilgileri.telefon || "—"}
                    </div>
                  </div>
                  <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                      <MapPin className="w-4 h-4" style={{ color: GOLD2 }} />
                      شهر
                    </div>
                    <div className="mt-2 font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>
                      {magazaBilgileri.il_ad || "—"}
                    </div>
                  </div>
                  <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                      <Eye className="w-4 h-4" style={{ color: GOLD2 }} />
                      بازدید
                    </div>
                    <div className="mt-2 font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>
                      {Number(magazaBilgileri.goruntulenme || 0).toLocaleString("fa-AF")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl p-5" style={panelStyle}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>Customer Segmentation</div>
                  <div className="text-xl" style={{ color: "rgba(255,255,255,0.55)" }}>…</div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { title: "Category", pct: segToPct(segCategory), data: segCategory },
                    { title: "City", pct: segToPct(segCity), data: segCity },
                    { title: "Status", pct: segToPct(segStatus), data: segStatus },
                  ].map((seg, i) => (
                    <div key={seg.title} className="text-center">
                      <div className="mx-auto" style={{ width: 92, height: 92 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={seg.data?.length ? seg.data.slice(0, 3) : [{ name: seg.title, value: 1 }]}
                              dataKey="value"
                              innerRadius={28}
                              outerRadius={40}
                              stroke="none"
                            >
                              {(seg.data?.length ? seg.data.slice(0, 3) : [{ name: seg.title, value: 1 }]).map((_, idx) => (
                                <Cell key={idx} fill={donutColors[(idx + i) % donutColors.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-2 text-xs font-bold" style={{ color: GOLD2 }}>{seg.pct || 0}%</div>
                      <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>{seg.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Helper */}
            {dashLoading && (
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }} dir="rtl">
                در حال دریافت اطلاعات...
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
