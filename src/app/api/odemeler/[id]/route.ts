import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Ödeme detayı
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const odemeData = await query(
      `
      SELECT 
        o.*,
        k.ad as kullanici_ad,
        k.email as kullanici_email
      FROM odemeler o
      INNER JOIN kullanicilar k ON o.kullanici_id = k.id
      WHERE o.id = ?
      `,
      [parseInt(id)]
    );

    const odeme: any = Array.isArray(odemeData) && odemeData.length > 0 ? odemeData[0] : null;

    if (!odeme) {
      return NextResponse.json(
        { success: false, message: 'Ödeme bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: odeme
    });
  } catch (error: any) {
    console.error('Ödeme detay hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Ödeme yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// Ödeme durumu güncelleme
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { odeme_durumu, transaction_id } = body;

    if (!odeme_durumu) {
      return NextResponse.json(
        { success: false, message: 'Ödeme durumu gereklidir' },
        { status: 400 }
      );
    }

    // Ödeme durumunu güncelle
    await query(
      `UPDATE odemeler 
       SET odeme_durumu = ?, transaction_id = ?, updated_at = NOW() 
       WHERE id = ?`,
      [odeme_durumu, transaction_id, parseInt(id)]
    );

    // Eğer ödeme tamamlandıysa, ilgili servisi aktifleştir
    if (odeme_durumu === 'tamamlandi') {
      const odemeData = await query('SELECT * FROM odemeler WHERE id = ?', [parseInt(id)]);
      const odeme: any = Array.isArray(odemeData) && odemeData.length > 0 ? odemeData[0] : null;

      if (odeme) {
        await aktivasyonYap(odeme);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Ödeme durumu güncellendi'
    });
  } catch (error: any) {
    console.error('Ödeme güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Ödeme güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// Aktivasyon işlemleri
async function aktivasyonYap(odeme: any) {
  try {
    switch (odeme.odeme_turu) {
      case 'paket':
        // Mağaza paketini aktifleştir
        const paketData = await query('SELECT * FROM paketler WHERE id = ?', [odeme.iliskili_id]);
        const paket: any = Array.isArray(paketData) && paketData.length > 0 ? paketData[0] : null;
        
        if (paket) {
          const baslangic = new Date();
          const bitis = new Date();
          bitis.setMonth(bitis.getMonth() + (paket.sure_ay || 1));

          await query(
            `UPDATE magazalar 
             SET store_level = ?, paket_baslangic = ?, paket_bitis = ? 
             WHERE kullanici_id = ?`,
            [paket.store_level, baslangic, bitis, odeme.kullanici_id]
          );
        }
        break;

      case 'vitrin':
        // Vitrin aktivasyonu (zaten vitrinler tablosuna eklenmiş olmalı)
        await query(
          'UPDATE vitrinler SET aktif = TRUE WHERE id = ?',
          [odeme.iliskili_id]
        );
        break;

      case 'reklam':
        // Reklam aktivasyonu
        await query(
          'UPDATE reklamlar SET aktif = TRUE, onay_durumu = "onaylandi" WHERE id = ?',
          [odeme.iliskili_id]
        );
        break;

      case 'urun_yukseltme':
        // Ürün yükseltme kaydı
        const yukseltmeData = await query(
          'SELECT * FROM urun_yukseltme_gecmisi WHERE id = ?',
          [odeme.iliskili_id]
        );
        const yukseltme: any = Array.isArray(yukseltmeData) && yukseltmeData.length > 0 ? yukseltmeData[0] : null;

        if (yukseltme) {
          if (yukseltme.yukseltme_turu === 'onecikan') {
            await query(
              'UPDATE ilanlar SET onecikan = TRUE WHERE id = ?',
              [yukseltme.ilan_id]
            );
          }
        }
        break;
    }
  } catch (error) {
    console.error('Aktivasyon hatası:', error);
  }
}



