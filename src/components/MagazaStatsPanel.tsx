"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { Eye, Package, Star, Users } from "lucide-react";

type Variant = "pro" | "elite";

export default function MagazaStatsPanel(props: {
  variant: Variant;
  products: number;
  views: number;
  rating: number; // 0..5
  reviews: number;
}) {
  const { variant, products, views, rating, reviews } = props;

  const palette = variant === "elite"
    ? {
        accent: "#d4a537",
        accent2: "#f5d78e",
        text: "#f5d78e",
      }
    : {
        accent: "#9ca3af",
        accent2: "#6b7280",
        text: "#e5e7eb",
      };

  const data = useMemo(() => {
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
    const pct = (value: number, max: number) => clamp((value / max) * 100, 0, 100);

    return [
      { name: "محصولات", value: pct(products, 60), raw: products, icon: "products" },
      { name: "بازدید", value: pct(views, 1200), raw: views, icon: "views" },
      { name: "امتیاز", value: pct(rating, 5), raw: rating, icon: "rating" },
      { name: "نظرات", value: pct(reviews, 40), raw: reviews, icon: "reviews" },
    ];
  }, [products, reviews, rating, views]);

  const chartWrapRef = useRef<HTMLDivElement | null>(null);
  const [chartWidth, setChartWidth] = useState(360);

  useEffect(() => {
    const el = chartWrapRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      // Recharts'in -1/0 ölçüm hatasına düşmemek için clamp
      const w = Math.max(280, Math.floor(rect.width || 0));
      setChartWidth(w);
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div className="md:col-span-5">
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-2xl p-3 border"
            style={{
              borderColor: "rgba(255,255,255,0.12)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: palette.text }}>
                تعداد محصولات
              </span>
              <Package className="w-4 h-4" style={{ color: palette.accent2 }} />
            </div>
            <div className="text-2xl font-black text-white">{products}</div>
          </div>

          <div
            className="rounded-2xl p-3 border"
            style={{
              borderColor: "rgba(255,255,255,0.12)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: palette.text }}>
                بازدید کل
              </span>
              <Eye className="w-4 h-4" style={{ color: palette.accent2 }} />
            </div>
            <div className="text-2xl font-black text-white">{views.toLocaleString("fa-AF")}</div>
          </div>

          <div
            className="rounded-2xl p-3 border"
            style={{
              borderColor: "rgba(255,255,255,0.12)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: palette.text }}>
                امتیاز
              </span>
              <Star className="w-4 h-4" style={{ color: palette.accent }} />
            </div>
            <div className="text-2xl font-black text-white">
              {Number.isFinite(rating) ? rating.toFixed(1) : "0.0"}
              <span className="text-sm font-semibold text-gray-400"> / 5</span>
            </div>
          </div>

          <div
            className="rounded-2xl p-3 border"
            style={{
              borderColor: "rgba(255,255,255,0.12)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: palette.text }}>
                تعداد نظرات
              </span>
              <Users className="w-4 h-4" style={{ color: palette.accent2 }} />
            </div>
            <div className="text-2xl font-black text-white">{reviews}</div>
          </div>
        </div>
      </div>

      <div className="md:col-span-7 min-w-0">
        <div
          ref={chartWrapRef}
          className="h-[220px] w-full min-w-0 overflow-hidden rounded-2xl flex items-center justify-center"
          style={{
            contain: "paint",
            minHeight: 220,
            background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <RadarChart width={chartWidth} height={220} data={data} outerRadius="80%">
            <defs>
              <linearGradient id={`radarFill-${variant}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={palette.accent2} stopOpacity={0.35} />
                <stop offset="100%" stopColor={palette.accent} stopOpacity={0.18} />
              </linearGradient>
            </defs>
            <PolarGrid stroke="rgba(255,255,255,0.10)" strokeDasharray="0" />
            <PolarAngleAxis
              dataKey="name"
              tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 700 }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              dataKey="value"
              stroke={palette.accent}
              fill={`url(#radarFill-${variant})`}
              fillOpacity={1}
              strokeWidth={2}
            />
          </RadarChart>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          مقیاس نمودار: محصولات(تا ۶۰) • بازدید(تا ۱۲۰۰) • امتیاز(تا ۵) • نظرات(تا ۴۰)
        </div>
      </div>
    </div>
  );
}


