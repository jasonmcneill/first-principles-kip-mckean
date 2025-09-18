// Service worker using Workbox UMD build
importScripts(
  "https://cdn.jsdelivr.net/npm/workbox-sw@7.0.0/build/workbox-sw.js"
);

if (workbox) {
  console.log("Workbox loaded 🎉");

  const routes = [
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
    "select-language",
    "the-mission",
    "word",
  ];

  const languages = ["en", "es"];

  // Build language-prefixed routes
  const languageRoutes = languages.flatMap((lang) =>
    routes.map((slug) => `/${lang}/${slug}`)
  );

  // Precache static assets + generated routes
  /* workbox.precaching.precacheAndRoute(
    self.__WB_MANIFEST.concat(
      [
        { url: "/", revision: null }, // homepage
        { url: "/about", revision: null },
        { url: "/contact", revision: null },
        { url: "/en/subscribe", revision: null },
        { url: "/es/subscribe", revision: null },
      ].concat(languageRoutes.map((url) => ({ url, revision: null })))
    ),
    {
      ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
    }
  ); */

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
