function autoLogin() {
  const refreshTokenStored = localStorage.getItem('refreshToken');

  if (!refreshTokenStored) return;

  const refreshToken = JSON.parse(atob(refreshTokenStored.split('.')[1]));
  const now = Math.floor(Date.now() / 1000);
  const isExpired = now >= refreshToken.exp;

  if (!isExpired) {
    window.location.href = './dashboard';
  }
}

function init() {
  autoLogin();
}

init();
