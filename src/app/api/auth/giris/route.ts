import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, sifre } = body;

    if (!email || !sifre) {
      return NextResponse.json(
        { success: false, message: 'ایمیل و رمز عبور الزامی است' },
        { status: 400 }
      );
    }

    // Kullanıcıyı bul
    const users = await query(
      'SELECT * FROM kullanicilar WHERE email = ? AND aktif = TRUE',
      [email]
    );

    const user: any = Array.isArray(users) && users.length > 0 ? users[0] : null;

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'ایمیل یا رمز عبور اشتباه است' },
        { status: 401 }
      );
    }

    // Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(sifre, user.sifre);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'ایمیل یا رمز عبور اشتباه است' },
        { status: 401 }
      );
    }

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
    console.error('❌ Giriş hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ورود: ' + error.message },
      { status: 500 }
    );
  }
}

