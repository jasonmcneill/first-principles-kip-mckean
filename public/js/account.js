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
    const pageSpinner = document.querySelector('#pageSpinner');
    const main = document.querySelector('main');

    main.classList.add('d-none');
    pageSpinner.classList.remove('d-none');

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

        return resolve(data.acctInfo);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        pageSpinner.classList.add('d-none');
        main.classList.remove('d-none');
      });
  });
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

  // Reset
  const reset = () => {
    subscriptionActiveContainerEl.classList.add('d-none');
    subscriptionSuspendedContainerEl.classList.add('d-none');
    accessRemainsUntilContainerEl.classList.add('d-none');
  };

  reset();

  // Toggle based on status
  status = 'cancelled';

  if (status === 'active') {
    const nextPmtAmtEl = document.querySelector('#nextPmtAmt');
    const nextPmtDateEl = document.querySelector('#nextPmtDate');
    const nextAmt = formatCurrency(nextPaymentAmount);
    const nextDate = formatDate(
      paypalSubscriptionDetails.billing_info.next_billing_time
    );

    nextPmtAmtEl.innerHTML = `${nextAmt} ${nextPaymentAmount.currency_code}`;
    nextPmtDateEl.innerHTML = nextDate;
    subscriptionActiveContainerEl.classList.remove('d-none');
  } else if (status === 'suspended') {
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
    const continueUntilDate = formatDate(
      paypalSubscriptionDetails.billing_info.next_billing_time
    );
    const mostRecentPmtTxt = getPhrase('mostRecentPmt')
      .replaceAll('{AMOUNT}', `<strong>${mostRecentPmtAmt}</strong>`)
      .replaceAll('{DATE}', mostRecentPmtDate);
    const continueUntilTxt = getPhrase('continueUntil').replaceAll(
      '{DATE}',
      `<strong class="text-success">${continueUntilDate}</strong>`
    );
    const accessRemainsUntilTxt = `${mostRecentPmtTxt} ${continueUntilTxt}`;

    dateSuspendedEl.innerHTML = suspendedOnTxt;
    accessRemainsUntilContainerEl.innerHTML = accessRemainsUntilTxt;
    accessRemainsUntilContainerEl.classList.remove('d-none');
    subscriptionSuspendedContainerEl.classList.remove('d-none');
  } else if (status === 'cancelled') {
    const dateCancelledEl = document.querySelector('#dateCancelled');
    const dateCancelled = formatDate(
      paypalSubscriptionDetails.status_update_time
    );
    const cancelledBy = paypalSubscriptionDetails.status_changed_by; // value will be "user" (if user cancelled via their own PayPal dashboard) or "merchant" (if this app made the pertinent API call).
    const cancelledOnTxt = getPhrase('cancelledOn').replaceAll(
      '{DATE}',
      dateCancelled
    );
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

  const registrationForm = document.querySelector('#accountForm');
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

function onCancelClicked(evt) {
  evt.preventDefault();
  console.log('Cancel clicked');
}

function onReinstateClicked(evt) {
  evt.preventDefault();
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
  document.querySelector('#accountForm').addEventListener('submit', onSubmit);
  document
    .querySelector('#linkReinstateSuspended')
    .addEventListener('click', onReinstateClicked);
  document
    .querySelector('#btnCancelSubscription')
    .addEventListener('click', onCancelClicked);
}

async function init() {
  addListeners();
  await getAccountInfo().then((acctInfo) => showSubscriptionStatus(acctInfo));
}

init();
