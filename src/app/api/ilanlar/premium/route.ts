import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Premium mağazaların ilanlarını getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8');

    // Pro ve Elite mağazaların ilanlarını getir
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
        m.store_level,
        (SELECT COUNT(*) FROM ilan_resimleri WHERE ilan_id = i.id) as resim_sayisi
      FROM ilanlar i
      LEFT JOIN kategoriler k ON i.kategori_id = k.id
      LEFT JOIN iller il ON i.il_id = il.id
      LEFT JOIN magazalar m ON i.magaza_id = m.id
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

    const ilanlar = await query(sql, [limit]);

    // Her ilan için resimleri ayrı sorgula
    const ilanlarWithImages = await Promise.all(
      (ilanlar as any[]).map(async (ilan) => {
        try {
          const resimlerResult = await query(
            'SELECT resim_url FROM ilan_resimleri WHERE ilan_id = ? ORDER BY sira LIMIT 3',
            [ilan.id]
          );
          const resimler = (resimlerResult as any[]).map(r => r.resim_url);
          
          return {
            ...ilan,
            resimler: resimler.length > 0 ? resimler : (ilan.ana_resim ? [ilan.ana_resim] : [])
          };
        } catch {
          return {
            ...ilan,
            resimler: ilan.ana_resim ? [ilan.ana_resim] : []
          };
        }
      })
    );

    console.log('⭐ Premium ilanlar:', ilanlarWithImages.length, 'adet');

    return NextResponse.json({
      success: true,
      data: ilanlarWithImages
    });
  } catch (error: any) {
    console.error('❌ Premium ilanlar hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت آگهی‌های ویژه', error: error.message },
      { status: 500 }
    );
  }
}

