import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - İletişim ayarlarını getir (Admin)
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

    const ayarlar = await query(
      'SELECT * FROM iletisim_ayarlari ORDER BY id DESC LIMIT 1',
      []
    ) as any[];

    if (ayarlar.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'İletişim ayarları bulunamadı'
      }, { status: 404 });
    }

    const ayar = ayarlar[0];

    // JSON alanlarını parse et
    const data = {
      ...ayar,
      calisma_saatleri: ayar.calisma_saatleri ? JSON.parse(ayar.calisma_saatleri) : [],
      sosyal_medya: ayar.sosyal_medya ? JSON.parse(ayar.sosyal_medya) : {},
      istatistikler: ayar.istatistikler ? JSON.parse(ayar.istatistikler) : {}
    };

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error: any) {
    console.error('❌ İletişim ayarları hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT - İletişim ayarlarını güncelle (Admin)
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
    const { 
      telefon, 
      telefon2, 
      email, 
      email2, 
      adres_tr, 
      adres_dari,
      calisma_saatleri,
      sosyal_medya,
      harita_embed,
      istatistikler
    } = body;

    // JSON alanlarını stringify et
    const calismaStr = calisma_saatleri ? JSON.stringify(calisma_saatleri) : null;
    const sosyalStr = sosyal_medya ? JSON.stringify(sosyal_medya) : null;
    const istatistiklerStr = istatistikler ? JSON.stringify(istatistikler) : null;

    // Güncelle veya ekle
    await query(
      `INSERT INTO iletisim_ayarlari (id, telefon, telefon2, email, email2, adres_tr, adres_dari, calisma_saatleri, sosyal_medya, harita_embed, istatistikler)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         telefon = ?,
         telefon2 = ?,
         email = ?,
         email2 = ?,
         adres_tr = ?,
         adres_dari = ?,
         calisma_saatleri = ?,
         sosyal_medya = ?,
         harita_embed = ?,
         istatistikler = ?`,
      [
        telefon, telefon2, email, email2, adres_tr, adres_dari, calismaStr, sosyalStr, harita_embed, istatistiklerStr,
        telefon, telefon2, email, email2, adres_tr, adres_dari, calismaStr, sosyalStr, harita_embed, istatistiklerStr
      ]
    );

    console.log('✅ İletişim ayarları güncellendi');

    return NextResponse.json({
      success: true,
      message: 'تنظیمات با موفقیت به‌روزرسانی شد'
    });
  } catch (error: any) {
    console.error('❌ İletişim ayarları güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

