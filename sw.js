/* Keygarden service worker — caches the shell + CDN deps so it works offline once installed.
   Bump CACHE when index.html or the manifest changes; old caches are pruned on activate. */
const CACHE = "keygarden-v2";
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

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // SHELL must all succeed; CDN entries are best-effort (network may be flaky on first install)
    await cache.addAll(SHELL);
    await Promise.all(CDN.map((u) => cache.add(u).catch(() => null)));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  event.respondWith((async () => {
    const cached = await caches.match(req, { ignoreVary: true });
    if (cached) return cached;
    try {
      const fresh = await fetch(req);
      // Cache successful CDN + same-origin GETs as we see them
      if (fresh && fresh.status === 200 && (req.url.startsWith(self.registration.scope) || /unpkg\.com/.test(req.url))) {
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone());
      }
      return fresh;
    } catch (e) {
      // Offline and not cached — gracefully return the shell for navigations
      if (req.mode === "navigate") {
        const shell = await caches.match("./index.html");
        if (shell) return shell;
      }
      throw e;
    }
  })());
});
