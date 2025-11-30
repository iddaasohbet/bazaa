import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'afghanistan_ilanlar'
};

// GET - Güvenlik bilgilerini ve logları getir
export async function GET(request: NextRequest) {
  let connection;
  
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'Kullanıcı kimliği gerekli'
      }, { status: 401 });
    }
    
    connection = await mysql.createConnection(dbConfig);
    
    // Kullanıcı bilgilerini getir
    const [users]: any = await connection.execute(
      'SELECT id, email, ad, soyad, rol, kayit_tarihi FROM kullanicilar WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      }, { status: 404 });
    }
    
    // Güvenlik loglarını getir (son 50 kayıt)
    const [logs]: any = await connection.execute(
      `SELECT * FROM guvenlik_loglari 
       WHERE kullanici_id = ? 
       ORDER BY tarih DESC 
       LIMIT 50`,
      [userId]
    );
    
    return NextResponse.json({
      success: true,
      data: {
        user: users[0],
        logs: logs || []
      }
    });
    
  } catch (error: any) {
    console.error('Güvenlik bilgileri hatası:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// PUT - Şifre değiştir
export async function PUT(request: NextRequest) {
  let connection;
  
  try {
    const body = await request.json();
    const { userId, eskiSifre, yeniSifre } = body;
    
    if (!userId || !eskiSifre || !yeniSifre) {
      return NextResponse.json({
        success: false,
        message: 'Tüm alanlar gerekli'
      }, { status: 400 });
    }
    
    if (yeniSifre.length < 6) {
      return NextResponse.json({
        success: false,
        message: 'Yeni şifre en az 6 karakter olmalıdır'
      }, { status: 400 });
    }
    
    connection = await mysql.createConnection(dbConfig);
    
    // Kullanıcıyı getir
    const [users]: any = await connection.execute(
      'SELECT * FROM kullanicilar WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      }, { status: 404 });
    }
    
    const user = users[0];
    
    // Eski şifreyi kontrol et
    const sifreDogruMu = await bcrypt.compare(eskiSifre, user.sifre);
    
    if (!sifreDogruMu) {
      // Başarısız denemeyi logla
      await logGuvenlikOlayi(connection, userId, 'sifre_degistir_basarisiz', 'Eski şifre yanlış');
      
      return NextResponse.json({
        success: false,
        message: 'Eski şifre yanlış'
      }, { status: 401 });
    }
    
    // Yeni şifreyi hashle
    const hashedSifre = await bcrypt.hash(yeniSifre, 10);
    
    // Şifreyi güncelle
    await connection.execute(
      'UPDATE kullanicilar SET sifre = ? WHERE id = ?',
      [hashedSifre, userId]
    );
    
    // Başarılı işlemi logla
    await logGuvenlikOlayi(connection, userId, 'sifre_degisti', 'Şifre başarıyla değiştirildi');
    
    return NextResponse.json({
      success: true,
      message: 'Şifre başarıyla değiştirildi'
    });
    
  } catch (error: any) {
    console.error('Şifre değiştirme hatası:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// POST - Güvenlik olayı logla
async function logGuvenlikOlayi(
  connection: any,
  kullaniciId: number,
  olay: string,
  detay: string
) {
  try {
    await connection.execute(
      'INSERT INTO guvenlik_loglari (kullanici_id, olay, detay) VALUES (?, ?, ?)',
      [kullaniciId, olay, detay]
    );
  } catch (error) {
    console.error('Log kaydetme hatası:', error);
  }
}


