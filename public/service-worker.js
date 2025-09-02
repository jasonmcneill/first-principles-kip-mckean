importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
);

if (workbox) {
  // Precache your EJS routes as they are unchanging
  workbox.precaching.precacheAndRoute([
    { url: "/", revision: "1" },
    { url: "/en/dashboard", revision: "2" },
    { url: "/en/introduction", revision: "1" },
    { url: "/en/course-information", revision: "1" },
    { url: "/en/intro-to-course", revision: "1" },
    { url: "/en/seeking-god", revision: "2" },
    { url: "/en/word", revision: "1" },
    { url: "/en/discipleship", revision: "1" },
    // Add other unchanging routes here
  ]);

  // Cache EJS routes as the user navigates
  workbox.routing.registerRoute(
    ({ request, url }) => {
      // Check if the request is for an HTML page from your domain
      return (
        request.destination === "document" &&
        url.origin === self.location.origin
      );
    },
    // Use the StaleWhileRevalidate strategy for caching
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "page-cache",
    })
  );
}
