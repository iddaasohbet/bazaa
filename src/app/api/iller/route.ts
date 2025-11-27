import { NextResponse } from 'next/server';

// Mock iller data - Afganistan şehirleri
const mockIller = [
  { id: 1, ad: 'Kabil', slug: 'kabil' },
  { id: 2, ad: 'Herat', slug: 'herat' },
  { id: 3, ad: 'Kandahar', slug: 'kandahar' },
  { id: 4, ad: 'Mazar-ı Şerif', slug: 'mazar-i-serif' },
  { id: 5, ad: 'Celalabad', slug: 'celalabad' },
  { id: 6, ad: 'Kunduz', slug: 'kunduz' },
  { id: 7, ad: 'Bamiyan', slug: 'bamiyan' },
  { id: 8, ad: 'Gazni', slug: 'gazni' },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: mockIller,
    });
  } catch (error: any) {
    console.error('İller yüklenirken hata:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

