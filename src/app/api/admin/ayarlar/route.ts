import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'afghanistan_ilanlar'
};

// GET - Tüm ayarları getir
export async function GET() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM site_ayarlar ORDER BY kategori, anahtar'
    );
    
    return NextResponse.json({
      success: true,
      data: rows
    });
    
  } catch (error: any) {
    console.error('Ayarlar getirme hatası:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// PUT - Ayarları güncelle
export async function PUT(request: NextRequest) {
  let connection;
  
  try {
    const body = await request.json();
    const { ayarlar } = body; // Array of {anahtar, deger}
    
    if (!ayarlar || !Array.isArray(ayarlar)) {
      return NextResponse.json({
        success: false,
        message: 'Geçersiz veri formatı'
      }, { status: 400 });
    }
    
    connection = await mysql.createConnection(dbConfig);
    
    // Her ayarı güncelle
    for (const ayar of ayarlar) {
      await connection.execute(
        'UPDATE site_ayarlar SET deger = ? WHERE anahtar = ?',
        [ayar.deger, ayar.anahtar]
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Ayarlar başarıyla güncellendi'
    });
    
  } catch (error: any) {
    console.error('Ayarlar güncelleme hatası:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// POST - Yeni ayar ekle
export async function POST(request: NextRequest) {
  let connection;
  
  try {
    const body = await request.json();
    const { anahtar, deger, kategori, aciklama } = body;
    
    if (!anahtar) {
      return NextResponse.json({
        success: false,
        message: 'Anahtar değeri gerekli'
      }, { status: 400 });
    }
    
    connection = await mysql.createConnection(dbConfig);
    
    await connection.execute(
      'INSERT INTO site_ayarlar (anahtar, deger, kategori, aciklama) VALUES (?, ?, ?, ?)',
      [anahtar, deger || '', kategori || 'genel', aciklama || '']
    );
    
    return NextResponse.json({
      success: true,
      message: 'Ayar başarıyla eklendi'
    });
    
  } catch (error: any) {
    console.error('Ayar ekleme hatası:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}





