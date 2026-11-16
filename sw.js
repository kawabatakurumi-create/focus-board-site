const CACHE = "focus-board-v3";
const BASE = new URL("./", self.location.href);
const SHELL = [
  BASE.href,
  new URL("manifest.webmanifest", BASE).href,
  new URL("icon.svg", BASE).href,
  new URL("icon-192.png", BASE).href,
  new URL("icon-512.png", BASE).href,
  new URL("apple-touch-icon.png", BASE).href,
];
self.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL))));
self.addEventListener("activate", (event) => event.waitUntil(
  caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()),
));
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== location.origin) return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request).then((hit) => hit || caches.match(BASE.href))));
});
// Future Web Push handlers can be added here without changing the app shell.
