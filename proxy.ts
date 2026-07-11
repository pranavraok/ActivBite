import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const LIVE_COMMERCE_PATHS = ['/shop'];
const OLD_COMMERCE_PATHS = ['/cart', '/checkout', '/product'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    OLD_COMMERCE_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    )
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/shop';
    return NextResponse.redirect(url);
  }

  if (
    pathname === '/' ||
    LIVE_COMMERCE_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    ) ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = '/';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: '/:path*',
};
