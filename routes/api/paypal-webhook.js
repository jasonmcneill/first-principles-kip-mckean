exports.POST = async (req, res) => {
  const db = require("../../db");

  // PayPal Webhook Event Body
  const eventBody = req.body;

  // Log the subscription webhook event (for debugging purposes)
  console.log("Received PayPal Webhook Event:", JSON.stringify(eventBody, null, 2));

  // Process the subscription webhook event based on its type
  const eventType = eventBody.event_type;
  if (eventType === "BILLING.SUBSCRIPTION.CANCELLED") {
    const subscriptionId = eventBody.resource.id;

    // Update the user's subscription status in the database
    const sql = `
      UPDATE users
      SET subscription_status = 'cancelled'
      WHERE paypal_subscription_id = ?
      ;
    `;

    db.query(sql, [subscriptionId], (error, result) => {
      if (error) {
        console.log("Database error while updating subscription status:", error);
        return res.status(500).send({
          msg: "unable to process subscription cancellation",
          msgType: "error",
        });
      }

      console.log(`Subscription ${subscriptionId} marked as cancelled in the database.`);
      return res.status(200).send({
        msg: "subscription cancellation processed",
        msgType: "success",
      });
    })
  }
}