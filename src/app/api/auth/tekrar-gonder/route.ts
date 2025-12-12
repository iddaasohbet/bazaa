import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generateVerificationCode, sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  console.log('🔄 Kod tekrar gönderme isteği...');
  
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'ایمیل الزامی است' },
        { status: 400 }
      );
    }

    // Mevcut doğrulama kaydını kontrol et
    const existingData = await query(
      `SELECT ad FROM email_dogrulama 
       WHERE email = ? AND tip = 'kayit' 
       ORDER BY olusturma_tarihi DESC LIMIT 1`,
      [email]
    );

    if (!Array.isArray(existingData) || existingData.length === 0) {
      return NextResponse.json(
        { success: false, message: 'درخواست ثبت نام یافت نشد' },
        { status: 400 }
      );
    }

    const userData = existingData[0] as any;

    // Yeni kod oluştur
    const newCode = generateVerificationCode();
    console.log('🔑 Yeni kod oluşturuldu:', newCode);

    // Eski kodları güncelle
    await query(
      `UPDATE email_dogrulama 
       SET kod = ?, son_kullanma_tarihi = DATE_ADD(NOW(), INTERVAL 10 MINUTE), kullanildi = FALSE
       WHERE email = ? AND tip = 'kayit'`,
      [newCode, email]
    );

    // Email gönder
    const emailSent = await sendVerificationEmail(email, newCode, userData.ad);

    if (!emailSent) {
      return NextResponse.json(
        { success: false, message: 'خطا در ارسال ایمیل' },
        { status: 500 }
      );
    }

    console.log('✅ Yeni kod gönderildi');

    return NextResponse.json({
      success: true,
      message: 'کد تایید جدید ارسال شد'
    });
  } catch (error: any) {
    console.error('❌ Tekrar gönderme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا: ' + error.message },
      { status: 500 }
    );
  }
}


