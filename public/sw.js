// Caches Kazakh TTS audio responses so repeated plays of the same text
// are served instantly from Cache Storage instead of hitting the TTS API again.
const TTS_CACHE = "tts-audio-v1";
const TTS_HOST = "edgettsapi.vercel.app";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.hostname !== TTS_HOST) return;

  event.respondWith(
    caches.open(TTS_CACHE).then(async (cache) => {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      const response = await fetch(event.request);
      cache.put(event.request, response.clone());
      return response;
    })
  );
});
