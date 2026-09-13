import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readArg(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const mode = readArg("mode", "single");
const requestedPages = Number.parseInt(readArg("pages", ""), 10);
const outputName = readArg("name", `resume-${Date.now()}`);
const force = process.argv.includes("--force");

if (!["single", "double", "multi"].includes(mode)) {
  throw new Error("--mode must be single, double, or multi.");
}

const pageCount =
  mode === "single"
    ? 1
    : mode === "double"
      ? 2
      : Number.isInteger(requestedPages) && requestedPages >= 3
        ? requestedPages
        : 3;

const safeName = outputName.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-|-$/g, "");
if (!safeName) throw new Error("--name must contain at least one safe filename character.");

const templateDir = path.join(skillRoot, "templates", "compact");
const outputDir = path.join(skillRoot, "output", safeName);

await mkdir(path.dirname(outputDir), { recursive: true });
await cp(templateDir, outputDir, { recursive: true, force, errorOnExist: !force });

const htmlPath = path.join(outputDir, "index.html");
let html = await readFile(htmlPath, "utf8");
html = html.replace('data-page-mode="single"', `data-page-mode="${mode}"`);

const extraPage = (pageNumber) => `
      <article class="resume-page" data-page-placeholder="${pageNumber}">
        <section class="resume-section">
          <h2>[第 ${pageNumber} 页章节]</h2>
          <p>[由 Agent 按完整经历边界填充本页，不要把同一段经历意外拆到两页。]</p>
        </section>
      </article>`;

if (pageCount > 1) {
  const pages = Array.from({ length: pageCount - 1 }, (_, index) => extraPage(index + 2)).join("\n");
  html = html.replace("\n    </main>", `${pages}\n    </main>`);
}

await writeFile(htmlPath, html);

console.log(`Created: ${path.relative(skillRoot, outputDir)}`);
console.log(`Mode: ${mode}`);
console.log(`Pages: ${pageCount}`);
