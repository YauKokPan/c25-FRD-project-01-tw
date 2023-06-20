
// Install event listener
// eslint-disable-next-line no-restricted-globals
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing Service Worker...", event);
  event.waitUntil(
    caches.open("sweet_hour").then((cache) => {
      console.log("[Service Worker] Precaching App Shell...");
      cache.addAll([
        "/",
        "/index.html",
        "/favicon.ico",
        "/logo180.png",
        "/logo512.png",
        "/maskable_icon.png",
      ]);
    })
  );
});

// Activate event listener
// eslint-disable-next-line no-restricted-globals
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating Service Worker...", event);
  // eslint-disable-next-line no-restricted-globals
  event.waitUntil(self.clients.claim());
});


