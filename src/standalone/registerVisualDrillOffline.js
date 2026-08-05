const OFFLINE_CACHE_NAME = "visual-drill-offline-v2";

function absoluteUrl(value) {
  try {
    return new URL(value, window.location.href).href;
  } catch {
    return "";
  }
}

function sameOriginUrl(value) {
  const url = absoluteUrl(value);
  return url && new URL(url).origin === window.location.origin ? url : "";
}

function currentDocumentAssetUrls() {
  const urls = new Set([
    window.location.href,
    new URL(import.meta.env.BASE_URL, window.location.origin).href,
    new URL(`${import.meta.env.BASE_URL}visual-drill.webmanifest`, window.location.origin).href,
  ]);

  document
    .querySelectorAll("script[src],link[href],img[src]")
    .forEach((element) => {
      const value = element.getAttribute("src") || element.getAttribute("href") || "";
      const url = sameOriginUrl(value);
      if (url) urls.add(url);
    });

  performance
    .getEntriesByType("resource")
    .forEach((entry) => {
      const url = sameOriginUrl(entry.name);
      if (url) urls.add(url);
    });

  return [...urls];
}

async function cacheCurrentAppShell() {
  if (!("caches" in window)) return false;
  const cache = await caches.open(OFFLINE_CACHE_NAME);
  const urls = currentDocumentAssetUrls();
  await Promise.allSettled(urls.map((url) => cache.add(url)));
  return true;
}

export function registerVisualDrillOffline() {
  if (!("serviceWorker" in navigator)) return;

  window.__visualDrillOfflineReady = new Promise((resolve) => {
    window.addEventListener("load", () => {
      const serviceWorkerUrl = new URL(`${import.meta.env.BASE_URL}visual-drill-sw.js`, window.location.origin);
      navigator.serviceWorker
        .register(serviceWorkerUrl, { scope: import.meta.env.BASE_URL })
        .then(() => navigator.serviceWorker.ready)
        .then(() => cacheCurrentAppShell())
        .then(resolve)
        .catch(() => resolve(false));
    }, { once: true });
  });
}
