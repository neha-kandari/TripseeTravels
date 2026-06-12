'use client';

import { useEffect } from 'react';

// Manual "force a fresh start" page.
// Visit https://tripseetravel.in/clear-cache to nuke every service worker,
// cache, and storage entry the browser holds for this origin, then redirect
// to the homepage. Useful when a visitor reports "the site looks old"
// (typically due to a stale service worker from a prior deploy).

export default function ClearCachePage() {
  useEffect(() => {
    (async () => {
      try {
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister().catch(() => {})));
        }
        if (typeof window !== 'undefined' && window.caches?.keys) {
          const names = await caches.keys();
          await Promise.all(names.map((n) => caches.delete(n).catch(() => {})));
        }
        try { localStorage.clear(); } catch {}
        try { sessionStorage.clear(); } catch {}
      } catch {}
      // Hard reload back to root with cache-buster query string.
      window.location.replace('/?_=' + Date.now());
    })();
  }, []);

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      textAlign: 'center',
      padding: '80px 24px',
      maxWidth: 640,
      margin: '0 auto',
      minHeight: '60vh',
    }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Refreshing Tripsee…</h1>
      <p style={{ color: '#666', fontSize: 16 }}>
        Clearing old cached data and sending you to the latest site.
      </p>
      <noscript>
        Please <a href="/">click here</a> to continue.
      </noscript>
    </div>
  );
}
