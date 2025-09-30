// paypalWebhook.js
const axios = require("axios");
const db = require("./db");

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_ENV = process.env.PAYPAL_ENV || "sandbox";
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

const PAYPAL_API_BASE =
  PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

module.exports = async function paypalWebhook(req, res) {
  try {
    const body = req.body;

    // Extract verification headers
    const headers = {
      transmission_id: req.header("paypal-transmission-id"),
      transmission_time: req.header("paypal-transmission-time"),
      cert_url: req.header("paypal-cert-url"),
      auth_algo: req.header("paypal-auth-algo"),
      transmission_sig: req.header("paypal-transmission-sig"),
    };

    // Get OAuth token
    const tokenResp = await axios({
      method: "post",
      url: `${PAYPAL_API_BASE}/v1/oauth2/token`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      auth: { username: PAYPAL_CLIENT_ID, password: PAYPAL_CLIENT_SECRET },
      data: "grant_type=client_credentials",
    });

    const accessToken = tokenResp.data.access_token;

    // Verify webhook signature
    const verifyResp = await axios({
      method: "post",
      url: `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        auth_algo: headers.auth_algo,
        cert_url: headers.cert_url,
        transmission_id: headers.transmission_id,
        transmission_sig: headers.transmission_sig,
        transmission_time: headers.transmission_time,
        webhook_id: PAYPAL_WEBHOOK_ID,
        webhook_event: body,
      },
    });

    if (verifyResp.data.verification_status === "SUCCESS") {
      console.log("✅ Verified PayPal webhook:", body.event_type);

      switch (body.event_type) {
        case "PAYMENT.CAPTURE.COMPLETED":
          console.log("💰 Payment completed:", body.resource);

          // Example: store order ID + status in DB
          await db.markOrderPaid({
            orderId: body.resource.id,
            payerEmail: body.resource.payer?.email_address,
            amount: body.resource.amount?.value,
            currency: body.resource.amount?.currency_code,
          });
          break;

        case "PAYMENT.CAPTURE.DENIED":
          console.log("❌ Payment denied:", body.resource);
          await db.markOrderFailed({
            orderId: body.resource.id,
            reason: body.resource.status,
          });
          break;

        default:
          console.log("ℹ️ Event received:", body.event_type);
      }

      res.sendStatus(200);
    } else {
      console.error("❌ Webhook verification failed");
      res.sendStatus(400);
    }
  } catch (err) {
    console.error("⚠️ Webhook error:", err.response?.data || err.message);
    res.sendStatus(500);
  }
};
