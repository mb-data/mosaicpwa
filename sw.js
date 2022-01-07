"use strict";

// Change this value to force the browser to install the
// service worker again, and recreate the cache (this technique
// works because the browser reinstalls the service worker
// whenever it detects a change in the source code of the
// service worker).
const CACHE_PREFIX = "mosaic-static-cache-";
const CACHE_VERSION = "20211230";
const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION;
const homepagePath = "";

self.addEventListener("install", (event) => {
	// skipWaiting() will force the browser to start using
	// this version of the service worker as soon as its
	// installation finishes.
	// It does not really matter when we call skipWaiting(),
	// as long as we perform all other operations inside
	// event.waitUntil(). Calling event.waitUntil() forces
	// the installation process to be marked as finished
	// only when all promises passed to waitUntil() finish.

	self.skipWaiting();

	event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
		// According to the spec, the service worker file
		// is handled differently by the browser and needs
		// not to be added to the cache. I tested it and I
		// confirm the service worker works offline even when
		// not present in the cache (despite the error message
		// displayed by the browser when trying to fetch it).
		//
		// Also, there is no need to worry about max-age and
		// other cache-control headers/settings, because the
		// CacheStorage API ignores them.
		//
		// Nevertheless, even though CacheStorage API ignores
		// them, tests showed that a in few occasions, when
		// the browser was fetching these files, the file
		// being added to the cache actually came from the
		// browser's own cache... Therefore, I switched from
		// cache.addAll() to this.
		//
		// Let the commented files be downloaded/cached only
		// if the browser requests them!
		const files = [
			homepagePath + "/",
			//homepagePath + "/assets/files/aspire.mp4",
			//homepagePath + "/assets/files/foscalcios.mp4",
			//homepagePath + "/assets/files/kmag.mp4",
			//homepagePath + "/assets/files/microessentials.mp4",
			//homepagePath + "/assets/files/mpasto.mp4",
			//homepagePath + "/assets/files/performa-full.mp4",
			//homepagePath + "/assets/files/performa-hf.mp4",
			//homepagePath + "/assets/files/performa-neo.mp4",
			//homepagePath + "/assets/files/performa-plus.mp4",
			//homepagePath + "/assets/files/performa-ultra.mp4",
			//homepagePath + "/assets/files/performance.mp4",
			//homepagePath + "/assets/files/performa-full.pdf",
			//homepagePath + "/assets/files/performa-ultra.pdf",
			//homepagePath + "/assets/files/performa-neo.pdf",
			//homepagePath + "/assets/files/performa-plus.pdf",
			//homepagePath + "/assets/files/performa-hf.pdf",
			//homepagePath + "/assets/files/microessentials.pdf",
			//homepagePath + "/assets/files/kmag.pdf",
			//homepagePath + "/assets/files/folder-kmag.pdf",
			//homepagePath + "/assets/files/folder-aspire.pdf",
			//homepagePath + "/assets/files/aspire.pdf",
			//homepagePath + "/assets/files/performance.pdf",
			//homepagePath + "/assets/files/mpasto.pdf",
			//homepagePath + "/assets/files/foscalcio.pdf",
			//homepagePath + "/assets/files/basica-pro.pdf",
			homepagePath + "/assets/images/aspire.png",
			homepagePath + "/assets/images/background-opacity.jpg",
			homepagePath + "/assets/images/background.jpg",
			homepagePath + "/assets/images/basica-pro-b.png",
			homepagePath + "/assets/images/basica-pro.png",
			homepagePath + "/assets/images/controle.png",
			homepagePath + "/assets/images/foscalcio.png",
			homepagePath + "/assets/images/kmag.png",
			homepagePath + "/assets/images/linha-nutricao.png",
			homepagePath + "/assets/images/linha-performance.png",
			homepagePath + "/assets/images/logo-nutricao.png",
			homepagePath + "/assets/images/logo-performa-b.png",
			homepagePath + "/assets/images/logo-performa.png",
			homepagePath + "/assets/images/logo-performance.png",
			homepagePath + "/assets/images/logo-sm.png",
			homepagePath + "/assets/images/logo.png",
			homepagePath + "/assets/images/micro-essentials.png",
			homepagePath + "/assets/images/mpasto.png",
			homepagePath + "/assets/images/performa-full.png",
			homepagePath + "/assets/images/performa-hf.png",
			homepagePath + "/assets/images/performa-neo.png",
			homepagePath + "/assets/images/performa-plus.png",
			homepagePath + "/assets/images/performa-ultra.png",
			homepagePath + "/assets/images/sprite.png",
			homepagePath + "/assets/images/sprite-sm.png",
			homepagePath + "/pdf/web/viewer.html",
			homepagePath + "/favicon.ico",
			homepagePath + "/favicons/manifest.webmanifest",
			homepagePath + "/favicons/favicon-512x512.png",
			homepagePath + "/fonts/Montserrat-Black.ttf",
			homepagePath + "/fonts/Montserrat-Bold.ttf",
			homepagePath + "/fonts/Montserrat-ExtraBold.ttf",
			homepagePath + "/fonts/Montserrat-ExtraLight.ttf",
			homepagePath + "/fonts/Montserrat-Light.ttf",
			homepagePath + "/fonts/Montserrat-Medium.ttf",
			homepagePath + "/fonts/Montserrat-Regular.ttf",
			homepagePath + "/fonts/Montserrat-SemiBold.ttf",
			homepagePath + "/fonts/Montserrat-Thin.ttf",
			homepagePath + "/fonts/Montserrat.css",
			homepagePath + "/static/media/background-opacity.f90e08a42dee2451ef02.jpg",
			homepagePath + "/static/media/sprite.c1436e78b58dc8107ff0.png",
		];
		const promises = new Array(files.length);
		for (let i = files.length - 1; i >= 0; i--)
			promises[i] = cache.add(new Request(files[i], { cache: "no-cache" }));
		return Promise.all(promises);
	}));
});

