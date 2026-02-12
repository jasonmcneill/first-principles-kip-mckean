exports.POST = async (req, res) => {
  const db = require('../../db');
  const jsonwebtoken = require('jsonwebtoken');
  const validator = require('email-validator');
  const genOTP = require('generate-one-time-password');
  const bcrypt = require('bcrypt');
  const userid = req.user.id;
  const username = req.body.username || '';
  const password = req.body.password || '';
  const email = req.body.email || '';
  const firstName = req.body.firstName || '';
  const lastName = req.body.lastName || '';
  const gender = req.body.gender;
  const mailingList = req.body.mailingList ? 1 : 0;
  const lang = req.body.lang || '';

  const updateEmail = (email) => {
    return new Promise((resolve, reject) => {
      const isValidEmail = validator.validate(email);

      if (!isValidEmail) return resolve('invalid email');

      const sql = `
        SELECT
          id, email
        FROM
          users
        WHERE
          email = ?
        AND
          id <> ?
        LIMIT 1
        ;
      `;

      db.query(sql, [email, req.user.id], (error, result) => {
        if (error) {
          console.error(error);
          return resolve(error);
        }

        if (result.length) {
          return resolve('email is taken');
        }

        const sql = `
          UPDATE
            users
          SET
            email = LCASE(?)
          WHERE
            id = ?
          ;
        `;

        db.query(sql, [email, req.user.id], (error, result) => {
          if (error) {
            console.error('unable to update email');
            return resolve(error);
          }

          return resolve('email updated');
        });
      });
    });
  };

  const updatePassword = (password) => {
    if (password.length < 8) {
      return resolve('invalid password');
    }

    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error(hashErr);
        return resolve('unable to resolve password');
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

      db.query(sql, [hashedPassword, req.user.id], (error, result) => {
        if (error) {
          console.error(error);
          return resolve('unable to update password');
        }

        return resolve('password updated');
      });
    });
  };

  const updateUsername = (username) => {
    return new Promise((resolve, reject) => {
      if (!username || !username.length) {
        return resolve('invalid username');
      }

      const sql = `
        SELECT
          id, username
        FROM
          users
        WHERE
          username = LCASE(?)
        AND
          id <> ?
        LIMIT 1
        ;
      `;

      db.query(sql, [username, req.user.id], (error, result) => {
        if (error) {
          console.error(error);
          return resolve('unable to query for existing username');
        }

        if (result.length) {
          return resolve('username is taken');
        }

        const sql = `
          UPDATE
            users
          SET
            username = LCASE(?)
          WHERE
            id = ?
          ;
        `;

        db.query(sql, [username, req.user.id], (error, result) => {
          if (error) {
            console.error(error);
            return resolve('unable to update username');
          }

          return resolve('username updated');
        });
      });
    });
  };

  if (email.trim().length) {
    const emailResult = await updateEmail(email.trim());

    if (emailResult !== 'email updated') {
      return res.status(400).send({
        msg: emailResult,
        msgType: 'error',
      });
    }
  }

  if (password.trim().length) {
    const passwordResult = await updatePassword(password.trim());

    if (passwordResult !== 'password updated') {
      return res.status(400).send({
        msg: passwordResult,
        msgType: 'error',
      });
    }
  }

  if (username.trim().length) {
    const usernameResult = await updateUsername(username.trim());

    if (usernameResult !== 'username updated') {
      return res.status(400).send({
        msg: usernameResult,
        msgType: 'error',
      });
    }
  }

  // Validate

  if (!firstName.trim().length) {
    return res.status(400).send({
      msg: 'firstName is required',
      msgType: 'error',
    });
  }

  if (!lastName.trim().length) {
    return res.status(400).send({
      msg: 'lastName is required',
      msgType: 'error',
    });
  }

  if (gender !== 'male' && gender !== 'female') {
    return res.status(400).send({
      msg: 'gender is required',
      msgType: 'error',
    });
  }

  if (mailingList !== 0 && mailingList !== 1) {
    return res.status(400).send({
      msg: 'invalid value for mailingList',
      msgType: 'error',
    });
  }

  if (lang.length !== 2) {
    return res.status(400).send({
      msg: 'lang must be 2 characters',
      msgType: 'error',
    });
  }

  const sql = `
    UPDATE
      users
    SET
      firstName = ?,
      lastName = ?,
      gender = ?,
      mailingList = ?,
      lang = ?
    WHERE
      id = ?
    ;
  `;

  db.query(
    sql,
    [firstName, lastName, gender, mailingList, lang],
    (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).send({
          msg: 'unable to update',
          msgType: 'error',
        });
      }

      const sql = `
          SELECT
            id,
            username,
            status,
            firstname,
            lastname,
            email,
            gender,
            mailingList,
            lang,
            subscribeduntil,
            createdAt
          FROM
            users
          WHERE
            id = ?
          LIMIT 1
          ;
        `;

      db.query(sql, [id], (error, result) => {
        if (error) {
          console.log(error);
          return res.status(500).send({
            msg: 'unable to log in',
            msgType: 'error',
          });
        }

        if (!result.length) {
          return res.status(404).send({
            msg: 'invalid login',
            msgType: 'error',
          });
        }

        const {
          id,
          username,
          status,
          firstname,
          lastname,
          email,
          gender,
          mailingList,
          lang,
          subscribeduntil,
          createdAt,
        } = result[0];

        const refreshToken = jsonwebtoken.sign(
          {
            id: id,
            username: username,
            status: status,
            firstname: firstname,
            lastname: lastname,
            email: email,
            gender: gender,
            mailingList: mailingList,
            lang: lang,
            subscribeduntil: subscribeduntil,
            createdAt: createdAt,
          },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: '30d' }
        );

        const accessToken = jsonwebtoken.sign(
          {
            id: id,
            username: username,
            status: status,
            firstname: firstname,
            lastname: lastname,
            email: email,
            gender: gender,
            mailingList: mailingList,
            lang: lang,
            subscribeduntil: subscribeduntil,
            createdAt: createdAt,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '10m' }
        );

        return res.status(200).send({
          msg: 'account updated',
          msgType: 'success',
          refreshToken: refreshToken,
          accessToken: accessToken,
        });
      });
    }
  );
};
