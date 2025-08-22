const CACHE_NAME = "day-tracker-v1";
const FILES_TO_CACHE = [
  "./", // root
  "./index.html", // your main HTML
  "./manifest.json", // PWA manifest
  "./icon-192.png", // app icons
  "./icon-512.png"
  // You can add CSS/JS files here if separate from index.html
];

// Install Service Worker and cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Caching app files");
      return cache.addAll(FILES_TO_CACHE);
    }).then(() => self.skipWaiting()) // Activate new SW immediately
  );
});

// Activate Service Worker and clear old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
        .filter((name) => name !== CACHE_NAME)
        .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim()) // Take control of all clients
  );
});

// Serve files from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});