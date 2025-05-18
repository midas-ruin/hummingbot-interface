import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/bots',
  '/settings',
];

// Define public routes (no auth check)
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/about',
  '/api/auth/verify',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if current path is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if current path is explicitly public
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith('/api/') || pathname.startsWith('/_next/')
  );
  
  // Get Privy session cookie
  const privyCookie = request.cookies.get('privy-token');
  const hasSession = !!privyCookie;
  
  // If it's a protected route and no session exists, redirect to login
  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    // Store the intended destination for post-login redirect
    loginUrl.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(loginUrl);
  }
  
  // Add security headers to all responses
  const response = NextResponse.next();
  
  // Set security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Set Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://api.privy.io https://privy.io; connect-src 'self' https://api.privy.io; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-src 'self' https://privy.io; object-src 'none';"
  );
  
  return response;
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    // Match all routes except for static files, API routes with CORS options
    '/((?!_next/static|_next/image|favicon.ico|api/auth/options).*)',
  ],
};
