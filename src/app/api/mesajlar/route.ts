import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Mesajları getir
export async function GET(request: NextRequest) {
  try {
    const kullaniciId = request.headers.get('x-user-id');
    
    if (!kullaniciId) {
      return NextResponse.json(
        { success: false, message: 'لطفاً وارد شوید' },
        { status: 401 }
      );
    }

    const mesajlar = await query(
      `SELECT m.*,
              gonderici.ad as gonderici_ad,
              alici.ad as alici_ad,
              i.baslik as ilan_baslik
       FROM mesajlar m
       JOIN kullanicilar gonderici ON m.gonderici_id = gonderici.id
       JOIN kullanicilar alici ON m.alici_id = alici.id
       LEFT JOIN ilanlar i ON m.ilan_id = i.id
       WHERE m.gonderici_id = ? OR m.alici_id = ?
       ORDER BY m.tarih DESC`,
      [kullaniciId, kullaniciId]
    );

    return NextResponse.json({
      success: true,
      data: mesajlar
    });
  } catch (error: any) {
    console.error('❌ Mesajlar getirme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت پیام‌ها' },
      { status: 500 }
    );
  }
}

// Mesaj gönder
export async function POST(request: NextRequest) {
  try {
    const kullaniciId = request.headers.get('x-user-id');
    
    if (!kullaniciId) {
      return NextResponse.json(
        { success: false, message: 'لطفاً وارد شوید' },
        { status: 401 }
      );
    }

    const { aliciId, mesaj, ilanId } = await request.json();

    if (!aliciId || !mesaj) {
      return NextResponse.json(
        { success: false, message: 'گیرنده و پیام الزامی است' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO mesajlar (gonderici_id, alici_id, mesaj, ilan_id, okundu) 
       VALUES (?, ?, ?, ?, FALSE)`,
      [kullaniciId, aliciId, mesaj, ilanId || null]
    );

    return NextResponse.json({
      success: true,
      message: 'پیام ارسال شد',
      data: { id: (result as any).insertId }
    });
  } catch (error: any) {
    console.error('❌ Mesaj gönderme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ارسال پیام' },
      { status: 500 }
    );
  }
}

// Mesajı okundu olarak işaretle
export async function PATCH(request: NextRequest) {
  try {
    const kullaniciId = request.headers.get('x-user-id');
    
    if (!kullaniciId) {
      return NextResponse.json(
        { success: false, message: 'لطفاً وارد شوید' },
        { status: 401 }
      );
    }

    const { mesajId } = await request.json();

    if (!mesajId) {
      return NextResponse.json(
        { success: false, message: 'پیام انتخاب نشده است' },
        { status: 400 }
      );
    }

    await query(
      'UPDATE mesajlar SET okundu = TRUE WHERE id = ? AND alici_id = ?',
      [mesajId, kullaniciId]
    );

    return NextResponse.json({
      success: true,
      message: 'پیام به عنوان خوانده شده علامت‌گذاری شد'
    });
  } catch (error: any) {
    console.error('❌ Mesaj güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در به‌روزرسانی پیام' },
      { status: 500 }
    );
  }
}

// Mesajı sil
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
    const mesajId = searchParams.get('mesajId');

    if (!mesajId) {
      return NextResponse.json(
        { success: false, message: 'پیام انتخاب نشده است' },
        { status: 400 }
      );
    }

    await query(
      'DELETE FROM mesajlar WHERE id = ? AND (gonderici_id = ? OR alici_id = ?)',
      [mesajId, kullaniciId, kullaniciId]
    );

    return NextResponse.json({
      success: true,
      message: 'پیام حذف شد'
    });
  } catch (error: any) {
    console.error('❌ Mesaj silme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در حذف پیام' },
      { status: 500 }
    );
  }
}












