(() => {
  const refreshTokenStored = localStorage.getItem('refreshToken');

  if (!refreshTokenStored) return login();

  const refreshToken = JSON.parse(atob(refreshTokenStored.split('.')[1]));

  const subscribe = () => {
    return window.location.replace('./subscribe');
  };

  const getAccessToken = async () => {
    let needToRefresh = false;
    const accessToken = sessionStorage.getItem('accessToken') || '';
    const now = Math.floor(Date.now().valueOf() / 1000);
    let expiry = 0;

    if (!accessToken.length) needToRefresh = true;

    try {
      expiry = Math.floor(JSON.parse(atob(accessToken.split('.')[1])).exp);
      if (expiry < now) needToRefresh = true;
    } catch (err) {
      needToRefresh = true;
    }

    return new Promise((resolve, reject) => {
      if (!needToRefresh) return resolve(accessToken);
      const refreshToken = localStorage.getItem('refreshToken') || '';
      if (!refreshToken.length) return reject('refresh token missing');

      fetch('/api/refresh-token', {
        method: 'POST',
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          switch (data.msg) {
            case 'tokens renewed':
              const { accessToken, refreshToken } = data;
              localStorage.setItem('refreshToken', refreshToken);
              sessionStorage.setItem('accessToken', accessToken);
              resolve(accessToken);
              break;
            default:
              resolve('could not get access token');
              break;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  if (!refreshToken.subscribeduntil) return subscribe();

  const now = Math.floor(Date.now() / 1000);
  const expiry = Math.floor(
    new Date(refreshToken.subscribeduntil).getTime() / 1000
  );
  const isSubscriptionCurrent = now < expiry;

  if (!isSubscriptionCurrent) return subscribe();

  const getSubscriptionStatus = () => {
    const refreshTokenStored = localStorage.getItem('refreshToken');
    if (!refreshTokenStored) return { valid: false, daysRemaining: 0 };

    try {
      const token = JSON.parse(atob(refreshTokenStored.split('.')[1]));
      if (!token.subscribeduntil) return { valid: false, daysRemaining: 0 };

      const now = Math.floor(Date.now() / 1000);
      const expiry = Math.floor(new Date(token.subscribeduntil).getTime() / 1000);
      const secondsRemaining = expiry - now;
      const daysRemaining = secondsRemaining / (60 * 60 * 24);

      return {
        valid: now < expiry,
        daysRemaining: daysRemaining,
        expiry: expiry,
      };
    } catch (error) {
      console.error('Error parsing refresh token:', error);
      return { valid: false, daysRemaining: 0 };
    }
  };

  const verifyWithAPI = async (blocking = false) => {
    const endpoint = '/api/check-subscription';
    const accessToken = await getAccessToken();

    if (!accessToken) {
      if (blocking) return subscribe();
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        signal: controller.signal,
      });

      const data = await response.json();

      if (data.msg && data.msg !== 'subscription active') {
        console.error('Subscription not active:', data.msg);
        return subscribe();
      }

      clearTimeout(timeoutId);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Subscription check timed out');
      } else {
        console.error('Network error during subscription check:', error);
      }

      clearTimeout(timeoutId);

      // If blocking and network failed, still enforce for expired tokens
      if (blocking) {
        const status = getSubscriptionStatus();
        if (!status.valid) return subscribe();
      }
      // If non-blocking, fail gracefully (allow access if token says valid)
    }
  };

  const checkSubscription = async () => {
    const status = getSubscriptionStatus();

    // Token invalid - must verify with API (blocking)
    if (!status.valid) {
      await verifyWithAPI(true);
      return;
    }

    // Token valid - determine check interval based on time remaining
    let nextCheckInterval;
    if (status.daysRemaining > 7) {
      // More than 7 days: check once per day
      nextCheckInterval = 60000 * 60 * 24; // 24 hours
    } else if (status.daysRemaining > 1) {
      // 1-7 days: check every 6 hours
      nextCheckInterval = 60000 * 60 * 6; // 6 hours
    } else {
      // Less than 1 day: check hourly
      nextCheckInterval = 60000 * 60; // 1 hour
    }

    // Verify in background (non-blocking)
    verifyWithAPI(false);

    // Schedule next check
    setTimeout(checkSubscription, nextCheckInterval);
  };

  checkSubscription();
})();
