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
  fromEmailName = process.env.EMAIL_FROM_NAME,
  fromEmailAddress = process.env.EMAIL_FROM_ADDRESS
) => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === "production") {
      sendMail_MailJet(
        toEmail,
        toName,
        subject,
        htmlBody,
        textBody,
        fromEmailName,
        fromEmailAddress
      ).then((result) => {
        resolve(result);
      });
    } else {
      sendMail_MailGun(
        toEmail,
        toName,
        subject,
        htmlBody,
        textBody,
        fromEmailName,
        fromEmailAddress
      ).then((result) => {
        resolve(result);
      });
    }
  });
};

function sendMail_MailGun(
  toEmail,
  toName,
  subject,
  htmlBody,
  textBody,
  fromEmailName,
  fromEmailAddress
) {
  const mailgun = require("mailgun-js");
  return new Promise((resolve, reject) => {
    try {
      const mg = mailgun({
        apiKey: process.env.MAILGUN_SECRET_KEY,
        domain: process.env.MAILGUN_DOMAIN,
      });

      const data = {
        from: `${fromEmailName} <${fromEmailAddress}>`,
        to: `${toName} <${toEmail}>`,
        subject,
        text: textBody || undefined,
        html: htmlBody || undefined,
      };

      mg.messages().send(data, (error, body) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(body);
        }
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

function sendMail_MailJet(
  toEmail,
  toName,
  subject,
  htmlBody,
  textBody,
  fromEmailName,
  fromEmailAddress
) {
  const Mailjet = require("node-mailjet");
  return new Promise((resolve, reject) => {
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
          ReplyTo: {
            Email: process.env.EMAIL_REPLYTO_ADDRESS,
            Name: process.env.EMAIL_REPLYTO_NAME,
          },
          Subject: subject,
          TextPart: textBody,
          HTMLPart: htmlBody,
          Headers: {
            "X-Mailer": "fp.kipmckean.com via Mailjet",
          },
        },
      ],
    });
    request
      .then((result) => {
        console.log(result);
        return resolve(result);
      })
      .catch((err) => {
        console.log(err);
        return resolve(err);
      });
  });
}
