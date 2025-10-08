exports.POST = async (req, res) => {
  const db = require("../../db");
  const genOTP = require("generate-one-time-password");
  const emailSubject = req.body.emailSubject || "";
  const emailP1 = req.body.emailP1 || "";
  const emailP2 = req.body.emailP2 || "";
  const emailP3 = req.body.emailP3 || "";
  const emailFooter1 = req.body.emailFooter1 || "";
  const emailFooter2 = req.body.emailFooter2 || "";
  const emailTextTemplate = req.body.emailTextTemplate || "";
  const emailHTMLTemplate = req.body.emailHTMLTemplate || "";
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

  db.query(sql, [req.user.id, otp], async (error, result) => {
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
        req.user.email,
        `${req.user.firstName} ${req.user.lastName}`,
        emailSubject,
        htmlBody,
        textBody
      )
      .then((result) => {
        return res.status(200).send({
          msg: "otp sent",
          msgType: "success",
          userid: req.user.id,
        });
      });
  });
};
