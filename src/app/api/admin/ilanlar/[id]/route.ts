import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Tek ilan detayı getir
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;

    const ilanlar = await query(
      `SELECT i.*, k.ad as kategori_ad, u.ad as kullanici_ad, u.email as kullanici_email
       FROM ilanlar i
       LEFT JOIN kategoriler k ON i.kategori_id = k.id
       LEFT JOIN kullanicilar u ON i.kullanici_id = u.id
       WHERE i.id = ?`,
      [id]
    ) as any[];

    if (ilanlar.length === 0) {
      return NextResponse.json(
        { success: false, message: 'آگهی یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ilanlar[0]
    });
  } catch (error: any) {
    console.error('❌ İlan detay hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت اطلاعات آگهی' },
      { status: 500 }
    );
  }
}

// İlan güncelle
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;
    const body = await request.json();
    const { 
      baslik, 
      aciklama, 
      fiyat, 
      kategori_id, 
      alt_kategori_id,
      aktif,
      onecikan
    } = body;

    // Validasyon
    if (!baslik || !kategori_id) {
      return NextResponse.json(
        { success: false, message: 'عنوان و دسته‌بندی الزامی است' },
        { status: 400 }
      );
    }

    // Güncelleme sorgusu
    let updateQuery = 'UPDATE ilanlar SET';
    const params_array: any[] = [];
    let first = true;

    if (baslik !== undefined) {
      updateQuery += first ? ' baslik = ?' : ', baslik = ?';
      params_array.push(baslik);
      first = false;
    }
    if (aciklama !== undefined) {
      updateQuery += first ? ' aciklama = ?' : ', aciklama = ?';
      params_array.push(aciklama);
      first = false;
    }
    if (fiyat !== undefined) {
      updateQuery += first ? ' fiyat = ?' : ', fiyat = ?';
      params_array.push(fiyat);
      first = false;
    }
    if (kategori_id !== undefined) {
      updateQuery += first ? ' kategori_id = ?' : ', kategori_id = ?';
      params_array.push(kategori_id);
      first = false;
    }
    if (alt_kategori_id !== undefined) {
      updateQuery += first ? ' alt_kategori_id = ?' : ', alt_kategori_id = ?';
      params_array.push(alt_kategori_id || null);
      first = false;
    }
    if (aktif !== undefined) {
      updateQuery += first ? ' aktif = ?' : ', aktif = ?';
      params_array.push(aktif ? 1 : 0);
      first = false;
    }
    if (onecikan !== undefined) {
      updateQuery += first ? ' onecikan = ?' : ', onecikan = ?';
      params_array.push(onecikan ? 1 : 0);
      first = false;
    }

    updateQuery += ' WHERE id = ?';
    params_array.push(id);

    await query(updateQuery, params_array);

    return NextResponse.json({
      success: true,
      message: 'آگهی با موفقیت به‌روزرسانی شد'
    });
  } catch (error: any) {
    console.error('❌ İlan güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در به‌روزرسانی آگهی: ' + error.message },
      { status: 500 }
    );
  }
}

// İlan sil
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;

    // Önce resimleri sil (opsiyonel)
    // await query('DELETE FROM ilan_resimleri WHERE ilan_id = ?', [id]);

    // İlanı sil
    await query('DELETE FROM ilanlar WHERE id = ?', [id]);

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
