import { defineConfig } from "vite";
import { marked } from "marked";
import { existsSync, readFileSync, readdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const programaPath = resolve(process.cwd(), "..", "contenidos", "programa.md");
const resumenPath = resolve(process.cwd(), "..", "contenidos", "resumen.md");
const equipoPath = resolve(process.cwd(), "..", "contenidos", "equipo.md");
const instructivosIndexPath = resolve(process.cwd(), "..", "instructivos", "instructivos.md");
const instructivosPath = resolve(process.cwd(), "..", "instructivos");
const instructivosMediaPath = resolve(process.cwd(), "..", "instructivos", "medios");
const guiasPath = resolve(process.cwd(), "..", "guias");
const contenidosPath = resolve(process.cwd(), "..", "contenidos");
const trabajoPracticoTemplatePath = resolve(process.cwd(), "trabajo-practico-template.html");
const instructivoTemplatePath = resolve(process.cwd(), "instructivo-template.html");
const generatedPagesPath = process.cwd();
const internalGuideStyleReferences = new Set(["estilos-guia.md", "estilos-guia-claude.md"]);

function getTrabajoPracticoEntries() {
  const markdown = readFileSync(programaPath, "utf8");
  return [...markdown.matchAll(/<!--\s*página:\s*([^>]+?\.md)\s*-->/gi)].map(
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

function renderProgramaNavigation(markdown) {
  const sections = markdown.split(/^##\s+/m).slice(1);

  return sections
    .map((section) => {
      const lines = section.trim().split(/\r?\n/);
      const [heading] = lines;
      const pageMatch = section.match(/<!--\s*página:\s*([^>]+?)\s*-->/i);

      if (!heading || !pageMatch) return "";

      const [title] = heading.split(" — ").map((value) => value.trim());
      const pagePath = pageMatch[1].trim().replace(/\.md$/i, ".html");
      return `<li><a href="/${escapeHtml(pagePath)}">${escapeHtml(title)}</a></li>`;
    })
    .filter(Boolean)
    .join("\n");
}

function getInstructivoEntries() {
  const markdown = readFileSync(instructivosIndexPath, "utf8");
  return [...markdown.matchAll(/^##\s+(.+?)\s*\r?\n[\s\S]*?<!--\s*página:\s*([^>]+?\.md)\s*-->/gim)]
    .map(([, title, fileName]) => ({
      title: title.trim(),
      fileName: fileName.trim(),
      markdownPath: resolve(instructivosPath, fileName.trim()),
      htmlFileName: fileName.trim().replace(/\.md$/i, ".html"),
    }));
}

function renderInstructivosNavigation() {
  return getInstructivoEntries()
    .map(({ title, htmlFileName }) => `<li><a href="/${escapeHtml(htmlFileName)}">${escapeHtml(title)}</a></li>`)
    .join("\n");
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

function renderInstructivo(markdown) {
  const normalizedMarkdown = markdown.replaceAll("](medios/", "](instructivos/medios/");
  return marked.parse(normalizedMarkdown).trim();
}

function emitDirectoryAssets(pluginContext, directory, outputPrefix) {
  for (const entry of readdirSync(directory)) {
    if (directory === guiasPath && internalGuideStyleReferences.has(entry)) continue;
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

function prepareGeneratedInstructivoPages() {
  const template = readFileSync(instructivoTemplatePath, "utf8");

  for (const { fileName, htmlFileName } of getInstructivoEntries()) {
    const marker = `<!-- INSTRUCTIVO_CONTENT: ${fileName} -->`;
    writeFileSync(
      resolve(generatedPagesPath, htmlFileName),
      template.replace("<!-- INSTRUCTIVO_CONTENT -->", marker),
    );
  }
}

function removeGeneratedInstructivoPages() {
  for (const { htmlFileName } of getInstructivoEntries()) {
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

function serveGuias(server) {
  server.middlewares.use("/guias", (request, response, next) => {
    const requestPath = decodeURIComponent((request.url || "").split("?")[0]);
    if (internalGuideStyleReferences.has(requestPath.slice(1))) {
      next();
      return;
    }
    const filePath = resolve(guiasPath, `.${requestPath}`);

    if (!filePath.startsWith(guiasPath) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
      next();
      return;
    }

    const contentTypes = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
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
    const entries = getTrabajoPracticoEntries();
    const entry = entries.find((candidate) => `/${candidate.htmlFileName}`.toLowerCase() === requestPath.toLowerCase());

    if (!entry) {
      next();
      return;
    }

    if (!existsSync(entry.markdownPath)) {
      next();
      return;
    }

    const template = readFileSync(trabajoPracticoTemplatePath, "utf8");
    const html = renderTrabajoPracticoPage(template, entry.markdownPath, "Trabajo práctico");
    const transformedHtml = await server.transformIndexHtml(request.url, html);

    response.statusCode = 200;
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.end(transformedHtml);
  });
}

function serveInstructivoPages(server) {
  server.middlewares.use(async (request, response, next) => {
    const requestPath = decodeURIComponent((request.url || "").split("?")[0]);
    const entry = getInstructivoEntries().find(
      (candidate) => `/${candidate.htmlFileName}`.toLowerCase() === requestPath.toLowerCase(),
    );

    if (!entry || !existsSync(entry.markdownPath)) {
      next();
      return;
    }

    const template = readFileSync(instructivoTemplatePath, "utf8");
    const markdown = readFileSync(entry.markdownPath, "utf8");
    const html = template.replace("<!-- INSTRUCTIVO_CONTENT -->", renderInstructivo(markdown));
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
      serveGuias(server);
      serveTrabajoPracticoPages(server);
      serveInstructivoPages(server);
      [programaPath, resumenPath, equipoPath, instructivosIndexPath, ...getInstructivoEntries().map((entry) => entry.markdownPath), ...getTrabajoPracticoEntries().map((entry) => entry.markdownPath)].forEach((contentPath) => {
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
        const instructivosMarkdown = readFileSync(instructivosIndexPath, "utf8");
        const pageMatch = html.match(/<!--\s*TRABAJO_PRACTICO_CONTENT:\s*([^>]+?)\s*-->/);
        const trabajoPracticoContent = pageMatch
          ? renderTrabajoPractico(
              readFileSync(resolve(contenidosPath, pageMatch[1].trim()), "utf8"),
              pageMatch[1].match(/\d+/)?.[0] ? `Trabajo práctico ${pageMatch[1].match(/\d+/)[0]}` : "Trabajo práctico",
            )
          : "";

        const instructivoMatch = html.match(/<!--\s*INSTRUCTIVO_CONTENT:\s*([^>]+?)\s*-->/);
        const instructivoContent = instructivoMatch
          ? renderInstructivo(readFileSync(resolve(instructivosPath, instructivoMatch[1].trim()), "utf8"))
          : "";

        return html
          .replace("<!-- PROGRAM_CONTENT -->", content)
          .replace("<!-- PROGRAM_NAV_CONTENT -->", renderProgramaNavigation(markdown))
          .replace("<!-- INSTRUCTIVOS_NAV_CONTENT -->", renderInstructivosNavigation(instructivosMarkdown))
          .replace("<!-- HERO_EYEBROW -->", resumen.heroEyebrow)
          .replace("<!-- HERO_TEXT -->", resumen.heroText)
          .replace("<!-- CLOSING_TITLE -->", resumen.closingTitle)
          .replace("<!-- CLOSING_TEXT -->", resumen.closingText)
          .replace("<!-- EQUIPO_CONTENT -->", equipo)
          .replace(/<!--\s*INSTRUCTIVO_CONTENT:\s*[^>]+?\s*-->/, instructivoContent)
          .replace(/<!--\s*TRABAJO_PRACTICO_CONTENT:\s*[^>]+?\s*-->/, trabajoPracticoContent);
      },
    },
    handleHotUpdate({ file, server }) {
      if ([programaPath, resumenPath, equipoPath, instructivosIndexPath, ...getInstructivoEntries().map((entry) => entry.markdownPath), ...getTrabajoPracticoEntries().map((entry) => entry.markdownPath)].includes(resolve(file))) {
        server.ws.send({ type: "full-reload" });
        return [];
      }
    },
    generateBundle() {
      emitDirectoryAssets(this, instructivosMediaPath, "instructivos/medios");
      emitDirectoryAssets(this, guiasPath, "guias");
    },
    closeBundle() {
      removeGeneratedPages();
      removeGeneratedInstructivoPages();
    },
  };
}

export default defineConfig(({ command }) => {
  if (command === "build") {
    prepareGeneratedPages();
    prepareGeneratedInstructivoPages();
  }

  return {
    plugins: [markdownContentPlugin()],
    build: {
      rollupOptions: {
        input: {
          home: resolve(process.cwd(), "index.html"),
          navegacion: resolve(process.cwd(), "navegacion.html"),
          ...(command === "build"
            ? Object.fromEntries(
                [...getTrabajoPracticoEntries(), ...getInstructivoEntries()].map(({ htmlFileName }) => [
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
