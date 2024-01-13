var cacheName = "estrategiasV2";




function generatePageAndScriptUrls(baseFolder) {
    const urls = [];

    function collectUrls(currentFolder) {
        const files = self.__precacheManifest || [];
        files.forEach((file) => {
            if (file.startsWith(currentFolder)) {
                const url = new URL(file, self.location).toString();
                urls.push(url);
            }
        });
    }

    collectUrls('/pages');
    collectUrls(`${baseFolder}/scripts`);
    collectUrls(`${baseFolder}/styles`);

    return urls;
}
self.addEventListener('install', async (event) => {
    event.waitUntil(
        (async () => {
            try {
                const cache = await caches.open(cacheName);
                const resources = generatePageAndScriptUrls('/wwwroot');
                await cache.addAll(resources);
                console.log('Recursos agregados a la caché con éxito');
            } catch (error) {
                console.error('Error al agregar recursos a la caché:', error);
            }
        })()
    );
});

async function networkFirst(event) {
    let cache = await caches.open(cacheName);
    try {
        let response = await fetch(event.request);

        if (response.ok) {
            cache.put(event.request, response.clone());
            return response;
        }
    } catch (error) {

        let resCache = await cache.match(event.request);

        if (resCache) {
            return resCache;
        } else {
            return new Response("No hay conexión a internet");
        }
    }
}
self.addEventListener("fetch", function (event) {
    if (event.request.method !== "GET") {
        return fetch(event.request);
    } else {
        event.respondWith(networkFirst(event));
    }
});


