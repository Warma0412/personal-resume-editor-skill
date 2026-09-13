import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const forbiddenExtensions = new Set([
  ".doc",
  ".docx",
  ".jpeg",
  ".jpg",
  ".pdf",
  ".png",
  ".rtf",
  ".webp"
]);
const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".sh",
  ".svg",
  ".txt"
]);

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === "node_modules") continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

for (const runtimeDir of ["output", "working"]) {
  const entries = await readdir(path.join(skillRoot, runtimeDir));
  const unexpected = entries.filter((entry) => entry !== ".gitkeep");
  if (unexpected.length > 0) {
    errors.push(`${runtimeDir}/ contains runtime data: ${unexpected.join(", ")}`);
  }
}

const files = await walk(skillRoot);
for (const file of files) {
  const relative = path.relative(skillRoot, file);
  const extension = path.extname(file).toLowerCase();

  if (forbiddenExtensions.has(extension)) {
    errors.push(`Potential personal artifact is packaged: ${relative}`);
    continue;
  }

  if (!textExtensions.has(extension) || (await stat(file)).size > 2_000_000) continue;
  const content = await readFile(file, "utf8");
  if (/\/Users\/[^/\s]+/i.test(content)) {
    errors.push(`Local absolute path remains in ${relative}`);
  }
}

const skill = await readFile(path.join(skillRoot, "SKILL.md"), "utf8");
const frontmatter = skill.match(/^---\n([\s\S]*?)\n---/)?.[1] || "";
if (!/(?:^|\n)name:\s*"personal-resume-editor"(?:\n|$)/.test(frontmatter)) {
  errors.push("SKILL.md is missing the expected name frontmatter.");
}
if (!/(?:^|\n)description:\s*".+"(?:\n|$)/.test(frontmatter)) {
  errors.push("SKILL.md is missing description frontmatter.");
}

if (errors.length > 0) {
  console.error(errors.map((error) => `ERROR: ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Package verification passed: ${files.length} files, no runtime resume artifacts.`);
}
