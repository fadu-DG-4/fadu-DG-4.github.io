const menuToggle = document.querySelector("[data-menu-toggle]");

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
