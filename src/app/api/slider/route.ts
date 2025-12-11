import { NextResponse } from 'next/server';
import { getSlider } from '@/lib/ilan';

// GET - Aktif slider'ları getir
export async function GET() {
  // Cache ile hızlı yanıt
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
  };
  
  try {
    const processedSliders = await getSlider();

    return NextResponse.json({
      success: true,
      data: processedSliders
    }, { headers });
  } catch (error: any) {
    console.error('Slider yükleme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

