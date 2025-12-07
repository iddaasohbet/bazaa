import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'afghanistan_ilanlar'
};

// reCAPTCHA doğrulama fonksiyonu
async function verifyCaptcha(token: string): Promise<boolean> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error('❌ RECAPTCHA_SECRET_KEY tanımlı değil!');
      return false;
    }

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('❌ reCAPTCHA doğrulama hatası:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  let connection;
  
  try {
    const body = await request.json();
    const { email, password, captchaToken } = body;
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'E-posta ve şifre gerekli'
      }, { status: 400 });
    }

    // reCAPTCHA doğrulaması (production'da zorunlu, development'ta opsiyonel)
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      if (!captchaToken) {
        return NextResponse.json({
          success: false,
          message: 'Lütfen robot olmadığınızı doğrulayın'
        }, { status: 400 });
      }

      const isCaptchaValid = await verifyCaptcha(captchaToken);
      if (!isCaptchaValid) {
        console.log('⚠️ Admin girişi - reCAPTCHA doğrulaması başarısız');
        return NextResponse.json({
          success: false,
          message: 'Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.'
        }, { status: 400 });
      }
      console.log('✅ Admin girişi - reCAPTCHA doğrulandı');
    } else {
      console.log('⚠️ Development modunda reCAPTCHA atlandı');
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
