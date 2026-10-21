# Guías HTML · Sistema de estilos

Documento de referencia interno para la producción de guías, presentaciones y materiales HTML independientes del portal de Diseño Gráfico 4.

Estas piezas se publican dentro de `guias/` y no comparten la navegación, la estructura ni la hoja de estilos del portal principal. El sistema está pensado para producir documentos visuales, editoriales e interactivos que puedan leerse como una presentación en pantalla completa.

## Principio general

La identidad visual combina una estética editorial técnica con recursos propios de una interfaz de trabajo:

- composición modular y estructurada;
- tipografía monoespaciada;
- grillas visibles y líneas de construcción;
- numeración, etiquetas y metadatos;
- diagramas geométricos y esquemas abstractos;
- contraste entre papel cálido y azul intenso;
- animaciones breves, funcionales y controladas;
- lenguaje directo, preciso y orientado a la investigación.

La guía debe sentirse como un sistema de documentación visual: rigurosa, analítica y contemporánea, pero no fría ni excesivamente corporativa.

## Formato y composición

### Guías en formato slide

Las presentaciones interactivas utilizan una relación de aspecto **16:9**, con una medida de referencia de `1920 × 1080 px`:

```css
--W: 1920px;
--H: 1080px;
```

El escenario se centra en el viewport y se escala proporcionalmente para adaptarse a distintas resoluciones. La composición se diseña primero sobre el lienzo de referencia y luego se transforma sin alterar sus proporciones.

La estructura recomendada es:

```text
viewport
└── stage  · 1920 × 1080
    ├── frame  · marco perimetral
    ├── inner  · área de composición
    ├── slides · pantallas superpuestas
    ├── progress · barra de progreso
    └── nav · controles de navegación
```

El escenario utiliza una sombra exterior suave para separarse del fondo del navegador. El contenido debe mantenerse dentro de los márgenes y evitar que los elementos importantes queden pegados al borde.

### Márgenes y marco

- Marco exterior: aproximadamente `40 px` desde arriba y abajo, y `48 px` desde los laterales.
- Padding general del slide: aproximadamente `56 px 64 px`.
- Encabezados internos: padding horizontal cercano a `28 px`.
- El marco se dibuja con un borde azul de aproximadamente `1.5 px`.
- El marco funciona como límite visual, no como contenedor de todos los contenidos.

El borde perimetral, las líneas horizontales y las divisiones verticales deben organizar la lectura sin convertir la pantalla en una cuadrícula rígida. La línea es un elemento estructural y también un recurso expresivo.

## Paleta cromática

La paleta debe ser reducida y consistente. Los valores de referencia utilizados en las guías actuales son:

| Variable | Valor | Uso |
| --- | --- | --- |
| `--paper` | `#f2eee3` | Fondo principal del papel y de las superficies de contenido. |
| `--paper-2` | `#ebe6d8` | Variación cálida para superficies secundarias, cuando sea necesario. |
| `--ink` | `#1d3fb8` | Tinta principal: títulos, líneas, bordes, íconos y elementos destacados. |
| `--ink-2` | `#4563c9` | Azul secundario para metadatos y textos atenuados. |
| `--ink-soft` | `rgba(29,63,184,.38)` | Líneas secundarias, separadores y bordes de menor jerarquía. |
| `--ink-faint` | `rgba(29,63,184,.14)` | Grillas y líneas muy sutiles. |
| `--ink-ghost` | `rgba(29,63,184,.07)` | Fondos leves, resaltados y estados hover. |
| `--bg` | `#d9d4c6` | Fondo exterior visible alrededor del escenario. |

### Uso del color

- El azul intenso funciona como una tinta editorial, no como un color decorativo aislado.
- El fondo cálido debe ocupar la mayor parte de la superficie principal.
- Las transparencias azules permiten jerarquizar sin introducir nuevos colores.
- Los estados activos pueden invertir la relación cromática: fondo azul y texto color papel.
- Evitar agregar colores saturados adicionales salvo que el contenido de un diagrama lo requiera.
- El amarillo no forma parte de la paleta principal de estas guías; corresponde principalmente a la identidad del portal.

