function localizePrice() {
  const priceElement = document.getElementById("price");
  const price = 12.0;
  const locale = navigator.language || "en-US";
  const currency = "USD";

  priceElement.textContent = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(price);
}

function paypalButtons() {
  const planId = document
    .querySelector("[data-paypal-plan-id]")
    .getAttribute("data-paypal-plan-id");
  paypal
    .Buttons({
      style: {
        shape: "rect",
        color: "white",
        layout: "vertical",
        label: "subscribe",
      },
      createSubscription: function (data, actions) {
        return actions.subscription.create({
          plan_id: planId,
        });
      },
      onApprove: function (data, actions) {
        alert(data.subscriptionID);
      },
    })
    .render(`#paypal-button-container-${planId}`);
}

async function checkSubscription() {
  const endpoint = "/api/check-subscription";
  const accessToken = await getAccessToken().catch(() => null);

  if (!accessToken) return;

  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.msg && data.msg !== "subscription active") {
        return;
      }

      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      if (data.accessToken) {
        sessionStorage.setItem("accessToken", data.accessToken);
      }

      window.location.replace("./dashboard");
    });
}

function init() {
  checkSubscription();
  localizePrice();
  paypalButtons();
}

init();
