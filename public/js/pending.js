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

async function onSubmit(evt) {
  evt.preventDefault();

  resetSubmitButtons();
  showSubmitButtonSpinner(evt);

  const emailTextTemplate = await getEmailTextTemplate();
  const emailHTMLTemplate = await getEmailHTMLTemplate();

  const otpData = {
    emailAppName: getPhrase("appTitle"),
    emailSubject: getPhrase("emailSubject"),
    emailP1: getPhrase("emailP1"),
    emailP2: getPhrase("emailP2"),
    emailP3: getPhrase("emailP3"),
    emailFooter1: getPhrase("emailFooter1"),
    emailFooter2: getPhrase("emailFooter2"),
    emailTextTemplate: emailTextTemplate,
    emailHTMLTemplate: emailHTMLTemplate,
  };

  const accessToken = await getAccessToken();

  fetch("/api/pending", {
    method: "POST",
    body: JSON.stringify(otpData),
    headers: new Headers({
      "Content-Type": "application/json",
      authorization: `Bearer ${accessToken}`,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.msg === "otp sent") {
        window.location.replace(`./confirm?userid=${data.userid}`);
      }
    });
}

function addListeners() {
  document.querySelector("#form").addEventListener("submit", onSubmit);
}

function init() {
  addListeners();
}

init();
