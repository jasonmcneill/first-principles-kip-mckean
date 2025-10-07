exports.POST = async (req, res) => {
  const db = require("../../db");
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

  // Check

  const sql = `
    SELECT
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
      UPDATE users
      SET
        status = 'registered'
      WHERE
        id = ?
      LIMIT 1
      ;
    `;

    db.query(sql, [userid], (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          msg: "unable to update user's status",
          msgType: "error",
        });
      }

      return res.status(200).send({
        msg: "code verified",
        msgType: "success",
      });
    });
  });
};
