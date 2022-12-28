const cacheName = "static-v1";
const assets = [
	"./",
	"./page/index.html",
	"./page/manifest.webmanifest",
	"./page/favicon.ico",
	"./page/favicons-32.ico",
	"./page/logo.png",
	"./page/logos-129.png",
	"./page/logos-192.png",
	"./page/logos-512.png",
	"./page/logos-512.svg",

	// "./page/js/app.js",
	// "./page/js/app.chunk.js",
	// "./page/css/style.css",
	// "./page/css/style.chunk.css",
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
