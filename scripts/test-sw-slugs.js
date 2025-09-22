const fs = require("fs");
const path = require("path");

function fail(msg) {
  console.error("FAIL:", msg);
  process.exit(2);
}

const pubDir = path.join(process.cwd(), "public");
if (!fs.existsSync(pubDir)) fail("public/ directory not found");
const swFiles = fs
  .readdirSync(pubDir)
  .filter((f) => /^sw-[A-Za-z0-9_-]+\.js$/.test(f));
if (!swFiles.length)
  fail(
    "No per-language service workers found (expected public/sw-<lang>.js). Run `npm run build`."
  );

let anyFailures = false;
for (const file of swFiles) {
  const filePath = path.join(pubDir, file);
  const swSrc = fs.readFileSync(filePath, "utf8");

  const slugsMatchAll = swSrc.match(/const LANG_SLUGS\s*=\s*(\{[\s\S]*?\});/gm);
  const slugsMatch = slugsMatchAll
    ? slugsMatchAll[slugsMatchAll.length - 1].match(
        /const LANG_SLUGS\s*=\s*(\{[\s\S]*?\});/
      )
    : null;
  if (!slugsMatch) {
    console.error(`FAIL: LANG_SLUGS not found in ${file}`);
    anyFailures = true;
    continue;
  }

  let langObj;
  try {
    langObj = eval("(" + slugsMatch[1] + ")");
  } catch (e) {
    console.error(`FAIL: Failed to parse LANG_SLUGS in ${file}:`, e.message);
    anyFailures = true;
    continue;
  }

  const activeMatchAll = swSrc.match(/const ACTIVE_LANG\s*=\s*([^;]+);/gm);
  const activeMatch = activeMatchAll
    ? activeMatchAll[activeMatchAll.length - 1].match(
        /const ACTIVE_LANG\s*=\s*([^;]+);/
      )
    : null;
  if (!activeMatch) {
    console.error(`FAIL: ACTIVE_LANG not found in ${file}`);
    anyFailures = true;
    continue;
  }

  let activeLang;
  try {
    activeLang = eval(activeMatch[1]);
  } catch (e) {
    console.error(`FAIL: Failed to parse ACTIVE_LANG in ${file}:`, e.message);
    anyFailures = true;
    continue;
  }

  // Verify this SW contains only its language routes and includes all of them
  const expected = new Set(
    (langObj[activeLang] || []).map((slug) => `/${activeLang}/${slug}`)
  );
  const missing = [];
  expected.forEach((route) => {
    if (!swSrc.includes(route)) missing.push(route);
  });
  if (missing.length) {
    console.error(`FAIL: Missing routes in ${file}:`, missing.slice(0, 10));
    anyFailures = true;
  }

  // Ensure routes from other languages are not present
  const otherHits = [];
  Object.keys(langObj)
    .filter((l) => l !== activeLang)
    .forEach((lang) => {
      (langObj[lang] || []).forEach((slug) => {
        const route = `/${lang}/${slug}`;
        if (swSrc.includes(route)) otherHits.push(route);
      });
    });
  if (otherHits.length) {
    console.error(
      `FAIL: Found other-language routes in ${file}:`,
      otherHits.slice(0, 10)
    );
    anyFailures = true;
  }

  if (!missing.length && !otherHits.length) {
    console.log(`OK: ${file} contains only its language routes`);
  }
}

if (anyFailures) process.exit(2);
console.log("OK: All per-language SW files validated");
process.exit(0);
