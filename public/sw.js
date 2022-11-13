const cacheName = "freshnet-v1";

const installAssets = [
   "./",
   "./page/index.html",

   "./page/manifest.webmanifest",

   // "./page/js/app.js",
   // "./page/js/app.chunk.js",
   // "./page/css/style.css",
   // "./page/css/style.chunk.css",

   "./page/favicon.ico",
   "./page/favicons-32.ico",
   "./page/logo.png",
   "./page/logos-192.png",
   "./page/logos-512.png",
   "./page/logos-512.svg",
];

self.addEventListener("install", (event) => {
   event.waitUntil(
      caches
         .open(cacheName)
         .then((cache) => {
            return cache.addAll(
               installAssets.map((urlToPrefetch) => {
                  return new Request(urlToPrefetch, { mode: "no-cors" });
               })
            );
         })
         .then(() => {
            console.log("Installation resources have been fetched and cached.");
         })
         .catch((error) => {
            console.error("Installation resources pre-fetching failed:", error);
         })
   );

   // return caches
   //    .open(cacheName)
   //    .then((cacheStore) => cacheStore.addAll(installAssets))
   //    .then(() => self.skipWaiting());
});

self.addEventListener("activate", (event) => self.clients.claim());

self.addEventListener("fetch", (event) => {
   const request = event.request;
   const url = new URL(request.url);

   return event.respondWith(fetch(request));

   // if (
   //    (location.origin === "http://localhost:8080" || url.origin === location.origin) &&
   //    url.pathname.startsWith("/api") &&
   //    request.method !== "GET"
   // ) {
   //    event.respondWith(fetch(request));
   // } else {
   //    event.respondWith(networkThenCache(request));
   // }
});

async function networkThenCache(request) {
   return caches.open(cacheName).then((cacheStore) => {
      return fetch(request)
         .then((freshResponse) => {
            return cacheStore
               .put(request, freshResponse.clone())
               .then(() => freshResponse);
         })
         .catch((error) => cacheStore.match(request));
   });
}
