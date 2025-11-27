import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Toplam ilanlar
    const ilanlarResult = await query('SELECT COUNT(*) as total FROM ilanlar WHERE aktif = TRUE');
    const totalIlanlar = (ilanlarResult as any)[0].total;

    // Geçen ayki ilanlar
    const gecenAyIlanlar = await query(`
      SELECT COUNT(*) as total FROM ilanlar 
      WHERE aktif = TRUE 
      AND created_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
      AND created_at < CURDATE()
    `);
    const gecenAyTotal = (gecenAyIlanlar as any)[0].total;
    const ilanGrowth = gecenAyTotal > 0 ? Math.round(((totalIlanlar - gecenAyTotal) / gecenAyTotal) * 100) : 0;

    // Toplam kullanıcılar
    const kullanicilarResult = await query('SELECT COUNT(*) as total FROM kullanicilar WHERE aktif = TRUE');
    const totalKullanicilar = (kullanicilarResult as any)[0].total;

    const gecenAyKullanicilar = await query(`
      SELECT COUNT(*) as total FROM kullanicilar 
      WHERE aktif = TRUE 
      AND created_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
      AND created_at < CURDATE()
    `);
    const gecenAyKullaniciTotal = (gecenAyKullanicilar as any)[0].total;
    const kullaniciGrowth = gecenAyKullaniciTotal > 0 ? Math.round(((totalKullanicilar - gecenAyKullaniciTotal) / gecenAyKullaniciTotal) * 100) : 0;

    // Toplam mağazalar
    const magazalarResult = await query('SELECT COUNT(*) as total FROM magazalar WHERE aktif = TRUE');
    const totalMagazalar = (magazalarResult as any)[0].total || 0;

    const gecenAyMagazalar = await query(`
      SELECT COUNT(*) as total FROM magazalar 
      WHERE aktif = TRUE 
      AND created_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
      AND created_at < CURDATE()
    `);
    const gecenAyMagazaTotal = (gecenAyMagazalar as any)[0]?.total || 0;
    const magazaGrowth = gecenAyMagazaTotal > 0 ? Math.round(((totalMagazalar - gecenAyMagazaTotal) / gecenAyMagazaTotal) * 100) : 0;

    // Aylık gelir
    const aylikGelirResult = await query(`
      SELECT COALESCE(SUM(tutar), 0) as total FROM odemeler 
      WHERE odeme_durumu = 'tamamlandi'
      AND created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
    `);
    const aylikGelir = (aylikGelirResult as any)[0].total || 0;

    const gecenAyGelir = await query(`
      SELECT COALESCE(SUM(tutar), 0) as total FROM odemeler 
      WHERE odeme_durumu = 'tamamlandi'
      AND created_at >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH)
      AND created_at < DATE_FORMAT(CURDATE(), '%Y-%m-01')
    `);
    const gecenAyGelirTotal = (gecenAyGelir as any)[0].total || 0;
    const gelirGrowth = gecenAyGelirTotal > 0 ? Math.round(((aylikGelir - gecenAyGelirTotal) / gecenAyGelirTotal) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalIlanlar,
        ilanGrowth,
        totalKullanicilar,
        kullaniciGrowth,
        totalMagazalar,
        magazaGrowth,
        aylikGelir: Math.round(aylikGelir),
        gelirGrowth
      }
    });
  } catch (error: any) {
    console.error('Dashboard stats hatası:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'İstatistikler yüklenirken hata oluştu',
        data: {
          totalIlanlar: 0,
          ilanGrowth: 0,
          totalKullanicilar: 0,
          kullaniciGrowth: 0,
          totalMagazalar: 0,
          magazaGrowth: 0,
          aylikGelir: 0,
          gelirGrowth: 0
        }
      },
      { status: 500 }
    );
  }
}



