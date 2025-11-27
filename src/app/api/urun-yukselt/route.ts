import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Ürün yükseltme işlemi
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      ilan_id,
      kullanici_id,
      yukseltme_turu, // 'vitrin', 'onecikan', 'kategori_ust'
      sure_gun = 30,
      tutar
    } = body;

    // Gerekli alanları kontrol et
    if (!ilan_id || !kullanici_id || !yukseltme_turu || !tutar) {
      return NextResponse.json(
        { success: false, message: 'Tüm alanlar gereklidir' },
        { status: 400 }
      );
    }

    // İlanın kullanıcıya ait olduğunu kontrol et
    const ilanData = await query(
      'SELECT kullanici_id FROM ilanlar WHERE id = ?',
      [ilan_id]
    );
    const ilan = Array.isArray(ilanData) && ilanData.length > 0 ? ilanData[0] : null;

    if (!ilan || (ilan as any).kullanici_id !== kullanici_id) {
      return NextResponse.json(
        { success: false, message: 'İlan bulunamadı veya size ait değil' },
        { status: 403 }
      );
    }

    // Bitiş tarihini hesapla
    const baslangic = new Date();
    const bitis = new Date();
    bitis.setDate(bitis.getDate() + sure_gun);

    // Yükseltme kaydı oluştur
    const yukseltmeResult = await query(
      `INSERT INTO urun_yukseltme_gecmisi 
       (ilan_id, kullanici_id, yukseltme_turu, baslangic_tarihi, bitis_tarihi) 
       VALUES (?, ?, ?, ?, ?)`,
      [ilan_id, kullanici_id, yukseltme_turu, baslangic, bitis]
    );

    const yukseltmeId = (yukseltmeResult as any).insertId;

    // Ödeme kaydı oluştur
    const odemeResult = await query(
      `INSERT INTO odemeler 
       (kullanici_id, odeme_turu, iliskili_id, tutar, odeme_durumu, aciklama) 
       VALUES (?, 'urun_yukseltme', ?, ?, 'beklemede', ?)`,
      [
        kullanici_id,
        yukseltmeId,
        tutar,
        `${yukseltme_turu} yükseltme - ${sure_gun} gün`
      ]
    );

    const odemeId = (odemeResult as any).insertId;

    // Yükseltme kaydına ödeme ID'sini ekle
    await query(
      'UPDATE urun_yukseltme_gecmisi SET odeme_id = ? WHERE id = ?',
      [odemeId, yukseltmeId]
    );

    // Yükseltme türüne göre işlem yap
    if (yukseltme_turu === 'vitrin') {
      // Vitrine ekle
      await query(
        `INSERT INTO vitrinler 
         (ilan_id, vitrin_turu, bitis_tarihi, aktif) 
         VALUES (?, 'anasayfa', ?, FALSE)`,
        [ilan_id, bitis]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Ürün yükseltme talebi oluşturuldu',
      data: {
        yukseltme_id: yukseltmeId,
        odeme_id: odemeId
      }
    });
  } catch (error: any) {
    console.error('Ürün yükseltme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Yükseltme işlemi sırasında hata oluştu' },
      { status: 500 }
    );
  }
}

// Yükseltme fiyat listesi
export async function GET(request: NextRequest) {
  try {
    const fiyatlar = [
      {
        id: 'vitrin_7',
        ad: 'Vitrin - 7 Gün',
        ad_dari: 'ویترین - ۷ روز',
        yukseltme_turu: 'vitrin',
        sure_gun: 7,
        tutar: 150,
        ozellikler: ['Ana sayfada görünür', 'Özel etiket', 'Öncelikli sıralama']
      },
      {
        id: 'vitrin_30',
        ad: 'Vitrin - 30 Gün',
        ad_dari: 'ویترین - ۳۰ روز',
        yukseltme_turu: 'vitrin',
        sure_gun: 30,
        tutar: 500,
        ozellikler: ['Ana sayfada görünür', 'Özel etiket', 'Öncelikli sıralama', '%20 indirim']
      },
      {
        id: 'onecikan_7',
        ad: 'Öne Çıkan - 7 Gün',
        ad_dari: 'برجسته - ۷ روز',
        yukseltme_turu: 'onecikan',
        sure_gun: 7,
        tutar: 100,
        ozellikler: ['Listede üstte', 'Özel işaret']
      },
      {
        id: 'onecikan_30',
        ad: 'Öne Çıkan - 30 Gün',
        ad_dari: 'برجسته - ۳۰ روز',
        yukseltme_turu: 'onecikan',
        sure_gun: 30,
        tutar: 350,
        ozellikler: ['Listede üstte', 'Özel işaret', '%15 indirim']
      },
      {
        id: 'kategori_ust_7',
        ad: 'Kategori Üstü - 7 Gün',
        ad_dari: 'بالای دسته‌بندی - ۷ روز',
        yukseltme_turu: 'kategori_ust',
        sure_gun: 7,
        tutar: 80,
        ozellikler: ['Kategoride en üstte']
      },
      {
        id: 'kategori_ust_30',
        ad: 'Kategori Üstü - 30 Gün',
        ad_dari: 'بالای دسته‌بندی - ۳۰ روز',
        yukseltme_turu: 'kategori_ust',
        sure_gun: 30,
        tutar: 280,
        ozellikler: ['Kategoride en üstte', '%10 indirim']
      }
    ];

    return NextResponse.json({
      success: true,
      data: fiyatlar
    });
  } catch (error: any) {
    console.error('Fiyat listesi hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Fiyat listesi yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}



