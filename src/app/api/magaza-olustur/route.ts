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
      store_level,
      odeme_bilgisi
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

    // Slug oluştur - Unique olması için timestamp ekle
    const baseSlug = magaza_ad.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
    const slug = `${baseSlug}-${Date.now()}`;

    // Paket tarihleri ve onay durumu
    let paket_baslangic = new Date(); // Hemen başlat
    let paket_bitis = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 yıl
    let finalStoreLevel = store_level || 'basic';
    let onay_durumu = 'onaylandi'; // Otomatik onaylı

    if (paket) {
      finalStoreLevel = paket.store_level;
      
      // Paket süresini belirle
      if (paket.sure_gun) {
        paket_bitis = new Date(Date.now() + paket.sure_gun * 24 * 60 * 60 * 1000);
      }
    }

    // Mağaza oluştur - HER PAKET OTOMATIK AKTİF
    const result = await query(
      `INSERT INTO magazalar 
       (kullanici_id, ad, ad_dari, slug, aciklama, adres, telefon, il_id, 
        logo, kapak_resmi, store_level, paket_baslangic, paket_bitis, aktif, onay_durumu) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?)`,
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
        paket_bitis,
        onay_durumu
      ]
    );

    const magazaId = (result as any).insertId;
    console.log('✅ Mağaza oluşturuldu, ID:', magazaId);

    // Eğer ücretli paket ise ödeme kaydı oluştur
    if (paket && paket.fiyat > 0) {
      let odemeAciklama = `${paket.ad} - مغازه: ${magaza_ad_dari}`;
      
      // Ödeme bilgisi varsa ekle
      if (odeme_bilgisi) {
        odemeAciklama += `\n\nاطلاعات پرداخت:\n`;
        odemeAciklama += `نام: ${odeme_bilgisi.ad_soyad || '-'}\n`;
        odemeAciklama += `تلفن: ${odeme_bilgisi.telefon || '-'}\n`;
        odemeAciklama += `زمان تراکنش: ${odeme_bilgisi.islem_saati || '-'}\n`;
        odemeAciklama += `شماره رسید: ${odeme_bilgisi.dekont_no || '-'}\n`;
        if (odeme_bilgisi.notlar) {
          odemeAciklama += `یادداشت: ${odeme_bilgisi.notlar}\n`;
        }
      }
      
      await query(
        `INSERT INTO odemeler 
         (kullanici_id, odeme_turu, iliskili_id, tutar, odeme_durumu, aciklama) 
         VALUES (?, 'paket', ?, ?, 'beklemede', ?)`,
        [
          kullaniciId,
          paket_id,
          paket.fiyat,
          odemeAciklama
        ]
      );
      
      console.log('✅ Ödeme kaydı oluşturuldu');
    }

    return NextResponse.json({
      success: true,
      message: 'مغازه شما با موفقیت ایجاد و فعال شد!',
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



