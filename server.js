// server.js

// Load .env for non-production environments
if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "staging") {
  try { require("dotenv").config(); } catch (_) { }
}

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const { auth, requiresAuth } = require('express-openid-connect');

const PORT = process.env.PORT || 3000;
const HOST = "127.0.0.1";

const i18nRoutes = require("./routes/i18n");
const routes_api = require("./routes/api/_index");

const app = express();

// ---------------------------
// Auth0 configuration
// ---------------------------
const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.AUTH0_BASE_URL,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  secret: process.env.AUTH0_SECRET,
  afterCallback: (req, res, session) => {
    const jwt = require('jsonwebtoken');
    const idToken = session.id_token;
    const lang = req.query.lang || "en";

    console.log('OIDC returnTo:', req.oidc.returnTo);
    console.log('Language detected in afterCallback:', lang);

    if (idToken) {
      const decoded = jwt.decode(idToken, { complete: true });
      console.log('Decoded ID token:', decoded);
    }

    res.redirect(`/${lang}/dashboard`);
    return;
  }
};

// Initialize Auth0 middleware
app.use(auth(config));

// ---------------------------
// View engine setup
// ---------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---------------------------
// Middleware
// ---------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------
// Public static directories
// ---------------------------
app.use(express.static(path.join(__dirname, "public"), { maxAge: "1d" }));
app.use("/audio", express.static(path.join(__dirname, "public/audio"), { maxAge: "90d" }));

// ---------------------------
// API and i18n routes
// ---------------------------
app.use("/api", routes_api);
app.use("/", i18nRoutes);

// ---------------------------
// Home page (language selector)
// ---------------------------
app.get("/", (req, res) => {
  const languages = { en: { name: "English" }, es: { name: "Español" } };
  res.render("select-language", { languages });
});

// ---------------------------
// Subscription page
// ---------------------------
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
    // fallback to English
    const englishContentPath = path.join(__dirname, "i18n", "en", "subscribe.json");
    if (fs.existsSync(englishContentPath)) {
      const pageData = JSON.parse(fs.readFileSync(englishContentPath, "utf8"));
      res.render("subscribe", { data: pageData });
    } else {
      res.status(404).render("404", { title: "Page Not Found" });
    }
  }
});

// ---------------------------
// Login route (from front-end)
// ---------------------------
// Example: user clicks "Login" button on /en or /es page
// Front-end should redirect to /login?lang=<lang>
app.get('/login', (req, res) => {
  const lang = req.query.lang || "en";
  res.oidc.login({
    authorizationParams: { lang, scope: 'openid profile email' },
  });
});

// ---------------------------
// Profile route (protected)
// ---------------------------
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// ---------------------------
// Start server
// ---------------------------
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
