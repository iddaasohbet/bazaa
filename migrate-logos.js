const mysql = require('mysql2/promise');

async function migrateLogos() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '104.247.173.212',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'cihatcengiz_cihatcengiz',
      password: process.env.DB_PASSWORD || 'Ciko5744**',
      database: process.env.DB_NAME || 'cihatcengiz_baza'
    });
    
    console.log('✅ Veritabanına bağlanıldı\n');
    
    // Tablo oluştur
    console.log('📋 logolar tablosu oluşturuluyor...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`logolar\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`tip\` enum('header','footer') NOT NULL COMMENT 'Logo tipi: header veya footer',
        \`logo_data\` longtext NOT NULL COMMENT 'Base64 encoded logo data',
        \`guncelleme_tarihi\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`tip\` (\`tip\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tablo oluşturuldu\n');
    
    // Eski logoları taşı
    console.log('📦 Eski logolar site_ayarlar tablosundan taşınıyor...');
    const [existingLogos] = await connection.query(`
      SELECT 
        CASE 
          WHEN \`anahtar\` = 'site_header_logo' THEN 'header'
          WHEN \`anahtar\` = 'site_footer_logo' THEN 'footer'
        END as \`tip\`,
        \`deger\` as \`logo_data\`
      FROM \`site_ayarlar\`
      WHERE \`anahtar\` IN ('site_header_logo', 'site_footer_logo')
        AND \`deger\` IS NOT NULL 
        AND \`deger\` != ''
        AND LENGTH(\`deger\`) > 0
    `);
    
    console.log(`📊 ${existingLogos.length} logo bulundu`);
    
    for (const logo of existingLogos) {
      if (logo.tip && logo.logo_data) {
        await connection.query(`
          INSERT INTO logolar (tip, logo_data) VALUES (?, ?)
          ON DUPLICATE KEY UPDATE logo_data = VALUES(logo_data)
        `, [logo.tip, logo.logo_data]);
        console.log(`  ✅ ${logo.tip} logo taşındı (${logo.logo_data.length} bytes)`);
      }
    }
    
    // Sonucu göster
    console.log('\n📋 logolar tablosu içeriği:');
    const [result] = await connection.query(`
      SELECT tip, LENGTH(logo_data) as uzunluk, guncelleme_tarihi 
      FROM logolar
    `);
    console.log(result);
    
    console.log('\n✅ Migration tamamlandı!');
    console.log('🎉 Artık logolar ayrı tabloda ve sorunsuz çalışacak!');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Hata:', error);
    if (connection) await connection.end();
    process.exit(1);
  }
}

migrateLogos();




