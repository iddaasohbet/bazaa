import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');

    // Mağaza sahibini bul
    const magazaData = await query(
      'SELECT kullanici_id FROM magazalar WHERE id = ?',
      [parseInt(id)]
    );

    const magaza = Array.isArray(magazaData) && magazaData.length > 0 ? magazaData[0] : null;

    if (!magaza) {
      return NextResponse.json(
        { success: false, message: 'Mağaza bulunamadı' },
        { status: 404 }
      );
    }

    // Mağazanın ilanlarını getir
    const ilanlar = await query(
      `
      SELECT 
        i.id,
        i.baslik,
        i.fiyat,
        i.ana_resim,
        i.goruntulenme,
        k.ad as kategori_ad,
        EXISTS(
          SELECT 1 FROM vitrinler v 
          WHERE v.ilan_id = i.id 
            AND v.magaza_id = ? 
            AND v.aktif = TRUE 
            AND v.bitis_tarihi > NOW()
        ) as vitrin
      FROM ilanlar i
      LEFT JOIN kategoriler k ON i.kategori_id = k.id
      WHERE i.kullanici_id = ? AND i.aktif = TRUE
      ORDER BY vitrin DESC, i.created_at DESC
      LIMIT ?
      `,
      [parseInt(id), (magaza as any).kullanici_id, limit]
    );

    return NextResponse.json({
      success: true,
      data: ilanlar
    });
  } catch (error: any) {
    console.error('Mağaza ilanları hatası:', error);
    return NextResponse.json(
      { success: false, message: 'İlanlar yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}



