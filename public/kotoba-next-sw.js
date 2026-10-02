const CACHE = "kotoba-next-shell-v2-dictionary";
const SHELL = ["./", "./index.html", "./kotoba-next-manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("kotoba-next-") && key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  const freshMetadata = url.pathname.includes("/dictionary/") && url.pathname.endsWith(".json");
  const navigation = event.request.mode === "navigate";
  const network = () => fetch(event.request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(() => undefined));
    }
    return response;
  });
  // Dictionary revisions refresh online; immutable MP3s and code reuse their cache.
  event.respondWith((freshMetadata || navigation ? network().catch(() => caches.match(event.request))
    : caches.match(event.request).then(cached => cached || network()))
    .then(response => response || (navigation ? caches.match("./index.html") : Response.error()))
    .catch(() => navigation ? caches.match("./index.html") : Response.error()));
});
