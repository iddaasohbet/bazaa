const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'afghanistan_ilanlar',
    charset: 'utf8mb4'
  });

  try {
    console.log('🔍 Admin kullanıcı kontrol ediliyor...\n');
    
    // Önce tablo yapısını kontrol et
    const [columns] = await connection.execute("DESCRIBE kullanicilar");
    console.log('📋 Kullanıcılar tablosu kolonları:');
    columns.forEach(col => console.log(`   - ${col.Field}`));
    console.log('');
    
    const [rows] = await connection.execute(
      "SELECT * FROM kullanicilar WHERE rol = 'admin' OR email LIKE '%admin%' LIMIT 5"
    );
    
    if (rows.length > 0) {
      console.log('✅ Admin kullanıcılar bulundu:\n');
      rows.forEach((user, index) => {
        console.log(`${index + 1}. Admin:`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Ad: ${user.ad}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Rol: ${user.rol}`);
        console.log(`   Aktif: ${user.aktif ? 'Evet' : 'Hayır'}`);
        console.log(`   Kayıt: ${user.kayit_tarihi}`);
        console.log('');
      });
    } else {
      console.log('❌ Admin kullanıcı bulunamadı!');
    }
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await connection.end();
  }
}

checkAdmin();

