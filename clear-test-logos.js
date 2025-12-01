const mysql = require('mysql2/promise');

async function clearTestLogos() {
  try {
    const connection = await mysql.createConnection({
      host: '104.247.173.212',
      port: 3306,
      user: 'cihatcengiz_cihatcengiz',
      password: 'Ciko5744**',
      database: 'cihatcengiz_baza'
    });
    
    console.log('✅ Veritabanına bağlanıldı');
    
    // Önce mevcut logoları göster
    const [before] = await connection.query(
      "SELECT anahtar, LENGTH(deger) as uzunluk FROM site_ayarlar WHERE anahtar IN ('site_header_logo', 'site_footer_logo')"
    );
    console.log('\n📋 Mevcut logolar:', before);
    
    // Test logolarını temizle (boş string yap)
    await connection.query(
      "UPDATE site_ayarlar SET deger = '' WHERE anahtar = 'site_header_logo'"
    );
    await connection.query(
      "UPDATE site_ayarlar SET deger = '' WHERE anahtar = 'site_footer_logo'"
    );
    
    console.log('✅ Test logoları temizlendi');
    
    // Sonucu göster
    const [after] = await connection.query(
      "SELECT anahtar, LENGTH(deger) as uzunluk FROM site_ayarlar WHERE anahtar IN ('site_header_logo', 'site_footer_logo')"
    );
    console.log('📋 Temizlenmiş durumu:', after);
    
    await connection.end();
    console.log('\n✅ İşlem tamamlandı - Artık yeni logo yükleyebilirsiniz!');
  } catch (error) {
    console.error('❌ Hata:', error);
  }
}

clearTestLogos();

