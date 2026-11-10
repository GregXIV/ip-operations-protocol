// Checks that the release metadata names one version: VERSION, the version of
// @ipproto/schemas in schemas/package.json and schemas/package-lock.json, and,
// where the file exists, the version in CITATION.cff.
// Usage: node scripts/check-release-metadata.mjs   (from the repository root)
// Exits 1 and names each file that disagrees with VERSION.
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const version = read("VERSION").trim();
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.log(`FAIL  VERSION holds "${version}", not MAJOR.MINOR.PATCH`);
  process.exit(1);
}

const found = [
  ["schemas/package.json", JSON.parse(read("schemas/package.json")).version],
];
const lock = JSON.parse(read("schemas/package-lock.json"));
found.push(["schemas/package-lock.json", lock.version]);
found.push(["schemas/package-lock.json (root package)", lock.packages?.[""]?.version]);

if (existsSync(join(root, "CITATION.cff"))) {
  const m = read("CITATION.cff").match(/^version:\s*["']?([^"'\s]+)["']?\s*$/m);
  found.push(["CITATION.cff", m ? m[1] : undefined]);
}

let fail = 0;
for (const [file, v] of found) {
  if (v === version) console.log(`PASS  ${file}  ${v}`);
  else { fail++; console.log(`FAIL  ${file}  ${v ?? "(no version)"}, VERSION is ${version}`); }
}
console.log(fail ? `\n${fail} file(s) disagree with VERSION ${version}` : `\nall name ${version}`);
process.exit(fail ? 1 : 0);
