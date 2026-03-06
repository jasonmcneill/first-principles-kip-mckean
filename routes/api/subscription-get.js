exports.POST = (req, res) => {
  const db = require('../../db');
  const jsonwebtoken = require('jsonwebtoken');
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
      return res.json({ msg: 'no active subscription', msgType: 'error' });
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
      return res.json({ msg: 'no active subscription', msgType: 'error' });
    }

    const addOneYear = new Date(
      paypalSubscriptionDetails.billing_info.last_payment.time
    );
    addOneYear.setFullYear(addOneYear.getFullYear() + 1);

    const now = new Date();
    const subscribedUntil = new Date(addOneYear);

    if (now >= subscribedUntil) {
      return res.json({ msg: 'subscription expired', msgType: 'error' });
    }

    if (paypalSubscriptionDetails.status !== 'ACTIVE') {
      return res.json({
        msg: 'no active subscription',
      });
    } else {
      return res.json({
        msg: 'subscription active',
      });
    }
  });
};
