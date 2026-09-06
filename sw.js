const CACHE_NAME = "shawarma-sales-v9";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin === location.origin && (
      url.pathname.endsWith("/index.html") ||
      url.pathname.endsWith("/sw.js") ||
      url.pathname.endsWith("/")
  )) {
    event.respondWith(
      fetch(event.request, {cache:"no-store"})
        .then(response => {
          const copy=response.clone();
          caches.open(CACHE_NAME).then(c=>c.put(event.request,copy));
          return response;
        })
        .catch(()=>caches.match(event.request))
    );
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if(response.ok && url.origin===location.origin){
          const copy=response.clone();
          caches.open(CACHE_NAME).then(c=>c.put(event.request,copy));
        }
        return response;
      })
      .catch(()=>caches.match(event.request))
  );
});
