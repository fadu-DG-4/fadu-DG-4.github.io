# Estilos — DG4 · TP4 · Investigación, Diseño & IA

Este documento registra las decisiones gráficas y de construcción que se tomaron para las dos piezas digitales del TP4 de Diseño Gráfico 4 (Cátedra Meygide-Carpintero, FADU-UBA):

| Pieza | Archivo | Función |
|---|---|---|
| Presentación | `presentacion/index.html` | 10 slides 16:9 navegables para explicar el ejercicio en clase. |
| Guía completa | `markdown/dg4-26-tp4-guia-markdown.html` | Versión web, formateada, de la guía escrita en Markdown (`dg4-26-tp4-guia-markdown.md`). |

Ambas comparten un mismo sistema visual. Este documento sirve para mantenerlo, extenderlo a nuevas piezas o reconstruirlo desde cero.

---

## 1. Concepto y referencia

### 1.1 Punto de partida

La referencia visual fue un afiche de estética **plano técnico / *blueprint* impreso**. Sus rasgos:

- tinta azul ultramar única sobre papel crema;
- tipografía monoespaciada en mayúsculas, con metadatos dispuestos como en un rótulo técnico;
- grillas milimetradas, campos de puntos (*scatter plots*), gráficos de barras y curvas;
- módulos rectangulares separados por líneas finas;
- pequeños **cuadrados sólidos** en las intersecciones y vértices, como "manijas" de selección de un software de diseño.

### 1.2 Por qué esta estética

- **Diseño + datos + máquina.** La grilla, el gráfico y la tipografía de máquina de escribir/terminal remiten a la vez al dibujo técnico, a la visualización de información y al código: el cruce exacto entre diseño e IA que plantea el TP.
- **Laboratorio, no producto.** El lenguaje de "hoja de trabajo" refuerza la idea de laboratorio de investigación provisional, en lugar de una comunicación institucional cerrada o de marketing tecnológico. Esto acompaña la distancia crítica que pide la consigna.
- **Monocromía.** Una sola tinta obliga a jerarquizar con tamaño, peso, opacidad y densidad de línea, no con color. Esto mantiene la unidad entre piezas muy distintas (slides, ilustraciones, documento largo).

### 1.3 Principios generales

1. **Una tinta, un papel.** Todo es azul `#1d3fb8` sobre crema `#f2eee3`. Las variaciones son solo de opacidad.
2. **Línea antes que mancha.** Las ilustraciones se resuelven con trazos. Los rellenos plenos se reservan para acentos: etiquetas invertidas, cuadrados-manija y algunas barras.
3. **Todo sobre grilla.** La composición se organiza en celdas delimitadas por líneas de 1 a 1.5 px.
4. **Manijas en los nodos.** Los cruces de líneas importantes y los vértices llevan un cuadrado sólido de 10-11 px.
5. **Mayúsculas para estructura, minúsculas para lectura.** Títulos, etiquetas y metadatos van en mayúsculas espaciadas. Los párrafos van en caja baja.
6. **Ilustraciones generativas y deterministas.** Los gráficos se dibujan por código (SVG + JavaScript) con semillas fijas: siempre salen iguales, pero no son imágenes estáticas.

---

## 2. Color

### 2.1 Paleta (variables CSS)

| Variable | Valor | Uso |
|---|---|---|
| `--paper` | `#f2eee3` | Fondo de slide/hoja. Relleno "papel" que tapa líneas detrás (asientos de bancos, fachadas, etiquetas). Texto sobre botones azules. |
| `--paper-2` | `#ebe6d8` | Variante de papel (reservada, sin uso protagónico). |
| `--ink` | `#1d3fb8` | Tinta principal: texto, marcos, líneas fuertes, manijas, rellenos de acento. |
| `--ink-2` | `#4563c9` | Azul atenuado para texto secundario (`.muted`, enlaces sutiles, etiquetas de apoyo). |
| `--ink-soft` | `rgba(29,63,184,.38)` | Divisores internos entre celdas, líneas secundarias, sombras rayadas. |
| `--ink-faint` | `rgba(29,63,184,.14)` | Grillas de fondo, juntas del piso, líneas de construcción. |
| `--ink-ghost` | `rgba(29,63,184,.07)` | Veladuras de fondo: celda destacada, código inline, encabezado de tabla, *hover* de filas. |
| `--bg` | `#d9d4c6` | Color de "mesa" detrás de la hoja (fuera del área de slide/página). |

