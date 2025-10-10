let userid;

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

async function onSubmitCode(evt) {
  evt.preventDefault();
  resetErrors();
  showSubmitButtonSpinner(evt);

  const userid = new URLSearchParams(window.location.search).get("userid");
  const codeEl = document.querySelector("#confirmationCode");
  const errMsgEl = document.querySelector("#errMsgConfirmationCode");
  const code = codeEl.value.trim();

  if (!code.length) {
    resetErrors();
    codeEl.classList.add("is-invalid");
    errMsgEl.innerHTML = getPhrase("errConfirmationCodeRequired");
    return;
  }

  if (code.length < 6 || isNaN(code)) {
    resetErrors();
    codeEl.classList.add("is-invalid");
    errMsgEl.innerHTML = getPhrase("err6Digits");
    return;
  }

  if (isNaN(userid)) {
    resetErrors();
    return console.error("userid must be a number");
  }

  fetch("/api/pw-forgot-confirm", {
    method: "POST",
    body: JSON.stringify({
      userid: userid,
      code: code,
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      switch (data.msg) {
        case "code is required":
          codeEl.classList.add("is-invalid");
          errMsgEl.innerHTML = getPhrase("errConfirmationCodeRequired");
          fpScrollTo("#confirmationCode");
          resetSubmitButtons();
          break;
        case "code must be numeric":
          codeEl.classList.add("is-invalid");
          errMsgEl.innerHTML = getPhrase("err6Digits");
          fpScrollTo("#confirmationCode");
          resetSubmitButtons();
          break;
        case "user not found":
          showAlert(getPhrase("errNoMatch"), getPhrase("errTitleNotFound"));
          resetSubmitButtons();
          break;
        case "no match found":
          showAlert(getPhrase("errNoMatch"), getPhrase("errTitleNotFound"));
          resetSubmitButtons();
          break;
        case "code expired":
          showAlert(getPhrase("errExpired"), getPhrase("errTitleExpired"));
          resetSubmitButtons();
          break;
        case "code confirmed":
          resetSubmitButtons();
          localStorage.setItem("refreshToken", data.refreshToken);
          sessionStorage.setItem("accessToken", data.accessToken);
          window.location.replace("./pw-forgot-new");
          break;
        default:
          showAlert(getPhrase("errGlitch"));
          resetSubmitButtons();
          console.error(data.msg);
          break;
      }
    })
    .catch((error) => {
      console.error(error);
      resetErrors();
    });
}

function addListeners() {
  document
    .querySelector("#confirmForm")
    .addEventListener("submit", onSubmitCode);
}

function init() {
  addListeners();
}

init();
