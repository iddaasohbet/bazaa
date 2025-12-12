import { query } from "@/lib/db";

export type IlanListItem = {
  id: number;
  baslik: string;
  fiyat: number;
  eski_fiyat?: number | null;
  indirim_yuzdesi?: number | null;
  fiyat_tipi: string;
  para_birimi?: string | null;
  fiyat_usd?: number | null;
  ana_resim: string | null;
  kategori_id?: number | null;
  alt_kategori_id?: number | null;
  magaza_id?: number | null;
  durum: string;
  goruntulenme: number;
  created_at: string;
  kategori_ad: string | null;
  kategori_slug: string | null;
  il_ad: string | null;
  store_level?: string | null;
  magaza_slug?: string | null;
  magaza_ad?: string | null;
  // UI için
  resimler?: string[];
  resim_sayisi?: number;
};

export type IlanDetay = {
  id: number;
  baslik: string;
  aciklama: string;
  fiyat: number;
  eski_fiyat?: number | null;
  indirim_yuzdesi?: number | null;
  fiyat_tipi: string;
  para_birimi?: "AFN" | "USD" | string | null;
  fiyat_usd?: number | null;
  kategori_ad: string | null;
  kategori_slug: string | null;
  il_ad: string | null;
  durum: string;
  emlak_tipi?: string | null;
  goruntulenme: number;
  created_at: string;
  kullanici_ad: string | null;
  kullanici_telefon: string | null;
  kullanici_id: number;
  magaza_id?: number | null;
  magaza_ad?: string | null;
  magaza_slug?: string | null;
  store_level?: string | null;
  magaza_guvenilir_satici?: boolean | number | null;
  ana_resim?: string | null;
  resimler: string[];
  alt_kategori_id?: number | null;
  kategori_id?: number | null;
};

export type SliderItem = {
  id: number;
  baslik: string | null;
  aciklama: string | null;
  resim: string | null;
  link: string | null;
  sira: number;
  ilan_id?: number | null;
  fiyat?: number | null;
  kategori_ad?: string | null;
  il_ad?: string | null;
};

export type PremiumIlan = {
  id: number;
  baslik: string;
  fiyat: number;
  eski_fiyat?: number | null;
  indirim_yuzdesi?: number | null;
  fiyat_tipi: string;
  para_birimi?: string | null;
  fiyat_usd?: number | null;
  ana_resim: string | null;
  kategori_ad: string | null;
  kategori_slug: string | null;
  il_ad: string | null;
  durum: string;
  goruntulenme: number;
  created_at: string;
  resimler: string[];
  resim_sayisi: number;
  store_level: "pro" | "elite" | string;
  magaza_id: number;
  magaza_ad: string | null;
  magaza_ad_dari?: string | null;
  magaza_slug: string | null;
  magaza_logo?: string | null;
};

export async function getIlanlar(params: {
  limit: number;
  offset: number;
  kategori?: string | null;
  q?: string | null;
  store_level?: string | null;
}): Promise<{ data: IlanListItem[]; total: number }> {
  const { limit, offset, kategori, q, store_level } = params;

  let sql = `
    SELECT 
      i.id,
      i.baslik,
      i.fiyat,
      i.eski_fiyat,
      i.indirim_yuzdesi,
      i.fiyat_tipi,
      i.para_birimi,
      i.fiyat_usd,
      i.ana_resim,
      i.kategori_id,
      i.alt_kategori_id,
      i.magaza_id,
      i.durum,
      i.goruntulenme,
      i.created_at,
      k.ad as kategori_ad,
      k.slug as kategori_slug,
      COALESCE(il.ad_dari, il.ad) as il_ad,
      m.store_level,
      m.slug as magaza_slug,
      m.ad as magaza_ad
    FROM ilanlar i
    LEFT JOIN kategoriler k ON i.kategori_id = k.id
    LEFT JOIN iller il ON i.il_id = il.id
    LEFT JOIN magazalar m ON i.magaza_id = m.id AND m.aktif = TRUE
    WHERE i.aktif = TRUE
  `;

  const queryParams: any[] = [];

  if (kategori) {
    sql += " AND k.slug = ?";
    queryParams.push(kategori);
  }

  if (store_level) {
    sql += " AND m.store_level = ?";
    queryParams.push(store_level);
  }

  if (q) {
    sql += " AND (i.baslik LIKE ? OR i.aciklama LIKE ?)";
    queryParams.push(`%${q}%`, `%${q}%`);
  }

  sql += " ORDER BY i.created_at DESC LIMIT ? OFFSET ?";
  queryParams.push(limit, offset);

  const ilanlar = (await query(sql, queryParams)) as any[];

  const ilanlarWithImages: IlanListItem[] = ilanlar.map((ilan) => ({
    ...(ilan as any),
    resimler: ilan.ana_resim ? [ilan.ana_resim] : [],
    resim_sayisi: ilan.ana_resim ? 1 : 0,
  }));

  let countSql = "SELECT COUNT(*) as total FROM ilanlar i WHERE i.aktif = TRUE";
  const countParams: any[] = [];

  if (kategori) {
    countSql +=
      " AND EXISTS (SELECT 1 FROM kategoriler k WHERE k.id = i.kategori_id AND k.slug = ?)";
    countParams.push(kategori);
  }

  if (store_level) {
    countSql +=
      " AND EXISTS (SELECT 1 FROM magazalar m WHERE m.id = i.magaza_id AND m.store_level = ?)";
    countParams.push(store_level);
  }

  if (q) {
    countSql += " AND (i.baslik LIKE ? OR i.aciklama LIKE ?)";
    countParams.push(`%${q}%`, `%${q}%`);
  }

  const countResult = (await query(countSql, countParams)) as any[];
  const total = countResult?.[0]?.total || 0;

  return { data: ilanlarWithImages, total };
}

