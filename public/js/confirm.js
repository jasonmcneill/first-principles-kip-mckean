async function onSubmit(evt) {
  evt.preventDefault();
  const codeEl = document.querySelector("#confirmationCode");
  const errMsgEl = document.querySelector("#errMsg");
  const code = codeEl.value.trim();
  const params = new URL(url).searchParams;
  const userid = params.get("userid");

  document
    .querySelectorAll(".is-invalid")
    .forEach((item) => item.classList.remove("is-invalid"));

  if (!code.length) {
    codeEl.classList.add("is-invalid");
    errMsgEl.innerHTML = getPhrase("errRequired");
  }

  if (isNaN(userid)) {
    console.error("userid must be numeric");
    // TODO: show error in UI
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
          break;
        case "code must be numeric":
          break;
        case "no match found":
          break;
        case "code expired":
          break;
        case "code verified":
          // TODO: Show a success message, then let the user proceed. Don't just redirect.
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
