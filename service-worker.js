const CACHE_NAME = "jiggasha-cache-v1";
const assetsToCache = [
  "/index.html",
  "/classes.html",
  "/quizzes.html",
  "/notes.html",
  "/videos.html",
  "/progress.html",
  "/about.html",
  "/css/style.css"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});