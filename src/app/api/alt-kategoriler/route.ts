import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Alt kategorileri listele (kategori_id'ye göre)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kategori_id = searchParams.get('kategori_id');

    let sql = `
      SELECT 
        ak.id,
        ak.kategori_id,
        ak.ad,
        ak.ad_dari,
        ak.slug,
        ak.aciklama,
        ak.sira,
        ak.aktif,
        k.ad as kategori_ad,
        COUNT(i.id) as ilan_sayisi
      FROM alt_kategoriler ak
      LEFT JOIN kategoriler k ON ak.kategori_id = k.id
      LEFT JOIN ilanlar i ON ak.id = i.alt_kategori_id AND i.aktif = TRUE
    `;

    const params: any[] = [];

    if (kategori_id) {
      sql += ' WHERE ak.kategori_id = ? AND ak.aktif = TRUE';
      params.push(kategori_id);
    } else {
      sql += ' WHERE ak.aktif = TRUE';
    }

    sql += ' GROUP BY ak.id ORDER BY ak.kategori_id, ak.sira';

    const altKategoriler = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: altKategoriler
    });
  } catch (error: any) {
    console.error('❌ Alt kategoriler hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت زیر دسته‌بندی‌ها', error: error.message },
      { status: 500 }
    );
  }
}

// Yeni alt kategori oluştur
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { kategori_id, ad, ad_dari, slug, aciklama, sira = 0, aktif = true } = body;

    if (!kategori_id || !ad || !slug) {
      return NextResponse.json(
        { success: false, message: 'دسته‌بندی، نام و slug الزامی است' },
        { status: 400 }
      );
    }

    // Slug kontrolü
    const existing = await query(
      'SELECT id FROM alt_kategoriler WHERE slug = ?',
      [slug]
    ) as any[];

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: 'این slug قبلاً استفاده شده است' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO alt_kategoriler (kategori_id, ad, ad_dari, slug, aciklama, sira, aktif)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [kategori_id, ad, ad_dari || null, slug, aciklama || null, sira, aktif ? 1 : 0]
    );

    return NextResponse.json({
      success: true,
      message: 'زیر دسته‌بندی با موفقیت ایجاد شد',
      data: { id: (result as any).insertId }
    });
  } catch (error: any) {
    console.error('❌ Alt kategori oluşturma hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ایجاد زیر دسته‌بندی: ' + error.message },
      { status: 500 }
    );
  }
}

// Alt kategori güncelle
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ad, ad_dari, slug, aciklama, sira, aktif } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه الزامی است' },
        { status: 400 }
      );
    }

    let updateQuery = 'UPDATE alt_kategoriler SET updated_at = NOW()';
    const params: any[] = [];

    if (ad !== undefined) {
      updateQuery += ', ad = ?';
      params.push(ad);
    }
    if (ad_dari !== undefined) {
      updateQuery += ', ad_dari = ?';
      params.push(ad_dari);
    }
    if (slug !== undefined) {
      updateQuery += ', slug = ?';
      params.push(slug);
    }
    if (aciklama !== undefined) {
      updateQuery += ', aciklama = ?';
      params.push(aciklama);
    }
    if (sira !== undefined) {
      updateQuery += ', sira = ?';
      params.push(sira);
    }
    if (aktif !== undefined) {
      updateQuery += ', aktif = ?';
      params.push(aktif ? 1 : 0);
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    await query(updateQuery, params);

    return NextResponse.json({
      success: true,
      message: 'زیر دسته‌بندی به‌روزرسانی شد'
    });
  } catch (error: any) {
    console.error('❌ Alt kategori güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در به‌روزرسانی: ' + error.message },
      { status: 500 }
    );
  }
}

// Alt kategori sil
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه الزامی است' },
        { status: 400 }
      );
    }

    await query('DELETE FROM alt_kategoriler WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'زیر دسته‌بندی حذف شد'
    });
  } catch (error: any) {
    console.error('❌ Alt kategori silme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در حذف: ' + error.message },
      { status: 500 }
    );
  }
}

