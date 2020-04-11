// Array lists files that will be cached
const FILES_TO_CACHE = [
  '/',
  '/assets/css/style.css',
  '/assets/images/icons/icon-72x72.png',
  '/assets/images/icons/icon-512x512.png',
  '/favicon.ico',
  '/manifest.webmanifest'
];

// Names of two caches are saved
const STATIC_CACHE_NAME = 'static-cache';
const DATA_CACHE_NAME = 'data-cache';

// This function caches files locally.
// Installs the service worker
self.addEventListener('install', e => {
  // Event waits until files are cached
  e.waitUntil(
    // Static cache is opened
    caches.open(STATIC_CACHE_NAME).then(cache => {
      console.log("Your files were pre-cached successfully!");
      // Adds all static files to cache
      return cache.addAll(FILES_TO_CACHE);
    })
  )

  // Ends waiting
  self.skipWaiting();
});

// This function removes unnecessary local caches and claims the remaining ones.
// Activates the service worker
self.addEventListener('activate', e => {
  // Event waits until unrelated caches are removed
  e.waitUntil(
    // Reads the keynames of local caches
    caches.keys().then(keyList => {
      // Returns a promise
      return Promise.all(
        // maps all of the locally stored cache keys
        keyList.map(key => {
          // Removes any cache that is not related to the app
          if (key !== STATIC_CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('removing old cache data', key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  // Takes control of the caches
  self.clients.claim();
});

// Listens for fetch events
self.addEventListener('fetch', e => {
  // checks if request includes '/api'
  if (e.request.url.includes("/api")) {
    // opens data cache
    e.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        // returns fetch request
        return fetch(e.request)
          .then(response => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(e.request.url, response.clone());
            }

            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
            return cache.match(e.request);
          });
      }).catch(err => console.log(err))
    );

    return;
  }

  // Hijacks responses for fetch events
  e.respondWith(
    // Opens the static cache
    caches.open(STATIC_CACHE_NAME).then(cache => {
      // returns the cached item that mathces the request name
      return cache.match(e.request).then(response => {
        // returns the regular response if online or fetches form local cache if offline
        return response || fetch(e.request);
      });
    })
  );
});