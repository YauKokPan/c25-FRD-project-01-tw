// eslint-disable-next-line no-restricted-globals
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("sweethour").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/static/js/main.chunk.js",
        "/static/js/0.chunk.js",
        "/static/js/bundle.js",
        "/static/css/main.chunk.css",
        "/favicon.ico",
        "/manifest.json",
        "/icon-192x192.png",
        "/icon-512x512.png",
      ]);
    })
  );
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
