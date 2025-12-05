import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST - Yeni mesaj gönder
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ad, email, telefon, konu, mesaj } = body;

    // Validasyon
    if (!ad || !email || !konu || !mesaj) {
      return NextResponse.json(
        { success: false, message: 'لطفا تمام فیلدهای الزامی را پر کنید' },
        { status: 400 }
      );
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'لطفا یک ایمیل معتبر وارد کنید' },
        { status: 400 }
      );
    }

    // Mesaj uzunluğu kontrolü
    if (mesaj.length < 20) {
      return NextResponse.json(
        { success: false, message: 'پیام باید حداقل ۲۰ کاراکتر باشد' },
        { status: 400 }
      );
    }

    // IP adresini al (opsiyonel)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

    // Mesajı kaydet
    const result = await query(
      `INSERT INTO iletisim_mesajlari (ad, email, telefon, konu, mesaj, durum, ip_adresi)
       VALUES (?, ?, ?, ?, ?, 'yeni', ?)`,
      [ad, email, telefon || null, konu, mesaj, ip]
    );

    const mesajId = (result as any).insertId;

    console.log('📬 Yeni iletişim mesajı alındı:', {
      id: mesajId,
      ad,
      email,
      konu
    });

    return NextResponse.json({
      success: true,
      message: 'پیام شما با موفقیت ارسال شد. به زودی با شما تماس می‌گیریم',
      data: { id: mesajId }
    });
  } catch (error: any) {
    console.error('❌ Mesaj gönderme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ارسال پیام. لطفا دوباره تلاش کنید' },
      { status: 500 }
    );
  }
}



