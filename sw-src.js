// Service Worker with Workbox
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

// Import routes list (auto-generated)
import { routes } from "./routes.js";

// Combine manifest + routes + manual routes
precacheAndRoute(
  self.__WB_MANIFEST.concat([
    // Manual static routes if needed
    { url: "/about", revision: null },
    { url: "/contact", revision: null },
    { url: "/en/subscribe", revision: null },
    { url: "/es/subscribe", revision: null },
    // Auto-generated routes from routes.js
    ...routes.map((url) => ({ url, revision: null })),
  ]),
  {
    // Optional: ignore tracking params so cache still matches
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  }
);

// Runtime caching for audio
registerRoute(
  ({ request }) => request.destination === "audio",
  new CacheFirst({
    cacheName: "audio-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 90 * 24 * 60 * 60, // 90 days
      }),
    ],
  })
);
