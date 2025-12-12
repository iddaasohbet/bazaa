import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Ödeme oluşturma
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      kullanici_id,
      odeme_turu,
      iliskili_id,
      tutar,
      para_birimi = 'AFN',
      odeme_yontemi,
      aciklama
    } = body;

    // Gerekli alanları kontrol et
    if (!kullanici_id || !odeme_turu || !tutar) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı ID, ödeme türü ve tutar gereklidir' },
        { status: 400 }
      );
    }

    // Ödeme kaydı oluştur
    const result = await query(
      `INSERT INTO odemeler 
       (kullanici_id, odeme_turu, iliskili_id, tutar, para_birimi, odeme_yontemi, odeme_durumu, aciklama) 
       VALUES (?, ?, ?, ?, ?, ?, 'beklemede', ?)`,
      [kullanici_id, odeme_turu, iliskili_id, tutar, para_birimi, odeme_yontemi, aciklama]
    );

    const odemeId = (result as any).insertId;

    return NextResponse.json({
      success: true,
      message: 'Ödeme kaydı oluşturuldu',
      data: { 
        id: odemeId,
        odeme_durumu: 'beklemede'
      }
    });
  } catch (error: any) {
    console.error('Ödeme oluşturma hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Ödeme oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
}

// Ödeme listesi (kullanıcıya göre)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const kullaniciId = searchParams.get('kullanici_id');

    if (!kullaniciId) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı ID gereklidir' },
        { status: 400 }
      );
    }

    const odemeler = await query(
      `
      SELECT 
        id,
        odeme_turu,
        iliskili_id,
        tutar,
        para_birimi,
        odeme_yontemi,
        odeme_durumu,
        transaction_id,
        aciklama,
        created_at
      FROM odemeler
      WHERE kullanici_id = ?
      ORDER BY created_at DESC
      LIMIT 50
      `,
      [parseInt(kullaniciId)]
    );

    return NextResponse.json({
      success: true,
      data: odemeler
    });
  } catch (error: any) {
    console.error('Ödeme listesi hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Ödemeler yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}



