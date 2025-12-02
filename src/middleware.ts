import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Admin sayfaları kontrolü
  if (path.startsWith('/admin') && path !== '/admin/giris') {
    // Cookie'den token kontrol et
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      // Token yoksa giriş sayfasına yönlendir
      return NextResponse.redirect(new URL('/admin/giris', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};






