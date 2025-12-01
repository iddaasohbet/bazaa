import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Footer ayarlarını getir - site_ayarlar tablosundan
export async function GET() {
  try {
    const connection = await pool.getConnection();
    
    try {
      // site_ayarlar tablosundan footer için gerekli ayarları çek
      const [ayarlar] = await connection.query(
        `SELECT anahtar, deger FROM site_ayarlar 
         WHERE kategori IN ('genel', 'iletisim', 'sosyal_medya')
         OR anahtar IN ('site_adi', 'site_aciklama', 'site_email', 'site_telefon', 'site_adres', 
                        'facebook_url', 'twitter_url', 'instagram_url', 'youtube_url')`
      ) as any[];

      // Key-value formatına çevir
      const settings: any = {
        site_baslik: '',
        site_aciklama: '',
        copyright_metni: 'تمام حقوق محفوظ است © ' + new Date().getFullYear(),
        iletisim_adres: '',
        iletisim_telefon: '',
        iletisim_email: '',
        sosyal_facebook: '',
        sosyal_twitter: '',
        sosyal_instagram: '',
        sosyal_tiktok: '',
        android_aktif: '0',
        ios_aktif: '0',
        app_baslik: 'اپلیکیشن موبایل ما را دانلود کنید',
        app_aciklama: 'آگهی ها را سریعتر کشف کنید، از هر جا دسترسی داشته باشید',
        app_google_play_link: 'https://play.google.com/store',
        app_app_store_link: 'https://apps.apple.com',
        app_qr_url: 'https://cihatcengiz.com',
        hizli_linkler: JSON.stringify([
          { label: "درباره ما", href: "/hakkimizda" },
          { label: "چگونه کار می کند؟", href: "/nasil-calisir" },
          { label: "خرید امن", href: "/guvenli-alisveris" },
          { label: "سوالات متداول", href: "/sss" }
        ]),
        alt_linkler: JSON.stringify([
          { label: "سیاست حفظ حریم خصوصی", href: "/gizlilik" },
          { label: "شرایط استفاده", href: "/kullanim-kosullari" },
          { label: "حریم خصوصی", href: "/kvkk" }
        ])
      };

      // site_ayarlar'dan gelen değerleri map et
      ayarlar.forEach((ayar: any) => {
        switch (ayar.anahtar) {
          case 'site_adi':
            settings.site_baslik = ayar.deger || '';
            break;
          case 'site_aciklama':
            settings.site_aciklama = ayar.deger || '';
            break;
          case 'site_email':
            settings.iletisim_email = ayar.deger || '';
            break;
          case 'site_telefon':
            settings.iletisim_telefon = ayar.deger || '';
            break;
          case 'site_adres':
            settings.iletisim_adres = ayar.deger || '';
            break;
          case 'facebook_url':
            settings.sosyal_facebook = ayar.deger || '';
            break;
          case 'twitter_url':
            settings.sosyal_twitter = ayar.deger || '';
            break;
          case 'instagram_url':
            settings.sosyal_instagram = ayar.deger || '';
            break;
          case 'youtube_url':
            settings.sosyal_youtube = ayar.deger || '';
            break;
          case 'tiktok_url':
            settings.sosyal_tiktok = ayar.deger || '';
            break;
          case 'android_aktif':
            settings.android_aktif = ayar.deger || '0';
            break;
          case 'ios_aktif':
            settings.ios_aktif = ayar.deger || '0';
            break;
          case 'app_app_store_link':
            settings.app_app_store_link = ayar.deger || '';
            break;
        }
      });

      connection.release();

      return NextResponse.json({
        success: true,
        data: settings
      });
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error: any) {
    console.error('❌ Footer ayarları hatası:', error);
    
    // Hata durumunda default değerler
    return NextResponse.json({
      success: true,
      data: {
        site_baslik: 'WatanBazaare',
        site_aciklama: 'د افغانستان لوی آنلاین بازار',
        copyright_metni: 'تمام حقوق محفوظ است © ' + new Date().getFullYear(),
        iletisim_adres: 'کابل، افغانستان',
        iletisim_telefon: '+93 700 000 000',
        iletisim_email: 'info@watanbazaare.com',
        sosyal_facebook: '',
        sosyal_twitter: '',
        sosyal_instagram: '',
        sosyal_tiktok: '',
        android_aktif: '0',
        ios_aktif: '0',
        app_baslik: 'اپلیکیشن موبایل ما را دانلود کنید',
        app_aciklama: 'آگهی ها را سریعتر کشف کنید، از هر جا دسترسی داشته باشید',
        app_google_play_link: 'https://play.google.com/store',
        app_app_store_link: 'https://apps.apple.com',
        app_qr_url: 'https://cihatcengiz.com',
        hizli_linkler: JSON.stringify([
          { label: "درباره ما", href: "/hakkimizda" },
          { label: "چگونه کار می کند؟", href: "/nasil-calisir" },
          { label: "خرید امن", href: "/guvenli-alisveris" },
          { label: "سوالات متداول", href: "/sss" }
        ]),
        alt_linkler: JSON.stringify([
          { label: "سیاست حفظ حریم خصوصی", href: "/gizlilik" },
          { label: "شرایط استفاده", href: "/kullanim-kosullari" },
          { label: "حریم خصوصی", href: "/kvkk" }
        ])
      }
    });
  }
}

// Footer ayarlarını güncelle - site_ayarlar tablosuna kaydet
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Mapping: Footer ayarları -> site_ayarlar anahtarları
      const mapping: { [key: string]: { anahtar: string, kategori: string } } = {
        site_baslik: { anahtar: 'site_adi', kategori: 'genel' },
        site_aciklama: { anahtar: 'site_aciklama', kategori: 'genel' },
        iletisim_email: { anahtar: 'site_email', kategori: 'iletisim' },
        iletisim_telefon: { anahtar: 'site_telefon', kategori: 'iletisim' },
        iletisim_adres: { anahtar: 'site_adres', kategori: 'iletisim' },
        sosyal_facebook: { anahtar: 'facebook_url', kategori: 'sosyal_medya' },
        sosyal_twitter: { anahtar: 'twitter_url', kategori: 'sosyal_medya' },
        sosyal_instagram: { anahtar: 'instagram_url', kategori: 'sosyal_medya' },
        sosyal_youtube: { anahtar: 'youtube_url', kategori: 'sosyal_medya' },
        sosyal_tiktok: { anahtar: 'tiktok_url', kategori: 'sosyal_medya' },
        android_aktif: { anahtar: 'android_aktif', kategori: 'genel' },
        ios_aktif: { anahtar: 'ios_aktif', kategori: 'genel' },
        app_app_store_link: { anahtar: 'app_app_store_link', kategori: 'genel' }
      };

      // Her bir ayarı güncelle veya ekle
      for (const [key, value] of Object.entries(body)) {
        if (mapping[key]) {
          const { anahtar, kategori } = mapping[key];
          await connection.query(
            `INSERT INTO site_ayarlar (anahtar, deger, kategori, aciklama)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE deger = VALUES(deger)`,
            [anahtar, value, kategori, key]
          );
        }
      }

      await connection.commit();
      connection.release();

      console.log('✅ Footer ayarları güncellendi');

      return NextResponse.json({
        success: true,
        message: 'تنظیمات footer با موفقیت ذخیره شد'
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error: any) {
    console.error('❌ Footer ayarları güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ذخیره تنظیمات: ' + error.message },
      { status: 500 }
    );
  }
}
