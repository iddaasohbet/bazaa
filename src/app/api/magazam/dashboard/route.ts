import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms);
    p.then((v) => {
      clearTimeout(t);
      resolve(v);
    }).catch((e) => {
      clearTimeout(t);
      reject(e);
    });
  });
}

function monthKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function monthLabelEn(d: Date) {
  // Keep chart look like the reference (Jan..Dec)
  return d.toLocaleString("en-US", { month: "short" });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kullaniciId = searchParams.get("kullanici_id");
  const magazaId = searchParams.get("magaza_id");

  // Hard guard
  if (!kullaniciId && !magazaId) {
    return NextResponse.json(
      { success: false, message: "kullanici_id یا magaza_id لازم است" },
      { status: 400 }
    );
  }

  const headers = {
    "Cache-Control": "private, no-store",
  };

  // Fallback payload (so UI never breaks, also protects Vercel from long hangs)
  const now = new Date();
  const months = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return { key: monthKey(d), label: monthLabelEn(d), value: 0 };
  });

  const fallback = NextResponse.json(
    {
      success: true,
      data: {
        kpis: {
          totalRevenue: 0,
          newVipMembers: 0,
          activeProducts: 0,
          totalCustomers: 0,
        },
        performance: months,
        ai: [
          { text: "بهبود عنوان آگهی‌ها", score: 0 },
          { text: "افزودن عکس‌های بیشتر", score: 0 },
          { text: "افزایش تعامل با پیام‌ها", score: 0 },
        ],
        products: [],
        segments: {
          category: [],
          city: [],
          status: [],
        },
      },
      fallback: true,
    },
    { headers }
  );

  try {
    // 1) KPIs (map sales-like numbers to marketplace metrics)
    // totalRevenue => total views sum
    // newVipMembers => new favorites in last 30 days (message table may not exist on some DBs)
    // activeProducts => active listings
    // totalCustomers => distinct users who favorited your listings (last 30 days)
    const kpiPromise = (async () => {
      const id = kullaniciId || "";
      const mid = magazaId || "";

      const ilanStats: any = await query(
        `SELECT 
           COUNT(*) as aktifIlanlar,
           COALESCE(SUM(goruntulenme),0) as toplamGoruntulenme
         FROM ilanlar
         WHERE aktif=1
           AND (
             (? <> '' AND (kullanici_id = ? OR magaza_id IN (SELECT id FROM magazalar WHERE kullanici_id = ?)))
             OR
             (? <> '' AND magaza_id = ?)
           )`,
        [id, id, id, mid, mid]
      );

      const aktifIlanlar = Array.isArray(ilanStats) ? Number(ilanStats[0]?.aktifIlanlar || 0) : 0;
      const toplamGoruntulenme = Array.isArray(ilanStats)
        ? Number(ilanStats[0]?.toplamGoruntulenme || 0)
        : 0;

      // Favoriler (store/customer proxy)
      const fav30: any = await query(
        `SELECT 
           COUNT(*) as toplam,
           COUNT(DISTINCT f.kullanici_id) as musteriler
         FROM favoriler f
         JOIN ilanlar i ON i.id = f.ilan_id
         WHERE (
             (? <> '' AND (i.kullanici_id = ? OR i.magaza_id IN (SELECT id FROM magazalar WHERE kullanici_id = ?)))
             OR
             (? <> '' AND i.magaza_id = ?)
           )
           AND f.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
        [id, id, id, mid, mid]
      );
      const newFav = Array.isArray(fav30) ? Number(fav30[0]?.toplam || 0) : 0;
      const customers = Array.isArray(fav30) ? Number(fav30[0]?.musteriler || 0) : 0;

      return {
        totalRevenue: toplamGoruntulenme,
        newVipMembers: newFav,
        activeProducts: aktifIlanlar,
        totalCustomers: customers,
      };
    })();

    // 2) Monthly performance (last 12 months)
    const perfPromise = (async () => {
      const id = kullaniciId || "";
      const mid = magazaId || "";

      // Prefer store_analytics if present; otherwise fall back to ilanlar aggregation
      let rows: any = [];
      try {
        rows = await query(
          `SELECT 
             DATE_FORMAT(date, '%Y-%m') as ym,
             COALESCE(SUM(views),0) as v
           FROM store_analytics
           WHERE store_id = ?
             AND date >= DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 11 MONTH)
           GROUP BY ym
           ORDER BY ym ASC`,
          [magazaId]
        );
      } catch (_e) {
        rows = await query(
          `SELECT 
             DATE_FORMAT(created_at, '%Y-%m') as ym,
             COALESCE(SUM(goruntulenme),0) as v
           FROM ilanlar
           WHERE (
               (? <> '' AND (kullanici_id = ? OR magaza_id IN (SELECT id FROM magazalar WHERE kullanici_id = ?)))
               OR
               (? <> '' AND magaza_id = ?)
             )
             AND created_at >= DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 11 MONTH)
           GROUP BY ym
           ORDER BY ym ASC`,
          [id, id, id, mid, mid]
        );
      }

      const map = new Map<string, number>();
      (Array.isArray(rows) ? rows : []).forEach((r: any) => map.set(String(r.ym), Number(r.v || 0)));

      return months.map((m) => ({
        key: m.key,
        label: m.label,
        value: map.get(m.key) ?? 0,
      }));
    })();

    // 3) Products table (top recent listings)
    const productsPromise = (async () => {
      const id = kullaniciId || "";
      const mid = magazaId || "";
      const rows: any = await query(
        `SELECT id, baslik, fiyat, ana_resim, goruntulenme, created_at
         FROM ilanlar
         WHERE (
             (? <> '' AND (kullanici_id = ? OR magaza_id IN (SELECT id FROM magazalar WHERE kullanici_id = ?)))
             OR
             (? <> '' AND magaza_id = ?)
           )
         ORDER BY created_at DESC
         LIMIT 8`,
        [id, id, id, mid, mid]
      );
      return Array.isArray(rows) ? rows : [];
    })();

    // 4) Segmentations (category/city/status)
    const segmentsPromise = (async () => {
      const id = kullaniciId || "";
      const mid = magazaId || "";

      const cat: any = await query(
        `SELECT k.ad_dari as name, COUNT(*) as value
         FROM ilanlar i
         LEFT JOIN kategoriler k ON k.id = i.kategori_id
         WHERE (
             (? <> '' AND (i.kullanici_id = ? OR i.magaza_id IN (SELECT id FROM magazalar WHERE kullanici_id = ?)))
             OR
             (? <> '' AND i.magaza_id = ?)
           )
         GROUP BY k.ad_dari
         ORDER BY value DESC
         LIMIT 5`,
        [id, id, id, mid, mid]
      );

      // City distribution: join iller (ilanlar has il_id in schema)
      let city: any = [];
      try {
        city = await query(
          `SELECT COALESCE(il.ad_dari, il.ad) as name, COUNT(*) as value
           FROM ilanlar i
           LEFT JOIN iller il ON il.id = i.il_id
           WHERE (
               (? <> '' AND (i.kullanici_id = ? OR i.magaza_id IN (SELECT id FROM magazalar WHERE kullanici_id = ?)))
               OR
               (? <> '' AND i.magaza_id = ?)
             )
           GROUP BY name
           ORDER BY value DESC
           LIMIT 5`,
          [id, id, id, mid, mid]
        );
      } catch (_e) {
        city = [];
      }

      const status: any = await query(
        `SELECT 
           CASE 
             WHEN aktif = 1 THEN 'فعال'
             ELSE 'غیرفعال'
           END as name,
           COUNT(*) as value
         FROM ilanlar
         WHERE (
             (? <> '' AND (kullanici_id = ? OR magaza_id IN (SELECT id FROM magazalar WHERE kullanici_id = ?)))
             OR
             (? <> '' AND magaza_id = ?)
           )
         GROUP BY name`,
        [id, id, id, mid, mid]
      );

      return {
        category: Array.isArray(cat) ? cat : [],
        city: Array.isArray(city) ? city : [],
        status: Array.isArray(status) ? status : [],
      };
    })();

    // 5) AI Suggestions (simple heuristics)
    const aiPromise = (async () => {
      const id = kullaniciId || "";
      const mid = magazaId || "";

      const rows: any = await query(
        `SELECT 
           SUM(CASE WHEN (ana_resim IS NULL OR ana_resim = '' OR ana_resim = 'null') THEN 1 ELSE 0 END) as no_image,
           SUM(CASE WHEN (baslik IS NULL OR CHAR_LENGTH(baslik) < 12) THEN 1 ELSE 0 END) as short_title,
           COUNT(*) as total
         FROM ilanlar
         WHERE (
             (? <> '' AND (kullanici_id = ? OR magaza_id IN (SELECT id FROM magazalar WHERE kullanici_id = ?)))
             OR
             (? <> '' AND magaza_id = ?)
           )`,
        [id, id, id, mid, mid]
      );
      const r = Array.isArray(rows) ? rows[0] : null;
      const total = Number(r?.total || 0) || 0;
      const noImg = Number(r?.no_image || 0) || 0;
      const shortTitle = Number(r?.short_title || 0) || 0;

      const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

      return [
        { text: "بهبود عنوان آگهی‌ها", score: Math.max(0, 100 - pct(shortTitle)) },
        { text: "افزودن عکس‌های بیشتر", score: Math.max(0, 100 - pct(noImg)) },
        { text: "افزایش تعامل با علاقه‌مندی‌ها", score: Math.min(100, 40 + Math.min(60, total * 3)) },
      ];
    })();

    const [kpis, performance, products, segments, ai] = await Promise.all([
      withTimeout(kpiPromise, 8000, "kpis"),
      withTimeout(perfPromise, 8000, "performance"),
      withTimeout(productsPromise, 8000, "products"),
      withTimeout(segmentsPromise, 8000, "segments"),
      withTimeout(aiPromise, 8000, "ai"),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: { kpis, performance, products, segments, ai },
      },
      { headers }
    );
  } catch (e: any) {
    console.error("❌ /api/magazam/dashboard error:", e?.message || e);
    return fallback;
  }
}


