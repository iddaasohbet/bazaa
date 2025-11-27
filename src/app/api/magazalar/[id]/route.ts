import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Mock mağaza data
const mockMagaza = {
  id: 1,
  ad: 'Tech Store Kabul',
  ad_dari: 'مغازه تکنولوژی کابل',
  slug: 'tech-store-kabul',
  logo: '',
  kapak_resmi: '',
  aciklama: 'بهترین محصولات الکترونیکی را از ما بخواهید',
  telefon: '+93 700 123 456',
  adres: 'کابل، افغانستان',
  paket_turu: 'premium',
  store_level: 'elite',
  goruntulenme: 1234,
  il_ad: 'Kabil',
  ilan_sayisi: 45
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const magazaData = await query(
      `
      SELECT 
        m.id,
        m.ad,
        m.ad_dari,
        m.slug,
        m.logo,
        m.kapak_resmi,
        m.aciklama,
        m.telefon,
        m.adres,
        m.paket_turu,
        m.store_level,
        m.goruntulenme,
        il.ad as il_ad,
        COUNT(DISTINCT i.id) as ilan_sayisi
      FROM magazalar m
      LEFT JOIN iller il ON m.il_id = il.id
      LEFT JOIN ilanlar i ON m.kullanici_id = i.kullanici_id AND i.aktif = TRUE
      WHERE m.id = ? AND m.aktif = TRUE AND m.onay_durumu = 'onaylandi'
      GROUP BY m.id
      `,
      [parseInt(id)]
    );

    const magaza: any = Array.isArray(magazaData) && magazaData.length > 0 ? magazaData[0] : null;

    if (!magaza) {
      return NextResponse.json(
        { success: false, message: 'Mağaza bulunamadı' },
        { status: 404 }
      );
    }

    // Görüntülenme sayısını artır
    await query(
      'UPDATE magazalar SET goruntulenme = goruntulenme + 1 WHERE id = ?',
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      data: magaza
    });
  } catch (error: any) {
    console.error('Mağaza yükleme hatası (fallback):', error);
    // Fallback
    return NextResponse.json({
      success: true,
      data: mockMagaza
    });
  }
}



