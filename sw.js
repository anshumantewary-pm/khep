// Khep service worker: lets the installed app open offline.
// Bump VERSION whenever app files change so phones pick up the new version.
const VERSION = "khep-v7";
const SHELL = [
  "./", "./index.html", "./app.html", "./signup.html", "./blog.html", "./post.html",
  "./site.css", "./site.js", "./posts.json", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-192.png", "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png", "./icons/favicon-48.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Map tiles always come from the network; caching them breaks the tile server's usage policy.
  if (url.hostname.endsWith("tile.openstreetmap.org")) return;
  // The APK download goes straight to the network so people always get the latest build.
  if (url.pathname.endsWith(".apk")) return;

  // Pages and the blog posts list: try the network first so updates show up, fall back to the saved copy offline.
  if (req.mode === "navigate" || url.pathname.endsWith("/posts.json")) {
    e.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; })
        .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("./app.html")))
    );
    return;
  }

  // Everything else (icons, fonts, the map library): saved copy first, refreshed in the background.
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res && (res.ok || res.type === "opaque")) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