## Tipografía

La tipografía es monoespaciada y constituye una parte central de la identidad.

### Familias

- **IBM Plex Mono**: tipografía principal para títulos, párrafos, etiquetas y bloques de información.
- **Space Mono**: tipografía auxiliar para metadatos, numeración, códigos, etiquetas, controles y datos técnicos.

Carga recomendada:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

Se debe incluir una familia alternativa monoespaciada para evitar que la composición pierda su lógica si la fuente externa no está disponible:

```css
font-family: "IBM Plex Mono", ui-monospace, monospace;
```

### Escala de referencia para slides

| Clase | Tamaño aproximado | Uso |
| --- | ---: | --- |
| `.h-xl` | `118 px` | Títulos principales de portada. |
| `.h-l` | `78 px` | Títulos destacados de sección. |
| `.h-m` | `40 px` | Subtítulos o preguntas centrales. |
| `.h-s` | `26 px` | Encabezados breves, nombres de etapas o categorías. |
| `.body` | `23 px` | Texto principal de una diapositiva. |
| `.body.sm` | `19 px` | Texto secundario, descripciones y notas. |
| `.meta` | `20 px` | Metadatos y encabezados técnicos. |
| `.label` | `15 px` | Etiquetas y nombres de componentes. |
| `.num` | `16 px` | Numeración y marcadores. |

Los tamaños deben ajustarse según la cantidad de contenido. La legibilidad tiene prioridad sobre la fidelidad literal a estos valores.

### Tratamiento tipográfico

- Los títulos principales suelen estar en mayúsculas.
- Los títulos utilizan pesos medios, no necesariamente bold.
- La condensación se obtiene mediante tamaños grandes, interlineados ajustados y un tracking levemente negativo.
- Los metadatos utilizan mayúsculas, tracking positivo y un tamaño menor.
- Los párrafos utilizan interlineado amplio, aproximadamente `1.5`.
- Las palabras o conceptos clave pueden destacarse mediante peso `600`, sin abusar del recurso.
- La itálica se reserva para citas, énfasis conceptuales o voces diferenciadas.

## Líneas, bordes y módulos

Las líneas son uno de los principales recursos de organización.

- Línea estructural principal: `1.5 px` en `var(--ink)`.
- Línea secundaria: `1 px` en `var(--ink-soft)`.
- Línea de grilla: `1 px` en `var(--ink-faint)`.
- Bordes de tarjetas y contenedores: `1.5 px` en `var(--ink)`.
- Evitar bordes redondeados: el sistema utiliza ángulos rectos.
- No utilizar sombras internas ni efectos de volumen pronunciados.
- Las divisiones deben prolongarse hasta los límites de los módulos para reforzar la lógica editorial.

### Puntos de anclaje

Los cuadrados azules de aproximadamente `11 × 11 px` funcionan como puntos de anclaje en líneas, esquinas y diagramas. Pueden utilizarse para:

- marcar el inicio o el final de una regla;
- señalar una intersección;
- enfatizar un cambio de sección;
- construir una figura geométrica mínima.

Su uso debe ser deliberado. No deben convertirse en una textura repetitiva sin función.

## Grillas y fondos

Las grillas son fondos de apoyo para diagramas, no un fondo constante para todo el contenido.

