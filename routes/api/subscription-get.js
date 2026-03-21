function isValidISODate(value) {
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  return (
    typeof value === 'string' &&
    isoRegex.test(value) &&
    !isNaN(Date.parse(value))
  );
}

function getJWT(db, userid, subscribedUntil = '') {
  return new Promise((resolve, reject) => {
    let sql = `
      UPDATE
        users
      SET
        subscribeduntil = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%sZ')
      WHERE
        id = ?
      ;
    `;

    let args = [subscribedUntil, userid];

    if (!isValidISODate(subscribedUntil)) {
      sql = `
        UPDATE
          users
        SET
          subscribeduntil = subscribeduntil
        WHERE
          id = ?
        ;
      `;

      args = [userid];
    }

    db.query(sql, args, (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }

      const jsonwebtoken = require('jsonwebtoken');

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

      db.query(sql, [userid], (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }

        if (!result.length) {
          return reject('user not found');
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

        return resolve({
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      });
    });
  });
}

exports.POST = (req, res) => {
  const db = require('../../db');
  const userid = req.user.id;

  if (!userid) {
    return res.status(401).json({ msg: 'user not found' });
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
      paypalSubscriptionId,
      createdAt
    FROM
      users
    WHERE
      id = ?
    LIMIT 1
    ;
  `;

  db.query(sql, [userid], async (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res
        .status(500)
        .json({ msg: 'unable to query for user', msgType: 'error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ msg: 'user not found', msgType: 'error' });
    }

    const subscriptionId = result[0].paypalSubscriptionId;

    if (!subscriptionId) {
      const jwt = await getJWT(db, req.user.id);
      return res.json({
        msg: 'no active subscription',
        msgType: 'error',
        accessToken: jwt.accessToken,
        refreshToken: jwt.refreshToken,
      });
    }

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64');
    const paypalBaseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';
    // Get PayPal access token
    const tokenRes = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const tokenData = await tokenRes.json();
    const paypalAccessToken = tokenData.access_token;
    // Get live subscription details from PayPal
    const subRes = await fetch(
      `${paypalBaseUrl}/v1/billing/subscriptions/${subscriptionId}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${paypalAccessToken}` },
      }
    );
    const paypalSubscriptionDetails = await subRes.json();

    if (!paypalSubscriptionDetails) {
      const jwt = await getJWT(db, req.user.id, '');
      return res.json({
        msg: 'no active subscription',
        msgType: 'error',
        accessToken: jwt.accessToken,
        refreshToken: jwt.refreshToken,
      });
    }

    if (!paypalSubscriptionDetails.billing_info) {
      const jwt = await getJWT(db, req.user.id, '');
      return res.json({
        msg: 'cannot connect to paypal',
        msgType: 'error',
        accessToken: jwt.accessToken,
        refreshToken: jwt.refreshToken,
        error: paypalSubscriptionDetails?.error,
      });
    }

    const addOneYear = new Date(
      paypalSubscriptionDetails.billing_info.last_payment.time
    );
    addOneYear.setFullYear(addOneYear.getFullYear() + 1);

    const now = new Date();
    const accessExpiry = new Date(addOneYear);
    const jwt = await getJWT(db, req.user.id, accessExpiry);

    if (now >= accessExpiry) {
      return res.json({
        msg: 'access is expired',
        msgType: 'error',
        accessToken: jwt.accessToken,
        refreshToken: jwt.refreshToken,
      });
    }

    return res.json({
      msg: 'access is active',
      msgType: 'success',
      accessToken: jwt.accessToken,
      refreshToken: jwt.refreshToken,
    });
  });
};
