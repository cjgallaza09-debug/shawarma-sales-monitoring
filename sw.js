const CACHE_NAME = "shawarma-sales-v3";

const APP_FILES = [
    "./",
    "./index.html",
    "./manifest.webmanifest",
    "./icon-192.png",
    "./icon-512.png"
];

// Install new service worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(APP_FILES);
        })
    );

    self.skipWaiting();
});

// Activate new service worker and remove old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );

    self.clients.claim();
});

// Handle requests
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") {
        return;
    }

    const requestURL = new URL(event.request.url);

    // Always try to get the newest index.html
    if (
        requestURL.origin === self.location.origin &&
        (
            requestURL.pathname.endsWith("/") ||
            requestURL.pathname.endsWith("/index.html")
        )
    ) {
        event.respondWith(
            fetch(event.request, {
                cache: "no-store"
            })
            .then((response) => {
                const copy = response.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, copy);
                });

                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
        );

        return;
    }

    // Other files: cache first, then network
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((response) => {
                if (
                    response.ok &&
                    requestURL.origin === self.location.origin
                ) {
                    const copy = response.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, copy);
                    });
                }

                return response;
            });
        })
    );
});
