const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runSayfalarMigration() {
  let connection;
  
  try {
    console.log('🔄 Sayfalar migration başlatılıyor...\n');

    // Veritabanına bağlan
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'afganistan_ilanlar',
      multipleStatements: true
    });

    console.log('✅ Veritabanına bağlanıldı\n');

    // Migration dosyasını oku
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'SAYFALAR_MIGRATION.sql'),
      'utf8'
    );

    // Migration'ı çalıştır
    await connection.query(migrationSQL);
    
    console.log('✅ Sayfalar tablosu başarıyla oluşturuldu!');
    console.log('\n📝 Eklenen sayfalar:');
    console.log('   - SSS (سوالات متداول)');
    console.log('   - Hakkımızda (درباره ما)');
    console.log('   - Güvenli Alışveriş (خرید امن)');
    console.log('   - Nasıl Çalışır (چگونه کار می‌کند)');
    console.log('\n✨ Artık bu sayfaları admin panelden düzenleyebilirsiniz!');

  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runSayfalarMigration();



