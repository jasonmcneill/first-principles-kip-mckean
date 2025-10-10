exports.POST = async (req, res) => {
  const db = require("../../db");
  const jsonwebtoken = require("jsonwebtoken");
  const userid = req.body.userid || "";
  const code = req.body.code || "";

  // Validate

  if (!userid || !userid.length) {
    return res.status(400).send({
      msg: "userid is required",
      msgType: "error",
    });
  }

  if (!code || !code.length) {
    return res.status(400).send({
      msg: "code is required",
      msgType: "error",
    });
  }

  if (isNaN(userid)) {
    return res.status(400).send({
      msg: "userid must be numeric",
      msgType: "error",
    });
  }

  if (isNaN(code)) {
    return res.status(400).send({
      msg: "code must be numeric",
      msgType: "error",
    });
  }

  // Check confirmation code

  const sql = `
    SELECT
      userid,
      expiry
    FROM
      otp
    WHERE
      userid = ?
    AND
      code = ?
    LIMIT 1
    ;
  `;

  db.query(sql, [userid, code], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send({
        msg: "unable to confirm confirmation code",
        msgType: "error",
      });
    }

    if (!result.length) {
      return res.status(404).send({
        msg: "no match found",
        msgType: "error",
      });
    }

    const row = result[0];
    const expiryDate = new Date(row.expiry);
    const now = new Date(row.now);
    if (expiryDate.getTime() < now.getTime()) {
      return res.status(400).send({
        msg: "code expired",
        msgType: "error",
      });
    }

    const userid = result[0].userid;

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

    db.query(sql, [userid], (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          msg: "unable to query for user",
          msgType: "error",
        });
      }

      if (!result.length) {
        return res.status(404).send({
          msg: "user not found",
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
        msg: "code confirmed",
        msgType: "success",
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    });
  });
};
