import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Yorumları Getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Yorumları ve kullanıcı bilgilerini çek
    const yorumlar = await query(
      `
      SELECT 
        y.*,
        k.ad as kullanici_ad,
        k.soyad as kullanici_soyad
      FROM magaza_yorumlari y
      LEFT JOIN kullanicilar k ON y.kullanici_id = k.id
      WHERE y.magaza_id = ? AND y.durum = 'onaylandi'
      ORDER BY y.created_at DESC
      `,
      [parseInt(id)]
    );

    // Ortalama puanı hesapla
    const istatistikler: any = await query(
      `
      SELECT 
        COUNT(*) as toplam_yorum,
        COALESCE(AVG(puan), 0) as ortalama_puan,
        SUM(CASE WHEN puan = 5 THEN 1 ELSE 0 END) as bes_yildiz,
        SUM(CASE WHEN puan = 4 THEN 1 ELSE 0 END) as dort_yildiz,
        SUM(CASE WHEN puan = 3 THEN 1 ELSE 0 END) as uc_yildiz,
        SUM(CASE WHEN puan = 2 THEN 1 ELSE 0 END) as iki_yildiz,
        SUM(CASE WHEN puan = 1 THEN 1 ELSE 0 END) as bir_yildiz
      FROM magaza_yorumlari 
      WHERE magaza_id = ? AND durum = 'onaylandi'
      `,
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      data: {
        yorumlar,
        istatistikler: istatistikler[0]
      }
    });

  } catch (error: any) {
    console.error('Yorum getirme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Yorumlar yüklenemedi' },
      { status: 500 }
    );
  }
}

// Yorum Yap
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { kullanici_id, puan, yorum } = body;

    if (!kullanici_id || !puan) {
      return NextResponse.json(
        { success: false, message: 'Eksik bilgi' },
        { status: 400 }
      );
    }

    // Kullanıcı daha önce yorum yapmış mı kontrol et (Opsiyonel - şimdilik kapalı)
    /*
    const mevcutYorum = await query(
      'SELECT id FROM magaza_yorumlari WHERE magaza_id = ? AND kullanici_id = ?',
      [parseInt(id), kullanici_id]
    );

    if (Array.isArray(mevcutYorum) && mevcutYorum.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Bu mağazaya zaten yorum yaptınız' },
        { status: 400 }
      );
    }
    */

    // Yorumu kaydet
    await query(
      `INSERT INTO magaza_yorumlari (magaza_id, kullanici_id, puan, yorum, durum) VALUES (?, ?, ?, ?, 'onaylandi')`,
      [parseInt(id), kullanici_id, puan, yorum]
    );

    return NextResponse.json({
      success: true,
      message: 'Yorumunuz başarıyla eklendi'
    });

  } catch (error: any) {
    console.error('Yorum ekleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Yorum eklenirken hata oluştu' },
      { status: 500 }
    );
  }
}








