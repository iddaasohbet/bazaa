import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Ödemeleri listele
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const durum = searchParams.get('durum');
    const tur = searchParams.get('tur');

    let sql = `
      SELECT 
        o.*,
        k.ad as kullanici_ad,
        k.email as kullanici_email
      FROM odemeler o
      LEFT JOIN kullanicilar k ON o.kullanici_id = k.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (durum && durum !== 'all') {
      sql += ' AND o.odeme_durumu = ?';
      params.push(durum);
    }

    if (tur && tur !== 'all') {
      sql += ' AND o.odeme_turu = ?';
      params.push(tur);
    }

    sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const odemeler = await query(sql, params);

    // Toplam sayı
    let countSql = 'SELECT COUNT(*) as total FROM odemeler WHERE 1=1';
    const countParams: any[] = [];
    
    if (durum && durum !== 'all') {
      countSql += ' AND odeme_durumu = ?';
      countParams.push(durum);
    }
    if (tur && tur !== 'all') {
      countSql += ' AND odeme_turu = ?';
      countParams.push(tur);
    }

    const countResult = await query(countSql, countParams) as any[];
    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: odemeler,
      total,
      limit,
      offset
    });
  } catch (error: any) {
    console.error('❌ Ödemeler listesi hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت لیست پرداخت‌ها', error: error.message },
      { status: 500 }
    );
  }
}

// Yeni ödeme oluştur
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      kullanici_id,
      odeme_turu,
      iliskili_id,
      tutar,
      para_birimi = 'AFN',
      odeme_yontemi,
      transaction_id,
      aciklama,
      odeme_durumu = 'beklemede'
    } = body;

    console.log('📝 Yeni ödeme kaydı oluşturuluyor:', { kullanici_id, tutar, odeme_turu });

    // Validasyon
    if (!kullanici_id || !odeme_turu || !tutar) {
      return NextResponse.json(
        { success: false, message: 'کاربر، نوع پرداخت و مبلغ الزامی است' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO odemeler (
        kullanici_id, odeme_turu, iliskili_id, tutar, para_birimi,
        odeme_yontemi, transaction_id, aciklama, odeme_durumu
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        kullanici_id, odeme_turu, iliskili_id || null, tutar, para_birimi,
        odeme_yontemi || null, transaction_id || null, aciklama || null, odeme_durumu
      ]
    );

    const odemeId = (result as any).insertId;
    console.log('✅ Ödeme kaydı oluşturuldu, ID:', odemeId);

    return NextResponse.json({
      success: true,
      message: 'پرداخت با موفقیت ثبت شد',
      data: { id: odemeId }
    });
  } catch (error: any) {
    console.error('❌ Ödeme oluşturma hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ثبت پرداخت: ' + error.message },
      { status: 500 }
    );
  }
}

// Ödeme durumu güncelle
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, odeme_durumu, odeme_yontemi, transaction_id, aciklama } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه پرداخت الزامی است' },
        { status: 400 }
      );
    }

    let updateQuery = 'UPDATE odemeler SET updated_at = NOW()';
    const params: any[] = [];

    if (odeme_durumu !== undefined) {
      updateQuery += ', odeme_durumu = ?';
      params.push(odeme_durumu);
    }
    if (odeme_yontemi !== undefined) {
      updateQuery += ', odeme_yontemi = ?';
      params.push(odeme_yontemi);
    }
    if (transaction_id !== undefined) {
      updateQuery += ', transaction_id = ?';
      params.push(transaction_id);
    }
    if (aciklama !== undefined) {
      updateQuery += ', aciklama = ?';
      params.push(aciklama);
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    await query(updateQuery, params);

    return NextResponse.json({
      success: true,
      message: 'وضعیت پرداخت به‌روزرسانی شد'
    });
  } catch (error: any) {
    console.error('❌ Ödeme güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در به‌روزرسانی پرداخت: ' + error.message },
      { status: 500 }
    );
  }
}

// Ödeme sil
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه پرداخت الزامی است' },
        { status: 400 }
      );
    }

    await query('DELETE FROM odemeler WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'پرداخت با موفقیت حذف شد'
    });
  } catch (error: any) {
    console.error('❌ Ödeme silme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در حذف پرداخت: ' + error.message },
      { status: 500 }
    );
  }
}













