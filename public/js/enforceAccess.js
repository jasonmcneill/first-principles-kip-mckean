(() => {
  const redirectToLogin = () => {
    let lang = document.querySelector("html").getAttribute("lang");

    if (!lang || !lang.length) {
      lang = "en";
    }

    const loginUrl = `/${lang}/login`;

    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    window.location.href = loginUrl;
  };

  const refreshTokenStored = localStorage.getItem("refreshToken");

  if (!refreshTokenStored) return redirectToLogin();

  const refreshToken = JSON.parse(atob(refreshTokenStored.split(".")[1]));

  const now = Math.floor(Date.now() / 1000);
  const isExpired = now >= exp;
  if (isExpired) return redirectToLogin();

  /* if (!refreshToken.subscribeduntil) return redirectToLogin();
  const isSubscriptionCurrent = now >= refreshToken.subscribeduntil;
  if (!isSubscriptionCurrent) return redirectToLogin(); */
})();
