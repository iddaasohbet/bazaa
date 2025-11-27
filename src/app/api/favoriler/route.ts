import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Favorileri getir
export async function GET(request: NextRequest) {
  try {
    const kullaniciId = request.headers.get('x-user-id');
    
    if (!kullaniciId) {
      return NextResponse.json(
        { success: false, message: 'لطفاً وارد شوید' },
        { status: 401 }
      );
    }

    const favoriler = await query(
      `SELECT f.*, i.baslik, i.fiyat, i.resimler, i.il, i.ilce, k.ad as kategori_ad
       FROM favoriler f
       JOIN ilanlar i ON f.ilan_id = i.id
       LEFT JOIN kategoriler k ON i.kategori_id = k.id
       WHERE f.kullanici_id = ? AND i.durum = 'aktif'
       ORDER BY f.tarih DESC`,
      [kullaniciId]
    );

    return NextResponse.json({
      success: true,
      data: favoriler
    });
  } catch (error: any) {
    console.error('❌ Favoriler getirme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت علاقه‌مندی‌ها' },
      { status: 500 }
    );
  }
}

// Favori ekle
export async function POST(request: NextRequest) {
  try {
    const kullaniciId = request.headers.get('x-user-id');
    
    if (!kullaniciId) {
      return NextResponse.json(
        { success: false, message: 'لطفاً وارد شوید' },
        { status: 401 }
      );
    }

    const { ilanId } = await request.json();

    if (!ilanId) {
      return NextResponse.json(
        { success: false, message: 'آگهی انتخاب نشده است' },
        { status: 400 }
      );
    }

    // Önce kontrol et, varsa ekleme
    const existing = await query(
      'SELECT id FROM favoriler WHERE kullanici_id = ? AND ilan_id = ?',
      [kullaniciId, ilanId]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'قبلاً به علاقه‌مندی‌ها اضافه شده'
      });
    }

    await query(
      'INSERT INTO favoriler (kullanici_id, ilan_id) VALUES (?, ?)',
      [kullaniciId, ilanId]
    );

    return NextResponse.json({
      success: true,
      message: 'به علاقه‌مندی‌ها اضافه شد'
    });
  } catch (error: any) {
    console.error('❌ Favori ekleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در افزودن به علاقه‌مندی‌ها' },
      { status: 500 }
    );
  }
}

// Favori sil
export async function DELETE(request: NextRequest) {
  try {
    const kullaniciId = request.headers.get('x-user-id');
    
    if (!kullaniciId) {
      return NextResponse.json(
        { success: false, message: 'لطفاً وارد شوید' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const ilanId = searchParams.get('ilanId');

    if (!ilanId) {
      return NextResponse.json(
        { success: false, message: 'آگهی انتخاب نشده است' },
        { status: 400 }
      );
    }

    await query(
      'DELETE FROM favoriler WHERE kullanici_id = ? AND ilan_id = ?',
      [kullaniciId, ilanId]
    );

    return NextResponse.json({
      success: true,
      message: 'از علاقه‌مندی‌ها حذف شد'
    });
  } catch (error: any) {
    console.error('❌ Favori silme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در حذف از علاقه‌مندی‌ها' },
      { status: 500 }
    );
  }
}

