import { copyFile, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(skillRoot, "assets", "brands.json");

function arg(name, fallback = "") {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function normalizeHex(value) {
  const hex = value.replace("#", "").toUpperCase();
  if (/^[0-9A-F]{3}$/.test(hex)) {
    return `#${[...hex].map((part) => `${part}${part}`).join("")}`;
  }
  if (/^[0-9A-F]{6}$/.test(hex)) return `#${hex}`;
  return undefined;
}

function rgb(hex) {
  return [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16)
  ];
}

function saturation([red, green, blue]) {
  const values = [red, green, blue].map((value) => value / 255);
  const maximum = Math.max(...values);
  const minimum = Math.min(...values);
  const lightness = (maximum + minimum) / 2;
  if (maximum === minimum) return 0;
  return (maximum - minimum) / (1 - Math.abs(2 * lightness - 1));
}

function detectPrimaryColor(svg) {
  const counts = new Map();
  for (const match of svg.matchAll(/#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?/g)) {
    const color = normalizeHex(match[0]);
    if (color) counts.set(color, (counts.get(color) || 0) + 1);
  }

  const ranked = [...counts.entries()]
    .map(([color, count]) => {
      const values = rgb(color);
      const luminance = (0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2]) / 255;
      return { color, score: count * (0.35 + saturation(values)), luminance };
    })
    .filter(({ luminance }) => luminance > 0.06 && luminance < 0.94)
    .sort((left, right) => right.score - left.score);

  return ranked[0]?.color || "#475467";
}

function soften(hex) {
  const amount = 0.9;
  const values = rgb(hex).map((value) => Math.round(value + (255 - value) * amount));
  return `#${values.map((value) => value.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

const key = arg("key").trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
const name = arg("name").trim();
const sourceFile = path.resolve(arg("file"));
const aliases = arg("aliases")
  .split(",")
  .map((alias) => alias.trim())
  .filter(Boolean);

if (!key || !name || !arg("file")) {
  throw new Error("Usage: register-logo.mjs --key <id> --name <company> --file <logo.svg> [--color #RRGGBB] [--aliases a,b]");
}

const svg = await readFile(sourceFile, "utf8");
if (!svg.trimStart().startsWith("<svg")) {
  throw new Error("The logo file must be an SVG document.");
}

const requestedColor = normalizeHex(arg("color"));
const color = requestedColor || detectPrimaryColor(svg);
const logoDir = path.join(skillRoot, "assets", "logos");
const sourceIsRegisteredAsset = path.dirname(sourceFile) === logoDir;
const filename = sourceIsRegisteredAsset ? path.basename(sourceFile) : `${key}.svg`;
const destination = path.join(logoDir, filename);
if (sourceFile !== destination) await copyFile(sourceFile, destination);

const registry = JSON.parse(await readFile(registryPath, "utf8"));
registry[key] = {
  name,
  aliases,
  logo: `assets/logos/${filename}`,
  color,
  softColor: soften(color)
};
await writeFile(registryPath, `${JSON.stringify(registry, null, 2)}\n`);

console.log(`${name} -> assets/logos/${filename}`);
console.log(`Primary color: ${color}`);
console.log(`Banner color: ${registry[key].softColor}`);
