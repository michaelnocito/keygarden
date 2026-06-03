/* Keygarden service worker.
   STRATEGY:
   - HTML / navigations / index.html → NETWORK-FIRST (fall back to cache when offline).
     New deploys appear on the next refresh — no manual cache clear, no incognito needed.
   - Versioned static assets (icons, manifest, CDN deps) → CACHE-FIRST with stale-while-revalidate.
   Bump CACHE when this file's logic changes; old caches are pruned on activate. */
const CACHE = "keygarden-v3";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./favicon-32.png",
];
const CDN = [
  "https://unpkg.com/react@18/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone/babel.min.js",
];

const isHtmlRequest = (req) => {
  if (req.mode === "navigate") return true;
  const url = new URL(req.url);
  if (url.origin !== self.registration.scope.replace(/\/$/, "") && !req.url.startsWith(self.registration.scope)) return false;
  return /\.html?$/.test(url.pathname) || url.pathname === "/" || url.pathname.endsWith("/");
};

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // SHELL must succeed; CDN entries best-effort (cache:"reload" forces a fresh copy past HTTP cache)
    await cache.addAll(SHELL.map((u) => new Request(u, { cache: "reload" })));
    await Promise.all(CDN.map((u) => cache.add(u).catch(() => null)));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // HTML / navigation → network-first so new deploys show up on the next refresh.
  if (isHtmlRequest(req)) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req, { cache: "no-store" });
        if (fresh && fresh.status === 200) {
          const cache = await caches.open(CACHE);
          cache.put(req, fresh.clone()).catch(() => {});
        }
        return fresh;
      } catch (e) {
        // Offline — fall back to whatever we have cached, then to the shell.
        const cached = await caches.match(req, { ignoreVary: true });
        if (cached) return cached;
        const shell = await caches.match("./index.html");
        if (shell) return shell;
        throw e;
      }
    })());
    return;
  }

  // Static assets (icons, manifest, CDN React/Babel) → cache-first + background refresh.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, { ignoreVary: true });
    const refresh = fetch(req).then((fresh) => {
      if (fresh && fresh.status === 200 && (req.url.startsWith(self.registration.scope) || /unpkg\.com/.test(req.url))) {
        cache.put(req, fresh.clone()).catch(() => {});
      }
      return fresh;
    }).catch(() => null);
    return cached || refresh || fetch(req);
  })());
});

// Allow the page to ask us to activate immediately after install (used by the update prompt below).
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
