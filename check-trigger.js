const mysql = require('mysql2/promise');

async function checkTriggers() {
  try {
    const connection = await mysql.createConnection({
      host: '104.247.173.212',
      port: 3306,
      user: 'cihatcengiz_cihatcengiz',
      password: 'Ciko5744**',
      database: 'cihatcengiz_baza'
    });
    
    console.log('✅ Veritabanına bağlanıldı\n');
    
    // Triggerlari kontrol et
    console.log('Triggerlar:');
    const [triggers] = await connection.query(
      "SHOW TRIGGERS WHERE `Table` = 'site_ayarlar'"
    );
    console.log(triggers);
    
    if (triggers.length === 0) {
      console.log('✅ Trigger yok\n');
    }
    
    // Tablo yapısını göster
    console.log('📊 site_ayarlar tablo yapısı:');
    const [columns] = await connection.query(
      "SHOW FULL COLUMNS FROM site_ayarlar"
    );
    columns.forEach((col) => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null} ${col.Key} ${col.Default || ''} ${col.Extra}`);
    });
    
    // Özellikle deger sütununu kontrol et
    console.log('\n🔍 deger sütunu detayları:');
    const degerCol = columns.find(c => c.Field === 'deger');
    if (degerCol) {
      console.log('  Type:', degerCol.Type);
      console.log('  Collation:', degerCol.Collation);
      console.log('  Null:', degerCol.Null);
      console.log('  Default:', degerCol.Default);
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Hata:', error);
  }
}

checkTriggers();

