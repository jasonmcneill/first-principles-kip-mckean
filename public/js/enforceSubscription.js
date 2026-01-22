(() => {
  const refreshTokenStored = localStorage.getItem("refreshToken");

  if (!refreshTokenStored) return login();

  const refreshToken = JSON.parse(atob(refreshTokenStored.split(".")[1]));

  const subscribe = () => {
    return window.location.replace("./subscribe");
  };

  if (!refreshToken.subscribeduntil) return subscribe();

  const now = Math.floor(Date.now() / 1000);
  const expiry = new Date(refreshToken.subscribeduntil).getTime() / 1000;
  const isSubscriptionCurrent = now < expiry;

  if (!isSubscriptionCurrent) return subscribe();
})();