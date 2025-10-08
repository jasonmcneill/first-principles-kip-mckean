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

module.exports = router;
