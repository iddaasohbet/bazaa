import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Tüm ayarları getir
export async function GET() {
  let connection;
  
  try {
    connection = await pool.getConnection();
    
    const [rows] = await connection.query(
      'SELECT * FROM site_ayarlar ORDER BY kategori, anahtar'
    );
    
    connection.release();
    
    return NextResponse.json({
      success: true,
      data: rows
    });
    
  } catch (error: any) {
    console.error('❌ Ayarlar getirme hatası:', error);
    if (connection) connection.release();
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
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
    
    connection = await pool.getConnection();
    
    await connection.beginTransaction();
    
    // Her ayarı güncelle
    for (const ayar of ayarlar) {
      await connection.query(
        'UPDATE site_ayarlar SET deger = ? WHERE anahtar = ?',
        [ayar.deger, ayar.anahtar]
      );
    }
    
    await connection.commit();
    connection.release();
    
    console.log(`✅ ${ayarlar.length} ayar güncellendi`);
    
    return NextResponse.json({
      success: true,
      message: 'Ayarlar başarıyla güncellendi'
    });
    
  } catch (error: any) {
    console.error('❌ Ayarlar güncelleme hatası:', error);
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
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
    
    connection = await pool.getConnection();
    
    await connection.query(
      'INSERT INTO site_ayarlar (anahtar, deger, kategori, aciklama) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE deger = VALUES(deger)',
      [anahtar, deger || '', kategori || 'genel', aciklama || '']
    );
    
    connection.release();
    
    return NextResponse.json({
      success: true,
      message: 'Ayar başarıyla eklendi'
    });
    
  } catch (error: any) {
    console.error('❌ Ayar ekleme hatası:', error);
    if (connection) connection.release();
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}
