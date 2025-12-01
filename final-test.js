const mysql = require('mysql2/promise');

// Büyükçe bir test logo
const testLogo = 'data:image/png;base64,' + 'A'.repeat(5000); // 5KB test data

async function finalTest() {
  const connection = await mysql.createConnection({
    host: '104.247.173.212',
    port: 3306,
    user: 'cihatcengiz_cihatcengiz',
    password: 'Ciko5744**',
    database: 'cihatcengiz_baza'
  });
  
  console.log('✅ Bağlandı\n');
  
  try {
    // Transaction başlat
    await connection.beginTransaction();
    console.log('🔄 Transaction başlatıldı');
    
    // UPDATE
    await connection.query(
      "UPDATE site_ayarlar SET deger = ? WHERE anahtar = 'site_header_logo'",
      [testLogo]
    );
    console.log('📝 UPDATE çalıştırıldı');
    
    // Commit ÖNCE kontrol
    const [beforeCommit] = await connection.query(
      "SELECT LENGTH(deger) as uzunluk FROM site_ayarlar WHERE anahtar = 'site_header_logo'"
    );
    console.log('📊 Commit ÖNCESI:', beforeCommit[0].uzunluk, 'bytes');
    
    // Commit
    await connection.commit();
    console.log('✅ Commit yapıldı');
    
    // Commit SONRA kontrol
    const [afterCommit] = await connection.query(
      "SELECT LENGTH(deger) as uzunluk FROM site_ayarlar WHERE anahtar = 'site_header_logo'"
    );
    console.log('📊 Commit SONRASI:', afterCommit[0].uzunluk, 'bytes');
    
    // 2 saniye bekle
    console.log('⏰ 2 saniye bekleniyor...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Tekrar kontrol
    const [afterWait] = await connection.query(
      "SELECT LENGTH(deger) as uzunluk FROM site_ayarlar WHERE anahtar = 'site_header_logo'"
    );
    console.log('📊 2 saniye SONRA:', afterWait[0].uzunluk, 'bytes');
    
    if (afterWait[0].uzunluk === 0) {
      console.log('\n❌ SORUN: Logo kaydedildi ama 2 saniye sonra kayboldu!');
      console.log('   Bu bir database trigger, constraint veya başka bir process olabilir.');
    } else if (afterWait[0].uzunluk > 0) {
      console.log('\n✅ Logo başarıyla kaydedildi ve kalıcı!');
    }
    
  } catch (error) {
    console.error('❌ Hata:', error);
    await connection.rollback();
  }
  
  await connection.end();
}

finalTest();

