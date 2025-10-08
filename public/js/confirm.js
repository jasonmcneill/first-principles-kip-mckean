function popUpError(title, body) {
  const modalEl = document.querySelector("#modal");
  const titleEl = modalEl.querySelector(".modal-title");
  const bodyEl = modalEl.querySelector(".modal-body");

  titleEl.innerHTML = title;
  bodyEl.innerHTML = body;

  resetSubmitButtons();

  new bootstrap.Modal("#modal").show();
}

async function onSubmit(evt) {
  evt.preventDefault();
  const codeEl = document.querySelector("#confirmationCode");
  const errMsgEl = document.querySelector("#errMsg");
  const code = codeEl.value.trim();
  const params = new URLSearchParams(window.location.search);
  const userid = params.get("userid");

  resetSubmitButtons();
  showSubmitButtonSpinner(evt);

  document
    .querySelectorAll(".is-invalid")
    .forEach((item) => item.classList.remove("is-invalid"));

  if (!code.length) {
    codeEl.classList.add("is-invalid");
    errMsgEl.innerHTML = getPhrase("errRequired");
    resetSubmitButtons();
    return;
  }

  if (code.length < 6 || isNaN(code)) {
    codeEl.classList.add("is-invalid");
    errMsgEl.innerHTML = getPhrase("err6Digits");
    resetSubmitButtons();
    return;
  }

  if (isNaN(userid)) {
    popUpError(getPhrase("errTitle"), getPhrase("errUserIdNumeric"));
    return;
  }

  fetch("/api/confirm", {
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
          popUpError(getPhrase("errTitle"), getPhrase("errRequired2"));
          break;
        case "code must be numeric":
          popUpError(getPhrase("errTitle"), getPhrase("errNumeric2"));
          break;
        case "no match found":
          popUpError(getPhrase("errTitleNotFound"), getPhrase("errNoMatch"));
          break;
        case "code expired":
          popUpError(getPhrase("errTitleExpired"), getPhrase("errExpired"));
          break;
        case "code verified":
          const confirmFormEl = document.querySelector("#confirmForm");
          const confirmedEl = document.querySelector("#confirmed");

          confirmFormEl.classList.add("d-none");
          confirmedEl.classList.remove("d-none");
          break;
        default:
          break;
      }
    });
}

function addListeners() {
  document.querySelector("#confirmForm").addEventListener("submit", onSubmit);
}

function init() {
  addListeners();
}

init();
