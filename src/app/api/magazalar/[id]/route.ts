import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log('🔍 API /magazalar/[id] - Mağaza ID:', id);
    
    const magazaData = await query(
      `
      SELECT 
        m.id,
        m.kullanici_id,
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
        (SELECT COUNT(*) FROM ilanlar i WHERE i.kullanici_id = m.kullanici_id AND i.aktif = TRUE) as ilan_sayisi
      FROM magazalar m
      LEFT JOIN iller il ON m.il_id = il.id
      WHERE m.id = ? AND m.aktif = TRUE
      `,
      [parseInt(id)]
    );
    
    console.log('📦 API /magazalar/[id] - Query sonucu:', magazaData);

    const magaza: any = Array.isArray(magazaData) && magazaData.length > 0 ? magazaData[0] : null;

    console.log('✅ API /magazalar/[id] - Mağaza bulundu:', magaza ? 'Evet' : 'Hayır');
    
    if (!magaza) {
      console.log('❌ API /magazalar/[id] - Mağaza bulunamadı!');
      return NextResponse.json(
        { success: false, message: 'Mağaza bulunamadı' },
        { status: 404 }
      );
    }

    console.log('📊 API /magazalar/[id] - İstatistikler:', {
      ilan_sayisi: magaza.ilan_sayisi,
      goruntulenme: magaza.goruntulenme,
      il_ad: magaza.il_ad
    });

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
    console.error('❌ API /magazalar/[id] - HATA:', error);
    // Artık mock döndürme, hata döndür
    return NextResponse.json({
      success: false,
      message: 'Mağaza yüklenirken hata oluştu: ' + error.message
    }, { status: 500 });
  }
}



