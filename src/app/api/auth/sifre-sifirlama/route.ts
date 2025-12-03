import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Rastgele 6 haneli kod oluştur
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'لطفا ایمیل خود را وارد کنید' },
        { status: 400 }
      );
    }

    // Kullanıcıyı kontrol et
    const users = await query(
      'SELECT id, email, ad FROM kullanicilar WHERE email = ?',
      [email]
    ) as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'این ایمیل ثبت نشده است' },
        { status: 404 }
      );
    }

    const user = users[0];

    // 6 haneli kod oluştur
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 dakika geçerli

    // Kodu database'e kaydet
    await query(
      `INSERT INTO sifre_sifirlama_kodlari (kullanici_id, kod, expires_at, kullanildi) 
       VALUES (?, ?, ?, FALSE)
       ON DUPLICATE KEY UPDATE kod = ?, expires_at = ?, kullanildi = FALSE`,
      [user.id, code, expiresAt, code, expiresAt]
    );

    // TODO: Email gönderimi (şimdilik console'a yazdır)
    console.log('🔐 Şifre Sıfırlama Kodu:', {
      email: user.email,
      ad: user.ad,
      kod: code,
      gecerlilik: '15 dakika'
    });

    // Geliştirme ortamında kodu response'da gönder
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        success: true,
        message: 'کد تایید ارسال شد',
        dev_code: code // Sadece development'ta
      });
    }

    return NextResponse.json({
      success: true,
      message: 'کد تایید به ایمیل شما ارسال شد'
    });
  } catch (error: any) {
    console.error('❌ Şifre sıfırlama hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ارسال کد تایید' },
      { status: 500 }
    );
  }
}

