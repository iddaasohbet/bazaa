import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// Cache: 1 saat (logo sık değişmez)
export const revalidate = 3600;
export const maxDuration = 30;

// In-memory cache for logos
let logoCache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 3600 * 1000; // 1 saat

// GET - Logo bilgilerini getir (cached)
export async function GET(request: NextRequest) {
  try {
    // Check in-memory cache first
    if (logoCache && (Date.now() - logoCache.timestamp) < CACHE_TTL) {
      const response = NextResponse.json({
        success: true,
        data: logoCache.data,
        cached: true
      });
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
      return response;
    }

    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        `SELECT tip, logo_data FROM logolar WHERE tip IN ('header', 'footer')`
      );
      
      const logos: any = {
        header_logo: '',
        footer_logo: ''
      };
      
      (rows as any[]).forEach((row: any) => {
        if (row.tip === 'header') {
          logos.header_logo = row.logo_data || '';
        } else if (row.tip === 'footer') {
          logos.footer_logo = row.logo_data || '';
        }
      });
      
      connection.release();
      
      // Update in-memory cache
      logoCache = { data: logos, timestamp: Date.now() };
      
      const response = NextResponse.json({
        success: true,
        data: logos,
        cached: false
      });
      
      // Vercel CDN cache - 1 saat cache, 24 saat stale
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
      
      return response;
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error: any) {
    console.error('❌ API: Logo getirme hatası:', error.message);
    
    // Fallback - boş logo döndür, 500 hatası verme
    const fallbackLogos = { header_logo: '', footer_logo: '' };
    const response = NextResponse.json({
      success: true,
      data: fallbackLogos,
      fallback: true
    });
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return response;
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
      
      // Clear cache after update
      logoCache = null;
      
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
