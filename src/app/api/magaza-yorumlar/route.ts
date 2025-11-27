import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Yorumları getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const magazaId = searchParams.get('magaza_id');

    if (!magazaId) {
      return NextResponse.json(
        { success: false, message: 'Mağaza ID gerekli' },
        { status: 400 }
      );
    }

    const yorumlar = await query(
      `
      SELECT 
        my.id,
        my.yorum,
        my.puan,
        my.created_at,
        k.id as kullanici_id,
        k.ad as kullanici_ad,
        k.profil_resmi
      FROM magaza_yorumlar my
      JOIN kullanicilar k ON my.kullanici_id = k.id
      WHERE my.magaza_id = ? 
        AND my.aktif = TRUE 
        AND my.onaylandi = TRUE
      ORDER BY my.created_at DESC
      `,
      [parseInt(magazaId)]
    );

    // Mağaza istatistiklerini getir
    const statsResult: any = await query(
      `
      SELECT 
        COALESCE(AVG(puan), 0) as ortalama_puan,
        COUNT(*) as toplam_yorum,
        SUM(CASE WHEN puan = 5 THEN 1 ELSE 0 END) as puan_5,
        SUM(CASE WHEN puan = 4 THEN 1 ELSE 0 END) as puan_4,
        SUM(CASE WHEN puan = 3 THEN 1 ELSE 0 END) as puan_3,
        SUM(CASE WHEN puan = 2 THEN 1 ELSE 0 END) as puan_2,
        SUM(CASE WHEN puan = 1 THEN 1 ELSE 0 END) as puan_1
      FROM magaza_yorumlar
      WHERE magaza_id = ? AND aktif = TRUE AND onaylandi = TRUE
      `,
      [parseInt(magazaId)]
    );

    const stats = statsResult[0] || {
      ortalama_puan: 0,
      toplam_yorum: 0,
      puan_5: 0,
      puan_4: 0,
      puan_3: 0,
      puan_2: 0,
      puan_1: 0
    };

    return NextResponse.json({
      success: true,
      data: {
        yorumlar,
        stats: {
          ortalama_puan: parseFloat(stats.ortalama_puan).toFixed(1),
          toplam_yorum: stats.toplam_yorum,
          dagilim: {
            5: stats.puan_5,
            4: stats.puan_4,
            3: stats.puan_3,
            2: stats.puan_2,
            1: stats.puan_1
          }
        }
      }
    });
  } catch (error: any) {
    console.error('❌ Yorumlar yüklenirken hata:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در بارگذاری نظرات', data: { yorumlar: [], stats: null } },
      { status: 200 }
    );
  }
}

// Yeni yorum ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { magaza_id, kullanici_id, yorum, puan } = body;

    // Validasyon
    if (!magaza_id || !kullanici_id || !yorum || !puan) {
      return NextResponse.json(
        { success: false, message: 'تمام فیلدها الزامی است' },
        { status: 400 }
      );
    }

    if (puan < 1 || puan > 5) {
      return NextResponse.json(
        { success: false, message: 'امتیاز باید بین ۱ تا ۵ باشد' },
        { status: 400 }
      );
    }

    if (yorum.trim().length < 10) {
      return NextResponse.json(
        { success: false, message: 'نظر باید حداقل ۱۰ کاراکتر باشد' },
        { status: 400 }
      );
    }

    // Kullanıcı daha önce yorum yapmış mı kontrol et
    const mevcutYorum: any = await query(
      'SELECT id FROM magaza_yorumlar WHERE magaza_id = ? AND kullanici_id = ? AND aktif = TRUE',
      [magaza_id, kullanici_id]
    );

    if (Array.isArray(mevcutYorum) && mevcutYorum.length > 0) {
      return NextResponse.json(
        { success: false, message: 'شما قبلاً برای این مغازه نظر گذاشته‌اید' },
        { status: 400 }
      );
    }

    // Yorum ekle (onay bekliyor)
    const result: any = await query(
      `
      INSERT INTO magaza_yorumlar (magaza_id, kullanici_id, yorum, puan, onaylandi)
      VALUES (?, ?, ?, ?, ?)
      `,
      [magaza_id, kullanici_id, yorum, puan, true] // true = otomatik onay
    );

    return NextResponse.json({
      success: true,
      message: 'نظر شما با موفقیت ثبت شد',
      data: {
        id: result.insertId
      }
    });
  } catch (error: any) {
    console.error('❌ Yorum eklenirken hata:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ثبت نظر' },
      { status: 500 }
    );
  }
}

