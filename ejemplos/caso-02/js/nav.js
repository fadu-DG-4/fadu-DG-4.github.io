/**
 * nav.js · Árboles nativos de la Argentina
 * Sistema unificado de navegación y configuración para sitio estático standalone (file:// compatible).
 * Maneja menú lateral de escritorio, panel deslizable móvil, migas de pan,
 * paginación anterior/siguiente, índice "En esta página" con scrollspy y tarjetas de portada.
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. ARREGLO DE CONFIGURACIÓN (Fuente única de la estructura del sitio)
     ========================================================================== */
  const SITE_CONFIG = {
    title: "Árboles nativos de la Argentina",
    shortTitle: "Árboles nativos",
    academicInfo: "FADU UBA · DG4 · Cátedra Meygide-Carpintero",
    version: "v1.0 // 2026",
    
    // Lista ordenada de todas las páginas del sitio
    pages: [
      {
        id: "inicio",
        file: "index.html",
        title: "Inicio",
        navLabel: "Inicio",
        chapterNum: null,
        chapterIndex: null,
        type: "portada",
        summary: "Presentación del informe sobre árboles nativos de la Argentina, sus ambientes y su valor en los paisajes urbanos."
      },
      {
        id: "capitulo-01",
        file: "capitulo-01.html",
        title: "Capítulo 1 · Introducción",
        navLabel: "01 · Introducción",
        chapterNum: "01",
        chapterIndex: 1,
        type: "capitulo",
        summary: "Qué entendemos por especie nativa, diferencias con especies exóticas e invasoras, y los beneficios ecológicos del arbolado urbano."
      },
      {
        id: "capitulo-02",
        file: "capitulo-02.html",
        title: "Capítulo 2 · Regiones y paisajes",
        navLabel: "02 · Regiones y paisajes",
        chapterNum: "02",
        chapterIndex: 2,
        type: "capitulo",
        summary: "Diversidad de ambientes fitogeográficos de la Argentina, tabla comparativa de especies representativas y el caso del pastizal pampeano."
      },
      {
        id: "capitulo-03",
        file: "capitulo-03.html",
        title: "Capítulo 3 · Especies destacadas",
        navLabel: "03 · Especies destacadas",
        chapterNum: "03",
        chapterIndex: 3,
        type: "capitulo",
        summary: "Relevamiento morfológico y paisajístico de tres especies clave: ceibo, lapacho rosado y algarrobo."
      },
      {
        id: "capitulo-04",
        file: "capitulo-04.html",
        title: "Capítulo 4 · Conclusiones",
        navLabel: "04 · Conclusiones",
        chapterNum: "04",
        chapterIndex: 4,
        type: "capitulo",
        summary: "Principales hallazgos sobre la presencia de flora nativa en la ciudad y preguntas abiertas para el diseño de la información."
      },
      {
        id: "referencias",
        file: "referencias.html",
        title: "Referencias",
        navLabel: "Referencias",
        chapterNum: null,
        chapterIndex: null,
        type: "secundaria",
        summary: "Fuentes bibliográficas e instituciones científicas consultadas para el desarrollo del informe."
      },
      {
        id: "acerca",
        file: "acerca.html",
        title: "Acerca del proyecto",
        navLabel: "Acerca del proyecto",
        chapterNum: null,
        chapterIndex: null,
        type: "secundaria",
        summary: "Contexto académico, equipo de investigación y propuesta del Trabajo Práctico de Diseño Gráfico 4."
      }
    ]
  };

  // Cantidad total de capítulos
  const totalChapters = SITE_CONFIG.pages.filter(p => p.type === "capitulo").length;

  /* ==========================================================================
     2. DETECCIÓN DE LA PÁGINA ACTUAL (Compatible con file:// y servidores)
     ========================================================================== */
  function getCurrentPage() {
    const fullPath = window.location.pathname;
    let fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1) || 'index.html';
    // Limpiar posibles parámetros o hash si los hubiera
    fileName = fileName.split('?')[0].split('#')[0] || 'index.html';

    const match = SITE_CONFIG.pages.find(p => p.file.toLowerCase() === fileName.toLowerCase());
    return match || SITE_CONFIG.pages[0]; // fallback a portada
  }

  const currentPage = getCurrentPage();

  /* ==========================================================================
     3. CONSTRUCCIÓN DEL MENÚ DE NAVEGACIÓN (Escritorio y Móvil)
     ========================================================================== */
  function buildNavHTML(isMobile = false) {
    const prefix = isMobile ? 'mob-' : 'dsk-';
    let html = '';

    // Agrupaciones: Inicio, Capítulos, Secciones secundarias
    const inicioPage = SITE_CONFIG.pages.find(p => p.id === 'inicio');
    const capitulos = SITE_CONFIG.pages.filter(p => p.type === 'capitulo');
    const secundarias = SITE_CONFIG.pages.filter(p => p.type === 'secundaria');

    html += `<div class="nav-menu">`;

    // 1. Grupo Inicio
    html += `
      <ul class="nav-list" role="list">
        <li class="nav-item">
          <a href="${inicioPage.file}" 
             class="nav-link ${currentPage.file === inicioPage.file ? 'is-current' : ''}" 
             ${currentPage.file === inicioPage.file ? 'aria-current="page"' : ''}>
             ${inicioPage.navLabel}
          </a>
        </li>
      </ul>
    `;

    // 2. Grupo Capítulos
    html += `
      <div class="nav-group">
        <div class="nav-group-title">// Capítulos</div>
        <ul class="nav-list" role="list">
    `;

    capitulos.forEach(cap => {
      const isCurrent = (currentPage.file === cap.file);
      html += `
        <li class="nav-item">
          <a href="${cap.file}" 
             class="nav-link ${isCurrent ? 'is-current' : ''}" 
             ${isCurrent ? 'aria-current="page"' : ''}>
             ${cap.navLabel}
          </a>
      `;

      // Si es el capítulo activo, incrustamos el contenedor para el índice "En esta página"
      if (isCurrent) {
        html += `<div class="toc-container" id="${prefix}toc-container"></div>`;
      }

      html += `</li>`;
    });

    html += `
        </ul>
      </div>
    `;

    // 3. Grupo Información complementaria (Referencias y Acerca)
    html += `
      <div class="nav-group">
        <div class="nav-group-title">// Información</div>
        <ul class="nav-list" role="list">
    `;

    secundarias.forEach(sec => {
      const isCurrent = (currentPage.file === sec.file);
      html += `
        <li class="nav-item">
          <a href="${sec.file}" 
             class="nav-link ${isCurrent ? 'is-current' : ''}" 
             ${isCurrent ? 'aria-current="page"' : ''}>
             ${sec.navLabel}
          </a>
        </li>
      `;
    });

    html += `
        </ul>
      </div>
    </div>
    `;

    return html;
  }

  /* ==========================================================================
     4. ÍNDICE "EN ESTA PÁGINA" Y SCROLLSPY (IntersectionObserver)
     ========================================================================== */
  function setupInPageTOC() {
    // Buscar los encabezados con ID dentro de main
    const main = document.querySelector('main');
    if (!main) return;

    // Secciones identificadas por h3 o h2 con atributo id
    const headings = Array.from(main.querySelectorAll('h2[id], h3[id]'));
    if (headings.length === 0) return;

    // Crear lista HTML para el TOC
    let tocListHTML = `<div class="toc-title">En esta página</div><ul class="toc-list" role="list">`;
    headings.forEach(h => {
      const cleanText = h.textContent.replace(/^\/\/\s*/, '').trim();
      tocListHTML += `
        <li>
          <a href="#${h.id}" class="toc-link" data-target="${h.id}">
            ${cleanText}
          </a>
        </li>
      `;
    });
    tocListHTML += `</ul>`;

    // Inyectar en los contenedores de TOC (tanto escritorio como móvil)
    ['dsk-toc-container', 'mob-toc-container'].forEach(id => {
      const container = document.getElementById(id);
      if (container) {
        container.innerHTML = tocListHTML;
      }
    });

    // Desplazamiento suave al hacer clic en enlaces del TOC
    const tocLinks = document.querySelectorAll('.toc-link');
    tocLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          
          // Si estamos en móvil, cerramos el drawer
          closeMobileDrawer();

          const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          targetEl.scrollIntoView({
            behavior: prefersReduced ? 'auto' : 'smooth',
            block: 'start'
          });

          // Poner foco para accesibilidad
          targetEl.setAttribute('tabindex', '-1');
          targetEl.focus({ preventScroll: true });

          // Actualizar URL sin pushState (usando hash seguro)
          window.location.hash = targetId;
        }
      });
    });

    // Configurar IntersectionObserver para resaltar la sección activa durante el scroll
    if ('IntersectionObserver' in window) {
      const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60% 0px',
        threshold: 0
      };

      let visibleHeadings = new Set();

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            visibleHeadings.add(entry.target.id);
          } else {
            visibleHeadings.delete(entry.target.id);
          }
        });

        // Seleccionar la sección visible más prioritaria
        if (visibleHeadings.size > 0) {
          // El primero de la lista de headings que esté en visibleHeadings
          const currentVisible = headings.find(h => visibleHeadings.has(h.id));
          if (currentVisible) {
            highlightTOCSection(currentVisible.id);
          }
        }
      }, observerOptions);

      headings.forEach(h => observer.observe(h));
    }
  }

  function highlightTOCSection(sectionId) {
    const tocLinks = document.querySelectorAll('.toc-link');
    tocLinks.forEach(link => {
      const target = link.getAttribute('data-target');
      if (target === sectionId) {
        link.classList.add('is-active-section');
        link.setAttribute('aria-current', 'true');
      } else {
        link.classList.remove('is-active-section');
        link.removeAttribute('aria-current');
      }
    });
  }

  /* ==========================================================================
     5. MIGAS DE PAN (Breadcrumbs)
     ========================================================================== */
  function renderBreadcrumbs() {
    const el = document.getElementById('breadcrumbs');
    if (!el) return;

    if (currentPage.type === 'portada') {
      el.innerHTML = '';
      return;
    }

    let crumbs = `<nav aria-label="Migas de pan" class="breadcrumbs">`;
    crumbs += `<a href="index.html">Inicio</a>`;
    crumbs += `<span class="sep" aria-hidden="true">›</span>`;

    if (currentPage.type === 'capitulo') {
      crumbs += `<span>Capítulos</span>`;
      crumbs += `<span class="sep" aria-hidden="true">›</span>`;
      crumbs += `<span class="current" aria-current="page">${currentPage.navLabel}</span>`;
    } else {
      crumbs += `<span class="current" aria-current="page">${currentPage.title}</span>`;
    }

    crumbs += `</nav>`;
    el.innerHTML = crumbs;
  }

  /* ==========================================================================
     6. INDICADOR DE CAPÍTULO ("Capítulo N de M")
     ========================================================================== */
  function renderChapterIndicator() {
    const el = document.getElementById('chapter-indicator');
    if (!el) return;

    if (currentPage.type === 'capitulo' && currentPage.chapterIndex) {
      el.innerHTML = `
        <div class="chapter-badge-wrap">
          <span class="chapter-badge">Capítulo ${currentPage.chapterIndex} de ${totalChapters}</span>
        </div>
      `;
    } else {
      el.innerHTML = '';
    }
  }

  /* ==========================================================================
     7. PAGINACIÓN ANTERIOR / SIGUIENTE (Pager)
     ========================================================================== */
  function renderPager() {
    const el = document.getElementById('pager');
    if (!el) return;

    if (currentPage.type === 'portada') {
      el.innerHTML = '';
      return;
    }

    const currentIndex = SITE_CONFIG.pages.findIndex(p => p.file === currentPage.file);
    if (currentIndex === -1) return;

    let prevPage = null;
    let nextPage = null;

    if (currentPage.type === 'capitulo') {
      // El capítulo 1 tiene de "Anterior" el Inicio
      if (currentPage.chapterIndex === 1) {
        prevPage = SITE_CONFIG.pages.find(p => p.id === 'inicio');
      } else {
        prevPage = SITE_CONFIG.pages[currentIndex - 1];
      }

      // El último capítulo tiene de "Siguiente" Referencias
      if (currentPage.chapterIndex === totalChapters) {
        nextPage = SITE_CONFIG.pages.find(p => p.id === 'referencias');
      } else {
        nextPage = SITE_CONFIG.pages[currentIndex + 1];
      }
    } else if (currentPage.id === 'referencias') {
      // Referencias: anterior es el último capítulo; siguiente es Acerca del proyecto
      prevPage = SITE_CONFIG.pages.find(p => p.chapterIndex === totalChapters);
      nextPage = SITE_CONFIG.pages.find(p => p.id === 'acerca');
    } else if (currentPage.id === 'acerca') {
      // Acerca: anterior es Referencias; siguiente es Inicio
      prevPage = SITE_CONFIG.pages.find(p => p.id === 'referencias');
      nextPage = SITE_CONFIG.pages.find(p => p.id === 'inicio');
    }

    let pagerHTML = `<nav aria-label="Navegación entre capítulos" class="pager-nav">`;

    if (prevPage) {
      pagerHTML += `
        <a href="${prevPage.file}" class="pager-link is-prev" rel="prev">
          <span class="pager-label">← Anterior</span>
          <span class="pager-title">${prevPage.title}</span>
        </a>
      `;
    } else {
      pagerHTML += `<div></div>`;
    }

    if (nextPage) {
      pagerHTML += `
        <a href="${nextPage.file}" class="pager-link is-next" rel="next">
          <span class="pager-label">Siguiente →</span>
          <span class="pager-title">${nextPage.title}</span>
        </a>
      `;
    }

    pagerHTML += `</nav>`;
    el.innerHTML = pagerHTML;
  }

  /* ==========================================================================
     8. TARJETAS DE CAPÍTULOS DE LA PORTADA (index.html)
     ========================================================================== */
  function renderChapterCards() {
    const container = document.getElementById('chapter-cards');
    if (!container) return;

    const capitulos = SITE_CONFIG.pages.filter(p => p.type === 'capitulo');
    let cardsHTML = `<div class="grid-capitulos">`;

    capitulos.forEach(cap => {
      cardsHTML += `
        <a href="${cap.file}" class="tarjeta-capitulo" aria-label="Ir al ${cap.title}">
          <div class="tarjeta-header">
            <span>SECCIÓN // ${cap.chapterNum}</span>
            <span aria-hidden="true">[+]</span>
          </div>
          <div class="tarjeta-cuerpo">
            <span class="tarjeta-numero">Capítulo ${cap.chapterIndex} de ${totalChapters}</span>
            <h2 class="tarjeta-titulo">${cap.title.replace(/^Capítulo\s*\d+\s*·\s*/, '')}</h2>
            <p class="tarjeta-resumen">${cap.summary}</p>
            <div class="tarjeta-footer">
              <span>Leer capítulo</span>
              <span aria-hidden="true">→</span>
            </div>
          </div>
        </a>
      `;
    });

    cardsHTML += `</div>`;
    container.innerHTML = cardsHTML;
  }

  /* ==========================================================================
     9. GESTIÓN DEL MENÚ MÓVIL (Accesibilidad y foco)
     ========================================================================== */
  let lastFocusedElement = null;

  function openMobileDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    const toggleBtn = document.getElementById('menu-toggle');
    if (!drawer || !backdrop) return;

    lastFocusedElement = document.activeElement;
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    document.body.classList.add('menu-is-open');

    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.setAttribute('aria-label', 'Cerrar menú');
      toggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      `;
    }

    // Poner foco en el primer enlace interactivo del panel
    setTimeout(() => {
      const firstFocusable = drawer.querySelector('button, a[href]');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }, 50);
  }

  function closeMobileDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    const toggleBtn = document.getElementById('menu-toggle');
    if (!drawer || !backdrop) return;

    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    document.body.classList.remove('menu-is-open');

    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Abrir menú');
      toggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      `;
    }

    // Devolver el foco al botón disparador
    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  function setupMobileMenu() {
    const toggleBtn = document.getElementById('menu-toggle');
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    const closeBtn = document.getElementById('mobile-drawer-close');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          closeMobileDrawer();
        } else {
          openMobileDrawer();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMobileDrawer);
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeMobileDrawer);
    }

    // Cerrar con tecla Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        const drawer = document.getElementById('mobile-drawer');
        if (drawer && drawer.classList.contains('is-open')) {
          closeMobileDrawer();
        }
      }
    });

    // Cerrar al hacer clic en enlaces dentro del panel móvil
    const drawer = document.getElementById('mobile-drawer');
    if (drawer) {
      drawer.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
          closeMobileDrawer();
        }
      });
    }
  }

  /* ==========================================================================
     10. REGLA TÉCNICA LATERAL (Motivo gráfico extraído de la referencia)
     ========================================================================== */
  function renderTechnicalRuler() {
    const ruler = document.getElementById('technical-ruler');
    if (!ruler) return;

    let html = `<span class="ruler-cross" aria-hidden="true">[+]</span>`;
    for (let i = 1; i <= 38; i++) {
      html += `<span class="ruler-num" aria-hidden="true">${i}</span>`;
    }
    ruler.innerHTML = html;
  }

  /* ==========================================================================
     11. INICIALIZACIÓN GENERAL AL CARGAR EL DOM
     ========================================================================== */
  function init() {
    // 1. Inyectar menú lateral de escritorio si existe el contenedor #site-nav
    const desktopNavContainer = document.getElementById('site-nav');
    if (desktopNavContainer) {
      desktopNavContainer.innerHTML = buildNavHTML(false);
    }

    // 2. Inyectar menú en el panel deslizable móvil si existe #mobile-nav-content
    const mobileNavContent = document.getElementById('mobile-nav-content');
    if (mobileNavContent) {
      mobileNavContent.innerHTML = buildNavHTML(true);
    }

    // 3. Renderizar componentes auxiliares
    renderBreadcrumbs();
    renderChapterIndicator();
    renderPager();
    renderChapterCards();
    renderTechnicalRuler();

    // 4. Configurar índice "En esta página" y observadores
    setupInPageTOC();

    // 5. Configurar eventos de menú móvil
    setupMobileMenu();
  }

  // Ejecución segura con defer o DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
