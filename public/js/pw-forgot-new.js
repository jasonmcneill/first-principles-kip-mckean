function hideAlert() {
  const alertEl = document.querySelector("#alert");
  alertEl.classList.add("d-none");
}

function showAlert(content, headline) {
  const alertEl = document.querySelector("#alert");
  let contentHTML = "";

  if (headline && content) {
    contentHTML = `
      <h3 class="my-1">${headline}</h3>
      ${content}
    `;
  } else if (content) {
    contentHTML = content;
  }

  alertEl.querySelector(".alert-content").innerHTML = contentHTML;
  alertEl.classList.remove("d-none");
  fpScrollTo(alertEl);
}

function resetErrors() {
  document
    .querySelectorAll(".is-invalid")
    .forEach((item) => item.classList.remove("is-invalid"));

  hideAlert();

  resetSubmitButtons();
}

async function onSubmit(evt) {
  evt.preventDefault();
  resetErrors();
  showSubmitButtonSpinner(evt);

  document
    .querySelectorAll(".is-invalid")
    .forEach((item) => item.classList.remove("is-invalid"));

  const passwordEl = evt.target.querySelector("#password");
  const password = passwordEl.value.trim();

  if (!passwordEl.value.trim().length) {
    resetErrors();
    passwordEl.parentElement.querySelector(".invalid-feedback").innerHTML =
      getPhrase("errorPasswordRequired");
    passwordEl.classList.add("is-invalid");
    passwordEl.parentElement.scrollIntoView();
    passwordEl.focus();
    return;
  }

  if (passwordEl.value.trim().length < 8) {
    resetErrors();
    passwordEl.parentElement.querySelector(".invalid-feedback").innerHTML =
      getPhrase("errorPasswordInvalid");
    passwordEl.classList.add("is-invalid");
    passwordEl.parentElement.scrollIntoView();
    passwordEl.focus();
    return;
  }

  const accessToken = await getAccessToken();

  fetch("/api/pw-forgot-new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: password,
    }),
    headers: new Headers({
      "Content-Type": "application/json",
      authorization: `Bearer ${accessToken}`,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      switch (data.msg) {
        case "password is required":
          resetErrors();
          passwordEl.parentElement.querySelector(
            ".invalid-feedback"
          ).innerHTML = getPhrase("errorPasswordRequired");
          passwordEl.classList.add("is-invalid");
          passwordEl.parentElement.scrollIntoView();
          passwordEl.focus();
          break;
        case "password must be at least 8 characters":
          resetErrors();
          passwordEl.parentElement.querySelector(
            ".invalid-feedback"
          ).innerHTML = getPhrase("errorPasswordInvalid");
          passwordEl.classList.add("is-invalid");
          passwordEl.parentElement.scrollIntoView();
          passwordEl.focus();
          break;
        case "password updated":
          resetErrors();
          document.querySelector("h2.pageHeadline").innerHTML = getPhrase(
            "titlePasswordUpdated"
          );
          document.querySelector("#inputNewPassword").classList.add("d-none");
          document.querySelector("#passwordUpdated").classList.remove("d-none");
          break;
        default:
          resetErrors();
          showAlert(getPhrase("errorGeneric"), getPhrase("errorTitle"));
          passwordEl.focus();
          console.error(data.msg);
          break;
      }
    })
    .catch((err) => {
      console.error(err);
      resetErrors();
    });
}

function addListeners() {
  document
    .querySelector("#newPasswordForm")
    .addEventListener("submit", onSubmit);
}

function init() {
  addListeners();
}

init();
