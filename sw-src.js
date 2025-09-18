// Service worker using Workbox UMD build
importScripts(
  "https://cdn.jsdelivr.net/npm/workbox-sw@7.0.0/build/workbox-sw.js"
);

if (workbox) {
  console.log("Workbox loaded 🎉");

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
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST.concat(langRoutes), {
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  });

  // Runtime caching for audio files
  workbox.routing.registerRoute(
    ({ request }) => request.destination === "audio",
    new workbox.strategies.CacheFirst({
      cacheName: "audio-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 90 * 24 * 60 * 60, // 90 days
        }),
      ],
    })
  );
} else {
  console.error("Workbox failed to load 😢");
}
