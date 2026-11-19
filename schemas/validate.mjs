#!/usr/bin/env node
// Reference validator for the IP Operations Protocol schema set (command line).
// Requires: npm ci (installs the pinned ajv and ajv-formats from package-lock.json)
// Usage: node validate.mjs            (validates schemas/examples/*)
//        node validate.mjs <file>     (validates one instance)
// Message examples resolve by their messageType; structure examples resolve via
// examples/_index.json (filename -> schema $id).
// Every instance is validated against the schema set of this package, whatever its
// protocolVersion says; a message of an earlier version is checked against that version's
// own set from its release (see Conformance, G1).
// For use from code, import createValidator from "@ipproto/schemas/validator"
// (lib/validator.mjs); importing this file runs nothing and exits nothing.
import { readFileSync, readdirSync, existsSync, realpathSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { createValidator } from "./lib/validator.mjs";

export { createValidator };

const here = dirname(fileURLToPath(import.meta.url));

function main(arg) {
  const v = createValidator();
  const exDir = join(here, "examples");
  const structMap = existsSync(join(exDir, "_index.json"))
    ? JSON.parse(readFileSync(join(exDir, "_index.json"), "utf8")) : {};
  const idFor = (path, inst) => v.schemaIdFor(inst) || structMap[basename(path)] || null;

  const targets = arg
    ? [arg]
    : readdirSync(exDir).filter((n) => n.endsWith(".example.json")).map((n) => join(exDir, n));

  let fail = 0, earlier = 0, indexProblems = 0;
  if (!arg) {
    const problems = v.checkIndex();
    for (const p of problems) console.log(`FAIL  index.json: ${p}`);
    indexProblems = problems.length;
    if (!problems.length) console.log(`PASS  index.json: ${v.schemaIds.length} schemas, each path exists in the package and holds its $id`);
  }
  for (const t of targets) {
    const inst = JSON.parse(readFileSync(t, "utf8"));
    const id = idFor(t, inst);
    if (!id) { fail++; console.log(`FAIL  ${basename(t)}: no schema mapping`); continue; }
    if (inst.protocolVersion && inst.protocolVersion !== v.protocolVersion) earlier++;
    const r = v.validate(inst, id);
    if (r.valid) console.log(`PASS  ${basename(t)}  ->  ${id}`);
    else { fail++; console.log(`FAIL  ${basename(t)}`); console.log(JSON.stringify(r.errors, null, 2)); }
  }
  console.log(`\n${targets.length - fail} passed, ${fail} failed (${v.schemaIds.length} schemas registered)`);
  if (earlier) console.log(`${earlier} of them carry an earlier protocolVersion and were validated against the ${v.protocolVersion} set.`);
  return fail || indexProblems ? 1 : 0;
}

const invokedDirectly = process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) process.exit(main(process.argv[2]));
