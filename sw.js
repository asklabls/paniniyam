// Paniniyam Service Worker — offline cache
// Bump CACHE_VERSION whenever static assets change significantly
const CACHE_VERSION = 'v1';
const CACHE_NAME = `paniniyam-${CACHE_VERSION}`;

const CDN_DATA  = 'https://cdn.jsdelivr.net/gh/asklabls/paniniyam-data@master';
const CDN_FORMS = 'https://cdn.jsdelivr.net/gh/asklabls/paniniyam@main/forms';

// ── Precached on install ───────────────────────────────────────────────────────
// Small, always-needed files. Core data files that power the sutra reader.
const PRECACHE = [
  '/',
  '/css/style.css',
  '/js/app.js',
  '/js/sanscript.js',
  '/js/shabda.js',
  '/img/favicon.ico',
  '/img/apple-touch-icon.png',
  '/img/kofi.png',
  '/img/icon-192.png',
  '/img/icon-512.png',
  '/privacy_policy.html',
  '/terms.html',
  '/copyright.html',
  '/contact.html',
  // Core data — needed for navigation + search to work offline
  `${CDN_DATA}/sutraani/data.txt`,
  `${CDN_DATA}/dhatu/data.txt`,
  `${CDN_DATA}/ganapath/data.txt`,
  `${CDN_DATA}/shivasutra/data.txt`,
  `${CDN_DATA}/unaadi/data.txt`,
  `${CDN_DATA}/fit/data.txt`,
  `${CDN_DATA}/linganushasanam/data.txt`,
  `${CDN_DATA}/shiksha/data.txt`,
  `${CDN_DATA}/sutraani/vartika.txt`,
  // Forms
  `${CDN_FORMS}/forms/pratyaya.txt`,
  `${CDN_FORMS}/forms/concepts_index.json`,
];

// ── Install: precache static shell + core data ─────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: remove old caches ────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for hits, network-then-cache for misses ─────────────────
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Only cache GET requests
  if (req.method !== 'GET') return;

  // Skip: R2 private data (Pravachanam, Siddhi etc.) — too personal/large
  if (url.hostname.includes('r2.dev') || url.hostname.includes('pub-19119053')) return;

  // Skip: audio files — too large (~6 MB per pada)
  if (url.pathname.includes('/audio/')) return;

  // Skip: per-dhatu form files — 2229 files, let browser cache handle these
  if (url.pathname.match(/\/forms\/dhatu\/.+\.json$/)) return;

  // Skip: SVG diagrams — many files, too large to pre-warm
  if (url.pathname.includes('/visuals/')) return;

  event.respondWith(
    caches.match(req).then(cached => {
      // Cache hit → return immediately, revalidate in background
      if (cached) {
        // Background revalidate for CDN data (keeps cache fresh)
        if (url.hostname.includes('jsdelivr.net') || url.hostname.includes('cdn.')) {
          fetch(req).then(res => {
            if (res.ok) caches.open(CACHE_NAME).then(c => c.put(req, res));
          }).catch(() => {});
        }
        return cached;
      }

      // Cache miss → fetch, cache successful responses, return
      return fetch(req).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone));
        }
        return res;
      }).catch(() => {
        // Network totally unavailable and no cache — return offline page for navigation
        if (req.mode === 'navigate') return caches.match('/');
      });
    })
  );
});
