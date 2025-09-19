const fs = require("fs");
const path = require("path");

function fail(msg) {
  console.error("FAIL:", msg);
  process.exit(2);
}

const swPath = path.join(process.cwd(), "public", "sw.js");
if (!fs.existsSync(swPath))
  fail("public/sw.js not found; run `npm run build` first");
const swSrc = fs.readFileSync(swPath, "utf8");

// Find injected LANG_SLUGS by a simple regex looking for 'const LANG_SLUGS = ' followed by JSON
// Match the last occurrence of `const LANG_SLUGS = { ... };` to avoid example placeholders
const allMatches = swSrc.match(/const LANG_SLUGS\s*=\s*(\{[\s\S]*?\});/gm);
const match = allMatches
  ? allMatches[allMatches.length - 1].match(
      /const LANG_SLUGS\s*=\s*(\{[\s\S]*?\});/
    )
  : null;
if (!match) fail("LANG_SLUGS not found in public/sw.js");

let langObj;
try {
  langObj = eval("(" + match[1] + ")"); // small, controlled eval to parse object literal
} catch (e) {
  console.error("Failed to parse LANG_SLUGS raw text:");
  console.error(match[1].slice(0, 1000));
  fail("Failed to parse LANG_SLUGS: " + e.message);
}

// Ensure each route exists as a string in the sw file (precache urls or array entries)
const missing = [];
Object.keys(langObj).forEach((lang) => {
  (langObj[lang] || []).forEach((slug) => {
    const route = `/${lang}/${slug}`;
    if (!swSrc.includes(route)) missing.push(route);
  });
});

if (missing.length) {
  console.error("Missing routes in public/sw.js:", missing.slice(0, 20));
  process.exit(2);
}

console.log("OK: public/sw.js contains all LANG_SLUGS routes");
process.exit(0);
