exports.POST = async (req, res) => {
  const db = require('../../db');
  const jsonwebtoken = require('jsonwebtoken');

  const sql = `
    SELECT
      username, status, firstname, lastname, email, gender, mailingList, paypalSubscriptionDetails
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

      const psd = result[0].paypalSubscriptionDetails;
      if (psd && psd.length) {
        result[0].paypalSubscriptionDetails = JSON.parse(psd);

        // Fetch plan details to get subscription price
        const planId = result[0].paypalSubscriptionDetails.plan_id;

        if (planId) {
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

          // Get plan details
          const planEndpoint = `${paypalBaseUrl}/v1/billing/plans/${planId}`;
          const planRes = await fetch(planEndpoint, {
            method: 'GET',
            headers: { Authorization: `Bearer ${paypalAccessToken}` },
          });

          const planData = await planRes.json();

          // Extract the subscription price from billing cycles
          if (planData.billing_cycles && planData.billing_cycles.length > 0) {
            // Find the REGULAR cycle (not TRIAL)
            const regularCycle = planData.billing_cycles.find(
              cycle => cycle.tenure_type === 'REGULAR'
            );

            if (regularCycle && regularCycle.pricing_scheme && regularCycle.pricing_scheme.fixed_price) {
              result[0].nextPaymentAmount = {
                value: regularCycle.pricing_scheme.fixed_price.value,
                currency_code: regularCycle.pricing_scheme.fixed_price.currency_code
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
      console.error('Error fetching plan details:', err);
      // Still return user info even if plan fetch fails
      return res.status(200).send({
        msg: 'account info retrieved',
        msgType: 'success',
        acctInfo: result[0],
      });
    }
  });
};
