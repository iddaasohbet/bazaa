import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
  };
  
  try {
    // ⚡ OPTIMIZE: Subquery ile hızlı resim çekimi
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
        m.ad as magaza_ad,
        (SELECT GROUP_CONCAT(resim_url ORDER BY sira SEPARATOR '|||') 
         FROM ilan_resimleri 
         WHERE ilan_id = i.id 
         LIMIT 3) as resimler_concat,
        (SELECT COUNT(*) FROM ilan_resimleri WHERE ilan_id = i.id) as resim_sayisi
       FROM ilanlar i
       LEFT JOIN kategoriler k ON i.kategori_id = k.id
       LEFT JOIN iller il ON i.il_id = il.id
       LEFT JOIN magazalar m ON i.magaza_id = m.id AND m.aktif = TRUE
       WHERE i.aktif = TRUE AND i.onecikan = TRUE
       ORDER BY i.onecikan_sira ASC, i.created_at DESC
       LIMIT 6`,
      []
    );

    // Resimleri parse et
    const ilanlarWithImages = (ilanlar as any[]).map((ilan: any) => {
      let resimler: string[] = [];
      if (ilan.resimler_concat) {
        resimler = ilan.resimler_concat.split('|||').filter((r: string) => r && r.trim());
      }
      
      if (resimler.length === 0 && ilan.ana_resim) {
        resimler = [ilan.ana_resim];
      }
      
      return {
        ...ilan,
        resimler: resimler,
        resim_sayisi: resimler.length,
        resimler_concat: undefined
      };
    });

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

