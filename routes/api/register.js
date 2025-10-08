exports.POST = (req, res) => {
  const db = require("../../db");
  const validator = require("email-validator");
  const genOTP = require("generate-one-time-password");
  const bcrypt = require("bcrypt");
  const username = req.body.username || "";
  const password = req.body.password || "";
  const email = req.body.email || "";
  const firstName = req.body.firstName || "";
  const lastName = req.body.lastName || "";
  const gender = req.body.gender;
  const mailingList = req.body.mailingList ? 1 : 0;
  const lang = req.body.lang || "";
  const emailSubject = req.body.emailSubject || "";
  const emailP1 = req.body.emailP1 || "";
  const emailP2 = req.body.emailP2 || "";
  const emailP3 = req.body.emailP3 || "";
  const emailFooter1 = req.body.emailFooter1 || "";
  const emailFooter2 = req.body.emailFooter2 || "";
  const emailTextTemplate = req.body.emailTextTemplate || "";
  const emailHTMLTemplate = req.body.emailHTMLTemplate || "";

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

          const userid = insertResult[0].insertId;

          const otp = genOTP.generateOTP(6);

          const sql = `
            INSERT INTO otp(userid, code, expiry, createdAt)
            VALUES (
              ?,
              ?,
              TIMESTAMPADD(MINUTE, 20, UTC_TIMESTAMP()),
              UTC_TIMESTAMP()
            );
          `;

          db.query(sql, [userid, otp, expiry], async (error, result) => {
            if (error) {
              console.log(error);
              return res.status(500).send({
                msg: "unable to store otp",
                msgType: "error",
              });
            }

            let htmlBody = emailHTMLTemplate.replaceAll(
              "{{ emailP1 }}",
              emailP1
            );
            htmlBody = htmlBody.replaceAll("{{ OTP }}", otp);
            htmlBody = htmlBody.replaceAll("{{ emailP2 }}", emailP2);
            htmlBody = htmlBody.replaceAll("{{ emailP3 }}", emailP3);
            htmlBody = htmlBody.replaceAll("{{ emailFooter1 }}", emailFooter1);
            htmlBody = htmlBody.replaceAll("{{ emailFooter2 }}", emailFooter2);

            let textBody = emailTextTemplate.replaceAll(
              "{{ emailP1 }}",
              emailP1
            );
            textBody = textBody.replaceAll("{{ OTP }}", otp);
            textBody = textBody.replaceAll("{{ emailP2 }}", emailP2);
            textBody = textBody.replaceAll("{{ emailP3 }}", emailP3);
            textBody = textBody.replaceAll("{{ emailFooter1 }}", emailFooter1);
            textBody = textBody.replaceAll("{{ emailFooter2 }}", emailFooter2);

            require("./utils")
              .sendMail(
                email,
                `${firstName} ${lastName}`,
                emailSubject,
                htmlBody,
                textBody
              )
              .then((result) => {
                return res.status(200).send({
                  msg: "user registered",
                  msgType: "success",
                });
              });
          });
        }
      );
    });
  });
};
