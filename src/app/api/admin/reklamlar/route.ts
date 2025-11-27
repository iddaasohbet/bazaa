import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const reklamlar = await query(
      `
      SELECT 
        r.*
      FROM reklamlar r
      ORDER BY 
        CASE r.onay_durumu 
          WHEN 'beklemede' THEN 1
          WHEN 'onaylandi' THEN 2
          WHEN 'reddedildi' THEN 3
        END,
        r.created_at DESC
      `
    );

    return NextResponse.json({
      success: true,
      data: reklamlar
    });
  } catch (error: any) {
    console.error('Admin reklam listesi hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Reklamlar yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}



