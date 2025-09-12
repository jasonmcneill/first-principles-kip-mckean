const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// A list of pages that require a subscription
const subscriberPages = [""];

// The subscription check middleware
function requireSubscription(req, res, next) {
  const isSubscriber = false; // Placeholder
  const langCode = req.params.langCode || "en";

  if (isSubscriber) {
    return next();
  }
  res.redirect(`/${langCode}/subscribe`);
}

// A middleware to check if a page requires a subscription
function checkSubscription(req, res, next) {
  const { pageSlug } = req.params;
  if (subscriberPages.includes(pageSlug)) {
    return requireSubscription(req, res, next);
  }
  next();
}

// The main route handler for all i18n pages
function renderPage(req, res) {
  const { langCode, pageSlug } = req.params;
  const templatePath = path.join(__dirname, "../views", `${pageSlug}.ejs`);
  const pass1Path = path.join(
    __dirname,
    "../i18n",
    langCode,
    `${pageSlug}.json`
  );
  const pass2Path = path.join(
    __dirname,
    "../i18n",
    langCode,
    "decorations",
    `${pageSlug}.json`
  );

  console.log("pass2Path exists: " + fs.existsSync(pass2Path));
  console.log("pass2Path:", pass2path);

  if (fs.existsSync(templatePath) && fs.existsSync(pass1Path)) {
    try {
      const pass1 = JSON.parse(fs.readFileSync(pass1Path, "utf8"));

      let pageData = pass1;

      if (fs.existsSync(pass2Path)) {
        try {
          const pass2 = JSON.parse(fs.readFileSync(pass2Path, "utf8"));

          pass2.forEach((item) => {
            const { key, text, decorations } = item;
            const { translated } = text;
            let decorated = translated;

            if (decorations.link) {
              decorated = decorated.replace(
                decorated,
                `<a href="${decorations.link.href}" ${decorations.link.attributes}>${decorated}</a>`
              );
            }

            if (decorations.bold) {
              decorated = `<strong>${decorated}</strong>`;
            }

            if (decorations.italic) {
              decorated = `<em>${decorated}</em>`;
            }

            if (decorations.underline) {
              decorated = `<u>${decorated}</u>`;
            }

            if (decorations.tags && Array.isArray(decorations.tags)) {
              decorations.tags.forEach((tag) => {
                decorated = `<${tag.name} ${tag.attributes}>${decorated}</${tag.name}>`;
              });
            }

            pageData[key] = pageData[key].replace(translated, decorated);
          });
        } catch (error) {
          console.error(error);
          res.status(500).send("Error loading content decorations.");
        }
      }

      res.render(pageSlug, { data: pageData });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error loading page content.");
    }
  } else {
    const englishContentPath = path.join(
      __dirname,
      "../i18n",
      "en",
      `${pageSlug}.json`
    );
    if (fs.existsSync(templatePath) && fs.existsSync(englishContentPath)) {
      res.redirect(`/en/${pageSlug}`);
    } else {
      res.status(404).render("404", { title: "Page Not Found" });
    }
  }
}

// Apply the checkSubscription middleware to all i18n routes
router.get("/:langCode/:pageSlug", checkSubscription, renderPage);

// Export the router
module.exports = router;
