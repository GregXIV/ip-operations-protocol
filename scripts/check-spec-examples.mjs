// Validates every ```json block of the specification against the schema set.
// Usage: node scripts/check-spec-examples.mjs     (from the repository root, after
//        npm ci in schemas/)
//
// A ```json block is a complete instance and must validate. A ```jsonc block is an
// illustrative fragment that elides parts with /* comments */; it is skipped.
//
// Which schema a block is checked against:
// 1. A block with a messageType: that message's schema.
// 2. A line <!-- schema: <name> --> right before the block: urn:ipproto:schema:<version>:<name>.
// 3. Otherwise the page's own schema, found by the page title (the H1) in index.json.
//    On a message page, a block that has a payload but not the whole envelope is the
//    message as the page shows it: the missing envelope fields are filled with
//    placeholders and the result is validated. A block without a payload on a message
//    page is the payload itself and is validated against the payload's schema.
// A block that maps to no schema fails: give it a schema line, or make it jsonc.
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createValidator } from "../schemas/lib/validator.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const v = createValidator();
const index = JSON.parse(readFileSync(join(root, "schemas", "index.json"), "utf8"));
const byTitle = new Map(index.schemas.map((s) => [s.title.toLowerCase(), s.$id]));
const idOf = (name) => `${index.schemaIdBase}${name}`;
// The profile page is about Asset References; its title is not a schema title.
const pageAliases = new Map([["asset identification and resolution", idOf("assetReference")]]);

const PLACEHOLDER = {
  messageUri: "urn:ipproto:message:00000000-0000-4000-8000-000000000000",
  protocolVersion: index.protocolVersion,
  originatingActor: "urn:ipproto:actor:00000000-0000-4000-8000-000000000001",
  originatingRoleDeclaration: "urn:ipproto:roleDeclaration:00000000-0000-4000-8000-000000000002",
  addressedTo: [{ actorUri: "urn:ipproto:actor:00000000-0000-4000-8000-000000000003" }],
  producedAt: "2026-01-01T00:00:00Z",
};

const walk = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(d, e.name)) : e.name.endsWith(".md") ? [join(d, e.name)] : []);

let checked = 0, skipped = 0;
const failures = [];
for (const file of walk(join(root, "spec")).sort()) {
  const text = readFileSync(file, "utf8");
  const title = (text.match(/^# (.+)$/m)?.[1] ?? "").trim().toLowerCase();
  const isMessagePage = /^type: message$/m.test(text);
  const pageId = pageAliases.get(title) ?? byTitle.get(title) ?? null;
  const fence = /^```(\S*)[^\n]*\n([\s\S]*?)^```/gm;
  for (let m; (m = fence.exec(text)); ) {
    const lang = m[1];
    if (lang !== "json" && lang !== "jsonc") continue;
    const line = text.slice(0, m.index).split("\n").length;
    const where = `${relative(root, file)}:${line}`;
    if (lang === "jsonc") { skipped++; continue; }
    checked++;
    let block;
    try { block = JSON.parse(m[2]); } catch (e) { failures.push(`${where}  not JSON (${e.message}); fix it or fence it as jsonc`); continue; }
    const hint = text.slice(0, m.index).match(/<!-- schema: ([A-Za-z0-9]+) -->\s*$/)?.[1];

    let instance = block, schemaId = null;
    if (block && typeof block === "object" && !Array.isArray(block) && block.messageType) {
      schemaId = v.schemaIdFor(block);
    } else if (hint) {
      schemaId = idOf(hint);
    } else if (isMessagePage && pageId && block && typeof block === "object" && !Array.isArray(block)) {
      const messageType = v.getSchema(pageId)?.schema?.properties?.messageType?.const;
      if ("payload" in block) {
        instance = { ...PLACEHOLDER, messageType, ...block };
        schemaId = pageId;
      } else {
        schemaId = `${pageId}#/properties/payload`;
      }
    } else {
      schemaId = pageId;
    }
    if (!schemaId) { failures.push(`${where}  no schema for this block; add <!-- schema: <name> --> or fence it as jsonc`); continue; }
    const r = v.validate(instance, schemaId);
    if (!r.valid) {
      const errs = r.errors.slice(0, 4).map((e) => `${e.instancePath || "/"} ${e.message}`).join("; ");
      failures.push(`${where}  invalid against ${schemaId}: ${errs}`);
    }
  }
}
for (const f of failures) console.log(`FAIL  ${f}`);
console.log(`\n${checked - failures.length} of ${checked} json blocks valid, ${skipped} jsonc fragments skipped`);
process.exit(failures.length ? 1 : 0);
