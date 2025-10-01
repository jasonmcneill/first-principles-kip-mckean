if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    try {
      const seg = (location.pathname.split("/")[1] || "").toLowerCase();
      if (/^[a-z]{2}(-[a-z]{2})?$/.test(seg)) {
        navigator.serviceWorker
          .register(`/sw-${seg}.js`)
          .catch((err) => console.error("SW registration failed:", err));
      }
    } catch (err) {
      console.error("SW registration failed:", err);
    }
  });
}
