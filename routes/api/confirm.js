exports.POST = async (req, res) => {
  const db = require("../../db");
  const code = req.body.code || "";

  // Validate

  if (!code || !code.length) {
    return res.status(400).send({
      msg: "code is required",
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
      id,
      userid,
      code,
      expiry
    FROM
      confirmation_codes
    WHERE
      userid = ?
    AND
      code = ?
    LIMIT 1
    ;
  `;

  db.query(sql, [req.user.id, code], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send({
        msg: "unable to query for confirmation code",
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

    return res.status(200).send({
      msg: "code verified",
      msgType: "success",
    });
  });
};
