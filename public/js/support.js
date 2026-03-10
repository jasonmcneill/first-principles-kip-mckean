const modalMsgSent = new bootstrap.Modal('#modalMessageSent');

function getHTMLEmail() {
  return new Promise((resolve, reject) => {
    fetch('/email/support/support.html')
      .then((res) => res.text())
      .then((content) => {
        return resolve(content);
      });
  });
}

function getTextEmail() {
  return new Promise((resolve, reject) => {
    fetch('/email/support/support.txt')
      .then((res) => res.text())
      .then((content) => {
        return resolve(content);
      });
  });
}

function validate(evt) {
  const name = evt.target.name.value.trim();
  const email = evt.target.email.value.trim().toLowerCase();
  const message = evt.target.message.value.trim();
  let isValid = true;

  document
    .querySelectorAll('.is-invalid')
    .forEach((item) => item.classList.remove('is-invalid'));

  if (!name.length) {
    evt.target.name.classList.add('is-invalid');
    if (isValid) fpScrollTo(evt.target.name, 50);
    isValid = false;
  }

  if (!email.length) {
    document.querySelector('#emailContainer .invalid-feedback').innerText =
      getPhrase('emailRequired');
    evt.target.email.classList.add('is-invalid');
    if (isValid) fpScrollTo(evt.target.email, 50);
    isValid = false;
  }

  const isEmailValid = validateEmail(email);
  if (!isEmailValid) {
    document.querySelector('#emailContainer .invalid-feedback').innerText =
      getPhrase('emailInvalid');
    evt.target.email.classList.add('is-invalid');
    if (isValid) fpScrollTo(evt.target.email, 50);
    isValid = false;
  }

  if (!message.length) {
    evt.target.message.classList.add('is-invalid');
    if (isValid) fpScrollTo(evt.target.message, 50);
    isValid = false;
  }

  return isValid;
}

function validateEmail(email) {
  const tester =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  if (!email) return false;

  if (email.length > 254) return false;

  const valid = tester.test(email);
  if (!valid) return false;

  // Further checking of specific part lengths as per the library's logic
  const parts = email.split('@');
  if (parts[0].length > 64) return false;

  const domainParts = parts[1].split('.');
  if (domainParts.some((part) => part.length > 63)) return false;

  return true;
}

async function onSubmit(evt) {
  evt.preventDefault();

  const isFormValid = validate(evt);

  if (!isFormValid) return;

  const name = evt.target.name.value.trim();
  const email = evt.target.email.value.trim().toLowerCase();
  const message = evt.target.message.value.trim();
  const userlocale = navigator.languages[0] || 'en-US';
  const endpoint = '/api/support-request';
  const accessToken = await getAccessToken();
  const htmlEmail = await getHTMLEmail();
  const textEmail = await getTextEmail();

  document.querySelector('.submitButtonContent').classList.add('d-none');
  document.querySelector('.submitButtonSpinner').classList.remove('d-none');

  fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      name: name,
      email: email,
      message: message,
      userlocale: userlocale,
      htmlEmail: htmlEmail,
      textEmail: textEmail,
    }),
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: `Bearer ${accessToken}`,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      modalMsgSent.show();
      evt.target.reset();
      document.querySelector('.submitButtonContent').classList.remove('d-none');
      document.querySelector('.submitButtonSpinner').classList.add('d-none');
    })
    .catch((err) => {
      console.error(err);
      document.querySelector('.submitButtonContent').classList.remove('d-none');
      document.querySelector('.submitButtonSpinner').classList.add('d-none');
    });
}

function addListeners() {
  document.querySelector('#supportForm').addEventListener('submit', onSubmit);
  document
    .querySelector('#modalMessageSent')
    .addEventListener('hide.bs.modal', (event) => {
      fpScrollTo(document.querySelector('html'), 0);
      window.location.reload();
    });
}

function init() {
  addListeners();
}

init();
