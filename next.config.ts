import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // 'standalone' ONLY when our Dockerfile is building the image.
  // We use DOCKER_BUILD=1 (set in the Dockerfile ENV) — NOT NEXT_OUTPUT — so that
  // accidentally setting an env var in Coolify's UI can never trigger standalone mode.
  //
  // Coolify/Nixpacks deploys: DOCKER_BUILD is never set → no standalone → next start
  //   works correctly and CSS is found at .next/static/ ✅
  // Docker builds (Dockerfile): DOCKER_BUILD=1 is set → standalone output →
  //   node server.js serves from the right place ✅
  ...(process.env.DOCKER_BUILD === '1' ? { output: 'standalone' } : {}),

  // Static file handling
  trailingSlash: false,
  generateEtags: true,

  // React + bundling
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  compress: true,

  // ── No assetPrefix ────────────────────────────────────────────────────────
  // Hashed bundles are served from whichever host the HTML came from
  // (relative `/_next/static/...` URLs). Same-origin requests can't fail
  // any differently than the HTML itself, which eliminates an entire class
  // of "HTML loaded but CSS 404'd" scenarios. The www→non-www edge redirect
  // in proxy.ts ensures visitors land on the canonical host before HTML is
  // served, so an absolute asset prefix is unnecessary.

  // Strip every console.* call from production client bundles, except
  // console.error and console.warn so real runtime problems still surface.
  // Dev builds keep everything for debugging.
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  // Performance optimizations — only list packages that are actually imported.
  experimental: {
    optimizePackageImports: ["@heroicons/react"],
    scrollRestoration: true,
  },

  // Turbopack empty config to silence warning when webpack config is present
  turbopack: {},

  // Server external packages (not bundled — loaded from node_modules at runtime)
  serverExternalPackages: ["mongoose", "mongodb", "cloudinary", "multer", "firebase", "sharp"],
  
  // Webpack configuration for better builds
  webpack: (config, { isServer }) => {
    // Handle node modules that need to be externalized
    if (isServer) {
      config.externals.push('mongoose', 'mongodb', 'firebase');
    }
    
    // Fix for 'self is not defined' error
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        // Firebase fallbacks
        'firebase/app': false,
        'firebase/auth': false,
        'firebase/firestore': false,
        'firebase/storage': false,
      };
    }
    
    return config;
  },
  
  // Cache headers
  async headers() {
    return [
      // ── ALL routes: NEVER cache HTML ─────────────────────────────────────────
      // Catch-all at the top ensures EVERY page (current and future) is always
      // fetched fresh. The asset-specific rules below override this for static
      // files (hashed filenames) — they come later so their value wins.
      {
        source: "/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
      // ── /sw.js: NEVER cache the service worker file ───────────────────────
      // Browsers cache /sw.js in the HTTP cache by default. If we cache it,
      // returning visitors keep running the OLD service worker which keeps
      // serving stale HTML. Force a fresh fetch on every navigation.
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      // ── Next.js hashed bundles: cache forever (filename changes on every deploy) ──
      // Comes AFTER catch-all → overrides Cache-Control for /_next/static/ only.
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // ── Optimised images: cache 30 days ─────────────────────────────────────
      {
        source: "/_next/image",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
      // ── Static media: cache 1 year (content never changes) ──────────────────
      //
      // CRITICAL: Next.js matches `source` case-INSENSITIVELY. A naive rule
      // like `source: "/Destination/:path*"` also matches the page route
      // `/destination/bali` — which would slap a 1-year immutable cache on
      // the destination page HTML and freeze visitors on that build forever.
      //
      // To avoid that, every static-folder rule below requires a recognisable
      // file extension in the path. Page routes never have a dot in the last
      // segment, so they fall through to the catch-all (no-store).
      {
        source: "/videos/:file(.+\\.(?:mp4|webm|mov|m4v))",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Content-Type", value: "video/mp4" },
        ],
      },
      {
        source: "/Feedback/:file(.+\\.(?:webp|jpg|jpeg|png|gif|svg|avif|mp4|webm|mov))",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/uploads/:file(.+\\.(?:webp|jpg|jpeg|png|gif|svg|avif|ico|webm|mp4|woff2?|ttf|otf))",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/Destination/:file(.+\\.(?:webp|jpg|jpeg|png|gif|svg|avif|webm|mp4))",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/icons/:file(.+\\.(?:webp|jpg|jpeg|png|gif|svg|avif|ico))",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/assets/:file(.+\\.(?:webp|jpg|jpeg|png|gif|svg|avif|ico|woff2?|ttf|otf))",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  
  // Build optimizations
  typescript: { 
    ignoreBuildErrors: true,
    tsconfigPath: './tsconfig.json'
  },
  
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [60, 75, 80],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      // Cloudinary (primary image CDN)
      { protocol: "https", hostname: "**.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      // Unsplash
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "source.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "unsplash.com", pathname: "/**" },
      // Pexels
      { protocol: "https", hostname: "images.pexels.com", pathname: "/**" },
      { protocol: "https", hostname: "static.pexels.com", pathname: "/**" },
      { protocol: "https", hostname: "pexels.com", pathname: "/**" },
      // Pixabay
      { protocol: "https", hostname: "cdn.pixabay.com", pathname: "/**" },
      { protocol: "https", hostname: "pixabay.com", pathname: "/**" },
      // Picsum
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      // Bing
      { protocol: "https", hostname: "*.bing.com", pathname: "/**" },
      { protocol: "https", hostname: "*.mm.bing.net", pathname: "/**" },
      { protocol: "https", hostname: "*.bing.net", pathname: "/**" },
      // Google
      { protocol: "https", hostname: "*.gstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "images.google.com", pathname: "/**" },
      // Imgur
      { protocol: "https", hostname: "i.imgur.com", pathname: "/**" },
      { protocol: "https", hostname: "imgur.com", pathname: "/**" },
      // iStock
      { protocol: "https", hostname: "media.istockphoto.com", pathname: "/**" },
      { protocol: "https", hostname: "images.istockphoto.com", pathname: "/**" },
      // Freepik
      { protocol: "https", hostname: "www.freepik.com", pathname: "/**" },
      { protocol: "https", hostname: "freepik.com", pathname: "/**" },
      // Shutterstock / Getty
      { protocol: "https", hostname: "www.shutterstock.com", pathname: "/**" },
      { protocol: "https", hostname: "media.gettyimages.com", pathname: "/**" },
      // Supabase Storage
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      { protocol: "https", hostname: "*.supabase.in", pathname: "/storage/v1/object/public/**" },
    ],
  },
  
  // Redirects for better SEO
  // NOTE: www → non-www redirect is intentionally handled in `proxy.ts`
  // (Edge middleware) instead of here, because next.config redirects run
  // BEFORE middleware, which means we can't attach the Clear-Site-Data
  // header that wipes stale service workers on returning visitors.
  async redirects() {
    return [
      // Fix incorrect Andaman slug (was typo'd as "andamans" in old links)
      {
        source: '/destination/andamans',
        destination: '/destination/andaman',
        permanent: true,
      },
    ];
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
