import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const input = process.argv[2];
if (!input) {
  throw new Error("Usage: validate-html.mjs <resume.html> [expected-pages]");
}

const htmlPath = path.resolve(input);
const html = await readFile(htmlPath, "utf8");
const expectedArg = Number.parseInt(process.argv[3], 10);
const errors = [];
const warnings = [];

const pageCount = [...html.matchAll(/class=["'][^"']*\bresume-page\b[^"']*["']/g)].length;
const mode = html.match(/data-page-mode=["'](single|double|multi)["']/)?.[1];
const expectedPages =
  Number.isInteger(expectedArg)
    ? expectedArg
    : mode === "single"
      ? 1
      : mode === "double"
        ? 2
        : undefined;

if (expectedPages && pageCount !== expectedPages) {
  errors.push(`Expected ${expectedPages} resume page(s), found ${pageCount}.`);
}
if (mode === "multi" && pageCount < 3) {
  errors.push(`Multi-page mode requires at least 3 pages, found ${pageCount}.`);
}
if (pageCount === 0) errors.push("No .resume-page element was found.");

if (/\[[^\]\n]{2,80}\]|data-page-placeholder/.test(html)) {
  errors.push("Unresolved template placeholders remain in the resume.");
}
if (/Mock 模拟经历|仅为示例|example\.com|138\s*0000/i.test(html)) {
  errors.push("Demo or mock content remains in the resume.");
}

const imageSources = [...html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)].map((match) => match[1]);
for (const source of imageSources) {
  if (/^https?:\/\//i.test(source)) {
    errors.push(`Remote image is not allowed in a final resume: ${source}`);
    continue;
  }
  const imagePath = path.resolve(path.dirname(htmlPath), source);
  if (!existsSync(imagePath)) errors.push(`Missing local image: ${source}`);
}

const roleCount = [...html.matchAll(/class=["'][^"']*\brole-card\b[^"']*["']/g)].length;
const logoCount = imageSources.filter((source) => source.includes("assets/logos/")).length;
const brandCount = [...html.matchAll(/--brand\s*:/g)].length;
const softBrandCount = [...html.matchAll(/--brand-soft\s*:/g)].length;
if (roleCount > 0 && logoCount < roleCount) {
  errors.push(`Every company role must use a local SVG logo: ${roleCount} roles, ${logoCount} registered logos.`);
}
if (brandCount < roleCount || softBrandCount < roleCount) {
  errors.push("Every company role must define --brand and --brand-soft banner colors.");
}

if (!/<h1\b/i.test(html)) errors.push("The resume has no candidate name heading.");
if (!/<section\b/i.test(html)) errors.push("The resume has no content sections.");
if (!/<meta\s+charset=/i.test(html)) warnings.push("No explicit document charset was found.");

if (warnings.length) {
  console.warn(warnings.map((warning) => `WARN: ${warning}`).join("\n"));
}
if (errors.length) {
  console.error(errors.map((error) => `ERROR: ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`HTML validation passed: ${pageCount} page(s), ${roleCount} branded role(s).`);
}
