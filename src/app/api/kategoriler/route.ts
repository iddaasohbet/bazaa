import { NextResponse } from 'next/server';

// Mock data - veritabanı olmadan çalışması için
const mockKategoriler = [
  { id: 1, ad: 'Araçlar', slug: 'araclar', ikon: 'car', aktif: true, sira: 1 },
  { id: 2, ad: 'Emlak', slug: 'emlak', ikon: 'home', aktif: true, sira: 2 },
  { id: 3, ad: 'Elektronik', slug: 'elektronik', ikon: 'smartphone', aktif: true, sira: 3 },
  { id: 4, ad: 'Ev Eşyaları', slug: 'ev-esyalari', ikon: 'sofa', aktif: true, sira: 4 },
  { id: 5, ad: 'Giyim', slug: 'giyim', ikon: 'shirt', aktif: true, sira: 5 },
  { id: 6, ad: 'Hobi', slug: 'hobi', ikon: 'music', aktif: true, sira: 6 },
  { id: 7, ad: 'İş Makineleri', slug: 'is-makineleri', ikon: 'tractor', aktif: true, sira: 7 },
  { id: 8, ad: 'Diğer', slug: 'diger', ikon: 'grid', aktif: true, sira: 8 },
];

export async function GET() {
  try {
    // Veritabanı olmadan mock data döndür
    return NextResponse.json({
      success: true,
      data: mockKategoriler,
    });
  } catch (error: any) {
    console.error('Kategoriler yüklenirken hata:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

