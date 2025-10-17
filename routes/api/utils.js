const util = require("util");

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
        console.log(result);
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
        console.log(result);
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
          let statusText = "OK";
          let statusCode = 200;

          if (body && body.message) {
            if (
              body.message.includes(
                "account-requests-per-sec limit exceeded, try again after 120 seconds"
              )
            ) {
              statusCode = 200;
              statusText = body.message;
            } else if (body.message.includes("Internal Server Error")) {
              statusCode = 500;
              statusText = body.message;
            } else if (body === "Forbidden") {
              statusCode = 401;
              statusText = body;
            } else if (body.message !== "Queued. Thank you.") {
              statusCode = 400;
              statusText = body.message;
            } else {
              statusCode = 200;
              statusText = body.message;
            }
          }

          const mailResponse = {
            status: statusCode,
            statusText: statusText,
          };

          resolve(mailResponse);
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
          Subject: subject,
          TextPart: textBody,
          HTMLPart: htmlBody,
        },
      ],
    });
    request
      .then((result) => {
        const mailResponse = {
          status: result.response.status,
          statusText: result.response.statusText,
        };

        return resolve(mailResponse);
      })
      .catch((err) => {
        console.log(err);
        return resolve(err);
      });
  });
}
