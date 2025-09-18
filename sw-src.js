// Service worker using Workbox UMD build
importScripts(
  "https://cdn.jsdelivr.net/npm/workbox-sw@7.0.0/build/workbox-sw.js"
);

if (workbox) {
  const langSlugs = [
    "after-baptism-now-what",
    "baptism-holy-spirit",
    "best-friends-all-time",
    "christ-is-your-life",
    "church",
    "course-information",
    "cross",
    "dashboard",
    "discipleship",
    "intro-to-course",
    "introduction",
    "kingdom",
    "light-darkness",
    "medical-account",
    "memory-scriptures",
    "miraculous-gifts-holy-spirit",
    "new-testament-conversion",
    "persecution",
    "seeking-god",
    "the-mission",
    "word",
  ];

  const routes = [
    {
      url: "/",
      revision: null,
    },
  ];

  const slugQuantity = langSlugs.length;
  const langs = ["en"];

  langs.forEach((lang) => {
    langSlugs.forEach((slug) => {
      routes.push({
        url: `/${lang}/${slug}`,
        revision: null,
      });
    });
  });

  // Precache static assets + generated routes
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST.concat(routes), {
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  });

  // Runtime caching for audio files
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith("/audio/"),
    async ({ event, request }) => {
      const cache = await caches.open("audio-cache");
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // Check for online status
      if (self.navigator.onLine) {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.ok) {
            // Clone and store in cache
            cache.put(request, networkResponse.clone());
            return networkResponse;
          }
        } catch (err) {
          // Network fetch failed, fall through to fail silently
        }
      }
      // Fail silently (no response)
      return Response.error();
    }
  );
} else {
  console.error("Workbox failed to load 😢");
}
