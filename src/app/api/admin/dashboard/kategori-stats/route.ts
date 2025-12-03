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

    // En popüler kategorileri çek
    const kategoriler = await query(
      `SELECT 
        k.ad as kategori_ad,
        k.ad_dari as kategori_ad_dari,
        COUNT(i.id) as ilan_sayisi
       FROM kategoriler k
       LEFT JOIN ilanlar i ON k.id = i.kategori_id AND i.aktif = TRUE
       WHERE k.aktif = TRUE
       GROUP BY k.id
       ORDER BY ilan_sayisi DESC
       LIMIT 3`,
      []
    );

    return NextResponse.json({
      success: true,
      data: kategoriler
    });
  } catch (error: any) {
    console.error('❌ Kategori stats hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

