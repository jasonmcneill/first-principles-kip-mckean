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

app.get('/zeptomail-test', async (req, res) => {
  const { sendOTPEmail } = require('./emailService');
  const recipientEmail = 'vrtjason@gmail.com';
  const otpCode = '123456';

  sendOTPEmail(recipientEmail, otpCode)
    .then(response => {
      res.send('Test OTP email sent successfully.');
    })
    .catch(error => {
      res.status(500).send('Failed to send test OTP email.');
    });
});

// ---------------------------
// Start server
// ---------------------------
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
