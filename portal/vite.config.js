import { defineConfig } from "vite";
import { marked } from "marked";
import { existsSync, readFileSync, readdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const programaPath = resolve(process.cwd(), "..", "contenidos", "programa.md");
const resumenPath = resolve(process.cwd(), "..", "contenidos", "resumen.md");
const equipoPath = resolve(process.cwd(), "..", "contenidos", "equipo.md");
const guiaGithubPath = resolve(process.cwd(), "..", "instructivos", "guia-crear-cuenta-github.md");
const instructivosMediaPath = resolve(process.cwd(), "..", "instructivos", "medios");
const contenidosPath = resolve(process.cwd(), "..", "contenidos");
const trabajoPracticoTemplatePath = resolve(process.cwd(), "trabajo-practico-template.html");
const generatedPagesPath = process.cwd();

function getTrabajoPracticoEntries() {
  const markdown = readFileSync(programaPath, "utf8");
  return [...markdown.matchAll(/<!--\s*página:\s*(trabajo-practico-[\d-]+\.md)\s*-->/gi)].map(
    ([, fileName]) => ({
      fileName,
      markdownPath: resolve(contenidosPath, fileName),
      htmlFileName: fileName.replace(/\.md$/i, ".html"),
    }),
  );
}

function prepareGeneratedPages() {
  const template = readFileSync(trabajoPracticoTemplatePath, "utf8");

  for (const { fileName, htmlFileName } of getTrabajoPracticoEntries()) {
    const marker = `<!-- TRABAJO_PRACTICO_CONTENT: ${fileName} -->`;
    writeFileSync(
      resolve(generatedPagesPath, htmlFileName),
      template.replace("<!-- TRABAJO_PRACTICO_CONTENT -->", marker),
    );
  }
}

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
      const pageMatch = section.match(/<!--\s*página:\s*([^>]+?)\s*-->/i);
      const pagePath = pageMatch
        ? pageMatch[1].trim().replace(/\.md$/i, ".html")
        : "";
      const visibleBody = bodyLines
        .filter((line) => !/<!--\s*página:\s*[^>]+?\s*-->/i.test(line))
        .join("\n")
        .trim();
      const bodyHtml = marked.parse(visibleBody).trim();
      const titleHtml = pagePath
        ? `<a href="/${escapeHtml(pagePath)}">${escapeHtml(exerciseTitle)}</a>`
        : escapeHtml(exerciseTitle);
      const number = String(index + 1).padStart(2, "0");

      return `<article class="exercise">
  <span class="exercise-number">${number}</span>
  <div>
    <h3>${titleHtml}</h3>
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

function renderTrabajoPracticoPage(template, markdownPath, fallbackTitle) {
  const markdown = readFileSync(markdownPath, "utf8");
  return template.replace(
    /<!--\s*TRABAJO_PRACTICO_CONTENT(?::[^>]+)?\s*-->/,
    renderTrabajoPractico(markdown, fallbackTitle),
  );
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

function removeGeneratedPages() {
  for (const { htmlFileName } of getTrabajoPracticoEntries()) {
    const generatedPath = resolve(generatedPagesPath, htmlFileName);
    if (existsSync(generatedPath)) unlinkSync(generatedPath);
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

function serveTrabajoPracticoPages(server) {
  server.middlewares.use(async (request, response, next) => {
    const requestPath = decodeURIComponent((request.url || "").split("?")[0]);
    const match = requestPath.match(/^\/((?:trabajo-practico-\d+))\.html$/i);

    if (!match) {
      next();
      return;
    }

    const fileName = `${match[1]}.md`;
    const markdownPath = resolve(contenidosPath, fileName);
    const entries = getTrabajoPracticoEntries();
    const isConfigured = entries.some((entry) => entry.fileName.toLowerCase() === fileName.toLowerCase());

    if (!isConfigured || !existsSync(markdownPath)) {
      next();
      return;
    }

    const template = readFileSync(trabajoPracticoTemplatePath, "utf8");
    const html = renderTrabajoPracticoPage(template, markdownPath, `Trabajo práctico ${match[1].split("-").pop()}`);
    const transformedHtml = await server.transformIndexHtml(request.url, html);

    response.statusCode = 200;
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.end(transformedHtml);
  });
}

function markdownContentPlugin() {
  return {
    name: "markdown-content",
    configureServer(server) {
      serveInstructivosMedia(server);
      serveTrabajoPracticoPages(server);
      [programaPath, resumenPath, equipoPath, guiaGithubPath, ...getTrabajoPracticoEntries().map((entry) => entry.markdownPath)].forEach((contentPath) => {
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
        const pageMatch = html.match(/<!--\s*TRABAJO_PRACTICO_CONTENT:\s*([^>]+?)\s*-->/);
        const trabajoPracticoContent = pageMatch
          ? renderTrabajoPractico(
              readFileSync(resolve(contenidosPath, pageMatch[1].trim()), "utf8"),
              pageMatch[1].match(/\d+/)?.[0] ? `Trabajo práctico ${pageMatch[1].match(/\d+/)[0]}` : "Trabajo práctico",
            )
          : "";

        return html
          .replace("<!-- PROGRAM_CONTENT -->", content)
          .replace("<!-- HERO_EYEBROW -->", resumen.heroEyebrow)
          .replace("<!-- HERO_TEXT -->", resumen.heroText)
          .replace("<!-- CLOSING_TITLE -->", resumen.closingTitle)
          .replace("<!-- CLOSING_TEXT -->", resumen.closingText)
          .replace("<!-- EQUIPO_CONTENT -->", equipo)
          .replace("<!-- GUIA_GITHUB_CONTENT -->", guiaGithub)
          .replace(/<!--\s*TRABAJO_PRACTICO_CONTENT:\s*[^>]+?\s*-->/, trabajoPracticoContent);
      },
    },
    handleHotUpdate({ file, server }) {
      if ([programaPath, resumenPath, equipoPath, guiaGithubPath, ...getTrabajoPracticoEntries().map((entry) => entry.markdownPath)].includes(resolve(file))) {
        server.ws.send({ type: "full-reload" });
        return [];
      }
    },
    generateBundle() {
      emitDirectoryAssets(this, instructivosMediaPath, "instructivos/medios");
    },
    closeBundle() {
      removeGeneratedPages();
    },
  };
}

export default defineConfig(({ command }) => {
  if (command === "build") prepareGeneratedPages();

  return {
    plugins: [markdownContentPlugin()],
    build: {
      rollupOptions: {
        input: {
          home: resolve(process.cwd(), "index.html"),
          navegacion: resolve(process.cwd(), "navegacion.html"),
          guiaGithub: resolve(process.cwd(), "guia-crear-cuenta-github.html"),
          ...(command === "build"
            ? Object.fromEntries(
                getTrabajoPracticoEntries().map(({ htmlFileName }) => [
                  htmlFileName.replace(/\.html$/i, ""),
                  resolve(generatedPagesPath, htmlFileName),
                ]),
              )
            : {}),
        },
      },
    },
  };
});
