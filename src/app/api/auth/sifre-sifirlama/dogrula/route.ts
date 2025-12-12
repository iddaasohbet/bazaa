import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, kod, yeniSifre } = await request.json();

    if (!email || !kod || !yeniSifre) {
      return NextResponse.json(
        { success: false, message: 'لطفا تمام فیلدها را پر کنید' },
        { status: 400 }
      );
    }

    if (yeniSifre.length < 6) {
      return NextResponse.json(
        { success: false, message: 'رمز عبور باید حداقل 6 کاراکتر باشد' },
        { status: 400 }
      );
    }

    // Kullanıcıyı bul
    const users = await query(
      'SELECT id FROM kullanicilar WHERE email = ?',
      [email]
    ) as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }

    const user = users[0];

    // Kodu kontrol et
    const codes = await query(
      `SELECT id, kod, expires_at, kullanildi 
       FROM sifre_sifirlama_kodlari 
       WHERE kullanici_id = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [user.id]
    ) as any[];

    if (codes.length === 0) {
      return NextResponse.json(
        { success: false, message: 'کد تایید یافت نشد. لطفا دوباره درخواست دهید' },
        { status: 404 }
      );
    }

    const codeRecord = codes[0];

    // Kodun kullanılıp kullanılmadığını kontrol et
    if (codeRecord.kullanildi) {
      return NextResponse.json(
        { success: false, message: 'این کد قبلا استفاده شده است' },
        { status: 400 }
      );
    }

    // Kodun süresini kontrol et
    const now = new Date();
    const expiresAt = new Date(codeRecord.expires_at);
    
    if (now > expiresAt) {
      return NextResponse.json(
        { success: false, message: 'کد تایید منقضی شده است. لطفا دوباره درخواست دهید' },
        { status: 400 }
      );
    }

    // Kodu doğrula
    if (codeRecord.kod !== kod) {
      return NextResponse.json(
        { success: false, message: 'کد تایید اشتباه است' },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(yeniSifre, 10);

    // Şifreyi güncelle
    await query(
      'UPDATE kullanicilar SET sifre = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, user.id]
    );

    // Kodu kullanıldı olarak işaretle
    await query(
      'UPDATE sifre_sifirlama_kodlari SET kullanildi = TRUE WHERE id = ?',
      [codeRecord.id]
    );

    console.log('✅ Şifre başarıyla sıfırlandı - Kullanıcı ID:', user.id);

    return NextResponse.json({
      success: true,
      message: 'رمز عبور با موفقیت تغییر یافت'
    });
  } catch (error: any) {
    console.error('❌ Şifre sıfırlama doğrulama hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در تغییر رمز عبور' },
      { status: 500 }
    );
  }
}



