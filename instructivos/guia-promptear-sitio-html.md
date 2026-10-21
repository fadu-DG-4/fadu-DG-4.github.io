# ¿Cómo generar un sitio web estático con IA?

> Cómo usarlo: adjuntá **dos archivos** junto con este prompt: (1) el archivo **.md** con los contenidos de la investigación y (2) una **imagen de referencia** para los estilos visuales. Copiá todo lo que está debajo de la línea y pegalo en Claude, ChatGPT, Antigravity u otro. El resultado es una **primera versión** del sitio, pensada para seguir iterando.

---

Necesito que generes la **versión inicial de un sitio web estático** que publique los resultados de una investigación, a partir de los archivos adjuntos:

1. **Un archivo Markdown (.md):** es la fuente de **todos los contenidos** del sitio.
2. **Una imagen de referencia:** es la fuente de **todos los estilos visuales** del sitio.

No busco un sitio terminado, sino una **base sólida**: la estructura de archivos, la navegación completa, las páginas iniciales con el contenido disponible y los estilos aplicados. En iteraciones siguientes voy a ir sumando y refinando contenidos e imágenes, así que el código tiene que ser fácil de ampliar.

## 1. Requisitos técnicos

- **Sitio autocontenido e independiente (*standalone*):** se abre **haciendo doble clic en `index.html`** y se navega en el navegador, sin servidor, sin *deploy*, sin instalación, sin compilación ni ningún paso previo.
- **Solo HTML, CSS y JavaScript nativos.** No usar librerías, frameworks ni CDNs (nada de React, Vue, Astro, Tailwind, Bootstrap, jQuery, generadores de sitios estáticos, etc.).
- Tiene que funcionar **sin conexión a internet**. Si usás una tipografía web, definí una alternativa del sistema (`font-family` con *fallback*) para que el sitio se vea bien aunque la fuente no cargue.
- Íconos y gráficos simples (como el ícono de menú): en **SVG embebido** o CSS, sin archivos externos.

### Restricciones por abrirse como archivo local (`file://`)

Al abrirse con doble clic, las páginas corren bajo el protocolo `file://`, donde el navegador bloquea varias cosas. Por lo tanto:

- **No** usar `fetch()` ni `XMLHttpRequest` para cargar contenidos, menús ni fragmentos de HTML. Cada página tiene que tener su contenido **escrito en su propio HTML**.
- **No** usar módulos de JavaScript (`<script type="module">`, `import`/`export`). Los scripts se cargan con `<script src="…" defer>` común.
- **No** usar `history.pushState` ni `history.replaceState`.
- Sí se pueden usar, porque funcionan en `file://`:
  - enlaces relativos entre páginas HTML;
  - una hoja de estilos compartida (`<link rel="stylesheet" href="…">`);
  - un JavaScript compartido (`<script src="…">`);
  - imágenes con rutas relativas;
  - `IntersectionObserver`.
- **Todas las rutas deben ser relativas** (`capitulo-01.html`, `css/estilos.css`), nunca absolutas (`/capitulo-01.html`), porque las absolutas se rompen al abrir desde una carpeta local.

## 2. Estructura de archivos

Organizá el sitio con una estructura **plana y simple**: todas las páginas HTML en la raíz, para que las rutas relativas sean siempre las mismas.

```
sitio/
├── index.html            ← portada
├── capitulo-01.html      ← un archivo por capítulo
├── capitulo-02.html
├── capitulo-0N.html
├── referencias.html      ← fuentes y bibliografía
├── acerca.html           ← sobre el proyecto y el equipo
├── css/
│   └── estilos.css       ← todos los estilos del sitio
├── js/
│   └── nav.js            ← navegación compartida
├── img/                  ← carpeta vacía para imágenes futuras
└── README.md             ← cómo está armado el sitio y cómo ampliarlo
```

- **Capítulos:** la cantidad sale del .md. Se trata de una investigación breve, con **pocos capítulos (entre 3 y 6 aproximadamente)**. Usá los títulos `##` del .md (o la estructura equivalente que tenga) para definirlos. Si el .md no tiene una división clara, proponé una agrupación lógica de sus contenidos.
- **`referencias.html` y `acerca.html`:** creálos solo si el .md tiene contenido para ellos (fuentes, bibliografía, autores, equipo, contexto del proyecto). Si no lo tiene, creá igual las páginas con la estructura lista y el contenido marcado claramente como pendiente (ver punto 5).
- No agregues secciones que un informe breve no necesita: nada de blog, noticias, talleres, eventos, buscador ni formularios.

## 3. Navegación

### 3.1 Patrón general

La navegación sigue el patrón de una **guía o informe por capítulos**:

- un **menú lateral fijo a la izquierda**, presente en todas las páginas;
- el contenido de cada página a la derecha;
- en las páginas de capítulo, herramientas para orientarse dentro de la página y para pasar al capítulo anterior o siguiente.

### 3.2 Menú lateral izquierdo (escritorio)

