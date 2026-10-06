import { defineConfig } from "vite";
import { marked } from "marked";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

const programaPath = resolve(process.cwd(), "..", "contenidos", "programa.md");
const resumenPath = resolve(process.cwd(), "..", "contenidos", "resumen.md");
const equipoPath = resolve(process.cwd(), "..", "contenidos", "equipo.md");
const guiaGithubPath = resolve(process.cwd(), "..", "instructivos", "guia-crear-cuenta-github.md");
const instructivosMediaPath = resolve(process.cwd(), "..", "instructivos", "medios");
const trabajoPracticoPaths = [1, 2, 3, 4].map((number) =>
  resolve(process.cwd(), "..", "contenidos", `trabajo-practico-${number}.md`),
);

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderPrograma(markdown) {
  const blocks = markdown.split(/^##\s+/m);
  const [intro, ...sections] = blocks;
  const titleMatch = intro.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : "Programa";
  const summary = intro.replace(/^#\s+.+$/m, "").trim();
  const summaryHtml = marked.parse(summary).trim();

  const exercises = sections
    .filter((section) => section.trim())
    .map((section, index) => {
      const [heading, ...bodyLines] = section.trim().split(/\r?\n/);
      const [exerciseTitle, tag = ""] = heading.split(" — ").map((value) => value.trim());
      const bodyHtml = marked.parse(bodyLines.join("\n").trim()).trim();
      const number = String(index + 1).padStart(2, "0");

      return `<article class="exercise">
  <span class="exercise-number">${number}</span>
  <div>
    <h3>${escapeHtml(exerciseTitle)}</h3>
    ${bodyHtml}
  </div>
  <span class="exercise-tag">${escapeHtml(tag)}</span>
</article>`;
    })
    .join("\n");

  return `<div class="program-heading"><h2 id="program-title">${escapeHtml(title)}</h2>${summaryHtml}</div>
<div class="exercise-list">${exercises}</div>`;
}

function extractMarkdownValue(markdown, sectionName, fieldName) {
  const sectionStart = markdown.indexOf(`## ${sectionName}`);
  if (sectionStart === -1) return "";

  const sectionBodyStart = markdown.indexOf("\n", sectionStart) + 1;
  const nextSection = markdown.indexOf("\n## ", sectionBodyStart);
  const sectionBody = markdown.slice(
    sectionBodyStart,
    nextSection === -1 ? markdown.length : nextSection,
  );

  const fieldStart = sectionBody.indexOf(`### ${fieldName}`);
  if (fieldStart === -1) return "";

  const fieldBodyStart = sectionBody.indexOf("\n", fieldStart) + 1;
  const nextField = sectionBody.indexOf("\n### ", fieldBodyStart);
  const fieldBody = sectionBody.slice(
    fieldBodyStart,
    nextField === -1 ? sectionBody.length : nextField,
  );

  return marked.parseInline(fieldBody.trim()).trim();
}

function renderResumen(markdown) {
  return {
    heroEyebrow: extractMarkdownValue(markdown, "Hero", "Eyebrow"),
    heroText: extractMarkdownValue(markdown, "Hero", "Texto"),
    closingTitle: extractMarkdownValue(markdown, "Cierre", "Título"),
    closingText: extractMarkdownValue(markdown, "Cierre", "Texto"),
  };
}

function renderEquipo(markdown) {
  const blocks = markdown.split(/^##\s+/m);
  const [intro, ...members] = blocks;
  const titleMatch = intro.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : "Equipo docente";
  const memberHtml = members
    .filter((member) => member.trim())
    .map((member) => {
      const [name, ...roleLines] = member.trim().split(/\r?\n/);
      const role = marked.parse(roleLines.join("\n").trim()).trim();
      return `<article class="team-member"><h3>${escapeHtml(name.trim())}</h3>${role}</article>`;
    })
    .join("\n");

  return `<div class="team-heading"><h2 id="equipo-title">${escapeHtml(title)}</h2></div>
<div class="team-list">${memberHtml}</div>`;
}

function renderTrabajoPractico(markdown, fallbackTitle) {
  const rendered = marked.parse(markdown).trim();
  return rendered || `<h1>${escapeHtml(fallbackTitle)}</h1>`;
}

function renderGuiaGithub(markdown) {
  const normalizedMarkdown = markdown.replaceAll("](medios/", "](instructivos/medios/");
  return marked.parse(normalizedMarkdown).trim();
}

function emitDirectoryAssets(pluginContext, directory, outputPrefix) {
  for (const entry of readdirSync(directory)) {
    const sourcePath = resolve(directory, entry);
    const outputPath = `${outputPrefix}/${entry}`;

    if (statSync(sourcePath).isDirectory()) {
      emitDirectoryAssets(pluginContext, sourcePath, outputPath);
    } else {
      pluginContext.emitFile({
        type: "asset",
        fileName: outputPath,
        source: readFileSync(sourcePath),
      });
    }
  }
}

function serveInstructivosMedia(server) {
  server.middlewares.use("/instructivos/medios", (request, response, next) => {
    const requestPath = decodeURIComponent((request.url || "").split("?")[0]);
    const filePath = resolve(instructivosMediaPath, `.${requestPath}`);

    if (!filePath.startsWith(instructivosMediaPath) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
      next();
      return;
    }

    const contentTypes = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
    };
    const extension = filePath.slice(filePath.lastIndexOf(".")).toLowerCase();

    response.statusCode = 200;
    response.setHeader("Content-Type", contentTypes[extension] || "application/octet-stream");
    response.end(readFileSync(filePath));
  });
}

function markdownContentPlugin() {
  return {
    name: "markdown-content",
    configureServer(server) {
      serveInstructivosMedia(server);
      [programaPath, resumenPath, equipoPath, guiaGithubPath, ...trabajoPracticoPaths].forEach((contentPath) => {
        server.watcher.add(contentPath);
      });
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        const markdown = readFileSync(programaPath, "utf8");
        const content = renderPrograma(markdown);
        const resumen = renderResumen(readFileSync(resumenPath, "utf8"));
        const equipo = renderEquipo(readFileSync(equipoPath, "utf8"));
        const guiaGithub = renderGuiaGithub(readFileSync(guiaGithubPath, "utf8"));
        const trabajosPracticos = trabajoPracticoPaths.map((contentPath, index) =>
          renderTrabajoPractico(
            readFileSync(contentPath, "utf8"),
            `Trabajo práctico ${index + 1}`,
          ),
        );

        return html
          .replace("<!-- PROGRAM_CONTENT -->", content)
          .replace("<!-- HERO_EYEBROW -->", resumen.heroEyebrow)
          .replace("<!-- HERO_TEXT -->", resumen.heroText)
          .replace("<!-- CLOSING_TITLE -->", resumen.closingTitle)
          .replace("<!-- CLOSING_TEXT -->", resumen.closingText)
          .replace("<!-- EQUIPO_CONTENT -->", equipo)
          .replace("<!-- GUIA_GITHUB_CONTENT -->", guiaGithub)
          .replace("<!-- TP1_CONTENT -->", trabajosPracticos[0])
          .replace("<!-- TP2_CONTENT -->", trabajosPracticos[1])
          .replace("<!-- TP3_CONTENT -->", trabajosPracticos[2])
          .replace("<!-- TP4_CONTENT -->", trabajosPracticos[3]);
      },
    },
    handleHotUpdate({ file, server }) {
      if ([programaPath, resumenPath, equipoPath, guiaGithubPath, ...trabajoPracticoPaths].includes(resolve(file))) {
        server.ws.send({ type: "full-reload" });
        return [];
      }
    },
    generateBundle() {
      emitDirectoryAssets(this, instructivosMediaPath, "instructivos/medios");
    },
  };
}

export default defineConfig({
  plugins: [markdownContentPlugin()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(process.cwd(), "index.html"),
        navegacion: resolve(process.cwd(), "navegacion.html"),
        guiaGithub: resolve(process.cwd(), "guia-crear-cuenta-github.html"),
        trabajoPractico1: resolve(process.cwd(), "trabajo-practico-1.html"),
        trabajoPractico2: resolve(process.cwd(), "trabajo-practico-2.html"),
        trabajoPractico3: resolve(process.cwd(), "trabajo-practico-3.html"),
        trabajoPractico4: resolve(process.cwd(), "trabajo-practico-4.html"),
      },
    },
  },
});
