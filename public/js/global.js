function listenForScriptureClicks() {
  document.querySelectorAll("[data-scripture]").forEach((el) => {
    el.addEventListener("click", (evt) => {
      if (event.target.matches("[data-scripture]")) {
        const slug = evt.target.getAttribute("data-scripture");
        evt.preventDefault();
        showScripture(slug);
      }
    });
  });
}

function showScripture(slug) {
  return new Promise((resolve, reject) => {
    const modal = new bootstrap.Modal("#modal");
    const lang = document.querySelector("html").getAttribute("lang");
    const endpoint = `/scriptures/${lang}/${slug}.json`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((scriptureObject) => {
        const modalEl = document.querySelector("#modal");
        const modal = new bootstrap.Modal(modalEl);
        const header = modalEl.querySelector(".modal-title");
        const body = modalEl.querySelector(".modal-body");
        const { display, version, book, chapter, verses } = scriptureObject;
        let expandText = "Expand";
        let versesHTML = "";

        for (let i = 0; i < verses.length; i++) {
          const verseNum = verses[i][0];
          const verseText = verses[i][1];
          let verseHTML = "";

          if (verses.length === 1) {
            verseHTML =
              verseHTML +
              `<tr>
                <td class="verseText ps-0">
                  ${verseText}
                </td>
              </tr>`;
          } else {
            verseHTML =
              verseHTML +
              `<tr>
                <td class="verseText ps-0">
                  ${verseText}
                </td>
                <td class="verseNum pe-0 text-nowrap text-end">
                  <div class="d-inline-block p-1 ms-2 mb-2 bg-light border border-dark" inert>
                    ${verseNum}
                  </div>
                </td>
              </tr>`;
          }

          versesHTML += verseHTML;
        }

        versesHTML = `
          <table class="table">
            ${versesHTML}
          </table>

          <div class="expand text-end mt-4 mb-2 ">
            <a class="btn btn-sm text-dark bg-light border border-dark" href="https://www.biblegateway.com/passage/?search=${book}%20${chapter}&version=${version}" rel="noopener nofollow" target="_blank">
              <i>${expandText}</i>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
              </svg>
            </a>
          </div>
        `;

        header.innerHTML = `${display} <span class="version">(${version})</span>`;
        body.innerHTML = versesHTML;

        modal.show();

        return resolve(scriptureObject);
      });
  });
}

function addListeners() {
  listenForScriptureClicks();
}

function init() {
  addListeners();
}

init();
