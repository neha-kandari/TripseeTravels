import type { Metadata, Viewport } from 'next'
import { Limelight, Lalezar, Merienda, Libre_Franklin } from 'next/font/google'
import './globals.css'
import ContactPopup from './components/ContactPopup'
import { AuthProvider } from '@/contexts/AuthContext'
import PerformanceMonitor from './components/PerformanceMonitor'
import Script from 'next/script'

// ─── Self-hosted fonts via next/font ─────────────────────────────────────────
// Downloaded at build time, served from your own domain.
// Zero network request to Google at runtime → no render-blocking → faster FCP.

const limelight = Limelight({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-limelight',
  preload: true,          // above-fold font — preload it
})

const lalezar = Lalezar({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lalezar',
  preload: false,
})

const merienda = Merienda({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merienda',
  preload: false,
})

const libreFranklin = Libre_Franklin({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-libre-franklin',
  preload: false,
})

// ─── Viewport ────────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

// ─── Metadata ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL('https://tripseetravel.in'),
  title: {
    default: 'Tripsee - Your Travel Adventure',
    template: '%s | Tripsee',
  },
  description: 'Discover amazing destinations and create unforgettable memories with our curated travel experiences across Bali, Vietnam, Singapore, Thailand, Maldives, Dubai, Malaysia and the Andamans.',
  keywords: ['travel', 'tour packages', 'honeymoon', 'Bali', 'Vietnam', 'Singapore', 'Thailand', 'Maldives', 'Dubai', 'Malaysia', 'Andamans', 'romantic getaway'],
  authors: [{ name: 'Tripsee Travels' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://tripseetravel.in',
    siteName: 'Tripsee',
    title: 'Tripsee - Your Travel Adventure',
    description: 'Discover amazing destinations and create unforgettable memories with our curated travel experiences.',
    images: [{ url: '/assets/hero-poster.webp', width: 1200, height: 630, alt: 'Tripsee' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tripsee - Your Travel Adventure',
    description: 'Discover amazing destinations and create unforgettable memories with our curated travel experiences.',
    images: ['/assets/hero-poster.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/assets/flaticon.webp', sizes: '32x32', type: 'image/webp' },
      { url: '/assets/flaticon.webp', sizes: '16x16', type: 'image/webp' },
    ],
    shortcut: '/assets/flaticon.webp',
    apple: [{ url: '/assets/flaticon.webp', sizes: '180x180', type: 'image/webp' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${limelight.variable} ${lalezar.variable} ${merienda.variable} ${libreFranklin.variable}`}
      data-scroll-behavior="smooth"
      // Browser extensions (Scribe, Grammarly, dark-mode tools, etc.) inject
      // attributes onto <html> before React hydrates, which would otherwise
      // throw a hydration mismatch. Suppress the warning ONLY on this root
      // element — children still get full hydration checks.
      suppressHydrationWarning
    >
      <head>
        {/*
          BELT-AND-SUSPENDERS www → non-www redirect.

          Runs synchronously before anything else parses. Catches the edge
          case where a stale Service Worker on the www origin serves cached
          OLD HTML (which would otherwise bypass our edge middleware).
          Once this script runs, the user is yanked off www regardless.

          Also includes a stale-build detector: if the cached HTML references
          CSS chunks that no longer exist on the server, we wipe every cache
          + every SW and reload — self-healing rescue from any stuck state.
        */}
        <Script
          id="tripsee-www-redirect-and-rescue"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  // www ↔ non-www redirect is handled at the edge by Coolify
                  // based on its "Direction" setting. We deliberately do NOT
                  // do a client-side redirect here too — it would fight any
                  // server-side redirect and produce ERR_TOO_MANY_REDIRECTS.

                  // Graceful stale-HTML recovery: if a <link rel="stylesheet">
                  // 404s, the HTML the browser cached references CSS hashes
                  // from a deleted build. Instead of leaving the user staring
                  // at an unstyled page, we:
                  //  (1) immediately show a brand-coloured loading overlay
                  //      so they NEVER see the broken layout
                  //  (2) wait one tick to confirm we're actually stuck (CSS
                  //      didn't recover on its own)
                  //  (3) wipe SW + caches in the background
                  //  (4) reload with a cache-buster query string
                  // Guarded by sessionStorage so this runs at most once per
                  // tab — no reload loop is possible.
                  window.addEventListener('error', function(e){
                    var t = e && e.target;
                    if (!t) return;
                    if (t.tagName !== 'LINK' || t.rel !== 'stylesheet') return;
                    if (sessionStorage.getItem('tripsee_recovered')) return;
                    sessionStorage.setItem('tripsee_recovered', '1');

                    // Brand-coloured full-screen overlay so the user sees a
                    // graceful "Loading…" state instead of a blank or
                    // unstyled page.
                    function showOverlay() {
                      if (document.getElementById('tripsee-recovery-overlay')) return;
                      var d = document.createElement('div');
                      d.id = 'tripsee-recovery-overlay';
                      d.style.cssText = [
                        'position:fixed','inset:0',
                        'background:linear-gradient(135deg,#fff7ed 0%,#fed7aa 50%,#fdba74 100%)',
                        'z-index:2147483647',
                        'display:flex','flex-direction:column',
                        'align-items:center','justify-content:center',
                        'font-family:system-ui,-apple-system,sans-serif',
                        'color:#9a3412','-webkit-font-smoothing:antialiased'
                      ].join(';');
                      d.innerHTML =
                        '<div style="font-size:32px;font-weight:700;margin-bottom:12px;letter-spacing:-.02em">Loading Tripsee…</div>' +
                        '<div style="font-size:14px;opacity:.7">Refreshing to the latest version</div>' +
                        '<div style="margin-top:24px;width:36px;height:36px;border:3px solid #fed7aa;border-top-color:#ea580c;border-radius:50%;animation:tripsee-spin 0.8s linear infinite"></div>' +
                        '<style>@keyframes tripsee-spin{to{transform:rotate(360deg)}}</style>';
                      (document.body || document.documentElement).appendChild(d);
                    }
                    if (document.body) showOverlay();
                    else document.addEventListener('DOMContentLoaded', showOverlay);

                    // Cleanup + reload, all silent in the background.
                    function cleanup(){
                      var p1 = ('serviceWorker' in navigator)
                        ? navigator.serviceWorker.getRegistrations()
                            .then(function(rs){ return Promise.all(rs.map(function(r){ return r.unregister().catch(function(){}); })); })
                            .catch(function(){})
                        : Promise.resolve();
                      var p2 = (window.caches && caches.keys)
                        ? caches.keys().then(function(names){
                            return Promise.all(names.map(function(n){ return caches.delete(n).catch(function(){}); }));
                          }).catch(function(){})
                        : Promise.resolve();
                      return Promise.all([p1, p2]);
                    }
                    cleanup().then(function(){
                      // Cache-buster query so HTTP cache MUST refetch HTML.
                      var sep = location.search ? '&' : '?';
                      location.replace(location.pathname + location.search + sep + '_v=' + Date.now() + location.hash);
                    });
                  }, true);
                } catch(e) {}
              })();
            `,
          }}
        />

        {/* Prevent HTML pages from being cached — ensures every deploy is instantly live */}
        <meta httpEquiv="Cache-Control" content="no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />

        {/* Hero poster — fetched before JS/CSS so the page looks full instantly */}
        <link rel="preload" as="image" href="/assets/hero-poster.webp" fetchPriority="high" />

        {/* Cloudinary hosts the hero video + testimonial videos — preconnect saves
            ~100-300ms on first byte by warming TLS up front. */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* WhatsApp CTAs throughout the site — DNS hint keeps the click fast. */}
        <link rel="dns-prefetch" href="https://wa.me" />

        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/assets/flaticon.webp" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/flaticon.webp" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <ContactPopup />
          <PerformanceMonitor />
        </AuthProvider>

        {/*
          SW registration — passive, no side effects on the current page.

          The /sw.js route (app/sw.js/route.ts) is dynamic and embeds a
          build-time stamp, so its bytes differ per deploy. The browser
          notices the change on its next update check and installs the new
          SW, which then claims clients, wipes caches, and unregisters
          itself — all WITHOUT navigating the current tab. The user keeps
          seeing whatever HTML they have; their next click hits the network.

          The aggressive `wipe-all-caches-on-every-page-load` we used to do
          here is removed: it duplicated the SW's cleanup and contributed to
          blank-flash issues during route changes.
        */}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                try {
                  navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).catch(function(){});
                } catch (e) {}
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
