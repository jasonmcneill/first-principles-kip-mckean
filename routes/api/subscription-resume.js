module.exports = async (req, res) => {
  try {
    const db = require('../../db');
    const userid = req.user.id;

    if (!userid) {
      return res.status(401).json({ msg: 'user not found', msgType: 'error' });
    }

    // Get the user's PayPal subscription ID from the database
    const sqlSelect = `
      SELECT paypalSubscriptionId
      FROM users
      WHERE id = ?
      LIMIT 1
    ;`;

    db.query(sqlSelect, [userid], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          msg: 'unable to query for subscription',
          msgType: 'error',
        });
      }

      if (results.length === 0 || !results[0].paypalSubscriptionId) {
        return res.status(404).json({
          msg: 'no subscription found',
          msgType: 'error',
        });
      }

      const subscriptionID = results[0].paypalSubscriptionId;

      // Get PayPal access token
      const auth = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
      ).toString('base64');
      const paypalBaseUrl = process.env.NODE_ENV === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
      const tokenEndpoint = `${paypalBaseUrl}/v1/oauth2/token`;

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

      // Activate (resume) the subscription via PayPal API
      const activateEndpoint = `${paypalBaseUrl}/v1/billing/subscriptions/${subscriptionID}/activate`;

      const activateRes = await fetch(activateEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${paypalAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: 'Customer requested reactivation',
        }),
      });

      if (activateRes.status === 204) {
        return res.json({
          msg: 'subscription resumed',
          msgType: 'success',
        });
      } else {
        const errorData = await activateRes.json();
        console.error('PayPal activate error:', errorData);
        return res.status(500).json({
          msg: 'unable to resume subscription',
          msgType: 'error',
        });
      }
    });
  } catch (err) {
    console.error('Error resuming subscription:', err);
    return res.status(500).json({
      msg: 'internal error',
      msgType: 'error',
    });
  }
};
