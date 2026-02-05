exports.POST = async (req, res) => {
  try {
    const { subscriptionID } = req.body;
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64');
    const tokenEndpoint = 'https://api-m.sandbox.paypal.com/v1/oauth2/token';

    const tokenRes = await fetch(tokenEndpoint, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const tokenData = await tokenRes.json();
    const paypalAccessToken = tokenData.access_token;

    const subEndpoint = `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionID}`;
    const subRes = await fetch(subEndpoint, {
      method: 'GET',
      headers: { Authorization: `Bearer ${paypalAccessToken}` },
    });

    const subData = await subRes.json();
    const subDataParsed = JSON.parse(JSON.stringify(subData));

    if (subData.status === 'ACTIVE' || subData.status === 'APPROVED') {
      const jsonwebtoken = require('jsonwebtoken');
      const db = require('../../db');

      const sqlUpdate = `
        UPDATE
          users
        SET
          paypalSubscriptionId = ?,
          subscribeduntil = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%sZ'),
          paypalSubscriptionDetails = ?
        WHERE
          id = ?
        LIMIT 1
      ;`;

      const subscribedUntil =
        subDataParsed.billing_info?.next_billing_time || null;

      db.query(
        sqlUpdate,
        [subscriptionID, subscribedUntil, JSON.stringify(subData), req.user.id],
        (error) => {
          if (error) {
            console.log(error);
            return res.status(500).send('Unable to verify subscription');
          }

          const sqlSelect = `
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
        ;`;

          db.query(sqlSelect, [req.user.id], (error, results) => {
            if (error) {
              console.log(error);
              return res.status(500).send({
                msg: 'unable to query for JWT data',
                msgType: 'error',
              });
            }

            if (!results.length) {
              return res
                .status(404)
                .send({ msg: 'user not found', msgType: 'error' });
            }

            const user = results[0];
            const payload = {
              id: user.id,
              username: user.username,
              status: user.status,
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              gender: user.gender,
              mailingList: user.mailingList,
              lang: user.lang,
              subscribeduntil: user.subscribeduntil,
              createdAt: user.createdAt,
            };

            const refreshToken = jsonwebtoken.sign(
              payload,
              process.env.REFRESH_TOKEN_SECRET,
              { expiresIn: '30d' }
            );
            const accessToken = jsonwebtoken.sign(
              payload,
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: '10m' }
            );

            return res.status(200).send({
              msg: 'subscription verified',
              msgType: 'success',
              subscriptionID: subscriptionID,
              accessToken: accessToken,
              refreshToken: refreshToken,
            });
          });
        }
      );
    } else {
      return res
        .status(400)
        .send({ msg: 'subscription not active', msgType: 'error' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: 'internal error', msgType: 'error' });
  }
};
