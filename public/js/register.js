function getEmailHTMLTemplate() {
  return new Promise((resolve, reject) => {
    fetch("../email/registration/registration.html")
      .then((res) => res.text())
      .then((data) => {
        resolve(data);
      });
  });
}

function getEmailTextTemplate() {
  return new Promise((resolve, reject) => {
    fetch("../email/registration/registration.txt")
      .then((res) => res.text())
      .then((data) => {
        resolve(data);
      });
  });
}

function validate(phrases) {
  const content = JSON.parse(document.querySelector("#content").innerHTML);
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

  const registrationForm = document.querySelector("#registrationForm");
  const genderErrorEl = document.querySelector("#gender_invalid_feedback");
  const maleEl = document.querySelector("#gender_male");
  const femaleEl = document.querySelector("#gender_female");

  genderErrorEl.classList.add("d-none");

  document
    .querySelectorAll(".is-invalid")
    .forEach((item) => item.classList.remove("is-invalid"));

  const usernameEl = document.querySelector("#username");
  const passwordEl = document.querySelector("#password");
  const emailEl = document.querySelector("#email");
  const firstNameEl = document.querySelector("#firstname");
  const lastNameEl = document.querySelector("#lastname");
  const mailingListEl = document.querySelector("#mailinglist");
  const gender = maleEl.checked ? "male" : femaleEl.checked ? "female" : "";
  const lang = document.querySelector("#lang").value || "";

  if (!usernameEl.value.trim().length) {
    usernameEl.parentElement.querySelector(".invalid-feedback").innerHTML =
      errors.usernameRequired;
    usernameEl.classList.add("is-invalid");
    usernameEl.parentElement.scrollIntoView();
    usernameEl.focus();
    return false;
  }

  if (!passwordEl.value.trim().length) {
    passwordEl.parentElement.querySelector(".invalid-feedback").innerHTML =
      errors.passwordRequired;
    passwordEl.classList.add("is-invalid");
    passwordEl.parentElement.scrollIntoView();
    passwordEl.focus();
    return false;
  }

  if (passwordEl.value.trim().length < 8) {
    passwordEl.parentElement.querySelector(".invalid-feedback").innerHTML =
      errors.passwordInvalid;
    passwordEl.classList.add("is-invalid");
    passwordEl.parentElement.scrollIntoView();
    passwordEl.focus();
    return false;
  }

  if (!emailEl.value.trim().length) {
    emailEl.parentElement.querySelector(".invalid-feedback").innerHTML =
      errors.emailRequired;
    emailEl.classList.add("is-invalid");
    emailEl.parentElement.scrollIntoView();
    emailEl.focus();
    return false;
  }

  if (!firstNameEl.value.trim().length) {
    firstNameEl.parentElement.querySelector(".invalid-feedback").innerHTML =
      errors.firstNameRequired;
    firstNameEl.classList.add("is-invalid");
    firstNameEl.parentElement.scrollIntoView();
    firstNameEl.focus();
    return false;
  }

  if (!lastNameEl.value.trim().length) {
    lastNameEl.parentElement.querySelector(".invalid-feedback").innerHTML =
      errors.lastNameRequired;
    lastNameEl.classList.add("is-invalid");
    lastNameEl.parentElement.scrollIntoView();
    lastNameEl.focus();
    return false;
  }

  if (!maleEl.checked && !femaleEl.checked) {
    document.querySelector("#gender_male").classList.add("is-invalid");
    document.querySelector("#gender_female").classList.add("is-invalid");
    genderErrorEl.classList.remove("d-none");
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
    emailSubject: getPhrase("emailSubject"),
    emailP1: getPhrase("emailP1"),
    emailP2: getPhrase("emailP2"),
    emailP3: getPhrase("emailP3"),
    emailFooter1: getPhrase("emailFooter1"),
    emailFooter2: getPhrase("emailFooter2"),
  };
}

async function onSubmit(evt) {
  event.preventDefault();

  const formData = validate();
  if (!formData) return;

  formData.emailTextTemplate = await getEmailTextTemplate();
  formData.emailHTMLTemplate = await getEmailHTMLTemplate();

  fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.msg === "user registered") {
        const userid = data.userid;

        if (!userid) {
          return console.error("userid is missing in response");
        } else if (isNaN(userid)) {
          return console.error("userid in response is not a number");
        }

        window.location.href = `./confirm?userid=${userid}`;
      }
    })
    .catch((err) => {
      console.error("Register request failed:", err);
    });
}

function addListeners() {
  document
    .querySelector("#registrationForm")
    .addEventListener("submit", onSubmit);
}

function init() {
  addListeners();
}

init();
