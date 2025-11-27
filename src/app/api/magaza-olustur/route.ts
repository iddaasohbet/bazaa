import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Kullanıcı ID'sini header'dan al
    const kullaniciId = request.headers.get('x-user-id');
    
    if (!kullaniciId) {
      return NextResponse.json(
        { success: false, message: 'لطفاً وارد شوید' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      magaza_ad,
      magaza_ad_dari,
      aciklama,
      adres,
      telefon,
      il_id,
      paket_id,
      logo,
      kapak_resmi,
      store_level
    } = body;

    console.log('🏪 Mağaza oluşturuluyor:', { kullaniciId, magaza_ad, magaza_ad_dari });

    // Validasyon
    if (!magaza_ad || !magaza_ad_dari) {
      return NextResponse.json(
        { success: false, message: 'نام مغازه الزامی است' },
        { status: 400 }
      );
    }

    // Paket bilgilerini al
    const paketData = await query(
      'SELECT * FROM paketler WHERE id = ?',
      [paket_id]
    );
    const paket: any = Array.isArray(paketData) && paketData.length > 0 ? paketData[0] : null;

    // Slug oluştur
    const slug = magaza_ad.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');

    // Paket tarihleri
    let paket_baslangic = null;
    let paket_bitis = null;
    let finalStoreLevel = store_level || 'basic';

    if (paket) {
      finalStoreLevel = paket.store_level;
      if (paket.fiyat > 0) {
        // Ücretli paket - admin onayından sonra aktif olacak
        paket_baslangic = null;
        paket_bitis = null;
      } else {
        // Ücretsiz paket - hemen aktif
        paket_baslangic = new Date();
        paket_bitis = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 yıl
      }
    }

    // Mağaza oluştur
    const result = await query(
      `INSERT INTO magazalar 
       (kullanici_id, ad, ad_dari, slug, aciklama, adres, telefon, il_id, 
        logo, kapak_resmi, store_level, paket_baslangic, paket_bitis, aktif, onay_durumu) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, 'beklemede')`,
      [
        kullaniciId,
        magaza_ad,
        magaza_ad_dari,
        slug,
        aciklama || '',
        adres || '',
        telefon || null,
        il_id || null,
        logo || null,
        kapak_resmi || null,
        finalStoreLevel,
        paket_baslangic,
        paket_bitis
      ]
    );

    const magazaId = (result as any).insertId;
    console.log('✅ Mağaza oluşturuldu, ID:', magazaId);

    // Eğer ücretli paket ise ödeme kaydı oluştur
    if (paket && paket.fiyat > 0) {
      await query(
        `INSERT INTO odemeler 
         (kullanici_id, odeme_turu, iliskili_id, tutar, odeme_durumu, aciklama) 
         VALUES (?, 'paket', ?, ?, 'beklemede', ?)`,
        [
          kullaniciId,
          paket_id,
          paket.fiyat,
          `${paket.ad} - مغازه: ${magaza_ad_dari}`
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'مغازه با موفقیت ایجاد شد و در انتظار تأیید است',
      data: { id: magazaId, slug }
    });
  } catch (error: any) {
    console.error('❌ Mağaza oluşturma hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ایجاد مغازه: ' + error.message },
      { status: 500 }
    );
  }
}



