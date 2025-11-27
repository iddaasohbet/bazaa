import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Kullanıcı bilgilerini getir
export async function GET(request: NextRequest) {
  try {
    const kullaniciId = request.headers.get('x-user-id');
    
    if (!kullaniciId) {
      return NextResponse.json(
        { success: false, message: 'لطفاً وارد شوید' },
        { status: 401 }
      );
    }

    const users = await query(
      'SELECT id, ad, email, telefon, adres, il, ilce, rol FROM kullanicilar WHERE id = ?',
      [kullaniciId]
    );

    const user = Array.isArray(users) && users.length > 0 ? users[0] : null;

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    console.error('❌ Kullanıcı bilgisi getirme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت اطلاعات کاربر' },
      { status: 500 }
    );
  }
}

// Kullanıcı bilgilerini güncelle
export async function PUT(request: NextRequest) {
  try {
    const kullaniciId = request.headers.get('x-user-id');
    
    if (!kullaniciId) {
      return NextResponse.json(
        { success: false, message: 'لطفاً وارد شوید' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { ad, telefon, adres, il, ilce, eskiSifre, yeniSifre } = body;

    // Temel bilgileri güncelle
    if (ad || telefon || adres || il || ilce) {
      const updates: string[] = [];
      const values: any[] = [];

      if (ad) {
        updates.push('ad = ?');
        values.push(ad);
      }
      if (telefon) {
        updates.push('telefon = ?');
        values.push(telefon);
      }
      if (adres) {
        updates.push('adres = ?');
        values.push(adres);
      }
      if (il) {
        updates.push('il = ?');
        values.push(il);
      }
      if (ilce) {
        updates.push('ilce = ?');
        values.push(ilce);
      }

      if (updates.length > 0) {
        values.push(kullaniciId);
        await query(
          `UPDATE kullanicilar SET ${updates.join(', ')} WHERE id = ?`,
          values
        );
      }
    }

    // Şifre güncellemesi
    if (eskiSifre && yeniSifre) {
      const users = await query(
        'SELECT sifre FROM kullanicilar WHERE id = ?',
        [kullaniciId]
      );

      const user: any = Array.isArray(users) && users.length > 0 ? users[0] : null;

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'کاربر یافت نشد' },
          { status: 404 }
        );
      }

      const isPasswordValid = await bcrypt.compare(eskiSifre, user.sifre);

      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: 'رمز عبور فعلی اشتباه است' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(yeniSifre, 10);
      await query(
        'UPDATE kullanicilar SET sifre = ? WHERE id = ?',
        [hashedPassword, kullaniciId]
      );
    }

    // Güncellenmiş kullanıcı bilgilerini getir
    const updatedUsers = await query(
      'SELECT id, ad, email, telefon, adres, il, ilce, rol FROM kullanicilar WHERE id = ?',
      [kullaniciId]
    );

    const updatedUser = Array.isArray(updatedUsers) && updatedUsers.length > 0 
      ? updatedUsers[0] 
      : null;

    return NextResponse.json({
      success: true,
      message: 'اطلاعات با موفقیت به‌روزرسانی شد',
      data: updatedUser
    });
  } catch (error: any) {
    console.error('❌ Kullanıcı güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در به‌روزرسانی اطلاعات' },
      { status: 500 }
    );
  }
}

