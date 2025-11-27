import mysql from 'mysql2/promise';

// Veritabanı bağlantı yapılandırması
const dbConfig = {
  host: process.env.DB_HOST || '104.247.173.212', // Fallback IP
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'cihatcengiz_cihatcengiz', // Fallback User
  password: process.env.DB_PASSWORD || 'Ciko5744**', // Fallback Pass
  database: process.env.DB_NAME || 'cihatcengiz_baza', // Fallback DB
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // ssl: undefined - CPanel MySQL SSL desteklemiyor, property kaldırıldı
  connectTimeout: 30000,
  multipleStatements: false,
};

// Connection pool oluştur
const pool = mysql.createPool(dbConfig);

// Veritabanı bağlantısını test et
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ Veritabanı bağlantısı başarılı!');
    return true;
  } catch (error: any) {
    console.error('❌ Veritabanı bağlantı hatası:', {
      message: error.message,
      code: error.code,
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database,
    });
    return false;
  }
}

// Query çalıştırma fonksiyonu
export async function query(sql: string, params?: any[]) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error: any) {
    console.error('❌ SQL Hatası:', {
      message: error.message,
      code: error.code,
      sql: sql.substring(0, 100),
    });
    // Hata fırlatmak yerine boş array dön veya hatayı logla
    // Bu sayede API 500 hatası vermez, sadece boş veri döner
    throw error; // API'lerde try-catch var, orada yakalanacak
  }
}

// Tekil sorgu için
export async function queryOne(sql: string, params?: any[]) {
  const results = await query(sql, params) as any[];
  return results[0] || null;
}

export default pool;

