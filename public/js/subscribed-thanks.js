function onContinue() {
  window.location.replace('./dashboard');
}

function attachListeners() {
  document.querySelector('#btnContinue').addEventListener('click', onContinue);
}

function init() {
  attachListeners();
}

init();
