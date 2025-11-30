import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'afghanistan_ilanlar'
};

export async function POST(request: NextRequest) {
  let connection;
  
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'E-posta ve şifre gerekli'
      }, { status: 400 });
    }
    
    connection = await mysql.createConnection(dbConfig);
    
    // Kullanıcıyı getir
    const [users]: any = await connection.execute(
      'SELECT * FROM kullanicilar WHERE email = ? AND aktif = 1',
      [email]
    );
    
    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'E-posta veya şifre hatalı'
      }, { status: 401 });
    }
    
    const user = users[0];
    
    // Admin kontrolü
    if (user.rol !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Bu panele erişim yetkiniz yok'
      }, { status: 403 });
    }
    
    // Şifre kontrolü
    const sifreDogruMu = await bcrypt.compare(password, user.sifre);
    
    if (!sifreDogruMu) {
      return NextResponse.json({
        success: false,
        message: 'E-posta veya şifre hatalı'
      }, { status: 401 });
    }
    
    // Token oluştur (basit - production'da JWT kullan)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
    
    // Kullanıcı bilgilerini hazırla
    const userData = {
      id: user.id,
      ad: user.ad,
      email: user.email,
      rol: user.rol
    };
    
    // Response oluştur
    const response = NextResponse.json({
      success: true,
      message: 'Giriş başarılı',
      token: token,
      user: userData
    });
    
    // Cookie set et (httpOnly ve secure)
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 gün
      path: '/'
    });
    
    // Kullanıcı bilgilerini de cookie'ye ekle
    response.cookies.set('admin_user', JSON.stringify(userData), {
      httpOnly: false, // Client'tan erişilebilir
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });
    
    return response;
    
  } catch (error: any) {
    console.error('Admin giriş hatası:', error);
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
