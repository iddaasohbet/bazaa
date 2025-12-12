const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function runMigration(migrationFile = 'GUVENLIK_LOGLARI_MIGRATION.sql') {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'afghanistan_ilanlar',
    multipleStatements: true,
    charset: 'utf8mb4'
  });

  try {
    console.log(`🔄 ${migrationFile} migration başlatılıyor...`);
    
    // Önce tabloyu oluştur
    await connection.query(`
      CREATE TABLE IF NOT EXISTS site_ayarlar (
        id INT PRIMARY KEY AUTO_INCREMENT,
        anahtar VARCHAR(100) UNIQUE NOT NULL,
        deger TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        kategori VARCHAR(50) DEFAULT 'genel',
        aciklama TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✅ Tablo oluşturuldu');
    
    // Sonra verileri ekle (tek tek)
    const ayarlar = [
      ['site_adi', 'WatanBazaare', 'genel', 'Site adi'],
      ['site_slogan', 'Watan Bazaare - Afghanistan', 'genel', 'Site slogani'],
      ['site_aciklama', 'Afghanistan e-commerce platform', 'genel', 'Site aciklamasi'],
      ['site_email', 'info@watanbazaare.com', 'iletisim', 'Iletisim e-posta'],
      ['site_telefon', '+93 700 000 000', 'iletisim', 'Iletisim telefon'],
      ['site_adres', 'Kabul, Afghanistan', 'iletisim', 'Sirket adresi'],
      ['facebook_url', '', 'sosyal_medya', 'Facebook sayfa linki'],
      ['twitter_url', '', 'sosyal_medya', 'Twitter profil linki'],
      ['instagram_url', '', 'sosyal_medya', 'Instagram profil linki'],
      ['youtube_url', '', 'sosyal_medya', 'YouTube kanal linki'],
      ['ilan_onay_gerektir', '0', 'sistem', 'Ilan onay gerektirsin mi'],
      ['kayit_aktif', '1', 'sistem', 'Kullanici kaydi acik mi'],
      ['magaza_acma_aktif', '1', 'sistem', 'Magaza acma aktif mi'],
      ['varsayilan_ilan_suresi', '30', 'sistem', 'Ilan suresi (gun)'],
      ['maksimum_resim_sayisi', '10', 'sistem', 'Max resim sayisi'],
      ['google_analytics_id', '', 'entegrasyon', 'Google Analytics ID'],
      ['google_maps_api_key', '', 'entegrasyon', 'Google Maps API Key'],
      ['smtp_host', '', 'email', 'SMTP sunucu'],
      ['smtp_port', '587', 'email', 'SMTP port'],
      ['smtp_kullanici', '', 'email', 'SMTP kullanici'],
      ['smtp_sifre', '', 'email', 'SMTP sifre'],
      ['bakim_modu', '0', 'sistem', 'Bakim modu'],
      ['bakim_mesaji', 'Sistem bakimda', 'sistem', 'Bakim mesaji']
    ];
    
    for (const ayar of ayarlar) {
      await connection.query(
        'INSERT INTO site_ayarlar (anahtar, deger, kategori, aciklama) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE deger=deger',
        ayar
      );
    }
    
    console.log('✅ Migration başarıyla tamamlandı!');
  } catch (error) {
    console.error('❌ Migration hatası:', error);
  } finally {
    await connection.end();
  }
}

runMigration();

