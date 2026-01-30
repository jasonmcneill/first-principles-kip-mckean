exports.POST = async (req, res) => {
  const { subscriptionID } = req.body;

  try {
    // 1. Get PayPal Access Token
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
    ).toString("base64");
    const tokenRes = await fetch(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: { Authorization: `Basic ${auth}` },
      },
    );
    const { access_token } = await tokenRes.json();

    // 2. Fetch Subscription Details directly from PayPal
    const subRes = await fetch(
      `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionID}`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );
    const subData = await subRes.json();

    // 3. Verify status
    if (subData.status === "ACTIVE" || subData.status === "APPROVED") {
      // Update your DB: user is now a subscriber
      await db.users.update(
        { id: req.user.id },
        {
          subscriptionStatus: "PENDING_WEBHOOK", // We know it's real, just waiting for money
          paypalSubscriptionId: subscriptionID,
        },
      );

      // 4. Issue your JWT
      const token = generateJwt(req.user);
      return res.json({ token });
    }

    res.status(400).send("Invalid Subscription");
  } catch (err) {
    res.status(500).send("Verification failed");
  }
};
