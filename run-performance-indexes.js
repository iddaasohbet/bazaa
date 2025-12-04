const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runIndexMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '104.247.173.212',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'cihatcengiz_cihatcengiz',
    password: process.env.DB_PASSWORD || 'Ciko5744**',
    database: process.env.DB_NAME || 'cihatcengiz_baza',
    multipleStatements: true
  });

  try {
    console.log('🚀 Performans indexleri oluşturuluyor...\n');

    const sql = fs.readFileSync(
      path.join(__dirname, 'PERFORMANCE_INDEXES.sql'),
      'utf8'
    );

    const [results] = await connection.query(sql);
    
    console.log('✅ Migration başarılı!\n');
    
    if (Array.isArray(results)) {
      results.forEach((result, index) => {
        console.log(`Step ${index + 1}:`, result);
      });
    }

    // Index'leri listele
    console.log('\n📊 İlanlar tablosu indexleri:');
    const [indexes] = await connection.query('SHOW INDEX FROM ilanlar');
    console.table(indexes);

  } catch (error) {
    console.error('❌ Hata:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

runIndexMigration()
  .then(() => {
    console.log('\n🎉 Index migration tamamlandı!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration başarısız:', error);
    process.exit(1);
  });


