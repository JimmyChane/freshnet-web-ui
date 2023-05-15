const cacheName = "static-v1";
const version = "";
const assets = [
   "./",
   "./index.html",
   "./manifest.webmanifest",
   "./favicon.ico",
   "./favicons-32.ico",
   "./ge/logo.png",
   "./logos-129.png",
   "./logos-192.png",
   "./logos-512.png",
   "./logos-512.svg",
   `./js/app.${version}.js`,
   `./js/app.${version}.chunk.js`,
   `./css/style.${version}.css`,
];

self.addEventListener("install", async (event) => {
   const promise = Promise.resolve().then(async () => {
      const requests = assets.map((urlAsset) => new Request(urlAsset));
      const cacheStore = await caches.open(cacheName);
      cacheStore.addAll(requests);
   });
   event.waitUntil(promise);
});
// self.addEventListener("activate", async (event) => {});
self.addEventListener("fetch", async (event) => {
   if (event.request.method !== "GET") return;

   const promise = Promise.resolve()
      .then(async () => {
         const cacheStore = await caches.open(cacheName);
         try {
            const response = await fetch(event.request);
            cacheStore.put(event.request, response.clone());
            return response;
         } catch (error) {
            return await cacheStore.match(event.request);
         }
      })
      .then((response) => {
         if (response instanceof Response) return response;
      });
   event.respondWith(promise);
});
