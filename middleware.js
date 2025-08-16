// /middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  // If the user is trying to access an authentication page (login/signup)
  if (isAuthPage) {
    // And they are already logged in (they have a token)
    if (token) {
      // Redirect them to the main dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Otherwise, let them see the login/signup page
    return NextResponse.next();
  }

  // For any other page...
  // If the user is NOT logged in (they have no token)
  if (!token) {
    // Redirect them to the login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user IS logged in and they are at the root path '/'
  if (pathname === '/') {
    // Redirect them to the dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If they are logged in and trying to access a protected page (like /dashboard),
  // let them proceed.
  return NextResponse.next();
}

// The config matcher tells the middleware which paths to run on.
// This configuration is correct and does not need to be changed.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