export async function getPremiumIlanlar(limit: number): Promise<PremiumIlan[]> {
  const sql = `
    SELECT 
      i.id,
      i.baslik,
      i.fiyat,
      i.eski_fiyat,
      i.indirim_yuzdesi,
      i.fiyat_tipi,
      i.para_birimi,
      i.fiyat_usd,
      i.ana_resim,
      i.durum,
      i.goruntulenme,
      i.created_at,
      k.ad as kategori_ad,
      k.slug as kategori_slug,
      COALESCE(il.ad_dari, il.ad) as il_ad,
      m.id as magaza_id,
      m.ad as magaza_ad,
      m.ad_dari as magaza_ad_dari,
      m.slug as magaza_slug,
      m.logo as magaza_logo,
      m.store_level
    FROM ilanlar i
    LEFT JOIN kategoriler k ON i.kategori_id = k.id
    LEFT JOIN iller il ON i.il_id = il.id
    INNER JOIN magazalar m ON i.magaza_id = m.id
    WHERE i.aktif = TRUE 
      AND m.aktif = TRUE
      AND m.store_level IN ('pro', 'elite')
    ORDER BY 
      CASE m.store_level 
        WHEN 'elite' THEN 1 
        WHEN 'pro' THEN 2 
      END,
      i.created_at DESC
    LIMIT ?
  `;

  const ilanlar = (await query(sql, [limit])) as any[];

  return ilanlar.map((ilan: any) => ({
    ...(ilan as any),
    resimler: ilan.ana_resim ? [ilan.ana_resim] : [],
    resim_sayisi: ilan.ana_resim ? 1 : 0,
  })) as PremiumIlan[];
}

export async function getIlanDetay(id: number): Promise<IlanDetay | null> {
  const ilanData = (await query(
    `SELECT 
      i.*,
      k.ad as kategori_ad,
      k.slug as kategori_slug,
      COALESCE(il.ad_dari, il.ad) as il_ad,
      u.ad as kullanici_ad,
      u.telefon as kullanici_telefon,
      u.id as kullanici_id,
      m.id as magaza_id,
      m.ad as magaza_ad,
      m.slug as magaza_slug,
      m.store_level,
      m.guvenilir_satici as magaza_guvenilir_satici
    FROM ilanlar i
    LEFT JOIN kategoriler k ON i.kategori_id = k.id
    LEFT JOIN iller il ON i.il_id = il.id
    LEFT JOIN kullanicilar u ON i.kullanici_id = u.id
    LEFT JOIN magazalar m ON i.magaza_id = m.id
    WHERE i.id = ? AND i.aktif = TRUE
    LIMIT 1`,
    [id]
  )) as any[];

  if (!Array.isArray(ilanData) || ilanData.length === 0) return null;
  const ilan: any = ilanData[0];

  const resimler = (await query(
    "SELECT resim_url FROM ilan_resimleri WHERE ilan_id = ? ORDER BY sira",
    [id]
  )) as any[];

  const resimListesi =
    Array.isArray(resimler) && resimler.length > 0
      ? resimler.map((r: any) => r.resim_url)
      : ilan.ana_resim
        ? [ilan.ana_resim]
        : [];

  return {
    ...(ilan as any),
    resimler: resimListesi,
  } as IlanDetay;
}

export async function incrementIlanView(id: number) {
  await query("UPDATE ilanlar SET goruntulenme = goruntulenme + 1 WHERE id = ?", [id]);
}

export async function getSlider(): Promise<SliderItem[]> {
  const sliders = (await query(
    `SELECT 
      s.id, 
      s.ilan_id,
      s.baslik, 
      s.aciklama, 
      s.resim, 
      s.link, 
      s.sira,
      i.baslik as ilan_baslik,
      i.aciklama as ilan_aciklama,
      i.fiyat as ilan_fiyat,
      i.ana_resim as ilan_resim,
      k.ad as kategori_ad,
      COALESCE(il.ad_dari, il.ad) as il_ad
     FROM slider s
     LEFT JOIN ilanlar i ON s.ilan_id = i.id
     LEFT JOIN kategoriler k ON i.kategori_id = k.id
     LEFT JOIN iller il ON i.il_id = il.id
     WHERE s.aktif = TRUE 
     ORDER BY s.sira ASC`,
    []
  )) as any[];

  return sliders.map((slider: any) => ({
    id: slider.id,
    baslik: slider.ilan_id && slider.ilan_baslik ? slider.ilan_baslik : slider.baslik,
    aciklama:
      slider.ilan_id && slider.ilan_aciklama ? slider.ilan_aciklama : slider.aciklama,
    resim: slider.ilan_id && slider.ilan_resim ? slider.ilan_resim : slider.resim,
    link: slider.ilan_id ? `/ilan/${slider.ilan_id}` : slider.link,
    sira: slider.sira,
    ilan_id: slider.ilan_id,
    fiyat: slider.ilan_fiyat,
    kategori_ad: slider.kategori_ad,
    il_ad: slider.il_ad,
  })) as SliderItem[];
}


