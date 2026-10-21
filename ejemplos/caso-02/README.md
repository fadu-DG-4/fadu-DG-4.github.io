# Árboles nativos de la Argentina · Sitio web del informe

Versión inicial y base sólida del sitio web estático para la publicación de la investigación sobre arbolado autóctono argentino y su rol en el espacio público urbano (Trabajo Práctico 4, **Diseño Gráfico 4**, Cátedra Meygide-Carpintero, FADU-UBA, 2026).

---

## 1. Cómo abrir y navegar el sitio

- **Apertura inmediata (*standalone*):** hacé **doble clic en `index.html`** desde tu explorador de archivos.
- Se abre y funciona en cualquier navegador moderno sin requerir servidores locales, compilación, librerías, Node.js ni conexión a internet (`file://` nativo).
- Todas las rutas a archivos CSS, scripts e imágenes son relativas.

---

## 2. Estructura de archivos

El proyecto mantiene una estructura plana y predecible:

```text
caso-02/
├── index.html            ← Portada general e índice visual de capítulos
├── capitulo-01.html      ← Capítulo 1 · Introducción
├── capitulo-02.html      ← Capítulo 2 · Regiones y paisajes
├── capitulo-03.html      ← Capítulo 3 · Especies destacadas
├── capitulo-04.html      ← Capítulo 4 · Conclusiones
├── referencias.html      ← Bibliografía y fuentes consultadas
├── acerca.html           ← Marco académico, equipo y metodología
├── css/
│   └── estilos.css       ← Hoja de estilos compartida y variables visuales
├── js/
│   └── nav.js            ← Navegación unificada, scrollspy y configuración única
├── img/                  ← Gráficos botánicos vectoriales y fotografías de especímenes
│   ├── flor-ceibo.jpg    ← Fotografía botánica recortada del ceibo en portada
│   ├── ceibo-fauna-picaflor.jpg    ← Fotografía recortada: flor de ceibo y picaflor (Cap. 1)
│   ├── ceibo-vereda-sustrato.jpg   ← Fotografía recortada: tronco, cazuela y vereda (Cap. 1)
│   ├── esquema-regiones-especies.svg
│   └── boceto-ceibo.svg
└── README.md             ← Documentación técnica y guía de ampliación
```

---

## 3. Cómo agregar un nuevo capítulo

Para sumar un nuevo capítulo (por ejemplo `capitulo-05.html`), se requieren dos pasos sencillos:

### Paso 1: Duplicar una plantilla HTML
1. Copiá cualquier archivo de capítulo existente (como `capitulo-04.html`) y renombralo como `capitulo-05.html`.
2. Actualizá el `<title>` y `<meta name="description">` en el `<head>`.
3. Actualizá el título principal `<h1>` y las secciones internas con sus respectivos `id` (por ejemplo `<h3 id="mi-seccion">Mi sección</h3>`).

### Paso 2: Registrar el capítulo en `js/nav.js`
Abrí `js/nav.js` y agregá el objeto correspondiente dentro del arreglo `SITE_CONFIG.pages`, en la posición deseada:

```javascript
{
  id: "capitulo-05",
  file: "capitulo-05.html",
  title: "Capítulo 5 · Título del capítulo",
  navLabel: "05 · Título del capítulo",
  chapterNum: "05",
  chapterIndex: 5,
  type: "capitulo",
  summary: "Breve síntesis de una o dos líneas tomada de los contenidos."
}
```

Al guardar el archivo, `nav.js` actualizará automáticamente en todas las páginas:
- El menú lateral de escritorio.
- El panel lateral móvil.
- El indicador "Capítulo N de M".
- Las migas de pan (*breadcrumbs*).
- Los enlaces "Anterior / Siguiente" (*pager*).
- Las tarjetas de la portada (`index.html`).
- El índice "En esta página" con detección de *scrollspy*.

---

## 4. Dónde se definen los estilos visuales

Todas las decisiones visuales del sitio provienen del análisis de la imagen de referencia técnica/editorial y se configuran como **variables CSS nativas** al inicio de:

📁 `css/estilos.css` (en el bloque `:root`, líneas 9 a 57).

Allí podés modificar:
- **Colores:** `--color-canvas` (fondo crema cálido), `--color-ink` (negro tinta de alto contraste), `--color-canvas-alt`, `--color-border`.
- **Tipografías:** `--font-display`, `--font-body`, `--font-mono` (con familias de sistema offline sin dependencias externas).
- **Escala de tamaños:** desde `--text-2xs` hasta `--text-hero`.
- **Espaciados y anchos de lectura:** `--content-max-width`, `--line-length` (68ch), `--sidebar-width`.

---

## 5. Dónde y cómo encontrar los bloques de contenido pendiente

Los bloques donde el informe requiere completar información futura están identificados con la clase `.pendiente`:

- **En el código:** buscá en los archivos HTML la clase `class="pendiente"`.
- **En pantalla:** se muestran dentro de una caja con recuadro punteado ocre y una etiqueta visible `[CONTENIDO PENDIENTE]`.
- En esta versión inicial, el bloque pendiente se encuentra en `acerca.html` bajo la sección `### Metodología`:
  ```html
  <div class="pendiente" role="status">
    <span class="pendiente-tag">[CONTENIDO PENDIENTE]</span>
    <p>[Contenido pendiente: Metodología de la investigación, criterios de selección bibliográfica y protocolo de observación del arbolado urbano.]</p>
  </div>
  ```
- Para completarlo en una iteración futura, solo hay que reemplazar el interior de ese contenedor por los párrafos definitivos y retirar la clase `.pendiente`.
