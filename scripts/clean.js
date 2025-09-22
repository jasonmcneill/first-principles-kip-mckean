const fs = require("fs");
const path = require("path");

const toRemove = [
  path.join(process.cwd(), "public", "sw.js"),
  path.join(process.cwd(), ".sw-build-temp.js"),
  path.join(process.cwd(), "lib", "lang-slugs.json"),
];

toRemove.forEach((p) => {
  try {
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log("Removed", p);
    }
  } catch (e) {
    console.warn("Failed to remove", p, e && e.message);
  }
});

// Also remove any per-language service workers (public/sw-*.js)
try {
  const pubDir = path.join(process.cwd(), "public");
  if (fs.existsSync(pubDir)) {
    const files = fs.readdirSync(pubDir);
    files
      .filter((f) => /^sw-[A-Za-z0-9_-]+\.js$/.test(f))
      .forEach((f) => {
        const full = path.join(pubDir, f);
        try {
          fs.unlinkSync(full);
          console.log("Removed", full);
        } catch (e) {
          console.warn("Failed to remove", full, e && e.message);
        }
      });
  }
} catch (e) {
  console.warn("Failed scanning public for sw-*.js:", e && e.message);
}

console.log("Clean complete");
