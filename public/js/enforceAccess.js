(() => {
  const login = () => {
    const lang = document.querySelector("html").getAttribute("lang") || "en";

    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    window.location.href = `/login/?lang=${lang}`;
  };

  const refreshTokenStored = localStorage.getItem("refreshToken");

  if (!refreshTokenStored) return login();

  const refreshToken = JSON.parse(atob(refreshTokenStored.split(".")[1]));

  const now = Math.floor(Date.now() / 1000);
  const isExpired = now >= refreshToken.exp;
  if (isExpired) return login();

  /* if (!refreshToken.subscribeduntil) return redirectToLogin();
  const isSubscriptionCurrent = now >= refreshToken.subscribeduntil;
  if (!isSubscriptionCurrent) return redirectToLogin(); */
})();
