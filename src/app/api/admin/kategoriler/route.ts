import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Kategorileri listele (ilan sayısı ile birlikte)
export async function GET(request: Request) {
  try {
    const kategoriler = await query(
      `SELECT 
        k.*,
        COUNT(i.id) as ilan_sayisi
       FROM kategoriler k
       LEFT JOIN ilanlar i ON k.id = i.kategori_id AND i.aktif = TRUE
       GROUP BY k.id
       ORDER BY k.sira ASC, k.id ASC`
    );
    
    return NextResponse.json({
      success: true,
      data: kategoriler
    });
  } catch (error: any) {
    console.error('❌ Kategoriler listesi hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت دسته‌بندی‌ها', error: error.message },
      { status: 500 }
    );
  }
}

// Yeni kategori oluştur
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ad, ad_dari, slug, aciklama, ikon = 'grid', aktif = true } = body;

    console.log('📝 Yeni kategori oluşturuluyor:', { ad, slug });

    // Validasyon
    if (!ad || !slug) {
      return NextResponse.json(
        { success: false, message: 'نام و slug الزامی است' },
        { status: 400 }
      );
    }

    // Slug benzersizliği kontrolü
    const existingCategory = await query(
      'SELECT id FROM kategoriler WHERE slug = ?',
      [slug]
    ) as any[];

    if (existingCategory.length > 0) {
      return NextResponse.json(
        { success: false, message: 'این slug قبلاً استفاده شده است' },
        { status: 400 }
      );
    }

    // En yüksek sıra numarasını al
    const maxSiraResult = await query(
      'SELECT MAX(sira) as max_sira FROM kategoriler'
    ) as any[];
    const yeniSira = (maxSiraResult[0]?.max_sira || 0) + 1;

    // Kategori oluştur
    const result = await query(
      `INSERT INTO kategoriler (ad, ad_dari, slug, aciklama, ikon, sira, aktif) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [ad, ad_dari || null, slug, aciklama || null, ikon, yeniSira, aktif ? 1 : 0]
    );

    const kategoriId = (result as any).insertId;
    console.log('✅ Kategori oluşturuldu, ID:', kategoriId);

    // Cache'i temizle (anasayfa ve kategori sayfaları için)
    try {
      revalidatePath('/');
      revalidatePath('/kategori/[slug]', 'page');
    } catch (e) {
      console.log('Revalidation hatası (normal):', e);
    }

    return NextResponse.json({
      success: true,
      message: 'دسته‌بندی با موفقیت ایجاد شد',
      data: { id: kategoriId }
    });
  } catch (error: any) {
    console.error('❌ Kategori oluşturma hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ایجاد دسته‌بندی: ' + error.message },
      { status: 500 }
    );
  }
}

// Kategori güncelle
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ad, ad_dari, slug, aciklama, ikon, sira, aktif } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه دسته‌بندی الزامی است' },
        { status: 400 }
      );
    }

    // Slug benzersizliği kontrolü (kendisi hariç)
    if (slug) {
      const existingCategory = await query(
        'SELECT id FROM kategoriler WHERE slug = ? AND id != ?',
        [slug, id]
      ) as any[];

      if (existingCategory.length > 0) {
        return NextResponse.json(
          { success: false, message: 'این slug توسط دسته‌بندی دیگری استفاده می‌شود' },
          { status: 400 }
        );
      }
    }

    // Güncelleme sorgusu oluştur
    let updateQuery = 'UPDATE kategoriler SET updated_at = NOW()';
    const params: any[] = [];

    if (ad !== undefined) {
      updateQuery += ', ad = ?';
      params.push(ad);
    }
    if (ad_dari !== undefined) {
      updateQuery += ', ad_dari = ?';
      params.push(ad_dari);
    }
    if (slug !== undefined) {
      updateQuery += ', slug = ?';
      params.push(slug);
    }
    if (aciklama !== undefined) {
      updateQuery += ', aciklama = ?';
      params.push(aciklama);
    }
    if (ikon !== undefined) {
      updateQuery += ', ikon = ?';
      params.push(ikon);
    }
    if (sira !== undefined) {
      updateQuery += ', sira = ?';
      params.push(sira);
    }
    if (aktif !== undefined) {
      updateQuery += ', aktif = ?';
      params.push(aktif ? 1 : 0);
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    await query(updateQuery, params);

    // Cache'i temizle
    try {
      revalidatePath('/');
      revalidatePath('/kategori/[slug]', 'page');
    } catch (e) {
      console.log('Revalidation hatası (normal):', e);
    }

    return NextResponse.json({
      success: true,
      message: 'دسته‌بندی با موفقیت به‌روزرسانی شد'
    });
  } catch (error: any) {
    console.error('❌ Kategori güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در به‌روزرسانی دسته‌بندی: ' + error.message },
      { status: 500 }
    );
  }
}

// Kategori sil
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه دسته‌بندی الزامی است' },
        { status: 400 }
      );
    }

    // İlanlı mı kontrol et
    const ilanlarResult = await query(
      'SELECT COUNT(*) as total FROM ilanlar WHERE kategori_id = ?',
      [id]
    ) as any[];
    
    const ilanSayisi = ilanlarResult[0]?.total || 0;
    
    if (ilanSayisi > 0) {
      // İlanları "Diğer" kategorisine taşı veya sil
      // Burada ilanları silmiyoruz, sadece uyarı veriyoruz
      // İsterseniz ilanları başka kategoriye taşıyabiliriz
      
      // Önce ilanları NULL yap (veya başka kategori)
      await query(
        'UPDATE ilanlar SET kategori_id = NULL WHERE kategori_id = ?',
        [id]
      );
    }

    await query('DELETE FROM kategoriler WHERE id = ?', [id]);

    // Cache'i temizle
    try {
      revalidatePath('/');
      revalidatePath('/kategori/[slug]', 'page');
    } catch (e) {
      console.log('Revalidation hatası (normal):', e);
    }

    return NextResponse.json({
      success: true,
      message: 'دسته‌بندی با موفقیت حذف شد'
    });
  } catch (error: any) {
    console.error('❌ Kategori silme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در حذف دسته‌بندی: ' + error.message },
      { status: 500 }
    );
  }
}












