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
    const subscriptionId = eventBody.id;
    const subscriptionTime = eventBody.create_time;
    const validUntil = eventBody.valid_until;

    const sql = `
      UPDATE
        users
      SET
        paypalSubscriptionId = ?,
        subscribeduntil = ?,
        paypalSubscriptionDetails = ?
      WHERE
        userid = ?
      ;
    `;

    db.query(
      sql,
      [subscriptionId, validUntil, JSON.stringify(req.body), req.user.id],
      (err, result) => {
        if (err) {
          console.log('Unable to update subscription status:', err);
          return res.status(500).send({
            msg: 'unable to update subscription status',
            msgType: 'error',
          });
        }

        return res.status(200).send();
      }
    );
  }
};
