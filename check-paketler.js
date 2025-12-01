const mysql = require('mysql2/promise');

async function checkPaketler() {
  try {
    const connection = await mysql.createConnection({
      host: '104.247.173.212',
      port: 3306,
      user: 'cihatcengiz_cihatcengiz',
      password: 'Ciko5744**',
      database: 'cihatcengiz_baza'
    });
    
    console.log('✅ Veritabanına bağlanıldı\n');
    
    const [paketler] = await connection.query(
      'SELECT id, ad, ad_dari, fiyat, eski_fiyat, store_level, sure_ay FROM paketler WHERE aktif = 1 ORDER BY store_level, sure_ay'
    );
    
    console.log('📊 Paketler:\n');
    paketler.forEach(p => {
      console.log(`ID: ${p.id} - ${p.ad_dari} (${p.store_level}, ${p.sure_ay} ay)`);
      console.log(`  Yeni Fiyat: ${p.fiyat} AFN`);
      console.log(`  Eski Fiyat: ${p.eski_fiyat || 'YOK'} AFN`);
      console.log('');
    });
    
    await connection.end();
  } catch (error) {
    console.error('❌ Hata:', error);
  }
}

checkPaketler();

