import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const konum = searchParams.get('konum');
    const kategoriId = searchParams.get('kategori_id');

    let whereClause = 'aktif = TRUE AND onay_durumu = "onaylandi" AND bitis_tarihi > NOW()';
    let params: any[] = [];

    // Konum filtresi
    if (konum) {
      whereClause += ' AND konum = ?';
      params.push(konum);
    }

    // Kategori filtresi
    if (kategoriId) {
      whereClause += ' AND (kategori_id = ? OR kategori_id IS NULL)';
      params.push(parseInt(kategoriId));
    }

    // Rastgele bir reklam seç
    const reklamlar = await query(
      `
      SELECT 
        id,
        baslik,
        aciklama,
        reklam_turu,
        banner_url,
        hedef_url,
        konum,
        boyut
      FROM reklamlar
      WHERE ${whereClause}
      ORDER BY RAND()
      LIMIT 1
      `,
      params
    );

    const reklam: any = Array.isArray(reklamlar) && reklamlar.length > 0 ? reklamlar[0] : null;

    // Görüntülenme sayısını artır
    if (reklam) {
      await query(
        'UPDATE reklamlar SET goruntulenme = goruntulenme + 1 WHERE id = ?',
        [reklam.id]
      );
    }

    return NextResponse.json({
      success: true,
      data: reklam
    });
  } catch (error: any) {
    console.error('❌ Reklam yükleme hatası:', error);
    // Fallback: null dön (reklam yokmuş gibi)
    return NextResponse.json({
      success: true,
      data: null
    });
  }
}

// Reklam ekleme
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      baslik,
      aciklama,
      reklam_turu,
      banner_url,
      hedef_url,
      ilan_id,
      magaza_id,
      kategori_id,
      konum,
      boyut,
      sure_gun = 30,
      butce
    } = body;

    // Gerekli alanları kontrol et
    if (!baslik || !reklam_turu || !hedef_url) {
      return NextResponse.json(
        { success: false, message: 'Başlık, reklam türü ve hedef URL gereklidir' },
        { status: 400 }
      );
    }

    // Bitiş tarihini hesapla
    const bitis_tarihi = new Date();
    bitis_tarihi.setDate(bitis_tarihi.getDate() + sure_gun);

    const result = await query(
      `INSERT INTO reklamlar 
       (baslik, aciklama, reklam_turu, banner_url, hedef_url, ilan_id, magaza_id, kategori_id, konum, boyut, bitis_tarihi, butce) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [baslik, aciklama, reklam_turu, banner_url, hedef_url, ilan_id, magaza_id, kategori_id, konum, boyut, bitis_tarihi, butce]
    );

    return NextResponse.json({
      success: true,
      message: 'Reklam eklendi',
      data: { id: (result as any).insertId }
    });
  } catch (error: any) {
    console.error('Reklam ekleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Reklam eklenirken hata oluştu' },
      { status: 500 }
    );
  }
}



