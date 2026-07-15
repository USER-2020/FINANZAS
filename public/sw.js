const STATIC_CACHE = 'finanzasos-static-v1';
const PAGE_CACHE = 'finanzasos-pages-v1';
const RUNTIME_CACHE = 'finanzasos-runtime-v1';

const APP_SHELL = ['/', '/offline.html', '/favicon.svg', '/pwa/icon-192.svg', '/pwa/icon-512.svg', '/pwa/icon-maskable.svg'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => ![STATIC_CACHE, PAGE_CACHE, RUNTIME_CACHE].includes(key))
                    .map((key) => caches.delete(key)),
            ),
        ).then(() => self.clients.claim()),
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET' || url.origin !== self.location.origin) {
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const cloned = response.clone();
                    caches.open(PAGE_CACHE).then((cache) => cache.put(request, cloned));
                    return response;
                })
                .catch(async () => {
                    const cachedPage = await caches.match(request);

                    if (cachedPage) {
                        return cachedPage;
                    }

                    return caches.match('/offline.html');
                }),
        );

        return;
    }

    const isStaticAsset =
        url.pathname.startsWith('/build/') ||
        url.pathname.startsWith('/pwa/') ||
        url.pathname === '/favicon.svg';

    if (isStaticAsset) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) {
                    return cached;
                }

                return fetch(request).then((response) => {
                    const cloned = response.clone();
                    caches.open(STATIC_CACHE).then((cache) => cache.put(request, cloned));
                    return response;
                });
            }),
        );

        return;
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                const cloned = response.clone();
                caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, cloned));
                return response;
            })
            .catch(async () => {
                const cached = await caches.match(request);
                return cached || Response.error();
            }),
    );
});
