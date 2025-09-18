// routes.js

// The list of slugs (page names) — add to this as your app grows
export const slugs = [
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

// The languages you support
export const languages = ["en"];

// Generate full paths: ["/en/about", "/es/about", ...]
export const routes = [
  "/", // homepage (no language prefix)
  ...languages.flatMap((lang) => slugs.map((slug) => `/${lang}/${slug}`)),
];
