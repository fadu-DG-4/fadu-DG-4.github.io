const menuToggle = document.querySelector("[data-menu-toggle]");
const siteHeaders = document.querySelectorAll(".site-header");

siteHeaders.forEach((siteHeader) => {
  siteHeader.addEventListener("click", (event) => {
    if (event.target.closest("[data-menu-toggle]")) return;
    window.location.href = "/";
  });
});

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    if (document.body.dataset.navigationPage === "true") {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "/";
      }
      return;
    }

    window.location.href = "/navegacion.html";
  });
}
