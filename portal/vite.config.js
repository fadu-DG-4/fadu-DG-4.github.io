import { defineConfig } from "vite";
import { marked } from "marked";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const programaPath = resolve(process.cwd(), "..", "contenidos", "programa.md");

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

function markdownContentPlugin() {
  return {
    name: "markdown-content",
    configureServer(server) {
      server.watcher.add(programaPath);
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        const markdown = readFileSync(programaPath, "utf8");
        const content = renderPrograma(markdown);
        return html.replace("<!-- PROGRAM_CONTENT -->", content);
      },
    },
    handleHotUpdate({ file, server }) {
      if (resolve(file) === programaPath) {
        server.ws.send({ type: "full-reload" });
        return [];
      }
    },
  };
}

export default defineConfig({
  plugins: [markdownContentPlugin()],
});
