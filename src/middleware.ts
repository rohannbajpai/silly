import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('__session'); // Firebase Auth cookie
  const { pathname } = request.nextUrl;

  // Auth routes that should redirect to dashboard if logged in
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    if (authCookie) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes that require authentication
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding')) {
    if (!authCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/signup', '/dashboard/:path*', '/onboarding/:path*'],
}; 