function storeSubscriptionDetails(db, userid, details) {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE
        users
      SET
        paypalSubscriptionDetails = ?
      WHERE
        id = ?
      ;
    `;

    db.query(sql, [JSON.stringify(details), userid], (error, result) => {
      if (error) {
        console.log(error);
        return reject('unable to store updated subscription details');
      }

      return resolve('subscription details stored');
    });
  });
}

exports.POST = async (req, res) => {
  const db = require('../../db');
  const jsonwebtoken = require('jsonwebtoken');

  const sql = `
    SELECT
      username, status, firstname, lastname, email, gender, mailingList, paypalSubscriptionId
    FROM
      users
    WHERE
      id = ?
    LIMIT 1
    ;
  `;

  db.query(sql, [req.user.id], async (error, result) => {
    try {
      if (error) {
        console.error(error);
        return res.status(500).send({
          msg: 'unable to query for user',
          msgType: 'error',
        });
      }

      if (!result.length) {
        return res.status(404).send({
          msg: 'user not found',
          msgType: 'error',
        });
      }

      const acctInfo = result[0];
      const subscriptionId = result[0].paypalSubscriptionId;
      delete result[0].paypalSubscriptionId;

      if (subscriptionId) {
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
        result[0].paypalSubscriptionDetails = paypalSubscriptionDetails;

        // Store subscription details
        storeSubscriptionDetails(db, req.user.id, paypalSubscriptionDetails);

        // Fetch plan details to get subscription price
        const planId = paypalSubscriptionDetails.plan_id;
        if (planId) {
          const planRes = await fetch(
            `${paypalBaseUrl}/v1/billing/plans/${planId}`,
            {
              method: 'GET',
              headers: { Authorization: `Bearer ${paypalAccessToken}` },
            }
          );
          const planData = await planRes.json();

          // Extract the subscription price from billing cycles
          if (planData.billing_cycles && planData.billing_cycles.length > 0) {
            const regularCycle = planData.billing_cycles.find(
              (cycle) => cycle.tenure_type === 'REGULAR'
            );
            if (
              regularCycle &&
              regularCycle.pricing_scheme &&
              regularCycle.pricing_scheme.fixed_price
            ) {
              result[0].nextPaymentAmount = {
                value: regularCycle.pricing_scheme.fixed_price.value,
                currency_code:
                  regularCycle.pricing_scheme.fixed_price.currency_code,
              };
            }
          }
        }
      }

      return res.status(200).send({
        msg: 'account info retrieved',
        msgType: 'success',
        acctInfo: result[0],
      });
    } catch (err) {
      console.error('Error fetching PayPal subscription details:', err);
      // Still return user info even if PayPal fetch fails
      return res.status(200).send({
        msg: 'account info retrieved',
        msgType: 'success',
        acctInfo: result[0],
      });
    }
  });
};
