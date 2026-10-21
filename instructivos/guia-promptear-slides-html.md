# ¿Cómo generar una presentación como un sitio web estático con IA?

> Cómo usarlo: adjuntá **dos archivos** junto con este prompt: (1) el archivo **.md** con los contenidos y (2) una **imagen de referencia** para los estilos visuales. Copiá todo lo que está debajo de la línea y pegalo en Claude,  ChatGPT, Antigravity u otro.

---

Necesito que generes una **presentación de slides en formato HTML** a partir de los archivos adjuntos:

1. **Un archivo Markdown (.md):** es la fuente de **todos los contenidos** de la presentación.
2. **Una imagen de referencia:** es la fuente de **todos los estilos visuales** de la presentación.

## 1. Entregable

- Un **único archivo `index.html`** autocontenido: HTML, CSS y JavaScript en el mismo archivo (`<style>` y `<script>` embebidos).
- Tiene que funcionar como un **sitio autocontenido e independiente (*standalone*)**: se abre **haciendo doble clic en el archivo** y se ve en el navegador, sin servidor, sin *deploy*, sin instalación, sin compilación ni ningún paso previo.
- **No usar ninguna librería ni framework** (nada de React, Vue, Reveal.js, Tailwind, jQuery, Bootstrap, etc.) ni CDNs. Solo HTML, CSS y JavaScript nativos.
- Tiene que funcionar **sin conexión a internet**. Si usás una tipografía web, debe haber una alternativa del sistema definida (`font-family` con *fallback*) para que la presentación se vea correctamente aunque la fuente no cargue.
- Gráficos, íconos e ilustraciones: hacelos con **SVG embebido en el propio HTML** o con CSS. No dependas de archivos de imagen externos, salvo las imágenes que el propio .md referencie (en ese caso, usá exactamente la misma ruta relativa que figura en el .md).

### Restricciones por abrirse como archivo local (`file://`)

Al abrirse con doble clic, la página corre bajo el protocolo `file://`, donde el navegador bloquea varias cosas. Por lo tanto:

- **No** usar `fetch()` ni `XMLHttpRequest` para cargar archivos. El contenido del .md tiene que quedar **escrito dentro del HTML**, no leerse en tiempo de ejecución.
- **No** usar módulos de JavaScript (`<script type="module">`, `import`/`export`).
- **No** usar `history.pushState` ni `history.replaceState`: en `file://` Chrome los bloquea y lanza un error. Si querés reflejar el número de slide en la URL, usá solo `location.hash`, o directamente no lo hagas.
- No depender de *service workers*, `localStorage` obligatorio ni nada que requiera un servidor.

## 2. Formato de las slides

- **Orientación horizontal y proporción fija 16:9.**
- Las slides deben **ocupar todo el espacio posible del *viewport*** manteniendo siempre la proporción 16:9 (*letterbox*: si la ventana es más ancha o más alta que 16:9, la slide se centra y sobra espacio solo en un eje).
- Deben **adaptarse al redimensionar la ventana** (evento `resize`) y verse completas y centradas en cualquier tamaño: notebooks de 1366×768, monitores de 1920×1080, pantallas grandes y celulares.
- Técnica recomendada:
  - diseñar cada slide sobre un **lienzo fijo de 1920×1080 px**;
  - escalarlo con JavaScript usando `scale = Math.min(anchoVentana/1920, altoVentana/1080)`;
  - posicionar el lienzo con `position:absolute; left:50%; top:50%; transform: translate(-50%,-50%) scale(scale)`.

  Así la tipografía y la composición escalan juntas y nunca se deforman.
- **Cuidado con el centrado:** no centres el lienzo con Grid o Flexbox (`place-items:center`) cuando es más grande que la ventana. Con ese método la slide queda corrida hacia un lado en pantallas menores a 1920 px. Usá el posicionamiento absoluto descrito arriba.
- No debe haber *scroll* en la página: `overflow:hidden` en `html` y `body`.
- Ningún texto puede desbordar ni quedar cortado dentro de su slide. Si un bloque es muy largo, ajustá el tamaño de letra o dividilo en más de una slide.

## 3. Navegación

Incluí controles para recorrer las slides:

- **Teclado:**
  - → / Av Pág / barra espaciadora: slide siguiente;
  - ← / Re Pág: slide anterior;
  - Inicio / Fin: primera y última slide;
  - F: pantalla completa (opcional).

  Si el foco está sobre un enlace o un botón, Enter y la barra espaciadora deben activar ese elemento y no cambiar de slide.
