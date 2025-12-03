const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'afghanistan_ilanlar',
    charset: 'utf8mb4'
  });

  try {
    console.log('🔐 Admin kullanıcı oluşturuluyor...\n');
    
    // Şifreyi hashle
    const sifre = 'admin123'; // Varsayılan şifre
    const hashedSifre = await bcrypt.hash(sifre, 10);
    
    // Admin kullanıcı ekle
    await connection.execute(
      `INSERT INTO kullanicilar (ad, email, telefon, sifre, rol, aktif) 
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE rol='admin', aktif=1`,
      ['Admin', 'admin@watanbazaare.com', '+93 700 000 000', hashedSifre, 'admin', 1]
    );
    
    console.log('✅ Admin kullanıcı başarıyla oluşturuldu!\n');
    console.log('📧 Email: admin@watanbazaare.com');
    console.log('🔑 Şifre: admin123');
    console.log('\n⚠️  Güvenlik için ilk girişten sonra şifrenizi değiştirin!');
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await connection.end();
  }
}

createAdmin();









