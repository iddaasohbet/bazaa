const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkAyarlar() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'afghanistan_ilanlar',
    charset: 'utf8mb4'
  });

  try {
    console.log('🔍 Site ayarları kontrol ediliyor...\n');
    
    const [rows] = await connection.execute('SELECT * FROM site_ayarlar ORDER BY kategori, anahtar');
    
    if (rows.length > 0) {
      console.log(`✅ ${rows.length} ayar bulundu:\n`);
      
      let currentKategori = '';
      rows.forEach(ayar => {
        if (ayar.kategori !== currentKategori) {
          currentKategori = ayar.kategori;
          console.log(`\n📁 Kategori: ${currentKategori.toUpperCase()}`);
          console.log('─'.repeat(50));
        }
        console.log(`  ${ayar.anahtar}: ${ayar.deger || '(boş)'}`);
      });
    } else {
      console.log('❌ Hiç ayar bulunamadı!');
    }
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await connection.end();
  }
}

checkAyarlar();










