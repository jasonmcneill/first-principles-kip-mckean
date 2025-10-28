function localizePrice() {
  const priceElement = document.getElementById('price');
  const price = 1.0;
  const locale = navigator.language || 'en-US'; // auto-detect user locale
  const currency = 'USD';

  priceElement.textContent = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(price);
}

function paypalButtons() {
  paypal.Buttons({
    style: {
      shape: 'rect',
      color: 'gold',
      layout: 'vertical',
      label: 'subscribe'
    },
    createSubscription: function (data, actions) {
      return actions.subscription.create({
        /* Creates the subscription */
        plan_id: 'P-7DY340608J9283523ND5FJUA'
      });
    },
    onApprove: async function (data, actions) {
      console.log(data);
      console.log(actions);

      try {
        const res = await fetch('/api/subscription/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscriptionId: data.subscriptionID })
        });

        if (!res.ok) throw new Error('Server error');

        // TODO:  Call API and pass in subscription information. Return JWT for subscription and save to localStorage.

        console.log('Subscription confirmed on server!');

        setTimeout(() => {
          window.location.href = './thank-you';
        }, 1000);
      } catch (err) {
        console.error('onApprove error:', err);
      }
    }
  }).render('#paypal-button-container-P-7DY340608J9283523ND5FJUA'); // Renders the PayPal button
}

function init() {
  localizePrice();
  paypalButtons();
}

init();