import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'E-posta ve şifre gereklidir' },
        { status: 400 }
      );
    }

    // Kullanıcıyı bul
    const users = await query(
      'SELECT * FROM kullanicilar WHERE email = ? AND rol = "admin" AND aktif = TRUE',
      [email]
    );

    const user: any = Array.isArray(users) && users.length > 0 ? users[0] : null;

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'E-posta veya şifre hatalı' },
        { status: 401 }
      );
    }

    // Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, (user as any).sifre);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'E-posta veya şifre hatalı' },
        { status: 401 }
      );
    }

    // Basit bir token oluştur (production'da JWT kullanılmalı)
    const token = Buffer.from(`${(user as any).id}:${Date.now()}`).toString('base64');

    // Son giriş zamanını güncelle
    await query(
      'UPDATE kullanicilar SET updated_at = NOW() WHERE id = ?',
      [(user as any).id]
    );

    return NextResponse.json({
      success: true,
      message: 'Giriş başarılı',
      token,
      user: {
        id: (user as any).id,
        ad: (user as any).ad,
        email: (user as any).email,
        rol: (user as any).rol
      }
    });
  } catch (error: any) {
    console.error('Admin giriş hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Giriş işlemi sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}



