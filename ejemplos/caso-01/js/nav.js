/* =====================================================================
   nav.js — navegación compartida del sitio
   ---------------------------------------------------------------------
   Este archivo es la ÚNICA fuente de la navegación. Para agregar o
   renombrar un capítulo, editá el arreglo SITE.pages (ver README.md).

   Genera, en cada página:
   - el menú lateral (escritorio) / panel deslizable (móvil)
   - el índice "En esta página" (desde los <h2 id="…"> del contenido)
   - las migas de pan
   - el indicador "Capítulo N de M"
   - los enlaces "Anterior / Siguiente"
   - las tarjetas de capítulos de la portada

   Funciona abriendo el sitio con doble clic (file://): no usa fetch,
   ni módulos, ni history.pushState / replaceState.
   ===================================================================== */
(function () {
  "use strict";

  /* -------------------------------------------------------------------
     1. CONFIGURACIÓN
     type: "home" (portada) · "chapter" (capítulo) · "extra" (otras páginas)
     ------------------------------------------------------------------- */
  var SITE = {
    title: "Árboles nativos de la Argentina",
    footer: "Diseño Gráfico 4 · Cátedra Meygide-Carpintero · FADU-UBA · 2026",
    pages: [
      { file: "portal.html",      type: "home",    title: "Inicio" },
      { file: "capitulo-01.html", type: "chapter", num: 1, title: "Introducción",
        summary: "Qué entendemos por especie nativa y por qué importan." },
      { file: "capitulo-02.html", type: "chapter", num: 2, title: "Regiones y paisajes",
        summary: "La Argentina abarca ambientes muy distintos, desde selvas subtropicales hasta bosques fríos de montaña." },
      { file: "capitulo-03.html", type: "chapter", num: 3, title: "Especies destacadas",
        summary: "Ceibo, lapacho rosado y algarrobo." },
      { file: "capitulo-04.html", type: "chapter", num: 4, title: "Conclusiones",
        summary: "Hallazgos principales y preguntas abiertas." },
      { file: "referencias.html", type: "extra",   title: "Referencias" },
      { file: "acerca.html",      type: "extra",   title: "Acerca del proyecto" }
    ]
  };

  /* -------------------------------------------------------------------
     2. UTILIDADES
     ------------------------------------------------------------------- */
  var pages = SITE.pages;
  var chapters = pages.filter(function (p) { return p.type === "chapter"; });
  var home = pages.filter(function (p) { return p.type === "home"; })[0];
  var extras = pages.filter(function (p) { return p.type === "extra"; });

  // Página actual según el nombre del archivo (sirve en file:// y en un servidor)
  var currentFile = decodeURIComponent(location.pathname.split("/").pop() || home.file);
  if (!/\.html?$/i.test(currentFile)) currentFile = home.file;
  var current = pages.filter(function (p) { return p.file === currentFile; })[0] || home;

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function $(id) { return document.getElementById(id); }

  var STAR = '<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10 0l2.2 7.8L20 10l-7.8 2.2L10 20l-2.2-7.8L0 10l7.8-2.2z"/></svg>';
  var STARS = '<span class="stars" aria-hidden="true">' + STAR + STAR + STAR + '</span>';
  var CROSSHAIR = '<svg class="crosshair" viewBox="0 0 60 60" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5">' +
    '<circle cx="30" cy="30" r="26"/><line x1="30" y1="2" x2="30" y2="58"/><line x1="2" y1="30" x2="58" y2="30"/>' +
    (function () { var t = ""; for (var i = -20; i <= 20; i += 5) { if (i) { t += '<line x1="' + (30 + i) + '" y1="27" x2="' + (30 + i) + '" y2="33"/><line x1="27" y1="' + (30 + i) + '" x2="33" y2="' + (30 + i) + '"/>'; } } return t; })() +
    '</svg>';

  // Título con la primera letra en serif itálica
  function brandTitle(t) { return '<span class="sw">' + esc(t.charAt(0)) + '</span>' + esc(t.slice(1)); }
  function chapterLabel(p) { return pad(p.num) + " · " + p.title; }

  /* -------------------------------------------------------------------
     3. ÍNDICE "EN ESTA PÁGINA"
     Toma los <h2 id="…"> dentro de <main>.
     ------------------------------------------------------------------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main .prose h2[id]"));

  function tocHTML() {
    if (!sections.length) return "";
    var h = '<p class="toc__title">En esta página</p><ul class="toc">';
    sections.forEach(function (s) { h += '<li><a href="#' + s.id + '">' + esc(s.textContent) + "</a></li>"; });
    return h + "</ul>";
  }

  /* -------------------------------------------------------------------
     4. MENÚ LATERAL
     ------------------------------------------------------------------- */
  function link(p, label) {
    var cur = p === current ? ' aria-current="page"' : "";
    return '<a class="nav-link" href="' + p.file + '"' + cur + ">" + label + "</a>";
  }

  function renderNav() {
    var nav = $("site-nav");
    if (!nav) return;
    var h = '<div class="sidebar__mark">' + CROSSHAIR + STARS + "</div>";
    h += '<a class="sidebar__brand" href="' + home.file + '">' + brandTitle(SITE.title) + "</a>";

    h += '<div class="nav-group"><ul class="nav-list"><li>' + link(home, "Inicio") + (current === home ? tocHTML() : "") + "</li></ul></div>";

    h += '<div class="nav-group"><p class="nav-label">' + STAR.replace("<svg", '<svg width="10" height="10"') + " Capítulos</p><ul class=\"nav-list\">";
    chapters.forEach(function (p) {
      h += "<li>" + link(p, '<span class="n">' + pad(p.num) + "</span><span>" + esc(p.title) + "</span>") + (p === current ? tocHTML() : "") + "</li>";
    });
    h += "</ul></div>";

    h += '<div class="nav-group"><ul class="nav-list">';
    extras.forEach(function (p) { h += "<li>" + link(p, esc(p.title)) + (p === current ? tocHTML() : "") + "</li>"; });
    h += "</ul></div>";

    h += '<p class="sidebar__foot">' + esc(SITE.footer) + "</p>";
    nav.innerHTML = h;
  }

  /* -------------------------------------------------------------------
     5. MIGAS, INDICADOR, PAGINADOR, TARJETAS, PIE
     ------------------------------------------------------------------- */
  function renderBreadcrumbs() {
    var el = $("breadcrumbs");
    if (!el || current === home) return;
    var items = ['<li><a href="' + home.file + '">Inicio</a></li>'];
    if (current.type === "chapter") {
      items.push('<li><a href="' + chapters[0].file + '">Capítulos</a></li>');
      items.push('<li aria-current="page">' + esc(chapterLabel(current)) + "</li>");
    } else {
      items.push('<li aria-current="page">' + esc(current.title) + "</li>");
    }
    el.innerHTML = '<nav class="breadcrumbs" aria-label="Migas de pan"><ol>' + items.join("") + "</ol></nav>";
  }

  function renderIndicator() {
    var el = $("chapter-indicator");
    if (!el || current.type !== "chapter") return;
    el.textContent = "Capítulo " + current.num + " de " + chapters.length;
  }

  function renderPager() {
    var el = $("pager");
    if (!el || current.type !== "chapter") return;
    var i = chapters.indexOf(current);
    var prev = i > 0 ? { p: chapters[i - 1], t: chapterLabel(chapters[i - 1]) } : { p: home, t: "Inicio" };
    var nextPage = extras[0];
    var next = i < chapters.length - 1 ? { p: chapters[i + 1], t: chapterLabel(chapters[i + 1]) } : (nextPage ? { p: nextPage, t: nextPage.title } : null);
    var h = '<a class="prev" href="' + prev.p.file + '" rel="prev"><span class="dir">← Anterior</span><span class="ttl">' + esc(prev.t) + "</span></a>";
    if (next) h += '<a class="next" href="' + next.p.file + '" rel="next"><span class="dir">Siguiente →</span><span class="ttl">' + esc(next.t) + "</span></a>";
    el.innerHTML = h;
  }

  function renderCards() {
    var el = $("chapter-cards");
    if (!el) return;
    var h = "";
    chapters.forEach(function (p) {
      var n = pad(p.num);
      h += '<li class="card"><a href="' + p.file + '"><span class="card__num" aria-hidden="true">' + n.charAt(0) + '<span class="sw">' + n.charAt(1) + "</span></span>" +
           '<span class="card__title">' + esc(p.title) + "</span>" +
           '<span class="card__sum">' + esc(p.summary || "") + "</span></a></li>";
    });
    el.innerHTML = h;
  }

  function renderFooter() {
    var el = $("site-footer");
    if (!el) return;
    el.innerHTML = "<span>" + esc(SITE.title) + "</span><span>" + esc(SITE.footer) + "</span>";
  }

  /* -------------------------------------------------------------------
     6. PANEL MÓVIL (hamburguesa)
     ------------------------------------------------------------------- */
  function setupMenu() {
    var btn = $("menu-toggle"), nav = $("site-nav");
    if (!btn || !nav) return;
    var overlay = document.createElement("div");
    overlay.className = "nav-overlay";
    overlay.setAttribute("aria-hidden", "true");
    document.body.appendChild(overlay);
    var mq = window.matchMedia("(max-width: 1023.98px)");

    function open() {
      document.body.classList.add("nav-open");
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-label", "Cerrar menú");
      var first = nav.querySelector("a");
      if (first) setTimeout(function () { first.focus(); }, 30);
    }
    function close(returnFocus) {
      if (!document.body.classList.contains("nav-open")) return;
      document.body.classList.remove("nav-open");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Abrir menú");
      if (returnFocus) btn.focus();
    }
    btn.addEventListener("click", function () { document.body.classList.contains("nav-open") ? close(true) : open(); });
    overlay.addEventListener("click", function () { close(true); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(true); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a") && mq.matches) close(false); });
    (mq.addEventListener ? mq.addEventListener("change", function () { close(false); }) : mq.addListener(function () { close(false); }));
  }

  /* -------------------------------------------------------------------
     7. SCROLLSPY (sección activa del índice)
     ------------------------------------------------------------------- */
  function setupScrollspy() {
    if (!sections.length || !("IntersectionObserver" in window)) return;
    var links = {};
    Array.prototype.forEach.call(document.querySelectorAll(".toc a"), function (a) { links[a.getAttribute("href").slice(1)] = a; });
    function activate(id) {
      Object.keys(links).forEach(function (k) {
        links[k].classList.toggle("is-active", k === id);
        if (k === id) links[k].setAttribute("aria-current", "location"); else links[k].removeAttribute("aria-current");
      });
    }
    // La sección activa es la última cuyo título ya pasó el tercio superior
    // de la ventana; al llegar al final de la página se activa la última.
    function compute() {
      var line = window.innerHeight * 0.35, active = sections[0];
      sections.forEach(function (s) { if (s.getBoundingClientRect().top <= line) active = s; });
      if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 2) active = sections[sections.length - 1];
      activate(active.id);
    }
    var io = new IntersectionObserver(compute, { rootMargin: "0px 0px -65% 0px", threshold: [0, 1] });
    sections.forEach(function (s) { io.observe(s); });
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () { ticking = false; compute(); });
    }, { passive: true });
    compute();
  }

  /* -------------------------------------------------------------------
     8. ENLACES EXTERNOS → pestaña nueva
     ------------------------------------------------------------------- */
  function externalLinks() {
    Array.prototype.forEach.call(document.querySelectorAll('main a[href^="http"]'), function (a) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    });
  }

  /* -------------------------------------------------------------------
     INICIO
     ------------------------------------------------------------------- */
  renderNav();
  renderBreadcrumbs();
  renderIndicator();
  renderPager();
  renderCards();
  renderFooter();
  setupMenu();
  setupScrollspy();
  externalLinks();
})();
