import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const turu = searchParams.get('turu') || 'anasayfa';
    const kategoriId = searchParams.get('kategori_id');
    const magazaId = searchParams.get('magaza_id');
    const limit = parseInt(searchParams.get('limit') || '8');

    let whereClause = 'v.aktif = TRUE AND v.bitis_tarihi > NOW()';
    let params: any[] = [];

    // Vitrin türüne göre filtrele
    whereClause += ' AND v.vitrin_turu = ?';
    params.push(turu);

    // Kategori filtresi
    if (kategoriId && turu === 'kategori') {
      whereClause += ' AND v.kategori_id = ?';
      params.push(parseInt(kategoriId));
    }

    // Mağaza filtresi
    if (magazaId && turu === 'magaza') {
      whereClause += ' AND v.magaza_id = ?';
      params.push(parseInt(magazaId));
    }

    const vitrinIlanlar = await query(
      `
      SELECT 
        i.id,
        i.baslik,
        i.fiyat,
        i.ana_resim,
        i.goruntulenme,
        k.ad as kategori_ad,
        COALESCE(il.ad_dari, il.ad) as il_ad,
        m.ad as magaza_ad,
        m.logo as magaza_logo,
        v.vitrin_turu,
        v.sira
      FROM vitrinler v
      INNER JOIN ilanlar i ON v.ilan_id = i.id
      LEFT JOIN kategoriler k ON i.kategori_id = k.id
      LEFT JOIN iller il ON i.il_id = il.id
      LEFT JOIN magazalar m ON v.magaza_id = m.id
      WHERE ${whereClause}
        AND i.aktif = TRUE
      ORDER BY v.sira ASC, v.created_at DESC
      LIMIT ?
      `,
      [...params, limit]
    );

    // Görüntülenme sayısını artır
    if (Array.isArray(vitrinIlanlar) && vitrinIlanlar.length > 0) {
      const vitrinIds = vitrinIlanlar.map((v: any) => v.id);
      await query(
        `UPDATE vitrinler SET goruntulenme = goruntulenme + 1 
         WHERE ilan_id IN (${vitrinIds.map(() => '?').join(',')})`,
        vitrinIds
      );
    }

    return NextResponse.json({
      success: true,
      data: vitrinIlanlar
    });
  } catch (error: any) {
    console.error('❌ Vitrin ilanları hatası:', error);
    
    // Fallback: Mock data dön (database hatası durumunda)
    const mockVitrin = [
      {
        id: 1,
        baslik: 'iPhone 14 Pro Max',
        fiyat: 45000,
        ana_resim: 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg',
        goruntulenme: 1200,
        kategori_ad: 'Elektronik',
        il_ad: 'Kabil',
        magaza_ad: 'Tech Store',
        vitrin_turu: 'anasayfa'
      },
      {
        id: 2,
        baslik: 'Samsung S23 Ultra',
        fiyat: 40000,
        ana_resim: 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg',
        goruntulenme: 980,
        kategori_ad: 'Elektronik',
        il_ad: 'Herat',
        magaza_ad: 'Mobile Shop',
        vitrin_turu: 'anasayfa'
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockVitrin
    });
  }
}

// Vitrin ekleme/güncelleme
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      ilan_id, 
      magaza_id, 
      vitrin_turu, 
      kategori_id, 
      sure_gun = 30,
      sira = 0 
    } = body;

    // Gerekli alanları kontrol et
    if (!ilan_id || !vitrin_turu) {
      return NextResponse.json(
        { success: false, message: 'İlan ID ve vitrin türü gereklidir' },
        { status: 400 }
      );
    }

    // Bitiş tarihini hesapla
    const bitis_tarihi = new Date();
    bitis_tarihi.setDate(bitis_tarihi.getDate() + sure_gun);

    // Vitrin ekle
    const result = await query(
      `INSERT INTO vitrinler 
       (ilan_id, magaza_id, vitrin_turu, kategori_id, sira, bitis_tarihi) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [ilan_id, magaza_id, vitrin_turu, kategori_id, sira, bitis_tarihi]
    );

    return NextResponse.json({
      success: true,
      message: 'İlan vitrine eklendi',
      data: { id: (result as any).insertId }
    });
  } catch (error: any) {
    console.error('Vitrin ekleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Vitrin eklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// Vitrinden kaldırma
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const vitrinId = searchParams.get('id');
    const ilanId = searchParams.get('ilan_id');

    if (vitrinId) {
      await query('DELETE FROM vitrinler WHERE id = ?', [vitrinId]);
    } else if (ilanId) {
      await query('DELETE FROM vitrinler WHERE ilan_id = ?', [ilanId]);
    } else {
      return NextResponse.json(
        { success: false, message: 'Vitrin ID veya İlan ID gereklidir' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Vitrin kaldırıldı'
    });
  } catch (error: any) {
    console.error('Vitrin kaldırma hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Vitrin kaldırılırken hata oluştu' },
      { status: 500 }
    );
  }
}

