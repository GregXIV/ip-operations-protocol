// Generator for types/ipproto.d.ts: TypeScript types from the JSON Schemas.
// Requires: npm install json-schema-to-typescript@15.0.4
//           (pinned: the output is committed, and another version may format it differently)
// Usage: node generate-types.mjs            (rewrites types/ipproto.d.ts)
//        node generate-types.mjs --check    (exits 1 if types/ipproto.d.ts is out of date)
// Every message type is CommonEnvelope & { messageType; payload }, and IpprotoMessage is their union.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "json-schema-to-typescript";

const here = dirname(fileURLToPath(import.meta.url));
const target = join(here, "types", "ipproto.d.ts");
const index = JSON.parse(readFileSync(join(here, "index.json"), "utf8"));

const load = (dir) =>
  readdirSync(join(here, dir))
    .filter((n) => n.endsWith(".schema.json"))
    .sort()
    .map((n) => JSON.parse(readFileSync(join(here, dir, n), "utf8")));

const defs = load("defs")[0];
const envelope = load("envelope")[0];
const foundational = load("foundational");
const messages = load("messages");

const pascal = (title) =>
  title.replace(/[^A-Za-z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : "")).replace(/^./, (c) => c.toUpperCase());
const nameById = {};
for (const s of [envelope, ...foundational, ...messages]) nameById[s.$id] = pascal(s.title);

const defName = (k) => k.charAt(0).toUpperCase() + k.slice(1);
const isObjectDef = (d) => d.type === "object";
// Branches that only state `required` say "at least one of" or "exactly one of" some fields.
// An interface cannot express that; the fields stay optional and the rule is left to the validator.
const onlyRequired = (branches) =>
  Array.isArray(branches) && branches.every((b) => Object.keys(b).length === 1 && Array.isArray(b.required));

// Turns the URN $refs into local definitions and closes objects, so the types come out strict.
function rewrite(node) {
  if (Array.isArray(node)) return node.map(rewrite);
  if (!node || typeof node !== "object") return node;
  if (typeof node.$ref === "string") {
    const ref = node.$ref;
    const m = ref.match(/#\/\$defs\/(.+)$/);
    if (m && ref.startsWith(defs.$id)) {
      const d = defs.$defs[m[1]];
      if (isObjectDef(d)) return { $ref: `#/definitions/${defName(m[1])}` };
      return rewrite({ ...d });
    }
    if (nameById[ref]) return { $ref: `#/definitions/${nameById[ref]}` };
    throw new Error(`unresolved $ref ${ref}`);
  }
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (k === "$schema" || k === "$id") continue;
    if ((k === "anyOf" || k === "oneOf") && onlyRequired(v)) continue;
    out[k] = rewrite(v);
  }
  if (out.type === "object" && out.additionalProperties === undefined) out.additionalProperties = false;
  return out;
}

// Objects whose fields the specification leaves open beyond what the schema declares. The
// types close every other object (additionalProperties: false), and a closed type would
// reject messages the schemas accept. Each stays open until its schema declares the fields.
//   Workstream goalConstraints: costCeiling and executionModeConstraints (Workstream page).
//   Service Subscription Started feeAmount: "type-specific"; a flat fee has amount,
//   currency and period, a revenue share sharePercent.
const OPEN_OBJECTS = [
  ["urn:ipproto:schema:" + index.protocolVersion + ":workstream", ["properties", "goalStatement", "properties", "goalConstraints"]],
  ["urn:ipproto:schema:" + index.protocolVersion + ":serviceSubscriptionStarted", ["properties", "payload", "properties", "commercialTerms", "properties", "feeAmount"]],
];
for (const [id, path] of OPEN_OBJECTS) {
  const schema = [...foundational, ...messages].find((s) => s.$id === id);
  const node = path.reduce((n, k) => n?.[k], schema);
  if (!node || node.type !== "object") throw new Error(`OPEN_OBJECTS: no object at ${id} ${path.join("/")}`);
  node.additionalProperties = true;
}

const definitions = {};
for (const [k, d] of Object.entries(defs.$defs)) if (isObjectDef(d)) definitions[defName(k)] = rewrite(d);
definitions[nameById[envelope.$id]] = rewrite(envelope);
for (const s of foundational) definitions[nameById[s.$id]] = rewrite(s);
// A message is the envelope plus its own messageType and payload. The schemas say so with an
// allOf next to properties; the generator does not merge the two, so the message is written
// as an intersection: CommonEnvelope & { messageType: "<its URN>"; payload: <its payload> }.
for (const s of messages) {
  const { allOf, properties, required, title, ...rest } = s;
  const own = { type: "object", properties: { messageType: properties.messageType, payload: properties.payload }, required: ["messageType", "payload"] };
  definitions[nameById[s.$id]] = rewrite({ ...rest, allOf: [...allOf, own] });
}
// Every message, discriminated on messageType.
definitions.IpprotoMessage = {
  description: "Any message of this version, discriminated on messageType.",
  anyOf: messages.map((s) => ({ $ref: `#/definitions/${nameById[s.$id]}` })),
};
for (const d of Object.values(definitions)) delete d.title;

const banner = `/* IP Operations Protocol v${index.protocolVersion} — TypeScript types.
 * GENERATED from the JSON Schemas. Do not edit by hand; regenerate when the spec versions.
 */`;

const ts = await compile({ title: "IPOperationsProtocol", type: "object", definitions }, "IPOperationsProtocol", {
  bannerComment: banner,
  unreachableDefinitions: true,
  additionalProperties: true,
  format: true,
  style: { printWidth: 120 },
});

if (process.argv.includes("--check")) {
  const current = readFileSync(target, "utf8");
  if (current === ts) console.log("types/ipproto.d.ts is up to date");
  else { console.log("types/ipproto.d.ts is OUT OF DATE; run: node generate-types.mjs"); process.exit(1); }
} else {
  writeFileSync(target, ts);
  console.log(`wrote types/ipproto.d.ts (v${index.protocolVersion}, ${foundational.length + messages.length + 1} schemas typed)`);
}
