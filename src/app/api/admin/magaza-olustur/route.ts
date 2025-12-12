import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📥 Admin Mağaza Oluştur - Gelen data:', body);
    
    const {
      kullanici_id,
      magaza_adi,
      aciklama,
      adres,
      telefon,
      logo,
      kapak_resmi,
      paket_id,
      ucretsiz,
      aktif
    } = body;
    
    console.log('👤 Kullanıcı ID:', kullanici_id);
    console.log('🏪 Mağaza Adı:', magaza_adi);
    console.log('📦 Paket ID:', paket_id);
    
    if (!kullanici_id || !magaza_adi) {
      console.log('❌ Validasyon hatası: Kullanıcı veya mağaza adı eksik');
      return NextResponse.json({
        success: false,
        message: 'کاربر و نام مغازه ضروری است'
      }, { status: 400 });
    }
    
    // Admin panelde kontrol yok - admin istediği kadar mağaza oluşturabilir
    console.log('✅ Admin mağaza oluşturuyor - kontrol atlandı');
    
    // Slug oluştur (benzersiz olmalı)
    const slug = magaza_adi
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Date.now();
    
    console.log('🔗 Slug oluşturuldu:', slug);
    
    // Mağazayı oluştur (email sütunu yok, query() kullan)
    const result = await query(
      `INSERT INTO magazalar (
        kullanici_id, 
        ad,
        ad_dari,
        slug,
        aciklama, 
        adres, 
        telefon, 
        logo, 
        kapak_resmi,
        aktif,
        onay_durumu
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        kullanici_id,
        magaza_adi,
        magaza_adi, // ad_dari aynı olsun
        slug,
        aciklama || '',
        adres || '',
        telefon || '',
        logo || null,
        kapak_resmi || null,
        aktif ? 1 : 0,
        'onaylandi' // Admin oluşturduğu için direkt onaylı
      ]
    );
    
    console.log('✅ Mağaza oluşturuldu, ID:', (result as any).insertId);
    
    const magazaId = (result as any).insertId;
    
    // Eğer paket seçildiyse, paket ataması ve store_level güncellemesi yap
    if (paket_id) {
      // Paket bilgilerini al
      const paketler = await query(
        'SELECT * FROM paketler WHERE id = ?',
        [paket_id]
      ) as any[];
      
      if (paketler.length > 0) {
        const paket = paketler[0];
        console.log('📦 Paket bilgisi:', paket);
        
        // Store level'i güncelle
        if (paket.store_level) {
          await query(
            'UPDATE magazalar SET store_level = ?, paket_baslangic = NOW(), paket_bitis = DATE_ADD(NOW(), INTERVAL ? DAY) WHERE id = ?',
            [paket.store_level, (paket.sure_ay * 30 || 30), magazaId]
          );
          console.log('✅ Store level güncellendi:', paket.store_level);
        }
        
        // Ödeme kaydı oluştur (doğru tablo yapısı)
        await query(
          `INSERT INTO odemeler (
            kullanici_id,
            odeme_turu,
            iliskili_id,
            tutar,
            para_birimi,
            odeme_yontemi,
            odeme_durumu,
            aciklama
          ) VALUES (?, 'paket', ?, ?, 'AFN', 'admin', 'tamamlandi', ?)`,
          [
            kullanici_id, 
            magazaId, // iliskili_id = magaza ID
            ucretsiz ? 0 : paket.fiyat,
            ucretsiz ? 'Admin tarafından ücretsiz tanımlandı (Paket: ' + paket.ad_dari + ')' : 'Admin tarafından oluşturuldu (Paket: ' + paket.ad_dari + ')'
          ]
        );
        
        console.log('✅ Ödeme kaydı oluşturuldu');
      }
    }
    
    // Başarı mesajı
    return NextResponse.json({
      success: true,
      message: 'مغازه با موفقیت ایجاد شد',
      data: {
        magaza_id: magazaId
      }
    });
    
  } catch (error: any) {
    console.error('❌ Mağaza oluşturma hatası:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}









