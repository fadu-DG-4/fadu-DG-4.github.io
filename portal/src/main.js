const menuToggle = document.querySelector("[data-menu-toggle]");
const siteHeaders = document.querySelectorAll(".site-header");
const isNavigationPage = document.body.dataset.navigationPage === "true";
const navigationExitDuration = 620;

function leaveNavigationPage(callback) {
  if (!isNavigationPage) {
    callback();
    return;
  }

  document.body.classList.add("navigation-leaving");
  window.setTimeout(callback, navigationExitDuration);
}

siteHeaders.forEach((siteHeader) => {
  siteHeader.addEventListener("click", (event) => {
    if (event.target.closest("[data-menu-toggle]")) return;
    leaveNavigationPage(() => {
      window.location.href = "/";
    });
  });
});

if (isNavigationPage) {
  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.target === "_blank"
      ) {
        return;
      }

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      event.preventDefault();
      leaveNavigationPage(() => {
        window.location.href = url.href;
      });
    });
  });
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    if (isNavigationPage) {
      if (window.history.length > 1) {
        leaveNavigationPage(() => window.history.back());
      } else {
        leaveNavigationPage(() => {
          window.location.href = "/";
        });
      }
      return;
    }

    window.location.href = "/navegacion.html";
  });
}
