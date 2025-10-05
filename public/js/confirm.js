async function onSubmit(evt) {
  evt.preventDefault();
  const codeEl = document.querySelector("#confirmationCode");
  const errMsgEl = document.querySelector("#errMsg");
  const code = codeEl.value.trim();
  const accessToken = await getAccessToken();

  document
    .querySelectorAll(".is-invalid")
    .forEach((item) => item.classList.remove("is-invalid"));

  if (!code.length) {
    codeEl.classList.add("is-invalid");
    errMsgEl.innerHTML = getPhrase("errRequired");
  }

  fetch("/confirm", {
    method: "POST",
    body: JSON.stringify({
      code: code,
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    authorization: `Bearer ${accessToken}`,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });
}

function addListeners() {
  document.querySelector("#confirmForm").addEventListener("submit", onSubmit);
}

function init() {
  addListeners();
}

init();
