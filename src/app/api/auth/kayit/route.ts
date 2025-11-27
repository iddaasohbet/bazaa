import { NextRequest, NextResponse } from 'next/server';
import { query, testConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  console.log('📝 Kayıt isteği alındı...');
  
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
    const { ad, email, telefon, sifre } = body;
    console.log('👤 Kayıt bilgileri:', { ad, email, telefon });

    // Validasyon
    if (!ad || !email || !sifre) {
      return NextResponse.json(
        { success: false, message: 'نام، ایمیل و رمز عبور الزامی است' },
        { status: 400 }
      );
    }

    // Email kontrolü
    console.log('🔍 Email kontrol ediliyor...');
    const existingUser = await query(
      'SELECT id FROM kullanicilar WHERE email = ?',
      [email]
    );

    if (Array.isArray(existingUser) && existingUser.length > 0) {
      console.log('⚠️ Email zaten kayıtlı');
      return NextResponse.json(
        { success: false, message: 'این ایمیل قبلاً ثبت شده است' },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(sifre, 10);

    // Kullanıcı oluştur
    console.log('💾 Kullanıcı kaydediliyor...');
    const result = await query(
      `INSERT INTO kullanicilar (ad, email, telefon, sifre, rol, aktif) 
       VALUES (?, ?, ?, ?, 'user', TRUE)`,
      [ad, email, telefon, hashedPassword]
    );

    const userId = (result as any).insertId;
    console.log('✅ Kullanıcı kaydedildi, ID:', userId);

    return NextResponse.json({
      success: true,
      message: 'ثبت نام با موفقیت انجام شد',
      data: { id: userId, ad, email }
    });
  } catch (error: any) {
    console.error('❌ Kayıt işlemi hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ثبت نام: ' + error.message },
      { status: 500 }
    );
  }
}

