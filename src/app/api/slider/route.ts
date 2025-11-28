import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Aktif slider'ları getir
export async function GET() {
  try {
    const sliders: any = await query(
      `SELECT 
        s.id, 
        s.ilan_id,
        s.baslik, 
        s.aciklama, 
        s.resim, 
        s.link, 
        s.sira,
        i.baslik as ilan_baslik,
        i.aciklama as ilan_aciklama,
        i.fiyat as ilan_fiyat,
        i.ana_resim as ilan_resim,
        k.ad as kategori_ad,
        il.ad as il_ad
       FROM slider s
       LEFT JOIN ilanlar i ON s.ilan_id = i.id
       LEFT JOIN kategoriler k ON i.kategori_id = k.id
       LEFT JOIN iller il ON i.il_id = il.id
       WHERE s.aktif = TRUE 
       ORDER BY s.sira ASC`,
      []
    );

    // İlan varsa ilan bilgilerini kullan, yoksa manuel bilgileri kullan
    const processedSliders = (sliders as any[]).map((slider: any) => ({
      id: slider.id,
      baslik: slider.ilan_id ? slider.ilan_baslik : slider.baslik,
      aciklama: slider.ilan_id ? slider.ilan_aciklama : slider.aciklama,
      resim: slider.ilan_id ? slider.ilan_resim : slider.resim,
      link: slider.ilan_id ? `/ilan/${slider.ilan_id}` : slider.link,
      sira: slider.sira,
      ilan_id: slider.ilan_id,
      fiyat: slider.ilan_fiyat,
      kategori_ad: slider.kategori_ad,
      il_ad: slider.il_ad
    }));

    return NextResponse.json({
      success: true,
      data: processedSliders
    });
  } catch (error: any) {
    console.error('Slider yükleme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

