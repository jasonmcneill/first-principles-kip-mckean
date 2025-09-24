const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const port = 3000;
const i18nRoutes = require("./routes/i18n");

// Load .env only for local/dev environments
const env = process.env.NODE_ENV || "local";
if (env === "development") {
  require("dotenv").config();
}

// Set up EJS and the views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set up a public directory
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: "1d",
    etag: true,
    lastModified: true,
  })
);

// Set parameters for audio
app.use(
  "/audio",
  express.static(path.join(__dirname, "public/audio"), {
    maxAge: "90d", // cache audio aggressively
    etag: true,
    lastModified: true,
  })
);

// Use the new i18n router
app.use("/", i18nRoutes);

app.get("/", (req, res) => {
  // Example list of supported languages
  const languages = {
    en: { name: "English" },
    es: { name: "Español" },
  };
  res.render("select-language", { languages });
});

// A route for the subscription page (no middleware needed)
app.get("/:langCode/subscribe", (req, res) => {
  const { langCode } = req.params;
  const contentPath = path.join(__dirname, "i18n", langCode, "subscribe.json");

  if (fs.existsSync(contentPath)) {
    try {
      const pageData = JSON.parse(fs.readFileSync(contentPath, "utf8"));
      res.render("subscribe", { data: pageData });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error loading subscribe page content.");
    }
  } else {
    const englishContentPath = path.join(
      __dirname,
      "i18n",
      "en",
      "subscribe.json"
    );
    if (fs.existsSync(englishContentPath)) {
      const pageData = JSON.parse(fs.readFileSync(englishContentPath, "utf8"));
      res.render("subscribe", { data: pageData });
    } else {
      res.status(404).render("404", { title: "Page Not Found" });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
