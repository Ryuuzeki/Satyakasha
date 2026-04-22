import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware ini dieksekusi di Edge Runtime, jadi standard Node.js crypto tidak tersedia langsung
// Kita hanya akan mengecek eksistensi cookie secara pasif, validasi kriptografis penuh dilakukan di /api/auth/me
// Ini adalah praktik umum untuk Edge Middleware
export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token');

  // Proteksi rute /dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      // Tidak ada token, tendang kembali ke login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
