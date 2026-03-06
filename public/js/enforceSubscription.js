(() => {
  const refreshTokenStored = localStorage.getItem('refreshToken');

  if (!refreshTokenStored) {
    return window.location.replace('./logout');
  }

  const refreshToken = JSON.parse(atob(refreshTokenStored.split('.')[1]));

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

  if (!navigator.onLine) return;

  try {
    getAccessToken().then((accessToken) => {
      fetch('/api/subscription-get', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.accessToken) {
            sessionStorage.setItem('accessToken', data.accessToken);
          }

          if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
          }

          if (data.msg && data.msg === 'access is active') return;

          window.location.replace('./subscribe');
        })
        .catch((err) => {
          console.error(err);
        });
    });
  } catch (err) {
    console.error(err);
  }
})();
