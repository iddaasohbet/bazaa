import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
  };
  
  try {
    // Öne çıkan ilanları çek
    const ilanlar = await query(
      `SELECT 
        i.id,
        i.baslik,
        i.fiyat,
        i.eski_fiyat,
        i.indirim_yuzdesi,
        i.para_birimi,
        i.fiyat_usd,
        i.ana_resim,
        i.magaza_id,
        i.goruntulenme,
        i.created_at,
        i.onecikan_sira,
        k.ad as kategori_ad,
        k.ad_dari as kategori_ad_dari,
        COALESCE(il.ad_dari, il.ad) as il_ad,
        m.store_level,
        m.slug as magaza_slug,
        m.ad as magaza_ad
       FROM ilanlar i
       LEFT JOIN kategoriler k ON i.kategori_id = k.id
       LEFT JOIN iller il ON i.il_id = il.id
       LEFT JOIN magazalar m ON i.magaza_id = m.id AND m.aktif = TRUE
       WHERE i.aktif = TRUE AND i.onecikan = TRUE
       ORDER BY i.onecikan_sira ASC, i.created_at DESC
       LIMIT 6`,
      []
    );

    // Kart görünümü için sadece ana_resim yeterli (hızlı yükleme)
    const ilanlarWithImages = (ilanlar as any[]).map((ilan: any) => ({
      ...ilan,
      resimler: ilan.ana_resim ? [ilan.ana_resim] : [],
      resim_sayisi: ilan.ana_resim ? 1 : 0
    }));

    console.log('⭐ Öne çıkan ilanlar:', ilanlarWithImages.length);

    return NextResponse.json({
      success: true,
      data: ilanlarWithImages,
    }, { headers });
  } catch (error: any) {
    console.error('❌ Öne çıkan ilanlar hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500, headers }
    );
  }
}

