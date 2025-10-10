exports.POST = async (req, res) => {
  const db = require("../../db");
  const userid = req.user.id;
  const password = req.body.password || "";

  // Validate

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

  const saltRounds = 10;

  bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
    if (hashErr) {
      console.log(hashErr);
      return res.status(500).send({
        msg: "unable to hash password",
        msgType: "error",
      });
    }

    const sql = `
      UPDATE
        users
      SET
        password = ?
      WHERE
        id = ?
      ;
    `;

    db.query(sql, [hashedPassword, userid], (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          msg: "unable to update password",
          msgType: "error",
        });
      }

      return res.status(200).send({
        msg: "password updated",
        msgType: "success",
      });
    });
  });
};
