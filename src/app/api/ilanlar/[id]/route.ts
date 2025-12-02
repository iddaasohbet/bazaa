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
        COALESCE(il.ad_dari, il.ad) as il_ad,
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

    // Resim listesi oluştur
    if (Array.isArray(resimler) && resimler.length > 0) {
      ilan.resimler = resimler.map((r: any) => r.resim_url);
    } else if (ilan.ana_resim) {
      // Eğer ilan_resimleri tablosunda resim yoksa, ana_resim'i kullan
      ilan.resimler = [ilan.ana_resim];
    } else {
      ilan.resimler = [];
    }

    console.log(`📸 İlan ${id} - ${ilan.resimler.length} resim bulundu`);

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

// DELETE - İlanı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Kullanıcı ID'sini header'dan al (frontend'den gönderilecek)
    const kullaniciId = request.headers.get('x-user-id');

    // İlanı kontrol et
    const ilanData = await query(
      'SELECT kullanici_id FROM ilanlar WHERE id = ?',
      [parseInt(id)]
    );

    if (!Array.isArray(ilanData) || ilanData.length === 0) {
      return NextResponse.json(
        { success: false, message: 'آگهی یافت نشد' },
        { status: 404 }
      );
    }

    const ilan: any = ilanData[0];

    // Sadece ilan sahibi silebilir
    if (kullaniciId && ilan.kullanici_id.toString() !== kullaniciId) {
      return NextResponse.json(
        { success: false, message: 'شما مجاز به حذف این آگهی نیستید' },
        { status: 403 }
      );
    }

    // İlanı sil (CASCADE ile resimler de otomatik silinir)
    await query('DELETE FROM ilanlar WHERE id = ?', [parseInt(id)]);

    console.log(`✅ İlan silindi: ${id} by user: ${kullaniciId}`);

    return NextResponse.json({
      success: true,
      message: 'آگهی با موفقیت حذف شد'
    });
  } catch (error: any) {
    console.error('❌ İlan silme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در حذف آگهی: ' + error.message },
      { status: 500 }
    );
  }
}
