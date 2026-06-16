/* ============================================================
   Condition Monitor – Service Worker
   キャッシュ戦略: Cache First（CDN assets） + Network First（API）
   ============================================================ */

const CACHE = "condition-monitor-v1";
const PRECACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "https://unpkg.com/react@18/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone/babel.min.js",
  "https://unpkg.com/recharts@2.12.7/umd/Recharts.js",
  "https://unpkg.com/papaparse@5.4.1/papaparse.min.js",
  "https://unpkg.com/lucide-react@0.383.0/dist/umd/lucide-react.js",
];

/* install – precache shell */
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

/* activate – delete old caches */
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* fetch – stale-while-revalidate for same-origin, cache-first for CDN */
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  /* Anthropic API: always network, never cache */
  if (url.hostname === "api.anthropic.com") return;

  /* CDN assets: cache-first */
  if (url.hostname.includes("unpkg.com") || url.hostname.includes("cdnjs")) {
    e.respondWith(
      caches.match(e.request).then((hit) => {
        if (hit) return hit;
        return fetch(e.request).then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
          return res;
        });
      })
    );
    return;
  }

  /* Same-origin (index.html, sw.js, manifest.json): network-first, fallback cache */
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