- **Controles en pantalla:** botones "anterior" y "siguiente", un indicador de posición (por ejemplo, `03 / 10`) y, si es posible, indicadores clicables para saltar a cualquier slide.
  - Que sean discretos, que no tapen el contenido y que mantengan el estilo de la presentación.
  - Pueden aparecer al mover el mouse, pero deben estar siempre visibles en dispositivos táctiles.
- **Táctil:** deslizar el dedo a izquierda o derecha cambia de slide.
- **Progreso:** una barra o indicador del avance en la presentación.
- **Transición:** suave y breve entre slides (por ejemplo, un fundido de 0.3 a 0.5 s).
- Opcional: un botón de pantalla completa (`requestFullscreen`).

## 4. Contenidos (archivo .md)

- **Todo el contenido debe salir del .md adjunto.** No inventes información, datos, fechas, nombres ni conclusiones que no estén en el archivo.
- Organizá el contenido en slides con criterio de presentación:
  - una idea principal por slide;
  - títulos claros;
  - textos que se puedan leer a distancia.

  Podés **sintetizar** párrafos largos para que entren en una slide, siempre que se mantenga el sentido. Cuando el .md tenga un texto que deba citarse tal cual (una consigna, una definición, una pregunta), respetalo literalmente.
- Usá la estructura del .md como guía:
  - los títulos `#` y `##` sugieren las secciones o slides;
  - las listas y tablas pueden convertirse en grillas, columnas o diagramas;
  - las citas `>` pueden convertirse en recuadros destacados;
  - los enlaces deben seguir funcionando y abrirse en una pestaña nueva (`target="_blank" rel="noopener"`).
- Incluí una **slide de portada** y una **slide de cierre**, armadas con información que esté en el .md.
- Respetá el idioma y la ortografía del .md, incluidos tildes y signos de apertura (¿ ¡).

## 5. Estilos visuales (imagen de referencia)

No te doy especificaciones de estilo: **extraelas de la imagen de referencia adjunta y emulala.** Analizala con atención e identificá:

- **Paleta de color:** fondo, tinta o tintas principales, colores de acento y valores aproximados en hexadecimal. Si la imagen es monocromática, mantené la monocromía.
- **Tipografía:** familia o estilo (serif, sans, monoespaciada, condensada…), pesos, uso de mayúsculas, espaciado entre letras, contraste de tamaños entre títulos y textos, y el tipo de interlineado. Elegí la tipografía disponible (del sistema o web con *fallback*) que más se acerque.
- **Retícula y composición:** márgenes, columnas, módulos, alineaciones, uso del espacio vacío y cómo se distribuyen los bloques.
- **Recursos gráficos:** líneas, filetes, marcos, grillas, texturas, formas, íconos, tipos de ilustración o gráficos, patrones y detalles característicos.
- **Tono general:** técnico, editorial, lúdico, minimalista, etc.

Con eso:

- Definí el sistema visual en **variables CSS** (`:root`) y aplicalo de forma consistente en todas las slides.
- Diseñá cada slide con una composición propia pero coherente con las demás. Evitá que todas sean "título + viñetas". Usá la retícula y los recursos gráficos de la referencia para que se reconozca el mismo lenguaje.
- Si la referencia tiene ilustraciones o gráficos, creá **ilustraciones propias en SVG** con el mismo lenguaje visual, vinculadas al contenido de cada slide. Si usás aleatoriedad, que sea con una semilla fija para que el resultado sea siempre el mismo.
- **Emulá el estilo, no copies la pieza:** no reproduzcas los textos, logos ni elementos identificatorios que aparecen en la imagen de referencia.
- Asegurá un buen **contraste** de lectura: como mínimo el nivel AA de WCAG para el texto.

## 6. Calidad del código

- Código ordenado y comentado por secciones: variables, estructura de slides, estilos, navegación y escalado.
- Cada slide en un elemento propio (por ejemplo `<section class="slide">`), fácil de editar a mano para cambiar textos.
- Sin errores en la consola del navegador.
- Al imprimir (`@media print`), ocultar los controles de navegación.

## 7. Verificación antes de entregar

Al final, entregame el archivo `index.html` completo y un resumen breve con:

1. la lista de slides con el título de cada una;
2. las decisiones de estilo que extrajiste de la imagen (paleta, tipografías, recursos gráficos);
3. cómo se navega la presentación.