self.addEventListener("activate", (event) => {
	// claim() is used to ask the browser to use this instance
	// of the service worker with all possible clients, including
	// any pages that might have been opened before this service
	// worker was downloaded/activated.

	self.clients.claim();

	event.waitUntil(
		// List all cache storages in our domain.
		caches.keys().then(function (keyList) {
			// Create one Promise for deleting each cache storage that is not
			// our current cache storage, taking care not to delete other
			// cache storages from the domain by checking the key prefix (we
			// are not using map() to avoid inserting undefined into the array).
			const oldCachesPromises = [];

			for (let i = keyList.length - 1; i >= 0; i--) {
				const key = keyList[i];
				if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
					oldCachesPromises.push(caches.delete(key));
			}

			return Promise.all(oldCachesPromises);
		})
	);
});

self.addEventListener("fetch", (event) => {
	// https://developer.mozilla.org/en-US/docs/Web/API/Request
	// mode is navigate only for the document itself (/ or
	// index.html), whereas for all other requests, mode is cors,
	// no-cors and so on. So, in order to make the entire game
	// work offline we must handle all kinds of requests!

	// This will speed up the loading time after the first
	// time the user loads the game. The downside of this
	// technique is that we will work with an outdated
	// version of the resource if it has been changed at
	// the server, but has not yet been updated in our
	// local cache (which, right now, will only happen
	// when the service worker is reinstalled).

	const url = event.request.url;

	if (event.request.method !== "GET" ||
		url.indexOf("assets/files/") >= 0 ||
		// Development phase only
		url.startsWith("http://localhost"))
		return;

	event.respondWith(caches.open(CACHE_NAME).then((cache) => {
		return cache.match(url, { ignoreVary: true }).then((response) => {
			// Return the resource if it has been found.
			if (response)
				return response;

			// When the resource was not found in the cache,
			// try to fetch it from the network.
			return fetch(url).then((response) => {
				// If this fetch succeeds, store it in the cache for
				// later! (This means we probably forgot to add a file
				// to the cache during the installation phase)

				// Just as requests, responses are streams and we will
				// need two usable streams: one to be used by the cache
				// and one to be returned to the browser! So, we send a
				// clone of the response to the cache.
				if (response && response.status === 200)
					return cache.put(url, response.clone()).then(() => {
						return response;
					}, () => {
						// If anything goes wrong, just ignore and try
						// to add the response to the cache later.
						return response;
					});

				return response;
			}, () => {
				// The request was neither in our cache nor was it
				// available from the network (maybe we are offline).
				// Therefore, try to fulfill requests for favicons with
				// the largest favicon we have available in our cache.
				if (url.indexOf("favicon") >= 0)
					return cache.match(homepagePath + "/favicons/favicon-512x512.png", { ignoreVary: true });

				// The resource was not in our cache, was not available
				// from the network and was also not a favicon...
				// Unfortunately, there is nothing else we can do :(
				return null;
			});
		});
	}));
});

// References:
// https://developers.google.com/web/fundamentals/primers/service-workers/?hl=en-us
// https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle?hl=en-us
// https://developers.google.com/web/fundamentals/codelabs/offline/?hl=en-us
// https://web.dev/service-workers-cache-storage