En los dibujos SVG se usan tres constantes equivalentes:
`INK = #1d3fb8`, `SOFT = rgba(29,63,184,.38)`, `FAINT = rgba(29,63,184,.16)`.

### 2.2 Reglas de uso

- **No hay segundo color.** Ni rojo de alerta ni verde de éxito: los avisos ("Nota", "Importante", "Objetivo") se distinguen con recuadros o etiquetas invertidas.
- **La jerarquía de línea va por opacidad:** `ink` (estructura principal) → `ink-soft` (divisiones) → `ink-faint` (grilla/fondo).
- **Inversión como énfasis.** Para el elemento más importante de un bloque se invierte la tinta: fondo azul y texto crema (`.tag.fill`, botones, *hover* de enlaces).
- **El papel también es un color de dibujo.** Las superficies que deben ocultar lo que está detrás se rellenan con `--paper` en vez de dejarse transparentes, como en el dibujo a mano con corrector.

### 2.3 Textura de papel

Sobre el área de slide/hoja se superpone un ruido fractal muy suave que imita la fibra del papel impreso:

- un pseudo-elemento `::before` con un SVG embebido (`feTurbulence`, `baseFrequency .9`, `numOctaves 2`);
- teñido cálido con `feColorMatrix` (alfa 0.22);
- `opacity: .55` y `mix-blend-mode: multiply`;
- `pointer-events: none`, para que no interfiera con los clics.

En impresión se desactiva.

### 2.4 Sombra de hoja

La hoja "apoya" sobre la mesa con una sombra difusa azulada: `0 30px 80px rgba(20,30,70,.18)`, más un filo inferior `0 2px 0 rgba(0,0,0,.04)`. En la guía la sombra es un poco más leve (`.16`).

---

## 3. Tipografía

### 3.1 Familias

Ambas se cargan desde Google Fonts:

| Familia | Pesos | Rol |
|---|---|---|
| **IBM Plex Mono** | 300, 400, 500, 600, 700 + itálicas | Familia principal: títulos, cuerpo de texto, código. |
| **Space Mono** | 400, 700 | Familia de "rótulo": metadatos, etiquetas, numeraciones, textos dentro de los dibujos, botones. |

**Por qué dos monoespaciadas.** IBM Plex Mono es sobria y muy legible en párrafos largos, con buen rango de pesos para jerarquizar. Space Mono tiene un dibujo más geométrico y "de máquina", ideal para textos cortos en mayúsculas con mucho espaciado, como los rótulos de un plano.

**Respaldo.** Sin conexión, el navegador usa `ui-monospace, monospace`. El sistema sigue funcionando porque todo está pensado en monoespaciada. En los textos SVG se fuerza `font-family: "Space Mono", ui-monospace, monospace !important`, porque el SVG no hereda la familia genérica y sin esa regla caía en una serif.

### 3.2 Escala tipográfica — presentación (lienzo de 1920 × 1080)

| Clase | Tamaño | Peso | Interlínea | Tracking | Caja | Uso |
|---|---|---|---|---|---|---|
| `.h-xl` | 118 px (106 en portada, 150 en cierre) | 500 | .95 | −.035em | MAYÚS | Títulos de portada y cierre. |
| `.h-l` | 78 px | 500 | 1 | −.03em | MAYÚS | Título de cada slide. También los números grandes (96 px) del slide 8 y los `#1…#4` (64 px) del slide 9. |
| `.h-m` | 40 px (34 en slide 6) | 500 | 1.1 | −.015em | caja baja | Bajadas o frases destacadas. |
| `.h-s` | 26 px (22-24 en contextos chicos) | 600 | 1.2 | +.01em | MAYÚS | Subtítulos de módulo ("DUPLAS", "INVESTIGACIÓN"…). |
| `.body` | 23 px | 400 | 1.5 | — | caja baja | Párrafo principal. |
| `.body.sm` | 19 px (16.5 en tópicos) | 400 | 1.5 | — | caja baja | Párrafo secundario o de módulo. |
| `.meta` | 20 px (17 en encabezado, 15 en `.sm`) | 400 (Space Mono) | 1.5 | +.06em | MAYÚS | Metadatos: número de slide, nombre del TP, pies. |
| `.label` | 15 px | 400 (Space Mono) | — | +.12em | MAYÚS | Etiquetas de sección ("INTRODUCCIÓN", "LABORATORIO COLABORATIVO"). |
| `.num` | 16 px | 400 (Space Mono) | — | +.08em | — | Numeraciones: `/01`, `01 —`, `T—03`, `[3/8]`. |
| `.tag` | 14 px | 400 (Space Mono) | — | +.1em | MAYÚS | Etiquetas en caja con borde (ChatGPT, Objetivo, Nota…). |

