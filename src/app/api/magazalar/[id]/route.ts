import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log('🔍 API /magazalar/[id] - Mağaza ID:', id);
    
    // Önce basit sorgu - hata varsa görelim
    let magazaData;
    try {
      magazaData = await query(
        `SELECT m.* FROM magazalar m WHERE m.id = ? LIMIT 1`,
        [parseInt(id)]
      );
      console.log('📦 API /magazalar/[id] - Mağaza bulundu (basit):', magazaData);
    } catch (err: any) {
      console.error('❌ API /magazalar/[id] - SQL HATASI:', err.message);
      throw err;
    }

    // Şimdi ilan sayısını ayrı çekelim
    let ilan_sayisi = 0;
    if (magazaData && Array.isArray(magazaData) && magazaData.length > 0) {
      try {
        const ilanCount: any = await query(
          `SELECT COUNT(*) as total FROM ilanlar WHERE kullanici_id = ? AND aktif = TRUE`,
          [(magazaData[0] as any).kullanici_id]
        );
        ilan_sayisi = ilanCount[0]?.total || 0;
      } catch (err) {
        console.log('⚠️ İlan sayısı alınamadı, 0 kabul ediliyor');
      }
    }

    // Şehir adını ayrı çekelim
    let il_ad = null;
    if (magazaData && Array.isArray(magazaData) && magazaData.length > 0) {
      const magaza: any = magazaData[0];
      if (magaza.il_id) {
        try {
          const ilData: any = await query(`SELECT ad FROM iller WHERE id = ?`, [magaza.il_id]);
          il_ad = ilData[0]?.ad || null;
        } catch (err) {
          console.log('⚠️ Şehir adı alınamadı');
        }
      }
    }
    
    console.log('📦 API /magazalar/[id] - Query tamamlandı');

    let magaza: any = Array.isArray(magazaData) && magazaData.length > 0 ? magazaData[0] : null;

    console.log('✅ API /magazalar/[id] - Mağaza bulundu:', magaza ? 'Evet' : 'Hayır');
    
    if (!magaza) {
      console.log('❌ API /magazalar/[id] - Mağaza bulunamadı!');
      return NextResponse.json(
        { success: false, message: 'Mağaza bulunamadı' },
        { status: 404 }
      );
    }

    // İlan sayısı ve şehir adını ekle
    magaza.ilan_sayisi = ilan_sayisi;
    magaza.il_ad = il_ad;

    console.log('📊 API /magazalar/[id] - İstatistikler:', {
      ilan_sayisi: magaza.ilan_sayisi,
      goruntulenme: magaza.goruntulenme,
      il_ad: magaza.il_ad
    });

    // Görüntülenme sayısını artır (hata olsa bile devam et)
    try {
      await query(
        'UPDATE magazalar SET goruntulenme = goruntulenme + 1 WHERE id = ?',
        [parseInt(id)]
      );
    } catch (err) {
      console.log('⚠️ Görüntülenme sayısı artırılamadı');
    }

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



