import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

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
    const limit = parseInt(searchParams.get('limit') || '5');

    // Son ilanları çek
    const ilanlar = await query(
      `SELECT 
        i.id,
        i.baslik,
        i.fiyat,
        i.goruntulenme,
        i.created_at,
        k.ad as kategori_ad,
        k.ad_dari as kategori_ad_dari
       FROM ilanlar i
       LEFT JOIN kategoriler k ON i.kategori_id = k.id
       WHERE i.aktif = TRUE
       ORDER BY i.created_at DESC
       LIMIT ?`,
      [limit]
    );

    return NextResponse.json({
      success: true,
      data: ilanlar
    });
  } catch (error: any) {
    console.error('❌ Son ilanlar hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