**Criterios:**

- **Titulares con tracking negativo** (−3 a −3.5 %): en monoespaciada grande, el espaciado natural se ve muy abierto, y cerrarlo da compacidad de afiche.
- **Rótulos con tracking positivo** (+6 a +12 %): en tamaño chico y mayúsculas, abrir el espaciado mejora la lectura y da el aire de rótulo técnico.
- **Peso 500 para titulares** (no 700): la monoespaciada en negrita pesada se empasta; 500 mantiene la elegancia del trazo de línea.
- **Negrita 600** para énfasis dentro del texto (`<b>`, `<strong>`).
- **Itálica** solo para términos puntuales (*incorpora*, *markdown*).

### 3.3 Escala tipográfica — guía web

| Elemento Markdown | Escritorio | Móvil (≤ 900 px) | Detalle |
|---|---|---|---|
| `#` (h1) | 96 px / 500 / .98 / −.035em / MAYÚS | `clamp(26px, 8.4vw, 46px)` | Con `overflow-wrap:anywhere` para que "INVESTIGACIÓN," no desborde en pantallas chicas. |
| `##` (h2) | 44 px / 500 / 1.05 / −.025em / MAYÚS | 28 px | Con línea superior de 1.5 px y manijas en los extremos. |
| `###` (h3) | 25 px / 600 / 1.25 / MAYÚS | 20 px | — |
| Párrafo | 19 px / 1.65 | 16 px | Ancho máximo de 920 px para controlar el largo de línea. |
| Cita inicial | 24 px / 1.5 | 18 px | Pregunta disparadora. |
| Citas | 18 px | 16 px | — |
| Tabla: encabezado | 14 px Space Mono / +.12em / MAYÚS | — | — |
| Tabla: celdas | 17 px / 1.55 | 15 px | — |
| Listas | 19 px / 1.6 | 16 px | — |
| Código inline | .92em IBM Plex Mono | — | — |

---

## 4. Retícula, formato y composición

### 4.1 Lienzo de la presentación

- **Formato fijo de 1920 × 1080 px (16:9).** Todas las medidas se diseñan en píxeles de ese lienzo y luego se escalan.
- **Escalado:** el `#stage` se posiciona en `left:50%; top:50%` y se transforma con `translate(-50%,-50%) scale(s)`. El factor `s` vale `min(ancho/1920, alto/1080) × 0.98`, de modo que la slide entra completa y centrada con un 2 % de margen. Se recalcula al cambiar el tamaño de la ventana.
  - *Nota de corrección:* la primera versión centraba con grid y `transform-origin:center`, y en ventanas menores a 1920 px la slide quedaba corrida a la derecha. Se reemplazó por el centrado absoluto.
- **Márgenes:** el marco (`.frame`) está a 40 px arriba/abajo y 48 px a los costados, con un borde de 1.5 px de `--ink`. El contenido (`.inner`) usa el mismo inset y se organiza con CSS Grid.
- **Encabezado común** (`.hdr`): a la izquierda `[NN] Nombre de la slide` y a la derecha el nombre del TP u otro dato, en `.meta` de 17 px, con 22-28 px de *padding*.

### 4.2 Sistema de celdas

- Las slides se dividen en **columnas o celdas** separadas por líneas de 1 px `--ink-soft` (internas) y 1.5 px `--ink` (bordes principales, filetes bajo títulos).
- Patrones de composición recurrentes:
  - **Mitad texto / mitad dibujo** (slides 2, 5, 7, 9): columna de texto con título arriba, desarrollo y una "tabla" de puntos clave anclada abajo; columna de imagen a sangre dentro del marco.
  - **Banda de N módulos iguales** (slides 3, 6 y 8): 3 o 4 columnas con número, ilustración o número grande, subtítulo y texto.
  - **Grilla de fichas** (slide 4): 4 × 2 fichas con número, ícono y texto.
  - **Imagen completa con texto en las esquinas** (slide 10).
