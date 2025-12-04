import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  console.log('🔐 Doğrulama isteği alındı...');
  
  try {
    const body = await request.json();
    const { email, kod } = body;
    
    console.log('📧 Email:', email, '🔑 Kod:', kod);

    // Validasyon
    if (!email || !kod) {
      return NextResponse.json(
        { success: false, message: 'ایمیل و کد تایید الزامی است' },
        { status: 400 }
      );
    }

    // Doğrulama kodunu kontrol et
    const verificationData = await query(
      `SELECT * FROM email_dogrulama 
       WHERE email = ? AND kod = ? AND tip = 'kayit' AND kullanildi = FALSE 
       AND son_kullanma_tarihi > NOW()
       ORDER BY olusturma_tarihi DESC LIMIT 1`,
      [email, kod]
    );

    if (!Array.isArray(verificationData) || verificationData.length === 0) {
      console.log('⚠️ Geçersiz veya süresi dolmuş kod');
      return NextResponse.json(
        { success: false, message: 'کد تایید نامعتبر یا منقضی شده است' },
        { status: 400 }
      );
    }

    const data = verificationData[0] as any;
    console.log('✅ Kod doğrulandı, kullanıcı oluşturuluyor...');

    // Kullanıcı oluştur
    const result = await query(
      `INSERT INTO kullanicilar (ad, email, telefon, sifre, rol, aktif, email_verified) 
       VALUES (?, ?, ?, ?, 'user', TRUE, TRUE)`,
      [data.ad, data.email, data.telefon, data.sifre_hash]
    );

    const userId = (result as any).insertId;
    console.log('✅ Kullanıcı kaydedildi, ID:', userId);

    // Doğrulama kodunu kullanılmış olarak işaretle
    await query(
      'UPDATE email_dogrulama SET kullanildi = TRUE WHERE id = ?',
      [data.id]
    );

    return NextResponse.json({
      success: true,
      message: 'ثبت نام با موفقیت انجام شد!',
      data: { id: userId, ad: data.ad, email: data.email }
    });
  } catch (error: any) {
    console.error('❌ Doğrulama hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در تایید: ' + error.message },
      { status: 500 }
    );
  }
}

