function localizeNumbers() {
  const userLocale = navigator.language || "en-US";
  document
    .querySelector("tbody.numerals")
    .querySelectorAll("td")
    .forEach((el) => {
      if (isNaN(el.innerText)) {
        return;
      }

      const num = parseFloat(el.innerText);
      const formatted = new Intl.NumberFormat(userLocale).format(num);
      el.textContent = formatted;
    });
}

function init() {
  localizeNumbers();
}

init();
