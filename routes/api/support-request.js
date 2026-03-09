exports.POST = (req, res) => {
  const db = require('../../db');
  const validator = require('email-validator');
  const name = req.body.name || '';
  let email = req.body.email || '';
  const message = req.body.message || '';
  const userlocale = req.body.userlocale || 'en-US';

  // Validate

  if (!name.length) {
    return res.status(400).send({
      msg: 'name is required',
      msgType: 'error',
    });
  }

  if (!email.trim().toLowerCase().length) {
    return res.status(400).send({
      msg: 'email is required',
      msgType: 'error',
    });
  }

  email = email.toLowerCase().trim();
  const isValidEmail = validator.validate(email);
  if (!isValidEmail) {
    return res.status(400).send({
      msg: 'invalid email',
      msgType: 'error',
    });
  }

  if (!message.length) {
    return res.status(400).send({
      msg: 'message is required',
      msgType: 'error',
    });
  }

  if (!userlocale.length) {
    return res.status(400).send({
      msg: 'userlocale is required',
      msgType: 'error',
    });
  }

  if (userlocale.length > 5) {
    return res.status(400).send({
      msg: 'userlocale is invalid',
      msgType: 'error',
    });
  }

  const sql = `
    INSERT INTO \`support-requests\`(
      userid,
      userlocale,
      name,
      email,
      message,
      createdAt
    ) VALUES (
      ?,
      ?,
      ?,
      ?,
      ?,
      UTC_TIMESTAMP
    );
  `;

  db.query(
    sql,
    [req.user.id, userlocale, name, email, message],
    (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          msg: 'unable to store message',
          msgType: 'error',
        });
      }

      /* return res.status(200).send({
        msg: 'message sent',
        msgType: 'success',
      }); */

      let textBody = `
NEW SUPPORT REQUEST

A request for support has been received from the First Principles web site.  Reply to this message to respond.

Date:
{DATE}

User:
{FIRSTNAME} {LASTNAME}

User ID:
{USERID}

E-mail:
{EMAIL}

Message:
----------------------------------
{MESSAGE}
----------------------------------
      `;

      const now = new Date();
      const formatter = new Intl.DateTimeFormat(userlocale, {
        dateStyle: 'full',
        timeStyle: 'long',
      });
      const formattedDate = formatter.format(now);

      textBody = textBody.replaceAll('{DATE}', formattedDate);
      textBody = textBody.replaceAll('{FIRSTNAME} {LASTNAME}', name);
      textBody = textBody.replaceAll('{USERID}', req.user.id);
      textBody = textBody.replaceAll('{EMAIL}', email);
      textBody = textBody.replaceAll('{MESSAGE}', message);

      require('./utils')
        .sendMail(
          'vrtjason@gmail.com',
          'Jason McNeill',
          'Support Request (fp.kipmckean.com)',
          '',
          textBody.trim(),
          name,
          email
        )
        .then((mailResponse) => {
          const { statusCode } = mailResponse;

          if (statusCode >= 200 && statusCode <= 299) {
            return res.status(200).send({
              msg: 'message sent',
              msgType: 'success',
              mailResponse: mailResponse,
            });
          } else {
            return res.status(400).send({
              msg: 'message not sent',
              msgType: 'error',
              mailResponse: mailResponse,
            });
          }
        });
    }
  );
};
