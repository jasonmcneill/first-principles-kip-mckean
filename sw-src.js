// Service Worker as an ES module
// Import Workbox modules from CDN (v7.0.0 at time of writing)
import { precacheAndRoute } from "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-precaching.mjs";
import { registerRoute } from "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-routing.mjs";
import { CacheFirst } from "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-strategies.mjs";
import { ExpirationPlugin } from "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-expiration.mjs";

// Import your own routes list
import { routes } from "./routes.js";

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
