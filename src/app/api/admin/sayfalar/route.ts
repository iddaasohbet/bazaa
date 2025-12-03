import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Tüm sayfaları getir
export async function GET(request: Request) {
  try {
    const sayfalar = await query(
      `SELECT * FROM sayfalar ORDER BY sira ASC, id ASC`
    );

    return NextResponse.json({
      success: true,
      data: sayfalar,
    });
  } catch (error: any) {
    console.error('Sayfalar yükleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در بارگذاری صفحات' },
      { status: 500 }
    );
  }
}

// PUT - Sayfa güncelle
export async function PUT(request: Request) {
  try {
    const { id, baslik, baslik_dari, icerik, icerik_json, aktif } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه صفحه الزامی است' },
        { status: 400 }
      );
    }

    await query(
      `UPDATE sayfalar 
       SET baslik = ?, baslik_dari = ?, icerik = ?, icerik_json = ?, aktif = ?, updated_at = NOW()
       WHERE id = ?`,
      [baslik, baslik_dari, icerik || '', icerik_json ? JSON.stringify(icerik_json) : null, aktif, id]
    );

    return NextResponse.json({
      success: true,
      message: 'صفحه با موفقیت به‌روزرسانی شد',
    });
  } catch (error: any) {
    console.error('Sayfa güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در به‌روزرسانی صفحه' },
      { status: 500 }
    );
  }
}








