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

    console.log('📦 Mağaza ilanları API - Mağaza ID:', id);

    // Mağaza sahibini bul
    const magazaData = await query(
      'SELECT id, kullanici_id FROM magazalar WHERE id = ?',
      [parseInt(id)]
    );

    const magaza: any = Array.isArray(magazaData) && magazaData.length > 0 ? magazaData[0] : null;

    console.log('🏪 Mağaza bilgisi:', magaza);

    if (!magaza) {
      console.error('❌ Mağaza bulunamadı');
      return NextResponse.json(
        { success: false, message: 'Mağaza bulunamadı' },
        { status: 404 }
      );
    }

    // Mağazanın ilanlarını getir (magaza_id'ye göre)
    const ilanlar = await query(
      `SELECT 
        i.id,
        i.baslik,
        i.fiyat,
        i.eski_fiyat,
        i.indirim_yuzdesi,
        i.ana_resim,
        i.goruntulenme,
        i.aktif,
        i.created_at,
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
      WHERE i.magaza_id = ? AND i.aktif = TRUE
      ORDER BY vitrin DESC, i.created_at DESC
      LIMIT ?`,
      [parseInt(id), parseInt(id), limit]
    );

    console.log('✅ İlanlar yüklendi:', Array.isArray(ilanlar) ? ilanlar.length : 0, 'adet');

    return NextResponse.json({
      success: true,
      data: ilanlar || []
    });
  } catch (error: any) {
    console.error('❌ Mağaza ilanları hatası:', error);
    
    // Hata durumunda boş array dön
    return NextResponse.json(
      { success: true, data: [] }
    );
  }
}



