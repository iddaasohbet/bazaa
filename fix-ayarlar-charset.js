const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixCharset() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'afghanistan_ilanlar',
    charset: 'utf8mb4'
  });

  try {
    console.log('🔄 Tablo charset düzeltiliyor...\n');
    
    // Tablo charset'ini değiştir
    await connection.execute(`
      ALTER TABLE site_ayarlar 
      CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);
    
    console.log('✅ Tablo charset düzeltildi!');
    
    // Şimdi Türkçe karakterli açıklamaları güncelle
    const ayarlar = [
      ['site_adi', 'Site adi'],
      ['site_slogan', 'Site slogani'],
      ['site_aciklama', 'Site aciklamasi'],
      ['site_anahtar_kelimeler', 'SEO anahtar kelimeler'],
      ['site_email', 'Iletisim e-posta'],
      ['site_telefon', 'Iletisim telefon'],
      ['site_adres', 'Sirket adresi'],
      ['facebook_url', 'Facebook sayfa linki'],
      ['twitter_url', 'Twitter profil linki'],
      ['instagram_url', 'Instagram profil linki'],
      ['youtube_url', 'YouTube kanal linki'],
      ['ilan_onay_gerektir', 'Ilanlar yayinlanmadan once onay gerektirsin mi?'],
      ['kayit_aktif', 'Kullanici kaydi acik mi?'],
      ['magaza_acma_aktif', 'Magaza acma aktif mi?'],
      ['varsayilan_ilan_suresi', 'Ilanlarin varsayilan yayin suresi (gun)'],
      ['maksimum_resim_sayisi', 'Ilan basina maksimum resim sayisi'],
      ['google_analytics_id', 'Google Analytics ID'],
      ['google_maps_api_key', 'Google Maps API Key'],
      ['smtp_host', 'SMTP sunucu'],
      ['smtp_port', 'SMTP port'],
      ['smtp_kullanici', 'SMTP kullanici'],
      ['smtp_sifre', 'SMTP sifre'],
      ['bakim_modu', 'Bakim modu aktif mi?'],
      ['bakim_mesaji', 'Bakim modu mesaji']
    ];
    
    console.log('\n🔄 Açıklamalar güncelleniyor...');
    
    for (const [anahtar, aciklama] of ayarlar) {
      await connection.execute(
        'UPDATE site_ayarlar SET aciklama = ? WHERE anahtar = ?',
        [aciklama, anahtar]
      );
      console.log(`✅ ${anahtar}`);
    }
    
    console.log('\n✅ Tüm ayarlar başarıyla güncellendi!');
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await connection.end();
  }
}

fixCharset();










