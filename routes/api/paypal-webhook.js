exports.POST = async (req, res) => {
  const db = require('../../db');
  const eventBody = req.body;
  const eventType = eventBody.event_type;
  const resource = eventBody.resource;

  // 1. Handle Successful Payment
  if (eventType === 'PAYMENT.SALE.COMPLETED') {
    const subscriptionId = resource.billing_agreement_id;
    const validUntil = resource.billing_info.next_billing_time;

    const sql = `UPDATE users SET subscribeduntil = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%sZ'), paypalSubscriptionDetails = ? WHERE paypalSubscriptionId = ?`;

    db.query(
      sql,
      [validUntil, JSON.stringify(resource), subscriptionId],
      (err) => {
        if (err) return res.status(500).send('DB Error');
        return res.status(200).send('Payment Recorded');
      }
    );

    // 2. Handle Cancellation / Expiration / Suspension
  } else if (
    eventType === 'BILLING.SUBSCRIPTION.CANCELLED' ||
    eventType === 'BILLING.SUBSCRIPTION.EXPIRED' ||
    eventType === 'BILLING.SUBSCRIPTION.SUSPENDED'
  ) {
    const subscriptionId = resource.id; // Note: In these events, the ID is usually top-level resource.id

    const sql = `UPDATE users SET paypalSubscriptionDetails = ? WHERE paypalSubscriptionId = ?`;

    db.query(sql, [JSON.stringify(resource), subscriptionId], (err) => {
      if (err) return res.status(500).send('DB Error');
      console.log(
        `Subscription ${subscriptionId} status updated to: ${resource.status}`
      );
      return res.status(200).send('Status Updated');
    });
  } else {
    // 3. Ignore everything else (like 'BILLING.SUBSCRIPTION.CREATED')
    return res.status(200).send('Event ignored');
  }
};
