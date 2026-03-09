const util = require('util');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const jsonwebtoken = require('jsonwebtoken');
  if (!token)
    return res
      .status(400)
      .send({ msg: 'missing access token', msgType: 'error' });

  jsonwebtoken.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, userdata) => {
      if (err)
        return res
          .status(403)
          .send({ msg: 'invalid access token', msgType: 'error', err: err });
      req.user = userdata;
      next();
    }
  );
};

exports.sendMail = (
  toEmail = '',
  toName = '',
  subject = '',
  htmlBody = '',
  textBody = '',
  fromEmailName = process.env.EMAIL_FROM_NAME,
  fromEmailAddress = process.env.EMAIL_FROM_ADDRESS
) => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'production') {
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
    } else if (process.env.NODE_ENV === 'staging') {
      sendMail_ZeptoMail(
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
    } else if (process.env.NODE_ENV === 'development') {
      sendMail_ZeptoMail(
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

function sendMail_MailJet(
  toEmail,
  toName,
  subject,
  htmlBody,
  textBody,
  fromEmailName,
  fromEmailAddress
) {
  return new Promise((resolve, reject) => {
    const Mailjet = require('node-mailjet');
    const mailjet = Mailjet.apiConnect(
      process.env.MAILJET_KEY_ID,
      process.env.MAILJET_SECRET_KEY
    );
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: `${fromEmailAddress}`,
            Name: `${fromEmailName}`,
          },
          To: [
            {
              Email: `${toEmail}`,
              Name: `${toName}`,
            },
          ],
          ReplyTo: {
            Email: fromEmailAddress,
            Name: fromEmailName,
          },
          Subject: `${subject}`,
          TextPart: `${textBody}`,
          HTMLPart: `${htmlBody}`,
        },
      ],
    });
    request
      .then((result) => {
        const { response } = result;
        console.log(response);

        const mailResponse = {
          statusCode: 200,
          statusText: response.statusText,
        };

        resolve(mailResponse);
      })
      .catch((err) => {
        console.log(err);

        const mailResponse = {
          statusCode: 400,
          statusText: 'Failed to send email via MailJet',
        };

        resolve(mailResponse);
      });
  });
}

function sendMail_MailGun(
  toEmail,
  toName,
  subject,
  htmlBody,
  textBody,
  fromEmailName,
  fromEmailAddress
) {
  return new Promise((resolve, reject) => {
    const mailgun = require('mailgun-js');
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
          const mailResponse = {
            statusCode: 200,
            statusText: body.message,
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

function sendMail_ZeptoMail(
  toEmail,
  toName,
  subject,
  htmlBody,
  textBody,
  replyToEmailName,
  replyToEmailAddress
) {
  return new Promise(async (resolve, reject) => {
    const { SendMailClient } = require('zeptomail');
    const url = 'api.zeptomail.com/';
    const isSupportRequest = /Support\s+Request/i.test(subject);
    console.log('isSupportRequest:', isSupportRequest);
    console.log(JSON.stringify(subject));
    const token = isSupportRequest
      ? process.env.ZEPTOMAIL_SUPPORT_TOKEN
      : process.env.ZEPTOMAIL_API_TOKEN;
    const client = new SendMailClient({ url, token });

    const fromEmail = process.env.EMAIL_FROM_ADDRESS;

    const fromName = process.env.EMAIL_FROM_NAME;

    try {
      const mailOptions = {
        from: {
          address: fromEmail,
          name: fromName,
        },
        to: [
          {
            email_address: {
              address: toEmail,
              name: toName,
            },
          },
        ],
        reply_to: [
          {
            address: replyToEmailAddress,
            name: replyToEmailName,
          },
        ],
        subject: subject,
        htmlbody: htmlBody,
        textbody: textBody,
      };

      const response = await client.sendMail(mailOptions);

      console.log(response);

      const mailResponse = {
        statusCode: 200,
        statusText: response.message,
      };

      resolve(mailResponse);
    } catch (error) {
      console.error(
        'ZeptoMail Error:',
        error.response ? error.response.data : error.message
      );
      reject(new Error('Failed to send OTP email.'));
    }
  });
}
