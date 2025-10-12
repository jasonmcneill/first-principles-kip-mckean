let userid;

function getEmailHTMLTemplate() {
  return new Promise((resolve, reject) => {
    fetch("../email/pw-forgot/pw-forgot.html")
      .then((res) => res.text())
      .then((data) => {
        resolve(data);
      });
  });
}

function getEmailTextTemplate() {
  return new Promise((resolve, reject) => {
    fetch("../email/pw-forgot/pw-forgot.txt")
      .then((res) => res.text())
      .then((data) => {
        resolve(data);
      });
  });
}

function hideAlert() {
  const alertEl = document.querySelector(".alert");
  alertEl.classList.add("d-none");
}

function showAlert(content, headline) {
  const alertEl = document.querySelector(".alert");
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

async function onSubmitEmail(evt) {
  evt.preventDefault();
  resetSubmitButtons();
  hideAlert();
  showSubmitButtonSpinner(evt);

  document
    .querySelectorAll(".is-invalid")
    .forEach((item) => item.classList.remove("is-invalid"));

  const emailEl = evt.target.querySelector("#email");
  const errMsgEmail = evt.target.querySelector("#errMsgEmail");
  const email = emailEl.value.trim();
  const alertEl = document.querySelector(".alert");
  const contentEl = alertEl.querySelector(".alert-content");

  if (!email.length) {
    resetSubmitButtons();
    errMsgEmail.innerHTML = getPhrase("errEmailRequired");
    emailEl.classList.add("is-invalid");
    emailEl.focus();
  }

  const formData = {
    email: email,
    emailAppName: getPhrase("appTitle"),
    emailSubject: getPhrase("emailSubject"),
    emailP1: getPhrase("emailP1"),
    emailP2: getPhrase("emailP2"),
    emailP3: getPhrase("emailP3"),
    emailFooter1: getPhrase("emailFooter1"),
    emailFooter2: getPhrase("emailFooter2"),
  };

  formData.emailTextTemplate = await getEmailTextTemplate();
  formData.emailHTMLTemplate = await getEmailHTMLTemplate();

  fetch("/api/pw-forgot", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      switch (data.msg) {
        case "invalid email":
          resetSubmitButtons();
          errMsgEmail.innerHTML = getPhrase("errorEmailInvalid");
          emailEl.classList.add("is-invalid");
          emailEl.focus();
          break;
        case "user not found":
          resetSubmitButtons();
          showAlert(
            getPhrase("errAcctNotFound"),
            getPhrase("errAcctNotFoundTitle")
          );
          break;
        case "password reset email sent":
          window.location.href = `./pw-forgot-confirm?userid=${data.userid}`;
          break;
        default:
          break;
      }
    });
}

function addListeners() {
  document
    .querySelector("#resetForm")
    .addEventListener("submit", onSubmitEmail);
}

function init() {
  addListeners();
}

init();
