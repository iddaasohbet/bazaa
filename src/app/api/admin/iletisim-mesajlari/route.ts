import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Tüm mesajları getir (Admin)
export async function GET(request: Request) {
  try {
    // Admin kontrolü
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'غیر مجاز' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const durum = searchParams.get('durum'); // yeni, okundu, cevaplanmis, kapandi
    const limit = parseInt(searchParams.get('limit') || '50');

    let sql = 'SELECT * FROM iletisim_mesajlari';
    const params: any[] = [];

    if (durum) {
      sql += ' WHERE durum = ?';
      params.push(durum);
    }

    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);

    const mesajlar = await query(sql, params);

    // İstatistikler
    const stats = await query(
      `SELECT 
        COUNT(*) as toplam,
        SUM(CASE WHEN durum = 'yeni' THEN 1 ELSE 0 END) as yeni,
        SUM(CASE WHEN durum = 'okundu' THEN 1 ELSE 0 END) as okundu,
        SUM(CASE WHEN durum = 'cevaplanmis' THEN 1 ELSE 0 END) as cevaplanmis,
        SUM(CASE WHEN durum = 'kapandi' THEN 1 ELSE 0 END) as kapandi
       FROM iletisim_mesajlari`,
      []
    ) as any[];

    return NextResponse.json({
      success: true,
      data: mesajlar,
      stats: stats[0]
    });
  } catch (error: any) {
    console.error('❌ Mesajlar getirme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Mesaj durumunu güncelle (Admin)
export async function PUT(request: Request) {
  try {
    // Admin kontrolü
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'غیر مجاز' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, durum, admin_notu } = body;

    if (!id || !durum) {
      return NextResponse.json(
        { success: false, message: 'ID و durum gerekli' },
        { status: 400 }
      );
    }

    await query(
      'UPDATE iletisim_mesajlari SET durum = ?, admin_notu = ?, updated_at = NOW() WHERE id = ?',
      [durum, admin_notu || null, id]
    );

    console.log('✅ Mesaj durumu güncellendi:', id, '->', durum);

    return NextResponse.json({
      success: true,
      message: 'وضعیت پیام به‌روزرسانی شد'
    });
  } catch (error: any) {
    console.error('❌ Mesaj güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Mesaj sil (Admin)
export async function DELETE(request: Request) {
  try {
    // Admin kontrolü
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'غیر مجاز' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID gerekli' },
        { status: 400 }
      );
    }

    await query('DELETE FROM iletisim_mesajlari WHERE id = ?', [id]);

    console.log('✅ Mesaj silindi:', id);

    return NextResponse.json({
      success: true,
      message: 'پیام حذف شد'
    });
  } catch (error: any) {
    console.error('❌ Mesaj silme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

