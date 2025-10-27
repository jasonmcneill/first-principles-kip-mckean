(() => {
  const refreshTokenStored = localStorage.getItem("refreshToken");

  if (!refreshTokenStored) return login();

  const refreshToken = JSON.parse(atob(refreshTokenStored.split(".")[1]));

  const login = () => {
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    window.location.href = `./login`;
  };

  if (!refreshToken.subscribeduntil) return login();

  const now = Math.floor(Date.now() / 1000);
  const isSubscriptionCurrent = now >= refreshToken.subscribeduntil;

  if (!isSubscriptionCurrent) return login();
})();