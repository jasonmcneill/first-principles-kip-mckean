(() => {
  const refreshTokenStored = localStorage.getItem("refreshToken");

  if (!refreshTokenStored) return login();

  const refreshToken = JSON.parse(atob(refreshTokenStored.split(".")[1]));

  const subscribe = () => {
    return window.location.replace("./subscribe");
  };

  if (!refreshToken.subscribeduntil) return subscribe();

  const now = Math.floor(Date.now() / 1000);
  const expiry = Math.floor(
    new Date(refreshToken.subscribeduntil).getTime() / 1000,
  );
  const isSubscriptionCurrent = now < expiry;

  if (!isSubscriptionCurrent) return subscribe();

  const INTERVAL_MS = 20000; // 20 seconds

  const checkSubscription = async () => {
    const endpoint = "/api/check-subscription";
    const accessToken = await getAccessToken();

    if (!accessToken) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), INTERVAL_MS);

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        signal: controller.signal,
      });

      const data = await response.json();

      if (data.msg && data.msg !== "subscription active") {
        return subscribe();
      }

      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      if (data.accessToken) {
        sessionStorage.setItem("accessToken", data.accessToken);
      }

      clearTimeout(timeoutId);
      setTimeout(checkSubscription, INTERVAL_MS);
    } catch (error) {
      if (error.name === "AbortError") {
        console.warn("Fetch timed out. Starting next cycle...");
      } else {
        console.error("Network error:", error);
      }

      clearTimeout(timeoutId);
      setTimeout(checkSubscription, INTERVAL_MS);
    }
  };

  checkSubscription();
})();
