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

  const INTERVAL_MS = 60000 * 60; // 60 minutes

  const checkSubscription = async () => {
    const endpoint = '/api/check-subscription';
    const accessToken = await getAccessToken();

    if (!accessToken) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), INTERVAL_MS);

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
        console.error(msg);
        return subscribe();
      }

      clearTimeout(timeoutId);
      setTimeout(checkSubscription, INTERVAL_MS);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Fetch timed out. Starting next cycle...');
      } else {
        console.error('Network error:', error);
      }

      clearTimeout(timeoutId);
      setTimeout(checkSubscription, INTERVAL_MS);
    }
  };

  checkSubscription();
})();
