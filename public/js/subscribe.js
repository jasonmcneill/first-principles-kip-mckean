function localizePrice() {
  const priceElement = document.getElementById('price');
  const price = 12.0;
  const locale = navigator.language || 'en-US';
  const currency = 'USD';

  priceElement.textContent = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(price);
}

function paypalButtons() {
  const planId = document.querySelector("[data-paypal-plan-id]").getAttribute("data-paypal-plan-id");
  paypal.Buttons({
      style: {
          shape: 'rect',
          color: 'white',
          layout: 'vertical',
          label: 'subscribe'
      },
      createSubscription: function(data, actions) {

        return actions.subscription.create({
          plan_id: planId
        });
      },
      onApprove: function(data, actions) {
        alert(data.subscriptionID);
      }
  }).render(`#paypal-button-container-${planId}`); 
}

function init() {
  localizePrice();
  paypalButtons();
}

init();