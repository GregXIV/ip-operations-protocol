// Reference validator for the IP Operations Protocol schema set.
// Requires: npm install ajv@8 ajv-formats
// Usage: node validate.mjs            (validates schemas/examples/*)
//        node validate.mjs <file>     (validates one instance)
// Message examples resolve by their messageType; structure examples resolve via
// examples/_index.json (filename -> schema $id).
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const here = dirname(fileURLToPath(import.meta.url));
const ajv = new Ajv2020({ strict: false, allErrors: true });
addFormats(ajv);

const collect = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? collect(join(d, e.name)) : e.name.endsWith(".schema.json") ? [join(d, e.name)] : []);

const byId = {}, typeToId = {};
for (const f of collect(here)) {
  const s = JSON.parse(readFileSync(f, "utf8"));
  ajv.addSchema(s, s.$id);
  byId[s.$id] = s;
  const mt = s?.properties?.messageType?.const;
  if (mt) typeToId[mt] = s.$id;
}

const exDir = join(here, "examples");
const structMap = existsSync(join(exDir, "_index.json"))
  ? JSON.parse(readFileSync(join(exDir, "_index.json"), "utf8")) : {};

function idFor(path, inst) {
  if (inst.messageType && typeToId[inst.messageType]) return typeToId[inst.messageType];
  return structMap[basename(path)] || null;
}

const arg = process.argv[2];
const targets = arg
  ? [arg]
  : readdirSync(exDir).filter((n) => n.endsWith(".example.json")).map((n) => join(exDir, n));

let fail = 0;
for (const t of targets) {
  const inst = JSON.parse(readFileSync(t, "utf8"));
  const id = idFor(t, inst);
  if (!id) { fail++; console.log(`FAIL  ${basename(t)}: no schema mapping`); continue; }
  const v = ajv.getSchema(id);
  if (v(inst)) console.log(`PASS  ${basename(t)}  ->  ${id}`);
  else { fail++; console.log(`FAIL  ${basename(t)}`); console.log(JSON.stringify(v.errors, null, 2)); }
}
console.log(`\n${targets.length - fail} passed, ${fail} failed (${Object.keys(byId).length} schemas registered)`);
process.exit(fail ? 1 : 0);
