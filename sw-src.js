// Service Worker as an ES module
// Import Workbox modules from CDN (v7.0.0 at time of writing)
import { precacheAndRoute } from "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-precaching.js";
import { registerRoute } from "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-routing.js";
import { CacheFirst } from "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-strategies.js";
import { ExpirationPlugin } from "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-expiration.js";

// Import your own routes list
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

// Precache static assets discovered by Workbox + your custom routes
precacheAndRoute(
  self.__WB_MANIFEST.concat(routes.map((url) => ({ url, revision: null }))),
  {
    // Strip out tracking params so cache still matches
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  }
);

// Runtime caching for audio files
registerRoute(
  ({ request }) => request.destination === "audio",
  new CacheFirst({
    cacheName: "audio-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50, // cap number of cached files
        maxAgeSeconds: 90 * 24 * 60 * 60, // 90 days
      }),
    ],
  })
);
