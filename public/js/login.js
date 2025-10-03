function hideAlert() {
  const alertEl = document.querySelector(".alert");
  alertEl.innerHTML = "";
  alertEl.classList.add("d-none");
}

function showAlert(body, headline, alertType = "alert-danger") {
  const alertEl = document.querySelector(".alert");
  let message = "";

  if (body && headline) {
    message = `
      <h3>${headline}</h3>
      <p class="mb-0">${body}</p>
    `;
  } else if (body) {
    message = `
      <p class="my-0">${body}</p>
    `;
  }

  const alertClasses = [
    "alert-danger",
    "alert-info",
    "alert-success",
    "alert-warning",
    "alert-primary",
    "alert-secondary",
    "alert-dark",
    "alert-light",
  ];

  alertClasses.forEach((alertClass) => alertEl.classList.remove(alertClass));
  alertEl.classList.add(alertType);

  alertEl.innerHTML = message;
  alertEl.classList.remove("d-none");
  alertEl.scrollIntoView();
}

function validate() {
  hideAlert();

  document
    .querySelectorAll(".is-invalid")
    .forEach((item) => item.classList.remove("is-invalid"));

  const usernameEl = document.querySelector("#username");
  const passwordEl = document.querySelector("#password");

  if (!usernameEl.value.length) {
    usernameEl.parentElement.querySelector(".invalid-feedback").innerHTML =
      getPhrase("usernameRequiredError");
    usernameEl.classList.add("is-invalid");
    usernameEl.parentElement.scrollIntoView();
    usernameEl.focus();
    return false;
  }

  if (!passwordEl.value.length) {
    passwordEl.parentElement.querySelector(".invalid-feedback").innerHTML =
      getPhrase("passwordRequiredError");
    passwordEl.classList.add("is-invalid");
    passwordEl.parentElement.scrollIntoView();
    passwordEl.focus();
    return false;
  }

  return true;
}

function onSubmit(event) {
  event.preventDefault();

  const isValid = validate();
  if (!isValid) return;

  const submitButtonEl = document.querySelector("form button[type=submit]");
  const usernameEl = document.querySelector("#username");
  const passwordEl = document.querySelector("#password");

  submitButtonEl.setAttribute("disabled", "");

  // TODO: show spinner

  fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({
      username: usernameEl.value.trim(),
      password: passwordEl.value.trim(),
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.msg === "unable to log in") {
        showAlert(
          getPhrase("alertErrorGlitch"),
          getPhrase("alertHeadlineUnable")
        );
        submitButtonEl.removeAttribute("disabled");
        // TODO: hide spinner
      } else if (data.msg === "invalid login") {
        showAlert(
          getPhrase("alertErrorInvalid"),
          getPhrase("alertHeadlineInvalid")
        );
        submitButtonEl.removeAttribute("disabled");
        // TODO: hide spinner
      } else if (data.msg === "login succeeded") {
        localStorage.setItem("refreshToken", data.refreshToken);
        sessionStorage.setItem("accessToken", data.accessToken);
        submitButtonEl.classList.add("d-none");
        submitButtonEl.removeAttribute("disabled");
        window.location.href = "./dashboard";
      }
    })
    .catch((error) => {
      console.error(error);
      submitButtonEl.removeAttribute("disabled");
    });
}

function addListeners() {
  document.querySelector("#loginForm").addEventListener("submit", onSubmit);
}

function init() {
  // TODO: show spinner
  addListeners();
  // TODO: hide spinner
}

init();
