import { NextResponse } from 'next/server';
import { getPremiumIlanlar } from '@/lib/ilan';

// Premium mağazaların ilanlarını getir
export async function GET(request: Request) {
  try {
    const headers = {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'CDN-Cache-Control': 'public, s-maxage=120',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=120',
    };

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8');

    const data = await getPremiumIlanlar(limit);

    console.log('⭐ Premium ilanlar:', data.length, 'adet');

    return NextResponse.json({
      success: true,
      data
    }, { headers });
  } catch (error: any) {
    console.error('❌ Premium ilanlar hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت آگهی‌های ویژه', error: error.message },
      { status: 500 }
    );
  }
}

