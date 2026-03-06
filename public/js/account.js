let subscriptionData = null;
const modalCancelSubscription = new bootstrap.Modal('#modalCancelSubscription');

function checkIfDateIsPast(iso8601Date) {
  const inputDate = new Date(iso8601Date);
  const now = new Date();
  const isInPast = inputDate < now;

  return isInPast;
}

function formatCurrency(nextPmtAmt) {
  const value = nextPmtAmt.value;
  const currency_code = nextPmtAmt.currency_code;
  const locale = navigator.language;
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency_code,
    currencyDisplay: 'symbol',
  }).format(value);

  return formatted;
}

function formatDate(iso8601Date, includeTime = true) {
  const date = new Date(iso8601Date);

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  let formatted = date.toLocaleString(undefined, {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  if (!includeTime) {
    formatted = date.toLocaleString(undefined, {
      dateStyle: 'long',
    });
  }

  return formatted;
}

function getAccountInfo() {
  return new Promise(async (resolve, reject) => {
    const endpoint = '/api/account-get';
    const accessToken = await getAccessToken();
    const main = document.querySelector('main');

    fetch(endpoint, {
      mode: 'cors',
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application-json',
        authorization: `Bearer ${accessToken}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.acctInfo) {
          handleOffline();
          return reject('response is missing required parameter acctInfo');
        }

        const {
          username,
          status,
          firstname,
          lastname,
          email,
          gender,
          mailingList,
        } = data.acctInfo;
        const subscriptionDetails = data.acctInfo.paypalSubscriptionDetails;

        document.querySelector('#username').value = username;
        document.querySelector('#email').value = email;
        document.querySelector('#firstname').value = firstname;
        document.querySelector('#lastname').value = lastname;

        if (gender === 'female') {
          document.querySelector('#gender_female').checked = true;
        } else {
          document.querySelector('#gender_male').checked = true;
        }

        document.querySelector('#mailinglist').checked = mailingList === 1;

        if (!data.acctInfo) {
          return reject('Unable to retrieve account info');
        }

        document.querySelector('#profileForm').classList.remove('d-none');
        document.querySelector('footer').classList.remove('d-none');

        showSubscriptionStatus(data.acctInfo);

        return resolve(data.acctInfo);
      })
      .catch((error) => {
        handleOffline();
        return reject(error);
      });
  });
}

function handleOffline() {
  document.querySelector('#subscriptionSection').classList.add('d-none');
  document.querySelector('#profileSection').classList.add('d-none');
  document.querySelector('#offline').classList.remove('d-none');

  hideSpinner();

  document.querySelector('main').classList.remove('d-none');

  return;
}

function hideSpinner() {
  document.querySelector('#pageSpinner').classList.add('d-none');
}

function popUpError(title, body) {
  const modalEl = document.querySelector('#modal');
  const titleEl = modalEl.querySelector('.modal-title');
  const bodyEl = modalEl.querySelector('.modal-body');

  titleEl.innerHTML = title;
  bodyEl.innerHTML = body;

  resetSubmitButtons();

  new bootstrap.Modal('#modal').show();
}

function showSubscriptionStatus(acctInfo) {
  const subscriptionActiveContainerEl = document.querySelector(
    '#subscriptionActiveContainer'
  );
  const subscriptionSuspendedContainerEl = document.querySelector(
    '#subscriptionSuspendedContainer'
  );
  const subscriptionCancelledContainerEl = document.querySelector(
    '#subscriptionCancelledContainer'
  );

  const accessRemainsUntilContainerEl = document.querySelector(
    '#accessRemainsUntilContainer'
  );

  let { nextPaymentAmount, paypalSubscriptionDetails, status } = acctInfo;

  if (paypalSubscriptionDetails) {
    subscriptionData = paypalSubscriptionDetails;
  }

  // Reset
  subscriptionActiveContainerEl.classList.add('d-none');
  subscriptionSuspendedContainerEl.classList.add('d-none');
  accessRemainsUntilContainerEl.classList.add('d-none');

  // Toggle based on subscription status

  if (!paypalSubscriptionDetails) {
    // SUBSCRIPTION NULL
    document.querySelector('#subscriptionSection').classList.remove('d-none');
  } else if (paypalSubscriptionDetails.status === 'ACTIVE') {
    // SUBSCRIPTION ACTIVE
    const nextPmtAmtEl = document.querySelector('#nextPmtAmt');
    const nextPmtDateEl = document.querySelector('#nextPmtDate');
    const nextAmt = formatCurrency(nextPaymentAmount);
    const nextDate = formatDate(
      paypalSubscriptionDetails.billing_info.next_billing_time
    );

    nextPmtAmtEl.innerHTML = `${nextAmt} ${nextPaymentAmount.currency_code}`;
    nextPmtDateEl.innerHTML = nextDate;
    subscriptionActiveContainerEl.classList.remove('d-none');
  } else if (paypalSubscriptionDetails.status === 'SUSPENDED') {
    // SUBSCRIPTION SUSPENDED
    const dateSuspendedEl = document.querySelector('#dateSuspended');
    const accessRemainsUntilContainerEl = document.querySelector(
      '#accessRemainsUntilContainer'
    );
    const dateSuspended = formatDate(
      paypalSubscriptionDetails.status_update_time
    );
    const suspendedOnTxt = getPhrase('suspendedOn').replaceAll(
      '{DATE}',
      dateSuspended
    );
    const mostRecentPmtAmt = formatCurrency(
      paypalSubscriptionDetails.billing_info.last_payment.amount
    );
    const mostRecentPmtDate = formatDate(
      paypalSubscriptionDetails.billing_info.last_payment.time,
      false
    );
    const addOneYear = new Date(
      paypalSubscriptionDetails.billing_info.last_payment.time
    );
    addOneYear.setFullYear(addOneYear.getFullYear() + 1);
    const continueUntilDate = formatDate(addOneYear);
    const accessEnded = checkIfDateIsPast(addOneYear.toISOString());

    const mostRecentPmtTxt = getPhrase('mostRecentPmt')
      .replaceAll('{AMOUNT}', `<strong>${mostRecentPmtAmt}</strong>`)
      .replaceAll('{DATE}', mostRecentPmtDate);
    const continueUntilTxt = getPhrase('continueUntil').replaceAll(
      '{DATE}',
      `<strong class="text-success text-nowrap">${continueUntilDate}</strong>`
    );
    const accessRemainsUntilTxt = accessEnded
      ? mostRecentPmtTxt
      : `${mostRecentPmtTxt} ${continueUntilTxt}`;

    dateSuspendedEl.innerHTML = suspendedOnTxt;
    accessRemainsUntilContainerEl.innerHTML = accessRemainsUntilTxt;
    accessRemainsUntilContainerEl.classList.remove('d-none');
    subscriptionSuspendedContainerEl.classList.remove('d-none');
  } else if (paypalSubscriptionDetails.status === 'CANCELLED') {
    // SUBSCRIPTION CANCELLED
    const dateCancelledEl = document.querySelector('#dateCancelled');
    const dateCancelled = formatDate(
      paypalSubscriptionDetails.status_update_time
    );
    const cancelledBy = paypalSubscriptionDetails.status_changed_by; // value will be "user" (if user cancelled via their own PayPal dashboard) or "merchant" (if this app made the pertinent API call).
    const cancelledOnTxt = getPhrase('cancelledOn').replaceAll(
      '{DATE}',
      dateCancelled
    );
    const continueUntilDate = formatDate(
      paypalSubscriptionDetails.billing_info.next_billing_time
    );
    const accessEnded = checkIfDateIsPast(
      paypalSubscriptionDetails.billing_info.next_billing_time
    );
    const continueUntilTxt = getPhrase('continueUntil').replaceAll(
      '{DATE}',
      `<strong class="text-success text-nowrap">${continueUntilDate}</strong>`
    );
    const accessRemainsUntilTxt = continueUntilTxt;
    dateCancelledEl.innerHTML = cancelledOnTxt;
    subscriptionCancelledContainerEl.classList.remove('d-none');
  }
}

function validate(phrases) {
  const content = JSON.parse(document.querySelector('#content').innerHTML);
  const errors = {
    usernameRequired: content.errorUsernameRequired,
    usernameTaken: content.errorUsernameTaken,
    passwordRequired: content.errorPasswordRequired,
    passwordInvalid: content.errorPasswordInvalid,
    emailRequired: content.errorEmailRequired,
    emailRegistered: content.errorEmailRegistered,
    emailInvalid: content.errorEmailInvalid,
    firstNameRequired: content.errorFirstNameRequired,
    lastNameRequired: content.errorLastNameRequired,
    genderRequired: content.errorGenderRequired,
  };

  const genderErrorEl = document.querySelector('#gender_invalid_feedback');
  const maleEl = document.querySelector('#gender_male');
  const femaleEl = document.querySelector('#gender_female');

  genderErrorEl.classList.add('d-none');

  resetSubmitButtons();

  document
    .querySelectorAll('.is-invalid')
    .forEach((item) => item.classList.remove('is-invalid'));

  const usernameEl = document.querySelector('#username');
  const passwordEl = document.querySelector('#password');
  const emailEl = document.querySelector('#email');
  const firstNameEl = document.querySelector('#firstname');
  const lastNameEl = document.querySelector('#lastname');
  const mailingListEl = document.querySelector('#mailinglist');
  const gender = maleEl.checked ? 'male' : femaleEl.checked ? 'female' : '';
  const lang = document.querySelector('#lang').value || '';

  if (!usernameEl.value.trim().length) {
    usernameEl.parentElement.querySelector('.invalid-feedback').innerHTML =
      errors.usernameRequired;
    usernameEl.classList.add('is-invalid');
    usernameEl.parentElement.scrollIntoView();
    usernameEl.focus();
    return false;
  }

  if (passwordEl.value.trim().length && passwordEl.value.trim().length < 8) {
    passwordEl.parentElement.querySelector('.invalid-feedback').innerHTML =
      errors.passwordInvalid;
    passwordEl.classList.add('is-invalid');
    passwordEl.parentElement.scrollIntoView();
    passwordEl.focus();
    return false;
  }

  if (!emailEl.value.trim().length) {
    emailEl.parentElement.querySelector('.invalid-feedback').innerHTML =
      errors.emailRequired;
    emailEl.classList.add('is-invalid');
    emailEl.parentElement.scrollIntoView();
    emailEl.focus();
    return false;
  }

  if (!firstNameEl.value.trim().length) {
    firstNameEl.parentElement.querySelector('.invalid-feedback').innerHTML =
      errors.firstNameRequired;
    firstNameEl.classList.add('is-invalid');
    firstNameEl.parentElement.scrollIntoView();
    firstNameEl.focus();
    return false;
  }

  if (!lastNameEl.value.trim().length) {
    lastNameEl.parentElement.querySelector('.invalid-feedback').innerHTML =
      errors.lastNameRequired;
    lastNameEl.classList.add('is-invalid');
    lastNameEl.parentElement.scrollIntoView();
    lastNameEl.focus();
    return false;
  }

  if (!maleEl.checked && !femaleEl.checked) {
    document.querySelector('#gender_male').classList.add('is-invalid');
    document.querySelector('#gender_female').classList.add('is-invalid');
    genderErrorEl.classList.remove('d-none');
    genderErrorEl.parentElement.scrollIntoView();
    return false;
  }

  return {
    username: usernameEl.value.trim(),
    password: passwordEl.value.trim(),
    email: emailEl.value.trim(),
    firstName: firstNameEl.value.trim(),
    lastName: lastNameEl.value.trim(),
    gender: gender,
    mailingList: mailingListEl.checked,
    lang: lang,
  };
}

function onCancelClicked() {
  const modalEl = document.querySelector('#modalCancelSubscription');
  const modalTitleEl = modalEl.querySelector('.modal-title');
  const modalBodyEl = modalEl.querySelector('.modal-body');
  const modalFooterEl = modalEl.querySelector('.modal-footer');
  const continueUntilDate = formatDate(
    subscriptionData.billing_info.next_billing_time,
    false
  );
  const txtP1 = getPhrase('confirmCancelP1').replaceAll(
    '{DATE}',
    `<strong class='text-success'>${continueUntilDate}</strong>`
  );

  modalEl.querySelector('.modal-body p:first-child').innerHTML = txtP1;

  modalCancelSubscription.show();
}

async function onCancelConfirmed(modal) {
  console.log('Subscription cancellation confirmed');

  const accessToken = await getAccessToken();
  const endpoint = '/api/subscription-suspend';

  fetch(endpoint, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: `Bearer ${accessToken}`,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.msg === 'subscription suspended') {
        modalCancelSubscription.hide();
        return window.location.reload();
      }

      // TODO:  handle errors
    });
}

function onReinstateClicked(evt) {
  console.log('Reinstate clicked');
}

async function onSubmit(evt) {
  evt.preventDefault();

  resetSubmitButtons();
  showSubmitButtonSpinner(evt);

  const formData = validate();
  if (!formData) return;

  const accessToken = await getAccessToken();

  fetch('/api/account-update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then((data) => {
      switch (data.msg) {
        case 'username is taken':
          popUpError(
            getPhrase('usernameTakenTitle'),
            getPhrase('usernameTaken')
          );
          break;
        case 'email is taken':
          popUpError(
            getPhrase('emailTakenTitle'),
            getPhrase('errorEmailRegistered')
          );
          break;
        case 'invalid email':
          popUpError(getPhrase('errorTitle'), getPhrase('errorEmailInvalid'));
          break;
        case 'account updated':
          if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
          }

          if (data.accessToken) {
            sessionStorage.setItem('accessToken', data.accessToken);
          }

          showModal(
            getPhrase('accountUpdatedHeader'),
            getPhrase('accountUpdatedBody')
          );

          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
          break;
        default:
          popUpError(getPhrase('errorTitle'), getPhrase('errorGeneric'));
          console.error(data.msg);
          break;
      }
    })
    .catch((err) => {
      console.error('Account update failed:', err);
      resetSubmitButtons();
    });
}

function addListeners() {
  document.querySelector('#profileForm').addEventListener('submit', onSubmit);
  document
    .querySelector('#btnReinstateSuspended')
    .addEventListener('click', onReinstateClicked);
  document
    .querySelector('#btnCancelSubscription')
    .addEventListener('click', onCancelClicked);
  document
    .querySelector('#modalCancelSubscription .modal-footer .subscriptionCancel')
    .addEventListener('click', onCancelConfirmed);
}

async function init() {
  addListeners();

  getAccountInfo()
    .catch((err) => {
      console.error(err);
      handleOffline();
    })
    .finally(() => {
      hideSpinner();
      document.querySelector('main').classList.remove('d-none');
    });
}

init();
