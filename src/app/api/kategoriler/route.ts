import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Mock data - fallback için
const mockKategoriler = [
  { id: 1, ad: 'Araçlar', ad_dari: 'وسایل نقلیه', slug: 'araclar', ikon: 'car', aktif: true, sira: 1, ilan_sayisi: 0 },
  { id: 2, ad: 'Emlak', ad_dari: 'املاک', slug: 'emlak', ikon: 'home', aktif: true, sira: 2, ilan_sayisi: 0 },
  { id: 3, ad: 'Elektronik', ad_dari: 'الکترونیک', slug: 'elektronik', ikon: 'smartphone', aktif: true, sira: 3, ilan_sayisi: 0 },
  { id: 4, ad: 'Ev Eşyaları', ad_dari: 'لوازم منزل', slug: 'ev-esyalari', ikon: 'sofa', aktif: true, sira: 4, ilan_sayisi: 0 },
  { id: 5, ad: 'Giyim', ad_dari: 'پوشاک', slug: 'giyim', ikon: 'shirt', aktif: true, sira: 5, ilan_sayisi: 0 },
  { id: 6, ad: 'Hobi', ad_dari: 'سرگرمی', slug: 'hobi', ikon: 'music', aktif: true, sira: 6, ilan_sayisi: 0 },
  { id: 7, ad: 'İş Makineleri', ad_dari: 'ماشین آلات', slug: 'is-makineleri', ikon: 'tractor', aktif: true, sira: 7, ilan_sayisi: 0 },
  { id: 8, ad: 'Diğer', ad_dari: 'دیگر', slug: 'diger', ikon: 'grid', aktif: true, sira: 8, ilan_sayisi: 0 },
];

export async function GET() {
  try {
    // Database'den kategorileri al
    const kategoriler = await query(
      'SELECT * FROM kategoriler ORDER BY sira ASC, id ASC'
    );
    
    return NextResponse.json({
      success: true,
      data: kategoriler,
    });
  } catch (error: any) {
    console.error('❌ Kategoriler yüklenirken hata:', error);
    
    // Hata durumunda mock data döndür
    return NextResponse.json({
      success: true,
      data: mockKategoriler,
    });
  }
}

