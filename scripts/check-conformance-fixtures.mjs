// Runs the must-fail fixtures under schemas/conformance/invalid/.
// Usage: node scripts/check-conformance-fixtures.mjs   (from the repository root, after
//        npm ci in schemas/)
//
// Each fixture holds an instance that breaks one requirement of Conformance (its `rule`)
// and the errors a validator must report for it (`expect`: instancePath, keyword and,
// optionally, params). A fixture passes when the instance is invalid AND every expected
// error is among the errors reported, so it fails for the reason it was written for.
// `schema` names the schema for an instance that is not a message
// (urn:ipproto:schema:<version>:<schema>); a message resolves by its messageType.
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createValidator } from "../schemas/lib/validator.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "schemas", "conformance", "invalid");
const v = createValidator();
const index = JSON.parse(readFileSync(join(root, "schemas", "index.json"), "utf8"));

const matches = (want, got) =>
  got.instancePath === want.instancePath &&
  got.keyword === want.keyword &&
  Object.entries(want.params ?? {}).every(([k, val]) => JSON.stringify(got.params?.[k]) === JSON.stringify(val));

const files = readdirSync(dir).filter((n) => n.endsWith(".json")).sort();
let fail = 0;
const rules = new Set();
for (const name of files) {
  const fx = JSON.parse(readFileSync(join(dir, name), "utf8"));
  rules.add(fx.rule);
  const schemaId = fx.schema ? `${index.schemaIdBase}${fx.schema}` : v.schemaIdFor(fx.instance);
  const r = v.validate(fx.instance, schemaId ?? undefined);
  if (!schemaId || r.schemaId === null) { fail++; console.log(`FAIL  ${name}: no schema`); continue; }
  if (r.valid) { fail++; console.log(`FAIL  ${name}: the instance validates; it must not (${fx.rule})`); continue; }
  const missing = fx.expect.filter((w) => !r.errors.some((g) => matches(w, g)));
  if (missing.length) {
    fail++;
    console.log(`FAIL  ${name}: invalid, but not for the expected reason`);
    console.log(`      expected ${JSON.stringify(missing)}`);
    console.log(`      reported ${JSON.stringify(r.errors.map((e) => ({ instancePath: e.instancePath, keyword: e.keyword })))}`);
    continue;
  }
  console.log(`PASS  ${name}  (${fx.rule}: ${fx.expect.map((e) => `${e.instancePath || "/"} ${e.keyword}`).join(", ")})`);
}
console.log(`\n${files.length - fail} of ${files.length} must-fail fixtures rejected as expected; rules covered: ${[...rules].sort().join(", ")}`);
process.exit(fail || !files.length ? 1 : 0);
