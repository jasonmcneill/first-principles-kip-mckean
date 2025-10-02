try {
  require("dotenv").config();
} catch (_) {}

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3000;
const i18nRoutes = require("./routes/i18n");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up EJS and the views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// API
const routes_api = require("./routes/api/_index");
app.use("/api", routes_api);

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
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
