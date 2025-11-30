const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'afghanistan_ilanlar',
    multipleStatements: true,
    charset: 'utf8mb4'
  });

  try {
    console.log('🔄 Güvenlik migration başlatılıyor...');
    
    const sql = fs.readFileSync('./GUVENLIK_LOGLARI_MIGRATION.sql', 'utf8');
    await connection.query(sql);
    
    console.log('✅ Güvenlik tabloları başarıyla oluşturuldu!');
  } catch (error) {
    console.error('❌ Migration hatası:', error);
  } finally {
    await connection.end();
  }
}

runMigration();


