import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '3');

    // Sponsorlu (premium veya pro) mağazaları getir
    const magazalar = await query(
      `
      SELECT 
        m.id,
        m.ad,
        m.ad_dari,
        m.logo,
        m.kapak_resmi,
        m.aciklama,
        m.paket_turu,
        m.goruntulenme,
        COUNT(DISTINCT i.id) as ilan_sayisi
      FROM magazalar m
      LEFT JOIN ilanlar i ON m.kullanici_id = i.kullanici_id AND i.aktif = TRUE
      WHERE m.aktif = TRUE 
        AND m.onay_durumu = 'onaylandi'
        AND m.paket_turu IN ('pro', 'premium')
        AND m.paket_bitis > NOW()
      GROUP BY m.id
      ORDER BY 
        CASE m.paket_turu 
          WHEN 'premium' THEN 1
          WHEN 'pro' THEN 2
        END,
        RAND()
      LIMIT ?
      `,
      [limit]
    );

    // Her mağaza için favori ürünleri getir
    const magazalarWithProducts = await Promise.all(
      (magazalar as any[]).map(async (magaza) => {
        const favoriUrunler = await query(
          `
          SELECT 
            i.id,
            i.baslik,
            i.fiyat,
            i.ana_resim
          FROM vitrinler v
          INNER JOIN ilanlar i ON v.ilan_id = i.id
          WHERE v.magaza_id = ? 
            AND v.vitrin_turu = 'magaza'
            AND v.aktif = TRUE
            AND v.bitis_tarihi > NOW()
            AND i.aktif = TRUE
          ORDER BY v.sira ASC
          LIMIT 3
          `,
          [magaza.id]
        );

        return {
          ...magaza,
          favori_urunler: favoriUrunler
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: magazalarWithProducts
    });
  } catch (error: any) {
    console.error('Sponsorlu mağazalar hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Sponsorlu mağazalar yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}



