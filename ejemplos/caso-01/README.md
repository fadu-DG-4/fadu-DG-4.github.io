# Árboles nativos de la Argentina — sitio del informe

Sitio estático (HTML, CSS y JavaScript nativos, sin librerías). **Se abre con doble clic en `portal.html`**: no necesita servidor, instalación ni conexión a internet.

## Estructura

```
sitio-flora-nativa/
├── portal.html         ← portada (presentación + tarjetas de capítulos)
├── capitulo-01.html    ← 01 · Introducción
├── capitulo-02.html    ← 02 · Regiones y paisajes
├── capitulo-03.html    ← 03 · Especies destacadas
├── capitulo-04.html    ← 04 · Conclusiones
├── referencias.html    ← fuentes
├── acerca.html         ← sobre el proyecto (incluye Metodología, pendiente)
├── css/estilos.css     ← todos los estilos
├── js/nav.js           ← navegación compartida (única fuente)
├── img/                ← imágenes del sitio (ver abajo)
└── README.md
```

## Imágenes (`img/`)

Todas las imágenes del sitio van en la carpeta `img/` y se referencian con rutas relativas (`img/archivo.png`).

| Archivo | Uso |
|---|---|
| `ilustracion-introduccion.png` | Original de la Fig. 01 (generada en Figma). |
| `ilustracion-introduccion-recorte.png` | Fig. 01 con fondo transparente — **la que usa** `capitulo-01.html`. |
| `ilustracion-ceibo.png` | Original de la Fig. 03 (generada en Figma). |
| `ilustracion-ceibo-recorte.png` | Fig. 03 con fondo transparente — **la que usa** `capitulo-03.html`. |
| `boceto-arbol-vereda.svg`, `boceto-ceibo.svg`, `esquema-regiones-especies.svg` | Esquicios preliminares, ya reemplazados (no los usa ninguna página). |

La Fig. 02 (diagrama del capítulo 2) no es un archivo: está dibujada como SVG dentro de `capitulo-02.html`.

## Agregar un capítulo nuevo

1. Copiá un capítulo existente (por ejemplo `capitulo-04.html`) como `capitulo-05.html`.
2. Cambiá el `<title>`, la `<meta name="description">`, el `<h1>` y el contenido dentro de `<div class="prose">`.
   Cada sección interna es un `<h2>` **con `id`** (por ejemplo `<h2 id="mi-seccion">`): así aparece en el índice "En esta página".
3. En `js/nav.js`, sumá una entrada al arreglo `SITE.pages`, en el orden en que debe aparecer:

   ```js
   { file: "capitulo-05.html", type: "chapter", num: 5, title: "Título del capítulo",
     summary: "Una o dos líneas de resumen para la tarjeta de la portada." },
   ```

El menú lateral, el panel móvil, las migas de pan, el indicador "Capítulo N de M", los enlaces Anterior / Siguiente y las tarjetas de la portada se actualizan solos.

## Estilos

Todas las decisiones visuales están como **variables CSS** al principio de `css/estilos.css` (`:root`): colores, tipografías, escala de tamaños, espaciados, grosores de línea y anchos. Cambiándolas ahí se ajusta todo el sitio.

Clases útiles para el contenido:

- `.sw` — letra en serif itálica oliva dentro de un título (`Arge<span class="sw">n</span>tina`).
- `.nota` — recuadro de aviso.
- `.pendiente` — bloque de contenido pendiente.
- `<figure class="brackets">` + `<figcaption><span class="fig-n">Fig. 01</span><span>Epígrafe</span></figcaption>` — figura con corchetes de recorte.

## Contenido pendiente

Los bloques que faltan completar tienen la clase **`pendiente`**. Para encontrarlos, buscá `class="pendiente"` en los archivos HTML. Hoy hay uno: **Metodología**, en `acerca.html`.
