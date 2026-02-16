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

        return resolve(data.accountInfo);
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
}

async function init() {
  addListeners();
  await getAccountInfo();
}

init();
