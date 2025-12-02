const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateAyarlar() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'afghanistan_ilanlar',
    charset: 'utf8mb4'
  });

  try {
    console.log('🔄 Ayarlar güncelleniyor...\n');
    
    // Türkçe açıklamaları düzelt
    const ayarlar = [
      ['site_adi', 'Site adı'],
      ['site_slogan', 'Site sloganı'],
      ['site_aciklama', 'Site açıklaması'],
      ['site_anahtar_kelimeler', 'SEO anahtar kelimeler'],
      ['site_email', 'İletişim e-posta adresi'],
      ['site_telefon', 'İletişim telefon'],
      ['site_adres', 'Şirket adresi'],
      ['facebook_url', 'Facebook sayfa linki'],
      ['twitter_url', 'Twitter profil linki'],
      ['instagram_url', 'Instagram profil linki'],
      ['youtube_url', 'YouTube kanal linki'],
      ['ilan_onay_gerektir', 'İlanlar yayınlanmadan önce onay gerektirsin mi? (0: Hayır, 1: Evet)'],
      ['kayit_aktif', 'Kullanıcı kaydı açık mı? (0: Hayır, 1: Evet)'],
      ['magaza_acma_aktif', 'Mağaza açma aktif mi? (0: Hayır, 1: Evet)'],
      ['varsayilan_ilan_suresi', 'İlanların varsayılan yayın süresi (gün)'],
      ['maksimum_resim_sayisi', 'İlan başına maksimum resim sayısı'],
      ['google_analytics_id', 'Google Analytics ID'],
      ['google_maps_api_key', 'Google Maps API Key'],
      ['smtp_host', 'SMTP sunucu adresi'],
      ['smtp_port', 'SMTP port'],
      ['smtp_kullanici', 'SMTP kullanıcı adı'],
      ['smtp_sifre', 'SMTP şifre'],
      ['bakim_modu', 'Bakım modu aktif mi? (0: Hayır, 1: Evet)'],
      ['bakim_mesaji', 'Bakım modu mesajı']
    ];
    
    for (const [anahtar, aciklama] of ayarlar) {
      await connection.execute(
        'UPDATE site_ayarlar SET aciklama = ? WHERE anahtar = ?',
        [aciklama, anahtar]
      );
      console.log(`✅ ${anahtar} güncellendi`);
    }
    
    console.log('\n✅ Tüm ayarlar başarıyla güncellendi!');
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await connection.end();
  }
}

updateAyarlar();






