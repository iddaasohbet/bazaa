import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    // Admin kontrolü
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'غیر مجاز' },
        { status: 401 }
      );
    }

    // 30 gün öncesi
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Toplam ilanlar
    const [ilanlar] = await query(
      'SELECT COUNT(*) as toplam FROM ilanlar WHERE aktif = TRUE',
      []
    ) as any[];

    // 30 gün önceki ilanlar
    const [ilanlarOld] = await query(
      'SELECT COUNT(*) as toplam FROM ilanlar WHERE aktif = TRUE AND created_at < ?',
      [thirtyDaysAgo]
    ) as any[];

    const totalIlanlar = ilanlar.toplam;
    const ilanGrowth = ilanlarOld.toplam > 0 
      ? Math.round(((totalIlanlar - ilanlarOld.toplam) / ilanlarOld.toplam) * 100)
      : 0;

    // Toplam kullanıcılar
    const [kullanicilar] = await query(
      'SELECT COUNT(*) as toplam FROM kullanicilar',
      []
    ) as any[];

    const [kullanicilarOld] = await query(
      'SELECT COUNT(*) as toplam FROM kullanicilar WHERE created_at < ?',
      [thirtyDaysAgo]
    ) as any[];

    const totalKullanicilar = kullanicilar.toplam;
    const kullaniciGrowth = kullanicilarOld.toplam > 0
      ? Math.round(((totalKullanicilar - kullanicilarOld.toplam) / kullanicilarOld.toplam) * 100)
      : 0;

    // Toplam mağazalar
    const [magazalar] = await query(
      'SELECT COUNT(*) as toplam FROM magazalar WHERE aktif = TRUE',
      []
    ) as any[];

    const [magazalarOld] = await query(
      'SELECT COUNT(*) as toplam FROM magazalar WHERE aktif = TRUE AND created_at < ?',
      [thirtyDaysAgo]
    ) as any[];

    const totalMagazalar = magazalar.toplam;
    const magazaGrowth = magazalarOld.toplam > 0
      ? Math.round(((totalMagazalar - magazalarOld.toplam) / magazalarOld.toplam) * 100)
      : 0;

    // Aylık gelir (bu ayki ödemeler)
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const [gelir] = await query(
      `SELECT COALESCE(SUM(tutar), 0) as toplam 
       FROM odemeler 
       WHERE durum = 'onaylandi' 
       AND created_at >= ?`,
      [firstDayOfMonth]
    ) as any[];

    // Geçen ayki gelir
    const firstDayOfLastMonth = new Date(firstDayOfMonth);
    firstDayOfLastMonth.setMonth(firstDayOfLastMonth.getMonth() - 1);
    
    const [gelirOld] = await query(
      `SELECT COALESCE(SUM(tutar), 0) as toplam 
       FROM odemeler 
       WHERE durum = 'onaylandi' 
       AND created_at >= ? 
       AND created_at < ?`,
      [firstDayOfLastMonth, firstDayOfMonth]
    ) as any[];

    const aylikGelir = gelir.toplam;
    const gelirGrowth = gelirOld.toplam > 0
      ? Math.round(((aylikGelir - gelirOld.toplam) / gelirOld.toplam) * 100)
      : 0;

    // Bugünün istatistikleri
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [bugunIlanlar] = await query(
      'SELECT COUNT(*) as toplam FROM ilanlar WHERE DATE(created_at) = CURDATE()',
      []
    ) as any[];

    const [bugunKullanicilar] = await query(
      'SELECT COUNT(*) as toplam FROM kullanicilar WHERE DATE(created_at) = CURDATE()',
      []
    ) as any[];

    const [bugunGoruntulenme] = await query(
      'SELECT COALESCE(SUM(goruntulenme), 0) as toplam FROM ilanlar WHERE DATE(updated_at) = CURDATE()',
      []
    ) as any[];

    // Bekleyen işlemler
    const [bekleyenIlanlar] = await query(
      'SELECT COUNT(*) as toplam FROM ilanlar WHERE onay_durumu = ?',
      ['beklemede']
    ) as any[];

    const [bekleyenMagazalar] = await query(
      'SELECT COUNT(*) as toplam FROM magazalar WHERE onay_durumu = ?',
      ['beklemede']
    ) as any[];

    const [bekleyenOdemeler] = await query(
      'SELECT COUNT(*) as toplam FROM odemeler WHERE durum = ?',
      ['beklemede']
    ) as any[];

    return NextResponse.json({
      success: true,
      data: {
        totalIlanlar,
        ilanGrowth,
        totalKullanicilar,
        kullaniciGrowth,
        totalMagazalar,
        magazaGrowth,
        aylikGelir,
        gelirGrowth,
        bugun: {
          ilanlar: bugunIlanlar.toplam,
          kullanicilar: bugunKullanicilar.toplam,
          goruntulenme: bugunGoruntulenme.toplam
        },
        bekleyen: {
          ilanlar: bekleyenIlanlar.toplam,
          magazalar: bekleyenMagazalar.toplam,
          odemeler: bekleyenOdemeler.toplam
        }
      }
    });
  } catch (error: any) {
    console.error('❌ Dashboard stats hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
