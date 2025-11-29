import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Tüm paketleri getir
export async function GET() {
  try {
    const paketler: any = await query(
      `SELECT 
        id, ad, ad_dari, store_level, sure_ay, fiyat, eski_fiyat,
        product_limit, category_limit, aktif, ozellikler, created_at
       FROM paketler 
       ORDER BY 
        CASE store_level 
          WHEN 'basic' THEN 1
          WHEN 'pro' THEN 2
          WHEN 'elite' THEN 3
        END,
        sure_ay ASC`,
      []
    );

    // Parse JSON ozellikler
    const parsedPaketler = paketler.map((paket: any) => ({
      ...paket,
      ozellikler: paket.ozellikler ? JSON.parse(paket.ozellikler) : null
    }));

    return NextResponse.json({
      success: true,
      data: parsedPaketler
    });
  } catch (error: any) {
    console.error('Paket yükleme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - Yeni paket ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ad, ad_dari, store_level, sure_ay, fiyat, eski_fiyat, product_limit, category_limit, aktif, ozellikler } = body;

    if (!ad || !ad_dari) {
      return NextResponse.json(
        { success: false, message: 'نام پکیج الزامی است' },
        { status: 400 }
      );
    }

    // Ozellikler'i JSON string'e çevir
    const ozelliklerJson = ozellikler ? JSON.stringify(ozellikler) : null;

    const result = await query(
      `INSERT INTO paketler 
       (ad, ad_dari, store_level, sure_ay, fiyat, eski_fiyat, product_limit, category_limit, aktif, ozellikler) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ad,
        ad_dari,
        store_level || 'basic',
        sure_ay || 1,
        fiyat || 0,
        eski_fiyat || null,
        product_limit || 50,
        category_limit || 1,
        aktif !== false ? 1 : 0,
        ozelliklerJson
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'پکیج اضافه شد',
      data: { id: (result as any).insertId }
    });
  } catch (error: any) {
    console.error('Paket ekleme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Paket güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ad, ad_dari, store_level, sure_ay, fiyat, eski_fiyat, product_limit, category_limit, aktif, ozellikler } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه پکیج الزامی است' },
        { status: 400 }
      );
    }

    // Ozellikler'i JSON string'e çevir
    const ozelliklerJson = ozellikler ? JSON.stringify(ozellikler) : null;

    await query(
      `UPDATE paketler 
       SET ad = ?, ad_dari = ?, store_level = ?, sure_ay = ?, fiyat = ?, eski_fiyat = ?,
           product_limit = ?, category_limit = ?, aktif = ?, ozellikler = ?
       WHERE id = ?`,
      [
        ad,
        ad_dari,
        store_level,
        sure_ay,
        fiyat,
        eski_fiyat || null,
        product_limit,
        category_limit,
        aktif !== false ? 1 : 0,
        ozelliklerJson,
        id
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'پکیج به‌روزرسانی شد'
    });
  } catch (error: any) {
    console.error('Paket güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Paket sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه پکیج الزامی است' },
        { status: 400 }
      );
    }

    await query('DELETE FROM paketler WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'پکیج حذف شد'
    });
  } catch (error: any) {
    console.error('Paket silme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}





