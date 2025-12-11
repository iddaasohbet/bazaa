import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const kullaniciId = parseInt(resolvedParams.id);

    console.log('📋 Kullanıcı ilanları getiriliyor, kullanici_id:', kullaniciId);

    // Veritabanından kullanıcının ilanlarını çek
    const ilanlar = await query(
      `SELECT 
        i.id,
        i.baslik,
        i.fiyat,
        i.fiyat_tipi,
        i.ana_resim,
        i.durum,
        i.goruntulenme,
        i.created_at,
        k.ad as kategori_ad,
        COALESCE(il.ad_dari, il.ad) as il_ad
      FROM ilanlar i
      LEFT JOIN kategoriler k ON i.kategori_id = k.id
      LEFT JOIN iller il ON i.il_id = il.id
      WHERE i.kullanici_id = ? AND i.aktif = TRUE
      ORDER BY i.created_at DESC`,
      [kullaniciId]
    );

    console.log(`✅ ${(ilanlar as any[]).length} ilan bulundu`);

    // Her ilan için resimleri getir
    const ilanlarWithImages = await Promise.all(
      (ilanlar as any[]).map(async (ilan) => {
        const resimler = await query(
          'SELECT resim_url FROM ilan_resimleri WHERE ilan_id = ? ORDER BY sira',
          [ilan.id]
        ) as any[];
        
        return {
          ...ilan,
          resimler: resimler.map(r => r.resim_url),
          resim_sayisi: resimler.length
        };
      })
    );

    // Kullanıcı bilgisini de getir
    const kullanicilar = await query(
      'SELECT id, ad FROM kullanicilar WHERE id = ?',
      [kullaniciId]
    );

    const kullanici = Array.isArray(kullanicilar) && kullanicilar.length > 0 
      ? kullanicilar[0] 
      : { id: kullaniciId, ad: 'کاربر' };

    return NextResponse.json({
      success: true,
      data: ilanlarWithImages,
      kullanici
    });
  } catch (error: any) {
    console.error('❌ Kullanıcı ilanları yüklenirken hata:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}



