(() => {
  const refreshTokenStored = localStorage.getItem("refreshToken");

  if (!refreshTokenStored) return login();

  const refreshToken = JSON.parse(atob(refreshTokenStored.split(".")[1]));

  const subscribe = () => {
    return window.location.href = `./subscribe`;
  };

  if (!refreshToken.subscribeduntil) return subscribe();

  const now = Math.floor(Date.now() / 1000);
  const isSubscriptionCurrent = now >= refreshToken.subscribeduntil;

  if (!isSubscriptionCurrent) return subscribe();
})();