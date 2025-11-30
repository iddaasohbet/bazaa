import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Mağazaları listele
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const onay_durumu = searchParams.get('onay_durumu');
    const store_level = searchParams.get('store_level');

    let sql = `
      SELECT 
        m.id, m.ad, m.ad_dari, m.slug, m.logo, m.telefon, m.store_level,
        m.onay_durumu, m.aktif, m.goruntulenme, m.created_at,
        u.ad as kullanici_ad,
        u.email as kullanici_email,
        il.ad as il_ad,
        COUNT(i.id) as ilan_sayisi
      FROM magazalar m
      LEFT JOIN kullanicilar u ON m.kullanici_id = u.id
      LEFT JOIN iller il ON m.il_id = il.id
      LEFT JOIN ilanlar i ON m.id = i.magaza_id AND i.aktif = TRUE
      WHERE 1=1
    `;

    const params: any[] = [];

    if (onay_durumu) {
      sql += ' AND m.onay_durumu = ?';
      params.push(onay_durumu);
    }

    if (store_level) {
      sql += ' AND m.store_level = ?';
      params.push(store_level);
    }

    sql += ' GROUP BY m.id ORDER BY m.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const magazalar = await query(sql, params);

    // Toplam sayı
    let countSql = 'SELECT COUNT(*) as total FROM magazalar WHERE 1=1';
    const countParams: any[] = [];
    
    if (onay_durumu) {
      countSql += ' AND onay_durumu = ?';
      countParams.push(onay_durumu);
    }
    if (store_level) {
      countSql += ' AND store_level = ?';
      countParams.push(store_level);
    }

    const countResult = await query(countSql, countParams) as any[];
    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: magazalar,
      total,
      limit,
      offset
    });
  } catch (error: any) {
    console.error('❌ Mağazalar listesi hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت لیست مغازه‌ها', error: error.message },
      { status: 500 }
    );
  }
}