- **Fijo** (*sticky*) a la izquierda: queda visible al hacer *scroll* en el contenido. Si el menú es más alto que la ventana, tiene su propio *scroll*.
- Arriba, el **título del sitio** (o del informe), con un enlace a la portada.
- Debajo, la **lista de páginas** en este orden:
  1. **Inicio**
  2. **Capítulos**: un grupo con un subtítulo y la lista numerada de capítulos (`01 · Título`, `02 · Título`…)
  3. **Referencias**
  4. **Acerca del proyecto**
- **Página actual destacada** en el menú. Marcala también con `aria-current="page"`.
- **Índice de la página ("En esta página"):** en la página de un capítulo, debajo del capítulo activo en el menú, mostrá una sublista con las secciones internas del capítulo (los `###` del contenido), con enlaces de anclaje (`#seccion`).
  - Al hacer *scroll*, se resalta la sección que se está leyendo (*scrollspy* con `IntersectionObserver`).
  - Al hacer clic, la página se desplaza suavemente a esa sección.
  - Los títulos de sección necesitan un margen superior de anclaje (`scroll-margin-top`) para no quedar tapados.

### 3.3 Navegación dentro de cada capítulo

- **Migas de pan** arriba del título: `Inicio › Capítulos › 02 · Título del capítulo`.
- **Indicador de capítulo** junto al título: por ejemplo, "Capítulo 2 de 5".
- **Navegación "Anterior / Siguiente"** al final de cada capítulo, con el número y el título del capítulo de destino. El primer capítulo no tiene "anterior" (o enlaza a la portada) y el último no tiene "siguiente" (o enlaza a Referencias).
- Opcional: un enlace "Volver arriba" al final de los capítulos largos.

### 3.4 Portada (`index.html`)

- **Presentación del informe:** título, subtítulo o pregunta de investigación, y un párrafo introductorio, todo tomado del .md.
- **Índice visual de capítulos:** una tarjeta o bloque por capítulo con número, título y una o dos líneas de resumen sacadas del .md, cada uno con enlace a su página.
- **Un enlace destacado para empezar a leer** (al capítulo 1).

### 3.5 Diseño adaptable (*responsive*)

- **Escritorio** (a partir de unos 1024 px): menú lateral visible a la izquierda y contenido a la derecha, con un ancho de lectura cómodo (60-80 caracteres por línea).
- **Tablet y móvil** (por debajo de ese ancho):
  - el menú lateral se oculta y aparece una **barra superior** con el título del sitio y un **botón de menú con ícono de hamburguesa** (☰);
  - al tocarlo, el menú se abre como un **panel lateral deslizable desde la izquierda**, con una capa semitransparente sobre el contenido;
  - el ícono cambia a una ✕ para cerrar;
  - el panel muestra exactamente los mismos enlaces que el menú de escritorio, incluido el índice "En esta página".
- El panel móvil se cierra:
  - al tocar la ✕;
  - al tocar la capa de fondo;
  - al presionar Esc;
  - al elegir un enlace.
- Mientras el panel está abierto, el *scroll* del contenido de fondo queda bloqueado.
- Sin *scroll* horizontal en ningún ancho. Probar como mínimo a 375 px, 768 px, 1280 px y 1920 px.

### 3.6 Implementación de la navegación (una sola fuente)

Para que agregar o renombrar un capítulo sea simple, **el menú tiene que definirse en un único lugar**:

- `js/nav.js` contiene un **arreglo de configuración** con las páginas del sitio (archivo, título, número de capítulo y una línea de resumen). Con esos datos genera en cada página:
  - el menú lateral;
  - el panel móvil;
  - las migas de pan;
  - el indicador "Capítulo N de M";
  - los enlaces "Anterior / Siguiente";
  - el índice "En esta página", a partir de los `<h3>` (o `<h2>`) con `id` del contenido.
- Cada página HTML solo incluye contenedores vacíos con atributos o ids conocidos (por ejemplo `<nav id="site-nav"></nav>`, `<div id="breadcrumbs"></div>`, `<nav id="pager"></nav>`) y carga `js/nav.js` con `<script src="js/nav.js" defer>`.
- `nav.js` detecta la página actual por el nombre del archivo (`location.pathname`), que funciona tanto en `file://` como en un servidor.
- **Respaldo sin JavaScript:** incluí en cada página un enlace básico a `index.html` dentro de un `<noscript>`, para que nunca quede una página sin salida.
- Las tarjetas de capítulos de la portada pueden quedar escritas en el HTML o generarse desde el mismo arreglo; si se generan, mejor, para que haya una única fuente.

### 3.7 Accesibilidad de la navegación

- Estructura semántica en todas las páginas:
  - `<header>` para la barra móvil;
  - `<nav aria-label="Navegación principal">` para el menú lateral;
  - `<main>` para el contenido;
  - `<footer>` para el pie;
  - un solo `<h1>` por página y jerarquía de títulos ordenada.
- Un enlace "**Saltar al contenido**" al principio de cada página, visible al recibir el foco del teclado.
- Botón de hamburguesa como `<button>` real, con:
  - `aria-label` ("Abrir menú" / "Cerrar menú");
  - `aria-expanded`;
  - `aria-controls`.
