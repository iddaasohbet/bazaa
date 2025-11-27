import { NextRequest, NextResponse } from 'next/server';
import { query, testConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';

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
    const { email, sifre } = body;
    console.log('👤 Giriş denemesi:', { email });

    if (!email || !sifre) {
      return NextResponse.json(
        { success: false, message: 'ایمیل و رمز عبور الزامی است' },
        { status: 400 }
      );
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

