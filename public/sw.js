const CACHE_NAME = "cusp-cache-v1";
const OFFLINE_URL = "/offline";

const STATIC_ASSETS = [
  "/",
  "/offline",
  "/login",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable.png",
  "/icon.svg",
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // Cache initial shell pages and icons
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event (Cleanup old caches)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log("[Service Worker] Deleting old cache:", cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Message Listener (Force updating)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Fetch Event
self.addEventListener("fetch", (event) => {
  // Only intercept GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip Chrome extension resources, Supabase auth redirects, Next.js HMR webpack socket, and API endpoints
  if (
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/_next/webpack-hmr") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.includes("/auth/") ||
    url.pathname.startsWith("/v1/") // Supabase API endpoint fallback
  ) {
    return;
  }

  // Caching Strategy: Stale-While-Revalidate for CSS/JS, Fonts, and Images
  const isStaticAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|woff2|woff|ttf|eot)$/) ||
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com");

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Serve from cache immediately and fetch new version in background
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
              }
            })
            .catch(() => {
              // Ignore background fetch errors (offline)
            });
          return cachedResponse;
        }

        // Fetch from network and cache for next time
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Caching Strategy: Network-First for HTML Documents (Pages)
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache the newly retrieved HTML page
        if (
          networkResponse.status === 200 &&
          networkResponse.headers.get("content-type")?.includes("text/html")
        ) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        // Try to serve requested page from cache, if missing serve the offline fallback page
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return caches.match(OFFLINE_URL);
        });
      })
  );
});
