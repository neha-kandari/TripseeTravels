// Tripsee Service Worker — served dynamically, not as a static file.
//
// Why dynamic?
//   1. Every deploy produces a DIFFERENT response body because the build-time
//      stamp at the top changes. Browsers compare SW scripts byte-for-byte
//      to detect updates — different bytes ⇒ "new" SW ⇒ install + activate
//      on the next update check, GUARANTEED. No more "browser thinks the SW
//      hasn't changed and skips update".
//
//   2. Response headers can be precisely controlled:
//      - Cache-Control: no-store        → never cached anywhere
//      - Clear-Site-Data: "cache"        → on the same trip, the browser
//                                          wipes its HTTP cache for the
//                                          origin, dropping the stale HTML
//                                          the old SW was serving
//      - Service-Worker-Allowed: /       → controls all paths
//      - Content-Type: application/javascript ← required for SW registration
//
// The SW body itself is the same aggressive cleanup script: claim, wipe
// caches, force-navigate every open tab, unregister.

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Bumped automatically by the build because process.env values are inlined
// at build time. Browsers see different bytes per deploy ⇒ guaranteed update.
const BUILD_STAMP = process.env.NEXT_PUBLIC_BUILD_ID || Date.now().toString();

const SW_BODY = `// Tripsee cleanup SW — build ${BUILD_STAMP}
//
// Recovery strategy: claim every client, wipe Cache-API caches, then DECIDE
// whether to force-reload the tab based on whether there's evidence the
// visitor is stuck on a legacy state.
//
//   * Fresh visitor (no old SW, no caches)        → silent cleanup, no reload
//   * Returning visitor with old caches/SW        → force-navigate to recover
//
// Detection: a fresh browser has zero Cache-API caches. A visitor with an
// old caching SW has caches under that origin. Checking caches.keys() length
// BEFORE wiping is a reliable signal of "this user was stuck".

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      await self.clients.claim();

      // Sample existing caches BEFORE wiping — non-empty means a previous
      // caching SW was here and the visitor is likely on stale state.
      const cacheNames = await caches.keys();
      const wasStuck = cacheNames.length > 0;

      // Wipe everything.
      await Promise.all(cacheNames.map((n) => caches.delete(n).catch(() => {})));

      // Only force-reload tabs if we detected stale state. Fresh visitors
      // never see a flash because they had zero caches to begin with.
      if (wasStuck) {
        const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        await Promise.all(wins.map((c) => {
          try {
            // Cache-buster query so the reload pulls fresh HTML from network,
            // bypassing any HTTP-cached entry the browser might still hold.
            const u = new URL(c.url);
            u.searchParams.set('_v', String(Date.now()));
            return c.navigate(u.toString());
          } catch (_) { return null; }
        }));
      }

      await self.registration.unregister();
    } catch (_) {}
  })());
});

// While this SW is briefly alive, never serve from any cache layer.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request, { cache: 'no-store' }).catch(() => fetch(event.request))
  );
});
`;

export async function GET() {
  return new NextResponse(SW_BODY, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Service-Worker-Allowed': '/',
      // Wipe the visitor's HTTP cache on the same response that updates the
      // SW. Crucially does NOT wipe "storage" — that would kill the SW we
      // are right now installing. The new SW handles SW cleanup itself via
      // self.registration.unregister() inside its activate handler.
      'Clear-Site-Data': '"cache"',
    },
  });
}
