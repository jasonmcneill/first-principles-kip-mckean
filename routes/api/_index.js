const express = require("express");
const router = express.Router();
const utils = require("./utils");
const authenticateToken = utils.authenticateToken;

const register = require("./register");
router.post("/register", register.POST);

const confirm = require("./confirm");
router.post("/confirm", confirm.POST);

const login = require("./login");
router.post("/login", login.POST);

const refreshToken = require("./refresh-token");
router.post("/refresh-token", refreshToken.POST);

const pending = require("./pending");
router.post("/pending", authenticateToken, pending.POST);

const pwForgot = require("./pw-forgot");
router.post("/pw-forgot", pwForgot.POST);

const pwForgotConfirm = require("./pw-forgot-confirm");
router.post("/pw-forgot-confirm", pwForgotConfirm.POST);

const pwForgotNew = require("./pw-forgot-new");
router.post("/pw-forgot-new", authenticateToken, pwForgotNew.POST);

const paypalWebhook = require("./paypal-webhook");
router.post("/paypal-webhook", paypalWebhook.POST);

const checkSubscription = require("./check-subscription");
router.post("/check-subscription", authenticateToken, checkSubscription.POST);

module.exports = router;
