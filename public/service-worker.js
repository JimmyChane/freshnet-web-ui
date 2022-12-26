class SW {
	static CacheName = "static-v1";
	static Assets = [
		"./",
		"./page/index.html",

		// "./page/js/app.js",
		// "./page/js/app.chunk.js",
		// "./page/css/style.css",
		// "./page/css/style.chunk.css",

		"./page/manifest.webmanifest",
		"./page/favicon.ico",
		"./page/favicons-32.ico",
		"./page/logo.png",
		"./page/logos-192.png",
		"./page/logos-512.png",
		"./page/logos-512.svg",
	];

	static async networkThenCache(request) {
		try {
			const cacheStore = await caches.open(this.CacheName);
			const freshResponse = await fetch(request);
			await cacheStore.put(request, freshResponse.clone());
			return freshResponse;
		} catch {
			return await cacheStore.match(request);
		}
	}

	async onInstall(event) {
		const promise = Promise.resolve()
			.then(async () => {
				const requests = SW.Assets.map((urlAsset) => {
					return new Request(urlAsset, { mode: "no-cors" });
				});
				const cacheStore = await caches.open(SW.CacheName);
				cacheStore.addAll(requests);
				console.log("Installation resources have been fetched and cached.");
			})
			.catch(() => {
				console.error("Installation resources pre-fetching failed:", error);
			});
		event.waitUntil(promise);

		// const cacher = caches
		// 	.open(SW.CacheName)
		// 	.then((cacheStore) => cacheStore.addAll(SW.Assets))
		// 	.then(() => self.skipWaiting());
	}
	async onActivate(event) {
		console.log("V1 now ready to handle fetches!");

		// self.clients.claim();
	}
	async onFetch(event) {
		const url = new URL(event.request.url);

		console.log(url);

		const cacheStore = await caches.open(SW.CacheName);
		try {
			const response = await fetch(event.request);
			await cacheStore.put(event.request, response.clone());
			event.respondWith(response);
		} catch {
			const response = cacheStore.match(event.request);
			event.respondWith(response);
		}

		return;
		event.respondWith(fetch(request));

		// if (
		// 	url.origin === location.origin &&
		// 	url.pathname.startsWith("/api") &&
		// 	request.method !== "GET"
		// ) {
		// 	event.respondWith(fetch(request));
		// } else {
		// 	event.respondWith(SW.networkThenCache(request));
		// }
	}
}

const sw = new SW();

self.addEventListener("install", (event) => sw.onInstall(event));
self.addEventListener("activate", (event) => sw.onActivate(event));
self.addEventListener("fetch", (event) => sw.onFetch(event));
