const express = require("express");
const router = express.Router();
const utils = require("./utils");
const authenticateToken = utils.authenticateToken;

/*
  // HOW TO USE MIDDLEWARE
  const eventAdd = require("./controllers_invites/event-add");
  router.post("/event-add", authenticateToken, eventAdd.POST);
*/

const register = require("./register");
router.post("/register", register.POST);

module.exports = router;
