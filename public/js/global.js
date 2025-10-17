let phrases;
let globalPhrases;

function fpScrollTo(el, offset = 20) {
  const y = el.getBoundingClientRect().top + window.pageYOffset - offset;

  window.scrollTo({ top: y, behavior: "smooth" });
}

function getAccessToken() {
  let needToRefresh = false;
  const accessToken = sessionStorage.getItem("accessToken") || "";
  let expiry = Date.now().valueOf() / 1000;

  try {
    expiry = JSON.parse(atob(accessToken.split(".")[1])).exp;
    if (expiry < now) needToRefresh = true;
  } catch (err) {
    needToRefresh = true;
  }

  return new Promise((resolve, reject) => {
    if (!needToRefresh) return resolve(accessToken);
    const refreshToken = localStorage.getItem("refreshToken") || "";
    if (!refreshToken.length) return reject("refresh token missing");

    fetch("/api/refresh-token", {
      method: "POST",
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        switch (data.msg) {
          case "tokens renewed":
            const { accessToken, refreshToken } = data;
            localStorage.setItem("refreshToken", refreshToken);
            sessionStorage.setItem("accessToken", accessToken);
            resolve(accessToken);
            break;
          default:
            resolve("could not get access token");
            break;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

function getGlobalPhrase(key) {
  if (!globalPhrases) return;

  const phrase = globalPhrases[key];

  if (!phrase) return;

  return phrase;
}

function getPhrase(key) {
  if (!phrases) return;

  const phrase = phrases[key];

  if (!phrase) return;

  return phrase;
}

function hideAudioIfOpusNotSupported() {
  const testAudio = document.createElement("audio");
  const canPlayOpus =
    !!testAudio.canPlayType &&
    testAudio.canPlayType('audio/webm; codecs="opus"').replace(/no/, "");

  if (!canPlayOpus) {
    document.querySelectorAll(".audioContainer").forEach((item) => {
      item.setAttribute("hidden", "");
    });
  }
}

function hideScriptureHash() {
  if (window.location.hash && window.location.hash === "#modal") {
    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search
    );
  }
}

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

function loadContent() {
  const contentEl = document.querySelector("#content");
  if (!contentEl) return;

  const globalContentEl = document.querySelector("#globalContent");
  if (!globalContentEl) return;

  const content = JSON.parse(contentEl.innerHTML);
  const globalContent = JSON.parse(globalContentEl.innerHTML);

  phrases = content;
  globalPhrases = globalContent;
}

async function logOut() {
  localStorage.removeItem("refreshToken");
  sessionStorage.removeItem("accessToken");

  const clearAllPWACaches = async () => {
    const cacheKeys = await caches.keys();

    for (const key of cacheKeys) {
      const deleted = await caches.delete(key);

      if (deleted) {
        console.log(`Successfully deleted cache: ${key}`);
      } else {
        console.log(`Cache not found or could not be deleted: ${key}`);
      }
    }
  };

  // await clearAllPWACaches();
  window.location.replace("./login");
}

function listenForAudio() {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const t = setTimeout(() => {
      channel.port1.onmessage = null;
      resolve({ ok: false, error: "timeout", url, requestId });
    }, timeoutMs);

    channel.port1.onmessage = (ev) => {
      clearTimeout(t);
      resolve(ev.data);
    };

    sw.postMessage({ type: "PREFETCH_AUDIO", url, requestId }, [channel.port2]);
  });
}

function maskNumericPasswordOnIOS() {
  const isIOS = /iP(ad|hone|od)/.test(navigator.userAgent);
  if (isIOS) {
    document
      .querySelectorAll('input[type="password"][data-mask="true"]')
      .forEach((item) => {
        item.type = "tel";
        item.inputMode = "numeric";
        item.style.webkitTextSecurity = "disc";
      });
  }
}

function resetSubmitButtons() {
  document.querySelectorAll("button[type=submit]").forEach((item) => {
    item.removeAttribute("disabled");
    item.querySelector(".submitButtonSpinner").classList.add("d-none");
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
            <a class="btn btn-sm text-dark bg-light border border-dark d-inline-flex align-items-center gap-1" href="https://www.biblegateway.com/passage/?search=${book}%20${chapter}&version=${version}" rel="noopener nofollow" target="_blank">
              <i>
                ${expandText} 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                </svg>
              </i>
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

function showSubmitButtonSpinner(submitEvt) {
  const submitButtonEl = submitEvt.target.querySelector("button[type=submit]");
  const spinnerEl = submitButtonEl?.querySelector(".submitButtonSpinner");
  submitButtonEl?.setAttribute("disabled", "");
  spinnerEl?.classList.remove("d-none");
}

function addListeners() {
  listenForScriptureClicks();

  window.addEventListener("popstate", () => {
    const modalEl = document.getElementById("modal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
      modal.hide();
    }
  });

  const myModalEl = document.getElementById("modal");

  myModalEl.addEventListener("hide.bs.modal", (event) => {
    if (window.location.hash === "#modal") {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  });

  myModalEl.addEventListener("show.bs.modal", (event) => {
    history.pushState(null, "", "#modal");
  });

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      resetSubmitButtons();
    }
  });

  document.addEventListener("DOMContentLoaded", maskNumericPasswordOnIOS);
}

function init() {
  addListeners();
  loadContent();
  hideAudioIfOpusNotSupported();
  hideScriptureHash();
  resetSubmitButtons();
}

init();
