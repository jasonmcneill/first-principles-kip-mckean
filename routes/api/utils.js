exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const jsonwebtoken = require("jsonwebtoken");
  if (!token)
    return res
      .status(400)
      .send({ msg: "missing access token", msgType: "error" });

  jsonwebtoken.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, userdata) => {
      if (err)
        return res
          .status(403)
          .send({ msg: "invalid access token", msgType: "error", err: err });
      req.user = userdata;
      next();
    }
  );
};

exports.sendMail = (
  toEmail = "",
  toName = "",
  subject = "",
  htmlBody = "",
  textBody = "",
  fromEmailName = "",
  fromEmailAddress = ""
) => {
  return new Promise((resolve, reject) => {
    const Mailjet = require("node-mailjet");
    const mailjet = Mailjet.apiConnect(
      process.env.MAILJET_API_KEY,
      process.env.MAILJET_SECRET_KEY
    );

    const fromEmail =
      fromEmailAddress && fromEmailAddress.length
        ? fromEmailAddress
        : process.env.EMAIL_FROM_ADDRESS;

    const fromName =
      fromEmailName && fromEmailName.length
        ? fromEmailName
        : process.env.EMAIL_FROM_NAME;

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: fromEmail,
            Name: fromName,
          },
          To: [
            {
              Email: toEmail,
              Name: toName,
            },
          ],
          Subject: subject,
          TextPart: textBody,
          HTMLPart: htmlBody,
        },
      ],
    });
    request
      .then((result) => {
        return resolve(result);
      })
      .catch((err) => {
        return resolve(err);
      });
  });
};