// Yeni mağaza oluştur
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      kullanici_id,
      ad,
      ad_dari,
      slug,
      aciklama,
      logo,
      kapak_resmi,
      telefon,
      adres,
      il_id,
      store_level = 'basic',
      tema_renk = '#3B82F6',
      aktif = true,
      onay_durumu = 'beklemede'
    } = body;

    console.log('📝 Yeni mağaza oluşturuluyor:', { ad, kullanici_id, store_level });

    // Validasyon
    if (!kullanici_id || !ad || !slug || !il_id) {
      return NextResponse.json(
        { success: false, message: 'صاحب مغازه، نام، slug و شهر الزامی است' },
        { status: 400 }
      );
    }

    // Slug benzersizliği kontrolü
    const existingStore = await query(
      'SELECT id FROM magazalar WHERE slug = ?',
      [slug]
    ) as any[];

    if (existingStore.length > 0) {
      return NextResponse.json(
        { success: false, message: 'این slug قبلاً استفاده شده است' },
        { status: 400 }
      );
    }

    // Store level'a göre limitler
    const limits = {
      basic: { product_limit: 50, category_limit: 1, listing_priority: 0, search_weight: 1.0 },
      pro: { product_limit: 200, category_limit: 3, listing_priority: 1, search_weight: 1.5 },
      elite: { product_limit: 999999, category_limit: 999, listing_priority: 2, search_weight: 2.0 }
    };

    const storeLimits = limits[store_level as keyof typeof limits] || limits.basic;

    // Mağaza oluştur
    const result = await query(
      `INSERT INTO magazalar (
        kullanici_id, ad, ad_dari, slug, aciklama, logo, kapak_resmi,
        telefon, adres, il_id, store_level, tema_renk,
        product_limit, category_limit, listing_priority, search_weight,
        aktif, onay_durumu, goruntulenme
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        kullanici_id, ad, ad_dari || null, slug, aciklama || null,
        logo || null, kapak_resmi || null, telefon || null, adres || null,
        il_id, store_level, tema_renk,
        storeLimits.product_limit, storeLimits.category_limit,
        storeLimits.listing_priority, storeLimits.search_weight,
        aktif ? 1 : 0, onay_durumu
      ]
    );

    const magazaId = (result as any).insertId;
    console.log('✅ Mağaza oluşturuldu, ID:', magazaId);

    return NextResponse.json({
      success: true,
      message: 'مغازه با موفقیت ایجاد شد',
      data: { id: magazaId }
    });
  } catch (error: any) {
    console.error('❌ Mağaza oluşturma hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ایجاد مغازه: ' + error.message },
      { status: 500 }
    );
  }
}

// Mağaza güncelle
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      id,
      ad,
      ad_dari,
      aciklama,
      logo,
      kapak_resmi,
      telefon,
      adres,
      il_id,
      store_level,
      tema_renk,
      aktif,
      onay_durumu
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه مغازه الزامی است' },
        { status: 400 }
      );
    }

    // Store level değişirse limitler de değişsin
    let updateQuery = `
      UPDATE magazalar SET 
        updated_at = NOW()
    `;
    const params: any[] = [];

    if (ad !== undefined) {
      updateQuery += ', ad = ?';
      params.push(ad);
    }
    if (ad_dari !== undefined) {
      updateQuery += ', ad_dari = ?';
      params.push(ad_dari);
    }
    if (aciklama !== undefined) {
      updateQuery += ', aciklama = ?';
      params.push(aciklama);
    }
    if (logo !== undefined) {
      updateQuery += ', logo = ?';
      params.push(logo);
    }
    if (kapak_resmi !== undefined) {
      updateQuery += ', kapak_resmi = ?';
      params.push(kapak_resmi);
    }
    if (telefon !== undefined) {
      updateQuery += ', telefon = ?';
      params.push(telefon);
    }
    if (adres !== undefined) {
      updateQuery += ', adres = ?';
      params.push(adres);
    }
    if (il_id !== undefined) {
      updateQuery += ', il_id = ?';
      params.push(il_id);
    }
    if (tema_renk !== undefined) {
      updateQuery += ', tema_renk = ?';
      params.push(tema_renk);
    }
    if (aktif !== undefined) {
      updateQuery += ', aktif = ?';
      params.push(aktif ? 1 : 0);
    }
    if (onay_durumu !== undefined) {
      updateQuery += ', onay_durumu = ?';
      params.push(onay_durumu);
    }

    // Store level değişirse limitler de değişsin
    if (store_level !== undefined) {
      const limits = {
        basic: { product_limit: 50, category_limit: 1, listing_priority: 0, search_weight: 1.0 },
        pro: { product_limit: 200, category_limit: 3, listing_priority: 1, search_weight: 1.5 },
        elite: { product_limit: 999999, category_limit: 999, listing_priority: 2, search_weight: 2.0 }
      };
      const storeLimits = limits[store_level as keyof typeof limits] || limits.basic;
      
      updateQuery += ', store_level = ?, product_limit = ?, category_limit = ?, listing_priority = ?, search_weight = ?';
      params.push(store_level, storeLimits.product_limit, storeLimits.category_limit, storeLimits.listing_priority, storeLimits.search_weight);
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    await query(updateQuery, params);

    return NextResponse.json({
      success: true,
      message: 'مغازه با موفقیت به‌روزرسانی شد'
    });
  } catch (error: any) {
    console.error('❌ Mağaza güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در به‌روزرسانی مغازه: ' + error.message },
      { status: 500 }
    );
  }
}

// Mağaza sil
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه مغازه الزامی است' },
        { status: 400 }
      );
    }

    await query('DELETE FROM magazalar WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'مغازه با موفقیت حذف شد'
    });
  } catch (error: any) {
    console.error('❌ Mağaza silme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در حذف مغازه: ' + error.message },
      { status: 500 }
    );
  }
}











