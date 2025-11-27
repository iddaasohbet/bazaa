import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kullaniciId = searchParams.get('kullanici_id');

    // Eğer kullanıcı ID'si varsa, kullanıcıya özel istatistikleri dön
    if (kullaniciId) {
      // Aktif ilan sayısı
      const ilanlarResult: any = await query(
        'SELECT COUNT(*) as toplam, COALESCE(SUM(goruntulenme), 0) as toplamGoruntulenme FROM ilanlar WHERE kullanici_id = ? AND aktif = 1',
        [kullaniciId]
      );
      const aktifIlanlar = ilanlarResult[0]?.toplam || 0;
      const toplamGoruntulenme = ilanlarResult[0]?.toplamGoruntulenme || 0;

      // Favori sayısı
      const favorilerResult: any = await query(
        'SELECT COUNT(*) as toplam FROM favoriler f JOIN ilanlar i ON f.ilan_id = i.id WHERE i.kullanici_id = ?',
        [kullaniciId]
      );
      const toplamFavoriler = favorilerResult[0]?.toplam || 0;

      // Mesaj sayısı (gelen mesajlar)
      const mesajlarResult: any = await query(
        'SELECT COUNT(*) as toplam FROM mesajlar WHERE alici_id = ? AND okundu = 0',
        [kullaniciId]
      );
      const toplamMesajlar = mesajlarResult[0]?.toplam || 0;

      return NextResponse.json({
        success: true,
        data: {
          aktifIlanlar,
          toplamGoruntulenme,
          toplamFavoriler,
          toplamMesajlar,
        },
      });
    }

    // Genel istatistikler
    // Aktif ilan sayısı
    const ilanlarResult: any = await query(
      'SELECT COUNT(*) as toplam FROM ilanlar WHERE aktif = 1'
    );
    const aktifIlanlar = ilanlarResult[0]?.toplam || 0;

    // Mağaza sayısı
    const magazalarResult: any = await query(
      'SELECT COUNT(*) as toplam FROM magazalar WHERE aktif = 1'
    );
    const aktifMagazalar = magazalarResult[0]?.toplam || 0;

    // Bugün eklenen ilan sayısı
    const bugunResult: any = await query(
      'SELECT COUNT(*) as toplam FROM ilanlar WHERE DATE(created_at) = CURDATE() AND aktif = 1'
    );
    const bugunEklenen = bugunResult[0]?.toplam || 0;

    // Kullanıcı sayısı
    const kullanicilarResult: any = await query(
      'SELECT COUNT(*) as toplam FROM kullanicilar WHERE aktif = 1'
    );
    const toplamKullanicilar = kullanicilarResult[0]?.toplam || 0;

    return NextResponse.json({
      success: true,
      data: {
        aktifIlanlar,
        aktifMagazalar,
        bugunEklenen,
        toplamKullanicilar,
      },
    });
  } catch (error: any) {
    console.error('❌ İstatistik hatası:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'خطا در بارگذاری آمار',
        // Hata durumunda varsayılan değerler dön
        data: {
          aktifIlanlar: 0,
          toplamGoruntulenme: 0,
          toplamFavoriler: 0,
          toplamMesajlar: 0,
          aktifMagazalar: 0,
          bugunEklenen: 0,
          toplamKullanicilar: 0,
        },
      },
      { status: 200 } // 500 yerine 200 dön, frontend çalışmaya devam etsin
    );
  }
}

