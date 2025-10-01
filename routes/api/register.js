exports.POST = async (req, res) => {
  const db = require("../../db");
  const validator = require("email-validator");
  const username = req.body.username || "";
  const password = req.body.password || "";
  const email = req.body.email || "";
  const firstName = req.body.firstName || "";
  const lastName = req.body.lastName || "";
  const mailingList = req.body.mailingList ? 1 : 0;
  const gender = req.body.gender;

  // Validate

  const isValidEmail = validator.validate(email);
  if (!isValidEmail) {
    return res.status(400).send({
      msg: "invalid email",
      msgType: "error",
    });
  }

  return res.status(200).send({
    msg: "user registered",
    msgType: "success",
  });
};