```css
.grid-bg {
  background-image:
    linear-gradient(var(--ink-faint) 1px, transparent 1px),
    linear-gradient(90deg, var(--ink-faint) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

Variantes:

- Grilla fina: `20 × 20 px`, para detalles y visualizaciones pequeñas.
- Grilla estándar: `40 × 40 px`, para módulos y composiciones generales.
- Grilla grande: `64 × 64 px`, con líneas más visibles para estructuras amplias.

Las grillas pueden combinarse con diagramas, cajas, nodos y textos fantasma. No deben competir con el texto principal.

## Diagramas y recursos visuales

Los diagramas deben ser geométricos, abstractos y legibles. Se recomienda construirlos con SVG, CSS o elementos HTML antes que incorporar imágenes decorativas sin relación con el contenido.

### Tipos de diagramas recomendados

- **Redes y nodos:** relaciones entre conceptos, actores, herramientas o etapas.
- **Matrices:** comparación de variables, categorías o niveles de análisis.
- **Embudo:** pasaje de un campo amplio hacia un recorte preciso.
- **Ciclos:** procesos iterativos, metodologías y flujos de trabajo.
- **Barras y escalas:** comparación, intensidad o distribución de variables.
- **Cubos y formas axonométricas:** sistemas, capas, componentes o estructuras.
- **Wireframes:** representación esquemática de interfaces y jerarquías.
- **Densidades y mapas de calor:** concentración, frecuencia o zonas de interés.
- **Pares y agrupamientos:** relaciones, oposiciones y clasificaciones.

Los diagramas no deben ilustrar literalmente cada palabra del texto. Su función es hacer visible una estructura, una relación o un proceso que el texto explica.

### SVG y elementos decorativos

- Los SVG deben ocupar el contenedor disponible y mantener `display: block`.
- Los textos dentro de SVG deben utilizar `Space Mono` para conservar la coherencia.
- Las formas pueden construirse con líneas, rectángulos, círculos, polígonos y pequeños puntos de anclaje.
- Evitar gradientes, biseles, 3D realista y efectos brillantes.
- Se permite una complejidad visual alta cuando esté organizada por una grilla y una jerarquía clara.

## Componentes recurrentes

### Metadatos

Los encabezados de slide pueden incluir número, título breve, tema del trabajo, herramienta o fuente. Se alinean en los extremos y utilizan `Space Mono`, mayúsculas y tracking positivo.

Ejemplo conceptual:

```text
[05] DEL TÓPICO AL RECORTE                    TP 04 · INVESTIGACIÓN, DISEÑO & IA
```

### Etiquetas

Las etiquetas se presentan como cajas de borde fino, con texto monoespaciado y mayúsculas:

```css
.tag {
  border: 1px solid var(--ink);
  padding: 4px 10px;
  font-family: "Space Mono", monospace;
  font-size: 14px;
  letter-spacing: .1em;
  text-transform: uppercase;
}
```

Las etiquetas pueden invertirse con fondo azul y texto color papel para marcar estados o categorías principales.

### Enlaces y botones

Los enlaces importantes deben parecer módulos editoriales interactivos:

- borde azul;
- fondo papel en estado normal;
- inversión a fondo azul y texto papel en hover;
- flecha o indicador de dirección alineado a la derecha;
- transición breve, aproximadamente `200 ms`.

Los botones principales pueden utilizar fondo azul desde el inicio y cambiar a fondo papel en hover. El texto debe estar en mayúsculas, con `Space Mono` y tracking positivo.

### Código y repositorios

Los fragmentos de código, rutas, nombres de archivos y estructuras de carpetas utilizan `IBM Plex Mono`, fondo azul muy tenue y un borde fino. Las estructuras de carpetas pueden aparecer en bloques `pre` con interlineado amplio.

## Animación e interacción

La interacción debe reforzar la lectura y no competir con ella.

### Transición entre slides

Los slides se superponen en la misma posición. El slide activo utiliza `opacity: 1` y `visibility: visible`; los restantes se ocultan con `opacity: 0` y `visibility: hidden`.

La transición de referencia es un fundido de aproximadamente `450 ms` con una curva `ease`. No se recomienda utilizar desplazamientos grandes, rebotes o rotaciones.

### Navegación

La interfaz de navegación aparece en la parte inferior, centrada horizontalmente, con:

- contador o botones anterior/siguiente;
- puntos de navegación para cada slide;
- borde azul fino;
- fondo papel con leve transparencia;
- opacidad reducida hasta que el cursor se acerca o el control recibe foco.

También puede incluirse una barra de progreso azul de `3 px` en el borde superior del viewport.

### Accesibilidad e interacción

- Los controles deben ser botones reales o enlaces reales.
- Cada slide debería tener un título identificable mediante `data-title` o una estructura equivalente.
- La navegación debe poder realizarse con teclado.
- Las animaciones deben reducirse o eliminarse con `prefers-reduced-motion: reduce`.
- No depender exclusivamente del color para indicar el slide activo.
- Los enlaces externos deben indicar claramente su destino o si se abrirán en una pestaña nueva.

## Tono editorial y redacción

El tono debe ser:

- claro y preciso;
- crítico, sin adoptar automáticamente el discurso promocional de una tecnología;
- directo, con frases breves en las diapositivas;
- analítico, pero accesible para estudiantes de diseño;
- orientado a preguntas, procesos, hallazgos y decisiones;
- consciente de la relación entre teoría, práctica y producción.

Una diapositiva no debe convertirse en una página saturada de texto. El desarrollo completo puede quedar en un documento Markdown o en una guía de contenido; las slides deben seleccionar, ordenar y visualizar lo más importante.

## Sección especial: guías Markdown

Las guías Markdown son documentos HTML extensos generados a partir de un archivo `.md`. Un ejemplo actual es:

```text
guias/contenidos/dg4-26-tp4-guia-markdown.html
```

Estas guías no utilizan el formato de slide 16:9 ni la navegación por pantallas de la guía interactiva. Utilizan una composición vertical, desplazable y orientada a la lectura, pero conservan el mismo sistema visual.

### Particularidades de las guías Markdown

- Se presentan como una hoja central (`.sheet`) sobre un fondo exterior gris cálido.
- El ancho máximo de referencia de la hoja es aproximadamente `1180 px`.
- El contenido tiene una columna principal de lectura y márgenes generosos.
- El documento mantiene fondo papel, marco azul y textura de grano.
- El título `h1` es grande, monoespaciado, azul y en mayúsculas.
- Los `h2` funcionan como separadores de sección: llevan una línea superior azul y puntos cuadrados en los extremos.
- Los `h3` funcionan como subtítulos de subsección, también en mayúsculas.
- Los párrafos tienen un ancho máximo cercano a `920 px`, un tamaño de `19 px` y un interlineado de `1.65`.
- Las listas utilizan una línea superior, separadores horizontales y cuadrados azules como viñetas.
- Las tablas se colocan dentro de un contenedor con desplazamiento horizontal para pantallas pequeñas.
- Los encabezados de tabla utilizan `Space Mono`, mayúsculas, tracking positivo y fondo azul muy tenue.
- Las citas destacadas pueden utilizar una línea vertical azul gruesa o una caja con borde azul y pequeños cuadrados de anclaje.
- El botón de exportación a PDF utiliza el mismo tratamiento que los botones de las slides.
- En impresión se eliminan las sombras, el fondo exterior, el botón de exportación y la textura.

La guía Markdown debe conservar la lógica visual de las slides, pero adaptarse a una lectura larga. No hay que forzar una composición de pantalla fija: la prioridad pasa a ser la jerarquía, la navegación del documento y la legibilidad.

## Checklist para nuevas guías

Antes de publicar una guía, verificar:

- [ ] La proporción de las slides es 16:9 cuando se trata de una presentación interactiva.
- [ ] La paleta utiliza papel cálido, azul principal y transparencias del mismo azul.
- [ ] Las tipografías son IBM Plex Mono y Space Mono, con alternativas monoespaciadas.
- [ ] La composición utiliza una grilla, márgenes y líneas estructurales coherentes.
- [ ] Los diagramas explican relaciones o procesos concretos.
- [ ] La navegación funciona con mouse, teclado y dispositivos táctiles.
- [ ] Las animaciones son breves y cuentan con alternativa para movimiento reducido.
- [ ] Los textos de las slides están sintetizados y no reemplazan el desarrollo completo del informe.
- [ ] Las guías Markdown mantienen un ancho de lectura cómodo y un comportamiento responsive.
- [ ] Los enlaces, imágenes, recursos externos y botones fueron probados.
- [ ] El archivo se visualiza correctamente tanto en pantalla como al exportarse o imprimirse.
