exports.POST = async (req, res) => {
  const db = require("../../db");
  const bcrypt = require("bcrypt");
  const jsonwebtoken = require("jsonwebtoken");
  const username = req.body.username || "";
  const password = req.body.password || "";

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

  const sql = `
    SELECT
      id, password
    FROM
      users
    WHERE
      username = ?
    LIMIT 1
    ;
  `;

  db.query(sql, [username], (error, result) => {
    if (error) {
      return res.status(500).send({
        msg: "unable to log in",
        msgType: "error",
      });
    }

    if (!result.length) {
      return res.status(404).send({
        msg: "invalid login",
        msgType: "error",
      });
    }

    const storedPassword = result[0].password;
    const id = result[0].id;

    bcrypt.compare(password, storedPassword, (err, same) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          msg: "unable to hash password",
          msgType: "error",
        });
      } else if (same) {
        const sql = `
          SELECT
            id,
            username,
            status,
            firstname,
            lastname,
            email,
            gender,
            mailingList,
            lang,
            subscribeduntil,
            createdAt
          FROM
            users
          WHERE
            id = ?
          LIMIT 1
          ;
        `;

        db.query(sql, [id], (error, result) => {
          if (error) {
            console.log(error);
            return res.status(500).send({
              msg: "unable to log in",
              msgType: "error",
            });
          }

          if (!result.length) {
            return res.status(404).send({
              msg: "invalid login",
              msgType: "error",
            });
          }

          const {
            id,
            username,
            status,
            firstname,
            lastname,
            email,
            gender,
            mailingList,
            lang,
            subscribeduntil,
            createdAt,
          } = result[0];

          const refreshToken = jsonwebtoken.sign(
            {
              id: id,
              username: username,
              status: status,
              firstname: firstname,
              lastname: lastname,
              email: email,
              gender: gender,
              mailingList: mailingList,
              lang: lang,
              subscribeduntil: subscribeduntil,
              createdAt: createdAt,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "30d" }
          );

          const accessToken = jsonwebtoken.sign(
            {
              id: id,
              username: username,
              status: status,
              firstname: firstname,
              lastname: lastname,
              email: email,
              gender: gender,
              mailingList: mailingList,
              lang: lang,
              subscribeduntil: subscribeduntil,
              createdAt: createdAt,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "10m" }
          );

          return res.status(200).send({
            msg: "login succeeded",
            msgType: "success",
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
        });
      } else {
        return res.status(404).send({
          msg: "invalid login",
          msgType: "error",
        });
      }
    });
  });
};
