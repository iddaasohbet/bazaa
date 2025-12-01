import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Logo bilgilerini getir
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: Logo GET isteği alındı');
    const connection = await pool.getConnection();
    
    try {
      // site_ayarlar tablosundan logo bilgilerini çek
      const [rows] = await connection.query(
        `SELECT anahtar, deger FROM site_ayarlar WHERE anahtar IN ('site_header_logo', 'site_footer_logo')`
      );
      
      console.log('📊 API: Database sorgu sonucu:', (rows as any[]).length, 'kayıt bulundu');
      
      const logos: any = {
        header_logo: '',
        footer_logo: ''
      };
      
      (rows as any[]).forEach((row: any) => {
        console.log('📝 API: Kayıt işleniyor -', row.anahtar, '- Uzunluk:', row.deger?.length || 0);
        if (row.anahtar === 'site_header_logo') {
          logos.header_logo = row.deger || '';
        } else if (row.anahtar === 'site_footer_logo') {
          logos.footer_logo = row.deger || '';
        }
      });
      
      console.log('✅ API: Logolar hazırlandı - Header:', logos.header_logo.length, 'Footer:', logos.footer_logo.length);
      
      connection.release();
      
      const response = NextResponse.json({
        success: true,
        data: logos
      });
      
      // Cache'i engelle - Her zaman güncel veriyi getir
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      
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
  try {
    const body = await request.json();
    const { header_logo, footer_logo } = body;
    
    console.log('💾 API PUT: Logo güncelleme isteği alındı');
    console.log('📏 API PUT: Header logo uzunluk:', header_logo?.length || 0);
    console.log('📏 API PUT: Footer logo uzunluk:', footer_logo?.length || 0);
    
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Header logo güncelle veya ekle
      if (header_logo !== undefined) {
        const [existing] = await connection.query(
          `SELECT id FROM site_ayarlar WHERE anahtar = 'site_header_logo'`
        );
        
        if ((existing as any[]).length > 0) {
          // Güncelle
          await connection.query(
            `UPDATE site_ayarlar SET deger = ? WHERE anahtar = 'site_header_logo'`,
            [header_logo]
          );
        } else {
          // Ekle
          await connection.query(
            `INSERT INTO site_ayarlar (anahtar, deger, kategori, aciklama) VALUES (?, ?, 'logo', 'Header Logo')`,
            ['site_header_logo', header_logo]
          );
        }
      }
      
      // Footer logo güncelle veya ekle
      if (footer_logo !== undefined) {
        const [existing] = await connection.query(
          `SELECT id FROM site_ayarlar WHERE anahtar = 'site_footer_logo'`
        );
        
        if ((existing as any[]).length > 0) {
          // Güncelle
          await connection.query(
            `UPDATE site_ayarlar SET deger = ? WHERE anahtar = 'site_footer_logo'`,
            [footer_logo]
          );
        } else {
          // Ekle
          await connection.query(
            `INSERT INTO site_ayarlar (anahtar, deger, kategori, aciklama) VALUES (?, ?, 'logo', 'Footer Logo')`,
            ['site_footer_logo', footer_logo]
          );
        }
      }
      
      await connection.commit();
      console.log('✅ API PUT: Logolar database\'e kaydedildi');
      connection.release();
      
      return NextResponse.json({
        success: true,
        message: 'Logolar başarıyla güncellendi'
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error: any) {
    console.error('Logo güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Logo güncellenemedi: ' + error.message },
      { status: 500 }
    );
  }
}

