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

      return res.status(200).send({
        msg: 'message sent',
        msgType: 'success',
      });

      // TODO: add required parameters to "sendMail()" function below

      require('./utils')
        .sendMail()
        .then((mailResponse) => {
          const { statusCode } = mailResponse;

          if (statusCode >= 200 && statusCode <= 299) {
            return res.status(200).send({
              msg: 'message sent',
              msgType: 'success',
              userid: insertResult.insertId,
              mailResponse: mailResponse,
            });
          } else {
            return res.status(400).send({
              msg: 'message not sent',
              msgType: 'error',
              userid: insertResult.insertId,
              mailResponse: mailResponse,
            });
          }
        });
    }
  );
};
