import { NextRequest, NextResponse } from 'next/server';
import { query, testConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';

// reCAPTCHA doğrulama fonksiyonu
async function verifyCaptcha(token: string): Promise<boolean> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error('❌ RECAPTCHA_SECRET_KEY tanımlı değil!');
      return false;
    }

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('❌ reCAPTCHA doğrulama hatası:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  console.log('🔑 Giriş isteği alındı...');

  try {
    // Database bağlantısını test et
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Database bağlantı hatası!');
      return NextResponse.json(
        { success: false, message: 'خطا در اتصال به پایگاه داده' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, sifre, captchaToken } = body;
    console.log('👤 Giriş denemesi:', { email });

    if (!email || !sifre) {
      return NextResponse.json(
        { success: false, message: 'ایمیل و رمز عبور الزامی است' },
        { status: 400 }
      );
    }

    // reCAPTCHA doğrulaması (production'da zorunlu, development'ta opsiyonel)
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      if (!captchaToken) {
        return NextResponse.json(
          { success: false, message: 'لطفا تأیید کنید که ربات نیستید' },
          { status: 400 }
        );
      }

      const isCaptchaValid = await verifyCaptcha(captchaToken);
      if (!isCaptchaValid) {
        console.log('⚠️ reCAPTCHA doğrulaması başarısız');
        return NextResponse.json(
          { success: false, message: 'تأیید امنیتی ناموفق بود. لطفا دوباره تلاش کنید' },
          { status: 400 }
        );
      }
      console.log('✅ reCAPTCHA doğrulandı');
    } else {
      console.log('⚠️ Development modunda reCAPTCHA atlandı');
    }

    // Kullanıcıyı bul
    console.log('🔍 Kullanıcı aranıyor...');
    const users = await query(
      'SELECT * FROM kullanicilar WHERE email = ? AND aktif = TRUE',
      [email]
    );

    const user: any = Array.isArray(users) && users.length > 0 ? users[0] : null;

    if (!user) {
      console.log('⚠️ Kullanıcı bulunamadı');
      return NextResponse.json(
        { success: false, message: 'ایمیل یا رمز عبور اشتباه است' },
        { status: 401 }
      );
    }

    // Şifreyi kontrol et
    console.log('🔐 Şifre kontrol ediliyor...');
    const isPasswordValid = await bcrypt.compare(sifre, user.sifre);

    if (!isPasswordValid) {
      console.log('⚠️ Şifre hatalı');
      return NextResponse.json(
        { success: false, message: 'ایمیل یا رمز عبور اشتباه است' },
        { status: 401 }
      );
    }

    console.log('✅ Giriş başarılı, kullanıcı ID:', user.id);

    // Token oluştur (basit - production'da JWT kullan)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      success: true,
      message: 'ورود موفقیت‌آمیز بود',
      token,
      user: {
        id: user.id,
        ad: user.ad,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error: any) {
    console.error('❌ Giriş işlemi hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ورود: ' + error.message },
      { status: 500 }
    );
  }
}

