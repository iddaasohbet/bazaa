import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Logo bilgilerini getir
export async function GET(request: NextRequest) {
  try {
    const connection = await pool.getConnection();
    
    try {
      // site_ayarlar tablosundan logo bilgilerini çek
      const [rows] = await connection.query(
        `SELECT anahtar, deger FROM site_ayarlar WHERE anahtar IN ('site_header_logo', 'site_footer_logo')`
      );
      
      const logos: any = {
        header_logo: '',
        footer_logo: ''
      };
      
      (rows as any[]).forEach((row: any) => {
        if (row.anahtar === 'site_header_logo') {
          logos.header_logo = row.deger || '';
        } else if (row.anahtar === 'site_footer_logo') {
          logos.footer_logo = row.deger || '';
        }
      });
      
      connection.release();
      
      return NextResponse.json({
        success: true,
        data: logos
      });
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error: any) {
    console.error('Logo getirme hatası:', error);
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

