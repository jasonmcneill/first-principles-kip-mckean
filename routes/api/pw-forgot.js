exports.POST = async (req, res) => {
  const db = require("../../db");
  const validator = require("email-validator");
  const genOTP = require("generate-one-time-password");
  const emailAppName = req.body.emailAppName || "";
  const emailSubmitted = req.body.email || "";
  const emailSubject = req.body.emailSubject || "";
  const emailP1 = req.body.emailP1 || "";
  const emailP2 = req.body.emailP2 || "";
  const emailP3 = req.body.emailP3 || "";
  const emailFooter1 = req.body.emailFooter1 || "";
  const emailFooter2 = req.body.emailFooter2 || "";
  const emailTextTemplate = req.body.emailTextTemplate || "";
  const emailHTMLTemplate = req.body.emailHTMLTemplate || "";

  // Validate

  const isValidEmail = validator.validate(emailSubmitted);
  if (!isValidEmail) {
    return res.status(400).send({
      msg: "invalid email",
      msgType: "error",
    });
  }

  // Check

  const sql = `
    SELECT
      id,
      firstname,
      lastname,
      email
    FROM
      users
    WHERE
      email = ?
    LIMIT 1
    ;
  `;

  db.query(sql, [emailSubmitted], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send({
        msg: "unable to get user id",
        msgType: "error",
      });
    }

    if (!result.length) {
      return res.status(404).send({
        msg: "user not found",
        msgType: "error",
      });
    }

    const userid = result[0].id;
    const firstName = result[0].firstname;
    const lastName = result[0].lastname;
    const otp = genOTP.generateOTP(6);
    const email = result[0].email;

    const sql = `
      INSERT INTO otp(userid, code, expiry, createdAt)
      VALUES (
        ?,
        ?,
        TIMESTAMPADD(MINUTE, 20, UTC_TIMESTAMP()),
        UTC_TIMESTAMP()
      );
    `;

    db.query(sql, [userid, otp], async (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          msg: "unable to store otp",
          msgType: "error",
        });
      }

      let htmlBody = emailHTMLTemplate.replaceAll("{{ emailP1 }}", emailP1);
      htmlBody = htmlBody.replaceAll("{{ OTP }}", otp);
      htmlBody = htmlBody.replaceAll("{{ emailP2 }}", emailP2);
      htmlBody = htmlBody.replaceAll("{{ emailP3 }}", emailP3);
      htmlBody = htmlBody.replaceAll("{{ emailFooter1 }}", emailFooter1);
      htmlBody = htmlBody.replaceAll("{{ emailFooter2 }}", emailFooter2);

      let textBody = emailTextTemplate.replaceAll("{{ emailP1 }}", emailP1);
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
          textBody,
          emailAppName
        )
        .then((result) => {
          return res.status(200).send({
            msg: "password reset email sent",
            msgType: "success",
            userid: userid,
            result: result,
          });
        });
    });
  });
};
