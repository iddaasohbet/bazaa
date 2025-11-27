import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ad, email, telefon, sifre } = body;

    // Validasyon
    if (!ad || !email || !sifre) {
      return NextResponse.json(
        { success: false, message: 'نام، ایمیل و رمز عبور الزامی است' },
        { status: 400 }
      );
    }

    // Email kontrolü
    const existingUser = await query(
      'SELECT id FROM kullanicilar WHERE email = ?',
      [email]
    );

    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return NextResponse.json(
        { success: false, message: 'این ایمیل قبلاً ثبت شده است' },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(sifre, 10);

    // Kullanıcı oluştur
    const result = await query(
      `INSERT INTO kullanicilar (ad, email, telefon, sifre, rol, aktif) 
       VALUES (?, ?, ?, ?, 'user', TRUE)`,
      [ad, email, telefon, hashedPassword]
    );

    const userId = (result as any).insertId;

    return NextResponse.json({
      success: true,
      message: 'ثبت نام با موفقیت انجام شد',
      data: { id: userId, ad, email }
    });
  } catch (error: any) {
    console.error('❌ Kayıt hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ثبت نام: ' + error.message },
      { status: 500 }
    );
  }
}

