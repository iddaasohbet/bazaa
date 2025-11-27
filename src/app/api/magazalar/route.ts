import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kullaniciId = searchParams.get('kullanici_id');

    let sql = `
      SELECT 
        m.*,
        il.ad as il_ad
      FROM magazalar m
      LEFT JOIN iller il ON m.il_id = il.id
      WHERE m.aktif = TRUE
    `;

    const params: any[] = [];

    if (kullaniciId) {
      sql += ' AND m.kullanici_id = ?';
      params.push(kullaniciId);
    }

    sql += ' ORDER BY m.created_at DESC';

    const magazalar = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: magazalar,
    });
  } catch (error: any) {
    console.error('❌ Mağazalar hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در بارگذاری مغازه‌ها', data: [] },
      { status: 200 } // 500 yerine 200 dön ki frontend çalışmaya devam etsin
    );
  }
}

