import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

const publicRoutes = [
  // '/',
  '/login',
  '/register',
  '/unauthorized',
  '/api/auth/register',
  '/api/auth/login',
  '/api/auth/verify',
];

export function proxy(req) {
  const { pathname } = req.nextUrl;

  // 🔹 Exclure les fichiers statiques (Tailwind, images, JS, etc.)
  if (
    pathname.startsWith('/_next') || // Next.js internal files
    pathname.startsWith('/favicon.ico') || // favicon
    pathname.startsWith('/static') || // anciens fichiers statiques
    publicRoutes.some(route => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  if (!token) {
    console.warn('No token found, redirecting to /login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // if (pathname.startsWith('/admin') && decoded.role !== 'ADMIN') {
    //   console.warn('Non-admin trying to access admin route');
    //   return NextResponse.redirect(new URL('/unauthorized', req.url));
    // }

    return NextResponse.next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/:path*'],
};
