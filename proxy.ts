import { NextRequest, NextResponse } from 'next/server';

// Coolify (Traefik) handles the www ↔ non-www redirect at the edge based on the
// "Direction" setting in the Coolify dashboard. We intentionally do NOT also
// redirect here — two layers fighting each other (one sending www → non-www,
// the other sending non-www → www) produces ERR_TOO_MANY_REDIRECTS.
//
// Configure Coolify → tripsee app → General → Direction:
//   "Redirect to non-www"  → non-www is canonical (recommended)
//   "Redirect to www"      → www is canonical
//   "No redirect"          → both domains serve directly
//
// Whichever you choose, this middleware will not interfere.

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Uploaded image headers ────────────────────────────────────────────────
  // Long-cache uploads served from disk.
  if (pathname.startsWith('/uploads/')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('Content-Type', 'image/jpeg');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
