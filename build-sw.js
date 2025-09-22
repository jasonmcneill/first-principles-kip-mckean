#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");
const workboxBuild = require("workbox-build");

(async () => {
  try {
    // Compute a stable build revision: prefer git commit short hash, fallback to timestamp
    let buildHash = null;
    try {
      buildHash = execSync("git rev-parse --short HEAD", { cwd: process.cwd() })
        .toString()
        .trim();
    } catch (e) {
      buildHash = String(Date.now());
    }

    // Auto-generate LANG_SLUGS by scanning i18n/* directories (ignore decorations)
    const i18nPath = path.join(process.cwd(), "i18n");
    if (!fs.existsSync(i18nPath)) {
      throw new Error("i18n folder not found; cannot derive language slugs");
    }
    const langDirs = fs
      .readdirSync(i18nPath, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .filter((name) => name !== "decorations");

    const LANG_SLUGS = {};
    langDirs.forEach((lang) => {
      const langDir = path.join(i18nPath, lang);
      const entries = fs
        .readdirSync(langDir, { withFileTypes: true })
        .filter((d) => d.isFile() && d.name.endsWith(".json"))
        .map((d) => d.name.replace(/\.json$/i, ""))
        .sort();
      LANG_SLUGS[lang] = entries;
    });

    // routes array no longer needed here; sw-src composes routes from ACTIVE_LANG

    // Load existing workbox config
    const workboxConfigPath = path.join(process.cwd(), "workbox-config.js");
    if (!fs.existsSync(workboxConfigPath)) {
      throw new Error("workbox-config.js not found in project root");
    }
    const config = require(workboxConfigPath);

    // Replace placeholder in sw-src.js with the slug array so the built sw contains the list
    const swSrcPath = path.join(process.cwd(), config.swSrc || "sw-src.js");
    // Build one service worker per language
    const swSrcTemplate = fs.readFileSync(swSrcPath, "utf8");
    const placeholder = "BUILD_INJECT_LANG_SLUGS";
    if (!swSrcTemplate.includes(placeholder)) {
      throw new Error(
        `Placeholder ${placeholder} not found in ${swSrcPath}. Aborting build.`
      );
    }

    for (const lang of Object.keys(LANG_SLUGS)) {
      const swTempPath = path.join(process.cwd(), `.sw-build-temp-${lang}.js`);
      let finalSw = swSrcTemplate
        // Inject all language slugs (the SW will filter to ACTIVE_LANG)
        .replace(
          "const LANG_SLUGS = {};",
          `const LANG_SLUGS = ${JSON.stringify(LANG_SLUGS, null, 2)};`
        )
        // Inject the active language constant
        .replace(
          "const ACTIVE_LANG = null;",
          `const ACTIVE_LANG = ${JSON.stringify(lang)};`
        )
        // Ensure route revisions are stable per build
        .replace(
          /revision:\s*String\(Date\.now\(\)\)/g,
          `revision: "${buildHash}"`
        );

      fs.writeFileSync(swTempPath, finalSw, "utf8");

      // Call injectManifest for this language
      const injectOptions = Object.assign({}, config, {
        swSrc: swTempPath,
        swDest: path.join("public", `sw-${lang}.js`),
      });

      console.log(
        `Building SW for lang=${lang} with build revision ${buildHash}`
      );
      const { count, size, warnings } = await workboxBuild.injectManifest(
        injectOptions
      );
      if (warnings && warnings.length) {
        console.warn(`Workbox warnings for ${lang}:`, warnings);
      }
      console.log(
        `Generated ${injectOptions.swDest} with ${count} precached files, total size ${size} bytes`
      );

      // Remove temporary sw file after successful build
      try {
        if (fs.existsSync(swTempPath)) fs.unlinkSync(swTempPath);
      } catch (e) {
        console.warn(
          `Failed to remove temporary SW file for ${lang}:`,
          e && e.message
        );
      }
    }
  } catch (err) {
    console.error("Error during SW build:", err);
    process.exitCode = 2;
  }
})();
