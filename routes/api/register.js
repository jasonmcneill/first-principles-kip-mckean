exports.POST = async (req, res) => {
  const db = require("../../db");
  const validator = require("email-validator");
  const bcrypt = require("bcrypt");
  const username = req.body.username || "";
  const password = req.body.password || "";
  const email = req.body.email || "";
  const firstName = req.body.firstName || "";
  const lastName = req.body.lastName || "";
  const gender = req.body.gender;
  const mailingList = req.body.mailingList ? 1 : 0;
  const lang = req.body.lang || "";

  // Validate

  if (!username.trim().length) {
    return res.status(400).send({
      msg: "username is required",
      msgType: "error",
    });
  }

  if (!password.trim().length) {
    return res.status(400).send({
      msg: "password is required",
      msgType: "error",
    });
  }

  if (password.trim().length < 8) {
    return res.status(400).send({
      msg: "password must be at least 8 characters",
      msgType: "error",
    });
  }

  if (!email.trim().length) {
    return res.status(400).send({
      msg: "email is required",
      msgType: "error",
    });
  }

  const isValidEmail = validator.validate(email);
  if (!isValidEmail) {
    return res.status(400).send({
      msg: "invalid email",
      msgType: "error",
    });
  }

  if (!firstName.trim().length) {
    return res.status(400).send({
      msg: "firstName is required",
      msgType: "error",
    });
  }

  if (!lastName.trim().length) {
    return res.status(400).send({
      msg: "lastName is required",
      msgType: "error",
    });
  }

  if (gender !== "male" && gender !== "female") {
    return res.status(400).send({
      msg: "gender is required",
      msgType: "error",
    });
  }

  if (mailingList !== 0 && mailingList !== 1) {
    return res.status(400).send({
      msg: "invalid value for mailingList",
      msgType: "error",
    });
  }

  if (lang.length !== 2) {
    return res.status(400).send({
      msg: "lang must be 2 characters",
      msgType: "error",
    });
  }

  const sql = `
    SELECT
      id, username
    FROM
      users
    WHERE
      username = ?
    LIMIT 1
    ;
  `;

  db.query(sql, [username.toLowerCase().trim()], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send({
        msg: "unable to check for existing username",
        msgType: "error",
      });
    }

    if (result.length) {
      return res.status(500).send({
        msg: "username is taken",
        msgType: "error",
        existingUser: result,
      });
    }

    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.log(hashErr);
        return res.status(500).send({
          msg: "unable to hash password",
          msgType: "error",
        });
      }

      const insertSql = `
        INSERT INTO users
          (username, password, email, firstName, lastName, gender, mailingList, lang, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())
      `;

      db.query(
        insertSql,
        [
          username,
          hashedPassword,
          email,
          firstName,
          lastName,
          gender,
          mailingList,
          lang,
        ],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.log(insertErr);
            return res.status(500).send({
              msg: "unable to create user",
              msgType: "error",
            });
          }

          return res.status(200).send({
            msg: "user registered",
            msgType: "success",
          });
        }
      );
    });
  });
};
