import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ilanData = await query(
      `SELECT 
        i.*,
        k.ad as kategori_ad,
        k.slug as kategori_slug,
        il.ad as il_ad,
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
      [parseInt(id)]
    );

    if (!Array.isArray(ilanData) || ilanData.length === 0) {
      return NextResponse.json(
        { success: false, message: 'آگهی یافت نشد' },
        { status: 404 }
      );
    }

    const ilan: any = ilanData[0];

    // Resimleri çek
    const resimler = await query(
      'SELECT resim_url FROM ilan_resimleri WHERE ilan_id = ? ORDER BY sira',
      [parseInt(id)]
    );

    ilan.resimler = Array.isArray(resimler) ? resimler.map((r: any) => r.resim_url) : [];

    // Görüntülenme sayısını artır
    await query(
      'UPDATE ilanlar SET goruntulenme = goruntulenme + 1 WHERE id = ?',
      [parseInt(id)]
    );

    const response = NextResponse.json({
      success: true,
      data: ilan
    });
    
    // Cache bypass
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    
    return response;
  } catch (error: any) {
    console.error('❌ İlan detay hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در بارگذاری آگهی: ' + error.message },
      { status: 500 }
    );
  }
}
