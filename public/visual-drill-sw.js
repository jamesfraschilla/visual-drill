const CACHE_NAME = "visual-drill-offline-v1";
const CACHE_PREFIX = "visual-drill-offline-";

function rootPath() {
  const scopePath = new URL(self.registration.scope).pathname;
  return scopePath.endsWith("/") ? scopePath : `${scopePath}/`;
}

function appShellUrls() {
  const root = rootPath();
  return [
    root,
    `${root}visual-drill.webmanifest`,
    `${root}visual-drill-icon-192.png`,
    `${root}visual-drill-icon-512.png`,
  ];
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(appShellUrls()))
      .catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function canCache(request, response) {
  if (!response || response.status !== 200) return false;
  if (request.method !== "GET") return false;
  const url = new URL(request.url);
  return url.origin === self.location.origin;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const fallbackUrl = `${new URL(self.registration.scope).origin}${rootPath()}`;
  try {
    const response = await fetch(request);
    if (canCache(request, response)) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (await cache.match(request, { ignoreVary: true }))
      || (await cache.match(fallbackUrl, { ignoreVary: true }))
      || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request, { ignoreVary: true });
  if (cached) return cached;
  const response = await fetch(request);
  if (canCache(request, response)) {
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (event.request.mode === "navigate") {
    const url = new URL(event.request.url);
    if (url.origin === self.location.origin && url.pathname.startsWith(rootPath())) {
      event.respondWith(networkFirst(event.request));
    }
    return;
  }
  event.respondWith(cacheFirst(event.request));
});
