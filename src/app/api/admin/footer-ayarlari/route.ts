import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Footer ayarlarını getir
export async function GET() {
  try {
    const ayarlar = await query(
      'SELECT ayar_key, ayar_value FROM site_ayarlari WHERE ayar_group = "footer"'
    ) as any[];

    // Key-value formatına çevir
    const settings: any = {};
    ayarlar.forEach((ayar: any) => {
      settings[ayar.ayar_key] = ayar.ayar_value;
    });

    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error: any) {
    console.error('❌ Footer ayarları hatası:', error);
    
    // Hata durumunda default değerler
    return NextResponse.json({
      success: true,
      data: {
        site_baslik: 'BazaareWatan',
        site_aciklama: 'معتبرترین پلتفرم آگهی در افغانستان. کالای دست دوم، خودرو، املاک و بیشتر.',
        copyright_metni: 'آگهی های افغانستان. تمامی حقوق محفوظ است.',
        iletisim_adres: 'کابل، افغانستان',
        iletisim_telefon: '+93 700 000 000',
        iletisim_email: 'info@afghanistan-ilanlar.com',
        sosyal_facebook: '#',
        sosyal_twitter: '#',
        sosyal_instagram: '#',
        app_baslik: 'اپلیکیشن موبایل ما را دانلود کنید',
        app_aciklama: 'آگهی ها را سریعتر کشف کنید، از هر جا دسترسی داشته باشید',
        app_google_play_link: 'https://play.google.com/store',
        app_qr_url: 'https://cihatcengiz.com',
        hizli_linkler: '[{"label":"درباره ما","href":"/hakkimizda"},{"label":"چگونه کار می کند؟","href":"/nasil-calisir"},{"label":"خرید امن","href":"/guvenli-alisveris"},{"label":"سوالات متداول","href":"/sss"}]',
        alt_linkler: '[{"label":"سیاست حفظ حریم خصوصی","href":"/gizlilik"},{"label":"شرایط استفاده","href":"/kullanim-kosullari"},{"label":"حریم خصوصی","href":"/kvkk"}]'
      }
    });
  }
}

// Footer ayarlarını güncelle
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    console.log('📝 Footer ayarları güncelleniyor');

    // Her bir ayarı güncelle veya ekle
    for (const [key, value] of Object.entries(body)) {
      await query(
        `INSERT INTO site_ayarlari (ayar_key, ayar_value, ayar_group)
         VALUES (?, ?, 'footer')
         ON DUPLICATE KEY UPDATE ayar_value = ?, updated_at = NOW()`,
        [key, value, value]
      );
    }

    console.log('✅ Footer ayarları güncellendi');

    return NextResponse.json({
      success: true,
      message: 'تنظیمات footer با موفقیت ذخیره شد'
    });
  } catch (error: any) {
    console.error('❌ Footer ayarları güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ذخیره تنظیمات: ' + error.message },
      { status: 500 }
    );
  }
}













