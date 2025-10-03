// Service worker using Workbox UMD build
importScripts(
  "https://cdn.jsdelivr.net/npm/workbox-sw@7.0.0/build/workbox-sw.js"
);

if (workbox) {
  // The `LANG_SLUGS` object is injected at build-time from the i18n folder.
  // BUILD_INJECT_LANG_SLUGS
  const LANG_SLUGS = {};
  // The active language is injected per build when generating per-language SW files
  // BUILD_INJECT_ACTIVE_LANG
  const ACTIVE_LANG = null;

  const routes = [
    {
      url: "/",
      // Use a timestamp so the precache manifest changes when this file is rebuilt
      revision: String(Date.now()),
    },
  ];

  // Restrict to a single active language when provided; otherwise include all
  const langs =
    typeof ACTIVE_LANG === "string" && ACTIVE_LANG
      ? [ACTIVE_LANG]
      : Object.keys(LANG_SLUGS || {});

  langs.forEach((lang) => {
    const langList = LANG_SLUGS[lang] || [];
    langList.forEach((slug) => {
      routes.push({
        url: `/${lang}/${slug}`,
        // Use a timestamp to force update when this script is regenerated
        revision: String(Date.now()),
      });
    });
  });

  // Ensure the service worker takes control as soon as it's installed/activated
  // This helps when a new SW is deployed so clients are claimed immediately.
  self.addEventListener("install", (event) => {
    // Activate new SW immediately, skipping waiting state
    if (self.skipWaiting) {
      try {
        self.skipWaiting();
      } catch (e) {
        /* ignore */
      }
    }
    if (event && event.waitUntil) {
      // No async work here, but keep waitUntil for future use
      event.waitUntil(Promise.resolve());
    }
  });

  self.addEventListener("activate", (event) => {
    if (self.clients && self.clients.claim) {
      try {
        self.clients.claim();
      } catch (e) {
        /* ignore */
      }
    }
    if (event && event.waitUntil) {
      event.waitUntil(Promise.resolve());
    }
  });

  // Precache static assets + generated routes (exclude audio .webm)
  const precacheManifest = (self.__WB_MANIFEST || []).filter((entry) => {
    const url = typeof entry === "string" ? entry : entry.url;
    return !(/^\/?audio\//i.test(url) || /\.webm(\?.*)?$/i.test(url));
  });
  workbox.precaching.precacheAndRoute(precacheManifest.concat(routes), {
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  });
  // Clean up caches created by older service workers when switching languages
  if (workbox.precaching && workbox.precaching.cleanupOutdatedCaches) {
    try {
      workbox.precaching.cleanupOutdatedCaches();
    } catch (_) {}
  }

  // Prefetch helper: fetch full .webm under /audio/ and cache
  async function prefetchAudio(urlString) {
    const result = { ok: false, url: urlString };
    try {
      const url = new URL(urlString, self.location.origin);
      result.url = url.href;
      if (
        !url.pathname.startsWith("/audio/") ||
        !/\.webm$/i.test(url.pathname)
      ) {
        result.error = "URL not allowed";
        return result;
      }

      const cache = await caches.open("audio-cache");
      const existing = await cache.match(url.href);
      if (existing) {
        result.ok = true;
        result.cached = true;
        result.from = "cache";
        return result;
      }

      const req = new Request(url.href, {
        method: "GET",
        credentials: "same-origin",
        mode: "cors",
        redirect: "follow",
        referrer: "about:client",
        referrerPolicy: "strict-origin-when-cross-origin",
      });

      const resp = await fetch(req);
      if (resp && (resp.status === 200 || resp.type === "opaque")) {
        await cache.put(url.href, resp.clone());
        result.ok = true;
        result.cached = true;
        result.from = "network";
        result.status = resp.status || 0;
        return result;
      }

      result.error = `Unexpected response: ${
        resp ? resp.status : "no response"
      }`;
      return result;
    } catch (err) {
      result.error = (err && err.message) || String(err);
      return result;
    }
  }

  // Allow the page to proactively prefetch audio
  self.addEventListener("message", (event) => {
    const data = event && event.data;
    if (!data) return;
    if (data.type === "PREFETCH_AUDIO" && typeof data.url === "string") {
      const respond = (payload) => {
        const message = {
          type: "PREFETCH_AUDIO_RESULT",
          ...payload,
          requestId: data.requestId,
        };
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage(message);
        } else if (event.source && event.source.postMessage) {
          event.source.postMessage(message);
        }
      };

      const p = (async () => {
        const result = await prefetchAudio(data.url);
        respond(result);
      })();

      if (event.waitUntil) event.waitUntil(p);
    }
  });

  // Helper to notify the initiating client for fetch-driven background work
  async function postToClient(event, payload) {
    try {
      if (event && event.clientId) {
        const client = await self.clients.get(event.clientId);
        if (client && client.postMessage) {
          client.postMessage(payload);
          return;
        }
      }
      // Fallback: first available window client
      const clientsList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      if (clientsList && clientsList.length && clientsList[0].postMessage) {
        clientsList[0].postMessage(payload);
      }
    } catch (_) {
      // ignore notification errors
    }
  }

  // Plugin: when first request is a Range (206), fetch full file in background and cache it
  const backgroundFullFetchPlugin = {
    handlerDidRespond: async ({ event, request, response }) => {
      try {
        if (!request || request.method !== "GET") return;
        // Only act on range requests that yielded a 206
        const rangeHeader =
          request.headers && request.headers.get
            ? request.headers.get("range")
            : null;
        if (!rangeHeader) return;
        if (!response || response.status !== 206) return;

        const url = new URL(request.url);
        // Constrain to our audio path and .webm
        if (
          !url.pathname.startsWith("/audio/") ||
          !url.pathname.endsWith(".webm")
        )
          return;

        const cache = await caches.open("audio-cache");
        const already = await cache.match(url.href);
        if (already) {
          // Already cached; acknowledge immediately
          postToClient(event, {
            type: "AUDIO_FULL_FETCH_RESULT",
            url: url.href,
            ok: true,
            cached: true,
            from: "cache",
          });
          return;
        }

        // Create a full (non-range) request mirroring key fetch options
        const fullRequest = new Request(url.href, {
          method: "GET",
          credentials: request.credentials || "same-origin",
          mode: request.mode || "cors",
          redirect: request.redirect || "follow",
          referrer: request.referrer || "about:client",
          referrerPolicy:
            request.referrerPolicy || "strict-origin-when-cross-origin",
          integrity: request.integrity || "",
        });

        const startedAt = Date.now();
        const doFetchAndCache = (async () => {
          let ok = false;
          let status = 0;
          let opaque = false;
          let error;
          try {
            const fullResponse = await fetch(fullRequest);
            status = fullResponse ? fullResponse.status || 0 : 0;
            opaque = !!(fullResponse && fullResponse.type === "opaque");
            // Cache successful 200 or opaque responses
            if (fullResponse && (status === 200 || opaque)) {
              await cache.put(url.href, fullResponse.clone());
              ok = true;
            } else {
              error = `Unexpected status ${status}`;
            }
          } catch (err) {
            error = (err && err.message) || String(err);
          } finally {
            const durationMs = Date.now() - startedAt;
            postToClient(event, {
              type: "AUDIO_FULL_FETCH_RESULT",
              url: url.href,
              ok,
              cached: ok,
              from: ok ? "network" : undefined,
              status,
              opaque,
              durationMs,
              error,
            });
          }
        })();

        if (event && event.waitUntil) {
          event.waitUntil(doFetchAndCache);
        } else {
          await doFetchAndCache;
        }
      } catch (_) {
        // fail silently
      }
    },
  };

  // Runtime caching for audio files (e.g. .webm, .mp4, .mp3) - cache on first play
  workbox.routing.registerRoute(
    ({ request, url }) =>
      url.pathname.startsWith("/audio/") && request.destination === "audio",
    new workbox.strategies.CacheFirst({
      cacheName: "audio-cache",
      plugins: [
        // Support HTTP Range requests used by <audio> streaming
        new workbox.rangeRequests.RangeRequestsPlugin(),
        // Limit cache size and age
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
          purgeOnQuotaError: true,
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        backgroundFullFetchPlugin,
      ],
    })
  );
} else {
  console.error("Workbox failed to load 😢");
}