- Al abrir el panel, el foco pasa al primer enlace del menú. Al cerrarlo, vuelve al botón.
- Todo debe poder recorrerse con el teclado, y el foco tiene que ser siempre visible.
- Respetar `prefers-reduced-motion`: sin animaciones de deslizamiento ni *scroll* suave si el usuario lo pide.

## 4. Plantilla de página

Todas las páginas de capítulo comparten la **misma estructura HTML**, para que crear una nueva sea copiar un archivo y cambiar su contenido:

```
<body>
  [enlace "Saltar al contenido"]
  [barra superior móvil con título + botón hamburguesa]
  [menú lateral / panel móvil (generado por nav.js)]
  <main>
    [migas de pan]
    [indicador "Capítulo N de M"]
    <h1>Título del capítulo</h1>
    [contenido: secciones con <h2>/<h3> con id, párrafos, listas, citas, tablas, figuras]
    [navegación Anterior / Siguiente]
  </main>
  [pie de página]
</body>
```

Dejá contemplados en el CSS los elementos que voy a usar al iterar, aunque todavía no estén en el contenido:

- títulos (`h1` a `h4`), párrafos, listas, citas destacadas (`blockquote`), tablas, código inline;
- **figuras con epígrafe** (`<figure>` + `<figcaption>`), con imágenes adaptables (`max-width:100%`);
- notas o recuadros de aviso;
- enlaces externos, que se abren en una pestaña nueva (`target="_blank" rel="noopener"`).

## 5. Contenidos (archivo .md)

- **Todo el contenido debe salir del .md adjunto.** No inventes datos, resultados, conclusiones, autores, fechas ni referencias.
- Pasá el contenido del .md a HTML respetando su estructura y su formato: títulos, negritas, cursivas, listas, tablas, citas, enlaces y código.
- En esta primera versión **podés trasladar el texto tal cual**; no hace falta reescribirlo.
- **Contenido pendiente:** si una página o sección de la estructura todavía no tiene contenido en el .md, dejala creada con su título y un bloque claramente identificado como pendiente. Por ejemplo, un recuadro con el texto `[Contenido pendiente: …]` que describa qué va ahí, con una clase CSS propia (`.pendiente`) para encontrarlo y reemplazarlo fácilmente después. No lo completes con texto inventado.
- Respetá el idioma y la ortografía del .md, incluidos tildes y signos de apertura (¿ ¡).
- Cada página debe tener su propio `<title>` (`Título de la página — Título del sitio`) y su `<meta name="description">` con una línea tomada del contenido.

## 6. Estilos visuales (imagen de referencia)

No te doy especificaciones de estilo: **extraelas de la imagen de referencia adjunta y emulala.** Analizá:

- la paleta de color;
- la tipografía (familia o estilo, pesos, mayúsculas, espaciado, jerarquía de tamaños);
- la retícula y la composición;
- los recursos gráficos (líneas, marcos, grillas, texturas, formas, íconos, ilustraciones);
- el tono general.

Con eso:

- Definí el sistema visual como **variables CSS** (`:root`) al principio de `css/estilos.css`: colores, tipografías, escala de tamaños, espaciados, grosores de línea y anchos máximos. Así se puede ajustar todo el sitio desde un solo lugar.
- Aplicá el estilo de manera consistente a todos los componentes: menú lateral, panel móvil, botón de hamburguesa, migas de pan, tarjetas de la portada, contenido, navegación "Anterior / Siguiente", recuadros de contenido pendiente y pie.
- Diseñá también los **estados interactivos** (*hover*, foco, página actual, sección activa del índice) con el mismo lenguaje visual.
- **Emulá el estilo, no copies la pieza:** no reproduzcas los textos, logos ni elementos identificatorios de la imagen de referencia.
- Asegurá un **contraste** de lectura de, como mínimo, el nivel AA de WCAG.

## 7. Calidad del código y documentación

- HTML semántico y válido, CSS ordenado por secciones comentadas (variables, base, estructura, navegación, contenido, componentes, adaptable, impresión) y JavaScript comentado.
- Sin errores en la consola del navegador.
- Estilos de impresión (`@media print`): ocultar el menú, el botón de hamburguesa y la navegación "Anterior / Siguiente", y dejar solo el contenido.
- **`README.md`** del sitio, breve, que explique:
  - la estructura de archivos;
  - **cómo agregar un capítulo nuevo** (copiar la plantilla y sumar la entrada en el arreglo de `nav.js`);
  - dónde se definen las variables de estilo;
  - cómo encontrar los bloques de contenido pendiente;
  - que el sitio se abre con doble clic en `index.html`.

## 8. Verificación antes de entregar

Al final, entregame **el contenido completo de cada archivo**, cada uno con su ruta, y un resumen breve con:

1. el mapa del sitio (páginas y capítulos, con su archivo);
2. las decisiones de estilo que extrajiste de la imagen (paleta, tipografías, recursos gráficos);
3. qué contenido quedó marcado como pendiente;
4. cómo agregar un capítulo nuevo.