- **Anclaje inferior.** En las columnas de texto, los bloques de resumen se empujan al pie con `margin-top:auto`. Así se forman dos zonas, arriba concepto y abajo detalle, aunque cambie el largo del texto.
- **Celda destacada.** La última columna de una serie (paso 4, objetivo #4) lleva una veladura de fondo `--ink-ghost`, para indicar que es el cierre o el resultado.

### 4.3 Grillas de fondo

Se generan con dos `linear-gradient` (horizontal y vertical) en CSS:

| Clase | Módulo | Color de línea |
|---|---|---|
| `.grid-bg` | 40 px | `--ink-faint` |
| `.grid-bg.fine` | 20 px | `--ink-faint` |
| `.grid-bg.big` | 64 px | `--ink-soft` (más presente) |

Se usan detrás de los íconos e ilustraciones, como papel milimetrado.

### 4.4 Manijas (`.h`)

- Cuadrado sólido de 11 × 11 px en `--ink`, centrado en el punto con `translate(-50%,-50%)`.
- Se ubican en intersecciones de la grilla (portada), en las esquinas inferiores de recuadros destacados (slide 2) y en los vértices de las ilustraciones: esquinas del edificio, del círculo y del cubo.
- En la guía, los `##` llevan manijas en los dos extremos del filete, las citas en las esquinas inferiores y la franja superior en cuatro puntos de su borde inferior.
- En los dibujos SVG cumplen la misma función cuadrados de 7 a 10 px.

### 4.5 Página de la guía

- **Hoja centrada** con un ancho máximo de 1180 px, *padding* de 48 px y la misma textura y sombra que las slides.
- **Marco** de 1.5 px `--ink` alrededor de todo el contenido.
- **Franja superior** de 150 px con grilla de 40 px y manijas en su borde inferior. En ella va el botón "Exportar como Markdown". Al pie hay una franja equivalente de 80 px.
- **Contenido** con *padding* de 56 × 72 px y un ancho de lectura limitado a 920-960 px.
- **Móvil (≤ 900 px):** márgenes de 16 px, franja de 90 px, contenido con 22 px de *padding* lateral y escala tipográfica reducida. No hay *scroll* horizontal; las tablas se envuelven en un contenedor con *scroll* propio.

---

## 5. Componentes

### 5.1 Etiquetas (`.tag`)

- Caja con borde de 1 px, *padding* de 4 × 10 px, Space Mono 14 px en MAYÚS con +.1em.
- **`.tag.fill`** (invertida: fondo azul, texto crema) marca un aviso o categoría clave: OBJETIVO, NOTA, LINK.
- **`.tag`** con contorno se usa para listas de ítems: ChatGPT, Claude, Gemini, Antigravity.

### 5.2 Recuadros de cita o aviso

- **Presentación:** caja con fondo `--paper` y borde de 1.5 px `--ink`, con *padding* de 26 × 30 px, apoyada sobre una ilustración (slide 2, "Laboratorio colaborativo") y con manijas en sus esquinas inferiores.
- **Guía:** cada `>` del Markdown se renderiza como ese mismo recuadro, con manijas en las esquinas inferiores (`::before`/`::after`).
- **Excepción:** la primera cita del documento, la pregunta disparadora, no lleva caja sino una barra lateral de 6 px y texto más grande. Funciona como bajada del título.

### 5.3 Botones y enlaces

| Componente | Reposo | *Hover* | Dónde |
|---|---|---|---|
| `.linkbox` (enlace principal) | Fondo papel, texto azul, flecha ↗ a la derecha | Se invierte: fondo azul, texto crema; la etiqueta LINK se invierte a su vez | Slide 7, carpeta de OneDrive |
| `.linksub` (enlace secundario) | Space Mono 13 px, `--ink-2`, subrayado `--ink-soft` | Pasa a `--ink`, con subrayado pleno | Slide 7, sintaxis de Markdown (misma caja, separada por un filete fino) |
| `.guidebtn` | Fondo azul, texto crema, Space Mono 20 px en MAYÚS, flecha ↗ | Se invierte: fondo papel, texto azul | Slide 10, "Ver guía completa" |
| `.export` | Fondo azul, texto crema, Space Mono 14 px en MAYÚS, flecha ↓ | Se invierte | Guía, "Exportar como Markdown" |
| Enlaces en texto (guía) | Azul, subrayado fino `--ink-soft` con *offset* de 4 px | Subrayado pleno y veladura `--ink-ghost` | Cuerpo de la guía |

**Criterios:**

- **Flechas con significado.** ↗ indica que el enlace sale a otra página y se abre en una pestaña nueva (`target="_blank" rel="noopener"`); ↓ indica una descarga.
- **Transición** de .2 s en fondo y color.
- Dos enlaces dentro de una misma caja se separan en zonas independientes, porque un enlace no puede contener otro.

### 5.4 Código inline

`code` lleva fondo `--ink-ghost`, borde de 1 px `--ink-faint`, *padding* de 0 × 5 px y .92em de IBM Plex Mono. Se usa para `README.md`, `.md`, etc., en la presentación (slide 8) y en la guía.

### 5.5 Tablas (guía)

- Filete superior e inferior de 1.5 px `--ink`. Filas separadas por 1 px `--ink-soft`; columnas separadas por líneas verticales del mismo tono.
- El encabezado lleva veladura `--ink-ghost`, Space Mono 14 px en MAYÚS con +.12em y un filete de 1.5 px debajo.
- **Primera columna** (#): Space Mono centrada, de 56 px de ancho. **Segunda columna** (tópico): MAYÚS 16 px, 28 % del ancho.
- Al pasar el mouse por una fila se le aplica la veladura `--ink-ghost`.

### 5.6 Listas (guía)

- Sin viñeta estándar: cada ítem lleva un **cuadrado sólido de 10 px** a la izquierda, que retoma el motivo de la manija.
- Lista con filete superior de 1.5 px y separadores de 1 px entre ítems: se lee como una tabla de especificaciones.

### 5.7 Árbol de carpetas y muestra de sintaxis (slide 7)

- Dos "ventanas" con borde de 1.5 px y una barra de título en `.label` (`/DUPLA-03 · TREE`, `README.MD · SINTAXIS`).
- Contenido en `pre` IBM Plex Mono, de 19-21 px. En la muestra de sintaxis, los caracteres de marcado (`#`, `-`, `>`, `![…](…)`) van en `--ink-2` para separarlos del contenido.

### 5.8 Navegación de la presentación

- **Barra de progreso** de 3 px en `--ink` en el borde superior de la ventana, con un ancho proporcional a la slide actual.
- **Control flotante** abajo al centro: ← · indicadores (cuadraditos de 8 px, el actual relleno) · contador `NN/10` · → · ⛶ (pantalla completa).
  - Aparece al pasar el mouse sobre la página o al recibir foco, y está siempre visible en dispositivos táctiles.
  - Lleva un fondo papel al 92 % y un borde de 1 px.
- **Teclado:** → / RePág / espacio / Enter avanzan; ← / AvPág / Retroceso retroceden; Inicio y Fin saltan a los extremos; F activa la pantalla completa. Si el foco está en un enlace o botón, Enter y espacio activan ese elemento en vez de avanzar.
- **Táctil:** deslizar el dedo más de 40 px cambia de slide.
- **Transición** entre slides: fundido de opacidad de .45 s.
- El número de slide en la URL (`#3`) solo se actualiza cuando la página está publicada en un servidor, porque Chrome bloquea `history.replaceState` en archivos locales (`file://`).
- Al imprimir se ocultan la barra y el control.

---

## 6. Ilustraciones generativas

### 6.1 Técnica

- Cada ilustración es un `<div class="deco" data-deco="nombre">` que JavaScript completa con un SVG del tamaño real de la celda, usando una función de dibujo ("painter") por tipo.
- **Aleatoriedad con semilla** (`data-seed`): un generador pseudoaleatorio propio (`rng(seed)`) hace que la "variación orgánica" sea siempre idéntica en cada carga.
- Las distribuciones "naturales" usan una aproximación gaussiana (suma de tres uniformes).
- Las ilustraciones se dibujan una vez, al cargar las fuentes, con las slides ocultas pero ya maquetadas.
- **Por qué SVG generativo** y no imágenes: queda nítido a cualquier escala, pesa poco (todo en un solo archivo HTML), permite ajustar densidad y composición cambiando un parámetro y es coherente con el tema del TP, una imagen producida por un sistema.

### 6.2 Vocabulario de marcas

| Marca | Especificación |
|---|---|
| Punto | Cuadrado de 2.4 a 3.6 px (nunca círculo), con opacidad aleatoria entre .4 y 1. |
| Línea estructural | 1.4-2 px en `INK`. |
| Línea secundaria | 1 px en `INK` o `SOFT`. |
| Línea de construcción | 1 px en `FAINT`. |
| Sombra | Rayado a −35° (patrón SVG de 6 px, línea de 0.9 px al 55 %). |
| Superficie que oculta | Polígono relleno de `#f2eee3` con contorno `INK`. |
| Manija | Cuadrado sólido de 7-10 px. |
| Texto | Space Mono de 11-16 px, con tracking positivo. |

### 6.3 Catálogo

**Portada (slide 1).** Los 8 íconos de tópicos en una grilla de 2 × 4, con fondo milimetrado fino, en este orden: Generatividad, Diseño inclusivo, Interfaces 3D, Sistemas de diseño, Pruebas de usuario, Prototipado, Design Thinking e Infografía. Llevan manijas en todas las intersecciones.

**Íconos de tópicos (slides 1 y 4).**

| Tópico | Painter | Dibujo |
|---|---|---|
| 1 · Sistemas de diseño | `tokens` | Matriz de 5 × 3 cuadrados con opacidad creciente (rampa tonal) y radio de esquina creciente por fila: tokens primitivos y variantes. |
| 2 · Design Thinking | `cycle` | Cinco nodos sobre un círculo punteado; uno relleno marca la etapa actual. |
| 3 · Prototipado | `wire` | *Wireframe*: marco, placeholder de imagen con cruz, líneas de texto y un botón relleno. |
| 4 · Diseño web inclusivo | `a11y` | Figura del símbolo de accesibilidad dentro de un círculo. |
| 5 · Infografía interactiva | `bars` | Gráfico de barras que combina barras plenas, en contorno y secundarias semitransparentes. |
| 6 · Generatividad | `gen` | Patrón tipo *10 PRINT*: diagonales y cuadrados elegidos al azar en una grilla de 10 × 7. |
| 7 · Pruebas de usuario | `heat` | Pantalla con dos nubes de puntos (mapa de calor de clics) y un cursor. |
| 8 · Interfaces inmersivas & 3D | `cube` | Cubo isométrico con la cara superior grillada y manijas en los vértices. |

**Slide 2 — Bancos de la FADU** (`fadu`). Basado en una foto de los bancos azules de taller sobre el piso de baldosas.

- **Proyección oblicua** desde arriba con baldosas de 58 px. Ejes de pantalla: x = (0.94, 0.34), y = (−0.34, 0.80); la altura se proyecta a 0.62 de la baldosa.
- **Piso:** grilla de juntas en `FAINT`. Una de cada nueve líneas es más gruesa (2.2 px, `SOFT`) y evoca la franja azul pintada en el piso.
- **Bancos:** asiento de 1 × 1 baldosa a una altura de 1.55, con espesor visible en dos caras. Tienen cuatro patas de 1.8 px, travesaños perimetrales a 30 % de la altura y dos más a 62 %, y una línea interior fina en el asiento.
- **Disposición:** filas cada 2.7 baldosas, desplazadas media posición entre sí (al tresbolillo, como en la foto). Se dibujan de atrás hacia adelante, y los asientos rellenos de papel tapan lo que queda detrás.
- **Sombras** rayadas proyectadas hacia atrás y a la izquierda, con las sombras de las patas como líneas.
- **Textos intervenidos** (DG4, TALLER 207, FADU, UBA, INVESTIGACIÓN, DISEÑO, IA, UX, MEYGIDE-CARPINTERO, TP4), de dos maneras:
  - siete *pintados en el piso*, deformados con la misma matriz de la perspectiva y ubicados en las franjas libres entre filas, en una capa por debajo de los bancos;
  - tres *rotulados* (FADU, IA, TP4), con una manija en la esquina del asiento, una línea guía a 45° y el texto en una cajita con borde.
- El recuadro "Laboratorio colaborativo" se apoya sobre la parte inferior del dibujo.

**Slide 3 — Consigna.** Arriba a la derecha, solo una grilla de 16 × 5 (`gridonly`); se quitaron las curvas por exceso de información. Los cuatro diagramas de los módulos son:

| Módulo | Painter | Dibujo |
|---|---|---|
| Duplas | `pairs` | Dos círculos superpuestos con nubes de puntos. |
| Tópico al azar | `dice` | Ocho casillas numeradas; la 6 va rellena y una línea punteada la señala con `random()`. |
| Investigación + producción | `bars` | Gráfico de barras. |
| Puesta en común | `network` | Grafo de nodos conectados por proximidad. |

**Slide 5 — Recorte** (`funnel`). Tres círculos concéntricos (A Tópico, punteado · B Subtópicos · C Recorte, más grueso), llenos de puntos cuya opacidad aumenta hacia el centro. Una cruz de ejes completa la figura con un rótulo invertido "IA" en el centro: el recorte siempre está atravesado por la IA.

**Slide 6 — Doble perspectiva** (`venn`). Dos círculos A y B superpuestos verticalmente, con veladura, y la intersección rotulada "A ∩ B" en una etiqueta invertida. A la izquierda, un campo de puntos (`dots`).

**Slide 8 — Línea de tiempo** (`timeline`). Una regla con marcas cada 1/40 (más largas cada 10) y cuatro hitos 01-04. El último es hueco (pendiente). Rótulo: "HOY → PRÓXIMA CLASE".

**Slide 9 — Documento** (`doc`). Un esquema de README: los títulos `#` y `##` en texto y los párrafos como barras de distintos largos. Incluye un mini gráfico en "Contexto actual" y una barra vertical que marca el documento.

**Slide 10 — Pabellón III, Ciudad Universitaria** (`pabellon`). Basado en una fotografía del edificio de la FADU.

- **Cámara estenopeica en 3D** con perspectiva a dos puntos de fuga, a la altura de los ojos (1.7 m), de modo que las verticales quedan verticales.
  - Cámara en (30, 1.7, 60); mira hacia (−62, 1.7, −40).
  - Focal de 0.60 × el ancho del lienzo; horizonte al 75 % del alto; centro óptico al 53 % del ancho.
  - Los segmentos que pasan detrás de la cámara se recortan contra un plano cercano.
- **Volumen** de 190 × 125 m y 26.2 m de alto, con la esquina principal a la derecha del centro, como en la foto. Las dos fachadas se rellenan con papel para tapar el piso que queda detrás.
- **Fachada:**
  - planta baja retirada 2.2 m, con columnas cada 7.5 m y carpinterías cada 1.8 m en tono `FAINT`;
  - cinco niveles separados por losas, cada losa dibujada con dos líneas (canto de 0.9 m);
  - parasoles verticales cada 1.5 m y una línea de travesaño de ventana detrás;
  - pretil en el remate.
- **Piso:** juntas de pavimento cada 7 m, solo delante del edificio para evitar acumulaciones de líneas en el horizonte, y tres líneas más marcadas a modo de grietas o juntas principales. Una línea de horizonte cruza todo el ancho.
- Manijas en las tres esquinas de la base y en el remate de la esquina principal.
- Sin autos ni personas, a pedido.

---

## 7. Composición slide por slide

| # | Slide | Composición | Textos clave |
|---|---|---|---|
| 1 | Portada | Columna de texto de 930 px + grilla de 8 íconos. Arriba una etiqueta, en el centro el título y abajo un filete con el pie. | "Investigación, Diseño & IA" · Diseño Gráfico 4 · Cátedra Meygide — Carpintero · FADU / UBA |
| 2 | Punto de partida | Texto (1.25 fr) + ilustración de bancos (1 fr). Tres principios anclados abajo (/01-/03). | Recuadro "**Laboratorio colaborativo**" (en negrita) |
| 3 | Consigna | Título + grilla decorativa; banda de 4 módulos; franja de objetivo con etiqueta invertida. | Duplas · Tópico al azar · Investigación + producción · Puesta en común |
| 4 | Tópicos | Grilla de 4 × 2 fichas: número `T—0N`, contador `[N/8]`, ícono, nombre y subtemas. | 8 tópicos |
| 5 | Recorte | Texto con lista A-B-C-∩IA + diagrama concéntrico. | — |
| 6 | IA: objeto y herramienta | Tres columnas: A · Venn · B; franja de nota. | Etiquetas de apps |
| 7 | Repositorio | Texto + caja de enlaces (OneDrive / sintaxis Markdown) + ventanas de árbol y sintaxis. | Enlaces externos |
| 8 | Tarea próxima clase | Título + línea de tiempo; 4 columnas con números grandes; la cuarta destacada. Pies en `.label` muted. | Textos literales de la guía |
| 9 | Estructura del README | Columna con esquema de documento + 4 filas `#1-#4`; la cuarta destacada. | Introducción · Recorte · Contexto actual · Objetivos |
| 10 | Cierre | Ilustración del pabellón a sangre; textos en las cuatro esquinas, los inferiores sobre fondo papel para despegarse del piso. Botón "Ver guía completa". | DG4 - TP4 · 2026 · Cátedra Meygide-Carpintero · FADU |

---

## 8. Construcción técnica

### 8.1 Presentación

- **Un solo archivo** `index.html` con HTML, CSS y JS embebidos. No tiene dependencias externas salvo las fuentes de Google.
- **Contenido escrito a mano** en cada `<section class="slide">`; las fichas de tópicos se generan desde un arreglo `TOPICS` en JS.
- **Funciona abriéndolo con doble clic** (`file://`). Por eso:
  - no se usa `fetch` de archivos externos;
  - `history.replaceState` solo se ejecuta fuera de `file://`.
- **Enlace a la guía** con ruta relativa `../markdown/dg4-26-tp4-guia-markdown.html`. Requiere mantener las carpetas `presentacion/` y `markdown/` juntas dentro de `tp-ia/`.

### 8.2 Guía

- **Generada a partir del `.md`** con un script de Python (`markdown-it-py`, *preset* `gfm-like`). Soporta tablas, autolink de URLs completas y *strikethrough*.
  - El *linkify* "difuso" está desactivado, porque convertía `README.md` en un enlace (`.md` es un dominio válido).
  - A los enlaces externos se les agrega `target="_blank" rel="noopener"`.
- **El HTML resultante se inserta en una plantilla** con los estilos descritos. No se agrega ni se quita texto; se verificó que el texto de la página coincide palabra por palabra con el `.md`.
- **Exportar como Markdown:**
  - el `.md` original queda embebido en la página como JSON (`<script type="application/json">`, con `</` escapado);
  - al presionar el botón, en Chrome o Edge se abre la ventana "Guardar como" (`showSaveFilePicker`) con el nombre `dg4-26-tp4-guia-markdown.md`;
  - en otros navegadores se descarga mediante un enlace `download`;
  - un aviso flotante ("Archivo guardado" / "Descarga iniciada") confirma la acción.
- **Si se edita el `.md`, hay que volver a generar el HTML** para que la página y la exportación se actualicen.

### 8.3 Accesibilidad y uso

- Contraste: el azul `#1d3fb8` sobre `#f2eee3` da una relación de 7.4:1 (nivel AAA). El azul atenuado `#4563c9` da 4.7:1 (cumple AA) y se usa solo en textos secundarios.
- Elementos puramente decorativos marcados con `aria-hidden`; el control de navegación tiene `aria-label`.
- *Focus* visible en los botones (`outline` de 2 px en `--ink`).
- Diseño adaptable: la presentación escala completa a cualquier ventana y la guía reacomoda tipografía y márgenes en móvil.
- Impresión: se ocultan la navegación, los botones y la textura; la guía evita cortar títulos, citas y filas entre páginas.

---

## 9. Cómo extender el sistema

1. **Usar solo las variables de color** de la sección 2. Si hace falta un nivel intermedio, agregar otra opacidad del mismo azul; nunca un tono nuevo.
2. **Títulos en IBM Plex Mono 500 en MAYÚS** con tracking negativo; **rótulos en Space Mono en MAYÚS** con tracking positivo.
3. **Organizar en celdas** con filetes de 1 px (`--ink-soft`) y 1.5 px (`--ink`), y marcar los nodos con manijas de 11 px.
4. **Ilustrar con líneas:** las superficies se rellenan con papel, las sombras se rayan y los puntos son cuadrados. Si la ilustración tiene variación, usar una semilla fija.
5. **Énfasis por inversión** (fondo azul / texto crema), nunca con otro color.
6. **Flechas con significado:** ↗ abre otra página, ↓ descarga, → avanza.
7. **Probar en 1366 × 768, 1920 × 1080 y en móvil** antes de publicar.
