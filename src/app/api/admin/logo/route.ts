import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// Next.js cache ve runtime config
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60;

// GET - Logo bilgilerini getir
export async function GET(request: NextRequest) {
  try {
    console.log('📊 API: Logo GET isteği alındı');
    const connection = await pool.getConnection();
    
    try {
      // logolar tablosundan logo bilgilerini çek
      const [rows] = await connection.query(
        `SELECT tip, logo_data FROM logolar WHERE tip IN ('header', 'footer')`
      );
      
      console.log('📋 API: Database sorgu sonucu:', (rows as any[]).length, 'kayıt bulundu');
      
      const logos: any = {
        header_logo: '',
        footer_logo: ''
      };
      
      (rows as any[]).forEach((row: any) => {
        console.log('📄 API: Kayıt işleniyor -', row.tip, '- Uzunluk:', row.logo_data?.length || 0);
        if (row.tip === 'header') {
          logos.header_logo = row.logo_data || '';
        } else if (row.tip === 'footer') {
          logos.footer_logo = row.logo_data || '';
        }
      });
      
      console.log('✅ API: Logolar hazırlandı - Header:', logos.header_logo.length, 'Footer:', logos.footer_logo.length);
      
      connection.release();
      
      const response = NextResponse.json({
        success: true,
        data: logos,
        timestamp: Date.now()
      });
      
      // Cache'i tamamen engelle
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('Last-Modified', new Date().toUTCString());
      
      return response;
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error: any) {
    console.error('❌ API: Logo getirme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Logo bilgileri alınamadı: ' + error.message },
      { status: 500 }
    );
  }
}

// PUT - Logo bilgilerini güncelle
export async function PUT(request: NextRequest) {
  let connection;
  try {
    // Body'yi oku
    let body;
    try {
      const text = await request.text();
      console.log('📊 API PUT: Request body boyutu:', text.length, 'bytes');
      body = JSON.parse(text);
    } catch (parseError: any) {
      console.error('❌ API PUT: JSON parse hatası:', parseError);
      return NextResponse.json(
        { success: false, message: 'Geçersiz JSON formatı: ' + parseError.message },
        { status: 400 }
      );
    }

    const { header_logo, footer_logo } = body;
    
    console.log('💾 API PUT: Logo güncelleme isteği alındı');
    console.log('📊 API PUT: Header logo uzunluk:', header_logo?.length || 0);
    console.log('📊 API PUT: Footer logo uzunluk:', footer_logo?.length || 0);
    
    // Logo boyut kontrolü
    if (header_logo && header_logo.length > 5000000) {
      return NextResponse.json(
        { success: false, message: 'Header logo çok büyük! Maksimum 5MB olmalı.' },
        { status: 400 }
      );
    }
    if (footer_logo && footer_logo.length > 5000000) {
      return NextResponse.json(
        { success: false, message: 'Footer logo çok büyük! Maksimum 5MB olmalı.' },
        { status: 400 }
      );
    }
    
    connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Header logo güncelle veya ekle
      if (header_logo !== undefined) {
        console.log('🔄 API PUT: Header logo kaydediliyor...');
        await connection.query(
          `INSERT INTO logolar (tip, logo_data) VALUES ('header', ?)
           ON DUPLICATE KEY UPDATE logo_data = VALUES(logo_data)`,
          [header_logo]
        );
        console.log('✅ API PUT: Header logo kaydedildi');
      }
      
      // Footer logo güncelle veya ekle
      if (footer_logo !== undefined) {
        console.log('🔄 API PUT: Footer logo kaydediliyor...');
        await connection.query(
          `INSERT INTO logolar (tip, logo_data) VALUES ('footer', ?)
           ON DUPLICATE KEY UPDATE logo_data = VALUES(logo_data)`,
          [footer_logo]
        );
        console.log('✅ API PUT: Footer logo kaydedildi');
      }
      
      await connection.commit();
      console.log('✅ API PUT: Transaction committed - Logolar veritabanına kaydedildi');
      
      // Doğrulama yap
      const [verification] = await connection.query(
        `SELECT tip, LENGTH(logo_data) as uzunluk FROM logolar WHERE tip IN ('header', 'footer')`
      );
      console.log('🔍 API PUT: Doğrulama sonucu:', verification);
      
      connection.release();
      
      return NextResponse.json({
        success: true,
        message: 'Logolar başarıyla güncellendi',
        verification: verification
      });
    } catch (dbError: any) {
      console.error('❌ API PUT: Database hatası:', dbError);
      await connection.rollback();
      connection.release();
      throw dbError;
    }
  } catch (error: any) {
    console.error('❌ API PUT: Logo güncelleme hatası:', error);
    if (connection) connection.release();
    return NextResponse.json(
      { success: false, message: 'Logo güncellenemedi: ' + error.message },
      { status: 500 }
    );
  }
}
