// This file exports the middleware function
const path = require("path");

function requireSubscription(req, res, next) {
  // Your subscription verification logic goes here
  const isSubscriber = false; // Placeholder

  if (isSubscriber) {
    next();
  } else {
    const langCode = req.params.langCode || "en";
    res.redirect(`/${langCode}/subscribe`);
  }
}

module.exports = requireSubscription; // Export the function
