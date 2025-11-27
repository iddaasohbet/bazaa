import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const vitrinler = await query(
      `
      SELECT 
        v.id,
        v.vitrin_turu,
        v.sira,
        v.baslangic_tarihi,
        v.bitis_tarihi,
        v.aktif,
        v.goruntulenme,
        v.tiklanma,
        i.baslik as ilan_baslik,
        m.ad as magaza_ad,
        k.ad as kategori_ad
      FROM vitrinler v
      INNER JOIN ilanlar i ON v.ilan_id = i.id
      LEFT JOIN magazalar m ON v.magaza_id = m.id
      LEFT JOIN kategoriler k ON v.kategori_id = k.id
      ORDER BY v.created_at DESC
      `
    );

    return NextResponse.json({
      success: true,
      data: vitrinler
    });
  } catch (error: any) {
    console.error('Admin vitrin listesi hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Vitrinler yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}



