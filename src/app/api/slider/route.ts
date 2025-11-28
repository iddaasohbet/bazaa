import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Aktif slider'ları getir
export async function GET() {
  try {
    const sliders = await query(
      `SELECT id, baslik, aciklama, resim, link, sira
       FROM slider 
       WHERE aktif = TRUE 
       ORDER BY sira ASC`,
      []
    );

    return NextResponse.json({
      success: true,
      data: sliders
    });
  } catch (error: any) {
    console.error('Slider yükleme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

