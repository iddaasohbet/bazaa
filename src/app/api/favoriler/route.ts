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

    console.log('📋 Favoriler yükleniyor - Kullanıcı ID:', kullaniciId);
    
    const favoriler = await query(
      `SELECT 
        f.id,
        f.kullanici_id,
        f.ilan_id,
        f.created_at,
        i.baslik,
        i.fiyat,
        i.eski_fiyat,
        i.indirim_yuzdesi,
        i.ana_resim,
        i.goruntulenme,
        i.created_at as ilan_created_at,
        k.ad as kategori_ad,
        k.slug as kategori_slug,
        il.ad as il_ad
       FROM favoriler f
       JOIN ilanlar i ON f.ilan_id = i.id
       LEFT JOIN kategoriler k ON i.kategori_id = k.id
       LEFT JOIN iller il ON i.il_id = il.id
       WHERE f.kullanici_id = ? AND i.aktif = TRUE
       ORDER BY f.created_at DESC`,
      [kullaniciId]
    );
    
    console.log('✅ Favoriler yüklendi:', Array.isArray(favoriler) ? favoriler.length : 0, 'adet');

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
    
    console.log('➕ Favori ekleme - Kullanıcı ID:', kullaniciId);
    
    if (!kullaniciId) {
      console.error('❌ Kullanıcı ID yok');
      return NextResponse.json(
        { success: false, message: 'لطفاً وارد شوید' },
        { status: 401 }
      );
    }

    const { ilanId } = await request.json();
    
    console.log('➕ Favori ekleme - İlan ID:', ilanId);

    if (!ilanId) {
      console.error('❌ İlan ID yok');
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
      console.log('⚠️ Favori zaten mevcut');
      return NextResponse.json({
        success: true,
        message: 'قبلاً به علاقه‌مندی‌ها اضافه شده'
      });
    }

    console.log('💾 Database\'e favori ekleniyor...');
    
    await query(
      'INSERT INTO favoriler (kullanici_id, ilan_id) VALUES (?, ?)',
      [kullaniciId, ilanId]
    );

    console.log('✅ Favori başarıyla eklendi!');

    return NextResponse.json({
      success: true,
      message: 'به علاقه‌مندی‌ها اضافه شد'
    });
  } catch (error: any) {
    console.error('❌ Favori ekleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در افزودن به علاقه‌مندی‌ها: ' + error.message },
      { status: 500 }
    );
  }
}

// Favori sil
export async function DELETE(request: NextRequest) {
  try {
    const kullaniciId = request.headers.get('x-user-id');
    
    console.log('🗑️ Favori silme - Kullanıcı ID:', kullaniciId);
    
    if (!kullaniciId) {
      console.error('❌ Kullanıcı ID yok');
      return NextResponse.json(
        { success: false, message: 'لطفاً وارد شوید' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const ilanId = searchParams.get('ilanId');
    
    console.log('🗑️ Favori silme - İlan ID:', ilanId);

    if (!ilanId) {
      console.error('❌ İlan ID yok');
      return NextResponse.json(
        { success: false, message: 'آگهی انتخاب نشده است' },
        { status: 400 }
      );
    }

    console.log('💾 Database\'den favori siliniyor...');
    
    const result = await query(
      'DELETE FROM favoriler WHERE kullanici_id = ? AND ilan_id = ?',
      [kullaniciId, ilanId]
    );
    
    console.log('✅ Favori silindi! Affected rows:', (result as any).affectedRows);

    return NextResponse.json({
      success: true,
      message: 'از علاقه‌مندی‌ها حذف شد'
    });
  } catch (error: any) {
    console.error('❌ Favori silme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در حذف از علاقه‌مندی‌ها: ' + error.message },
      { status: 500 }
    );
  }
}



