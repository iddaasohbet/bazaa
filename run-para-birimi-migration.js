const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runParaBirimiMigration() {
  let connection;
  
  try {
    console.log('🔄 Para birimi migration başlatılıyor...\n');

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
      path.join(__dirname, 'PARA_BIRIMI_MIGRATION.sql'),
      'utf8'
    );

    // Migration'ı çalıştır
    await connection.query(migrationSQL);
    
    console.log('✅ Para birimi migration başarıyla tamamlandı!');
    console.log('\n📝 Eklenen alanlar:');
    console.log('   - para_birimi (AFN veya USD)');
    console.log('   - fiyat_usd (USD fiyat)');
    console.log('\n✨ Artık hem AFN hem USD fiyat girebilirsiniz!');

  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runParaBirimiMigration();





