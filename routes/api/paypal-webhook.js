exports.POST = async (req, res) => {
  const db = require('../../db');

  // PayPal Webhook Event Body
  const eventBody = req.body;

  // Log the subscription webhook event (for debugging purposes)
  console.log(
    'Received PayPal Webhook Event:',
    JSON.stringify(eventBody, null, 2)
  );

  // Process the subscription webhook event based on its type
  // https://developer.paypal.com/api/rest/webhooks/event-names/#subscriptions
  const eventType = eventBody.event_type;

  if (eventType === 'PAYMENT.SALE.COMPLETED') {
    const resource = eventBody.resource;
    const subscriptionId = resource.billing_agreement_id;
    const validUntil = resource.billing_info.next_billing_time;
    const details = JSON.stringify(resource);

    const sql = `
      UPDATE
        users
      SET
        paypalSubscriptionId = ?,
        subscribeduntil = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%sZ'),
        paypalSubscriptionDetails = ?
      WHERE
        paypalSubscriptionId = ?
      ;
    `;

    db.query(
      sql,
      [subscriptionId, validUntil, details, subscriptionId],
      (err, result) => {
        if (err) {
          console.log('Unable to update subscription status:', err);
          return res.status(500).send({
            msg: 'unable to update subscription status',
            msgType: 'error',
          });
        }

        if (result.affectedRows === 0) {
          console.warn(`No user found with subscription ID: ${subscriptionId}`);
          return res.status(200).send('Webhook received but no user updated');
        }

        return res.status(200).send('Success');
      }
    );
  } else {
    return res.status(200).send('Event ignored');
  }
};
