import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Kullanıcıları listele
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const rol = searchParams.get('rol');

    let sql = `
      SELECT 
        id, ad, email, telefon, rol, profil_resmi, aktif, created_at
      FROM kullanicilar
      WHERE 1=1
    `;

    const params: any[] = [];

    if (rol) {
      sql += ' AND rol = ?';
      params.push(rol);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const kullanicilar = await query(sql, params);

    // Toplam sayı
    const countResult = await query(
      'SELECT COUNT(*) as total FROM kullanicilar' + (rol ? ' WHERE rol = ?' : ''),
      rol ? [rol] : []
    ) as any[];
    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: kullanicilar,
      total,
      limit,
      offset
    });
  } catch (error: any) {
    console.error('❌ Kullanıcılar listesi hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت لیست کاربران', error: error.message },
      { status: 500 }
    );
  }
}

// Yeni kullanıcı oluştur
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ad, email, telefon, sifre, rol, profil_resmi, aktif = true } = body;

    console.log('📝 Yeni kullanıcı oluşturuluyor:', { ad, email, rol });

    // Validasyon
    if (!ad || !email || !sifre) {
      return NextResponse.json(
        { success: false, message: 'نام، ایمیل و رمز عبور الزامی است' },
        { status: 400 }
      );
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'فرمت ایمیل نامعتبر است' },
        { status: 400 }
      );
    }

    // Şifre uzunluğu kontrolü
    if (sifre.length < 6) {
      return NextResponse.json(
        { success: false, message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' },
        { status: 400 }
      );
    }

    // Email benzersizliği kontrolü
    const existingUser = await query(
      'SELECT id FROM kullanicilar WHERE email = ?',
      [email]
    ) as any[];

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, message: 'این ایمیل قبلاً ثبت شده است' },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(sifre, 10);

    // Kullanıcıyı oluştur
    const result = await query(
      `INSERT INTO kullanicilar (ad, email, telefon, sifre, rol, profil_resmi, aktif) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [ad, email, telefon || null, hashedPassword, rol || 'user', profil_resmi || null, aktif ? 1 : 0]
    );

    const kullaniciId = (result as any).insertId;
    console.log('✅ Kullanıcı oluşturuldu, ID:', kullaniciId);

    return NextResponse.json({
      success: true,
      message: 'کاربر با موفقیت ایجاد شد',
      data: { id: kullaniciId }
    });
  } catch (error: any) {
    console.error('❌ Kullanıcı oluşturma hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ایجاد کاربر: ' + error.message },
      { status: 500 }
    );
  }
}

// Kullanıcı güncelle
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ad, email, telefon, rol, profil_resmi, aktif, yeni_sifre } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه کاربر الزامی است' },
        { status: 400 }
      );
    }

    // Email benzersizliği kontrolü (kendisi hariç)
    if (email) {
      const existingUser = await query(
        'SELECT id FROM kullanicilar WHERE email = ? AND id != ?',
        [email, id]
      ) as any[];

      if (existingUser.length > 0) {
        return NextResponse.json(
          { success: false, message: 'این ایمیل توسط کاربر دیگری استفاده می‌شود' },
          { status: 400 }
        );
      }
    }

    // Şifre değişikliği varsa hashle
    let updateQuery = `
      UPDATE kullanicilar SET 
        ad = ?, email = ?, telefon = ?, rol = ?, profil_resmi = ?, aktif = ?
    `;
    let params: any[] = [ad, email, telefon || null, rol, profil_resmi || null, aktif ? 1 : 0];

    if (yeni_sifre && yeni_sifre.length >= 6) {
      const hashedPassword = await bcrypt.hash(yeni_sifre, 10);
      updateQuery += ', sifre = ?';
      params.push(hashedPassword);
    }

    updateQuery += ', updated_at = NOW() WHERE id = ?';
    params.push(id);

    await query(updateQuery, params);

    return NextResponse.json({
      success: true,
      message: 'کاربر با موفقیت به‌روزرسانی شد'
    });
  } catch (error: any) {
    console.error('❌ Kullanıcı güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در به‌روزرسانی کاربر: ' + error.message },
      { status: 500 }
    );
  }
}

// Kullanıcı sil
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه کاربر الزامی است' },
        { status: 400 }
      );
    }

    // Admin kullanıcısını silmeyi engelle (ID 1)
    if (id === '1') {
      return NextResponse.json(
        { success: false, message: 'نمی‌توانید کاربر اصلی مدیر را حذف کنید' },
        { status: 403 }
      );
    }

    await query('DELETE FROM kullanicilar WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'کاربر با موفقیت حذف شد'
    });
  } catch (error: any) {
    console.error('❌ Kullanıcı silme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در حذف کاربر: ' + error.message },
      { status: 500 }
    );
  }
}

















