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

  // Precache static assets + generated routes (exclude audio .webm)
  const precacheManifest = (self.__WB_MANIFEST || []).filter((entry) => {
    const url = typeof entry === "string" ? entry : entry.url;
    return !(
      /^\/?audio\//i.test(url) ||
      /\.webm(\?.*)?$/i.test(url)
    );
  });
  workbox.precaching.precacheAndRoute(precacheManifest.concat(routes), {
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  });

  // Runtime caching for audio files (.webm) - cache on first play
  workbox.routing.registerRoute(
    ({ request, url }) =>
      url.pathname.startsWith("/audio/") &&
      (request.destination === "audio" || url.pathname.endsWith(".webm")),
    new workbox.strategies.CacheFirst({
      cacheName: "audio-cache",
      plugins: [
        // Support HTTP Range requests used by <audio> streaming
        new workbox.rangeRequests.RangeRequestsPlugin(),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );
} else {
  console.error("Workbox failed to load 😢");
}
