// Library form of the reference validator for the IP Operations Protocol schema set.
//
//   import { createValidator } from "@ipproto/schemas/validator";
//   const v = createValidator();
//   const { valid, schemaId, errors } = v.validate(message);
//
// Every *.schema.json of this package is registered by its $id (Ajv2020, strict:false,
// allErrors, ajv-formats), the same setup as validate.mjs. A message resolves by its
// messageType; any other instance needs the schema $id. Nothing here exits the process,
// so the module is safe to import. Requires the peer dependencies ajv and ajv-formats.
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

/** The root of this package (the directory that holds index.json). */
export const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

// Schema directories of the package; examples/ and conformance/ hold instances, not schemas.
const SCHEMA_DIRS = ["defs", "envelope", "foundational", "messages"];

function collectSchemaFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.name.startsWith(".")
      ? []
      : entry.isDirectory()
        ? collectSchemaFiles(join(dir, entry.name))
        : entry.name.endsWith(".schema.json")
          ? [join(dir, entry.name)]
          : [],
  );
}

/**
 * Builds a validator over the schema set of this package.
 * @param {{ root?: string }} [options] root: a directory laid out like this package
 *   (defaults to the package itself).
 */
export function createValidator({ root = packageRoot } = {}) {
  const ajv = new Ajv2020({ strict: false, allErrors: true });
  addFormats(ajv);

  const schemas = new Map();
  const messageTypes = new Map();
  for (const dir of SCHEMA_DIRS) {
    for (const file of collectSchemaFiles(join(root, dir))) {
      const schema = JSON.parse(readFileSync(file, "utf8"));
      ajv.addSchema(schema, schema.$id);
      schemas.set(schema.$id, schema);
      const messageType = schema?.properties?.messageType?.const;
      if (messageType) messageTypes.set(messageType, schema.$id);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "index.json"), "utf8"));

  /** The $id of the message schema for an instance's messageType, or null. */
  const schemaIdFor = (instance) =>
    (instance && typeof instance === "object" && messageTypes.get(instance.messageType)) || null;

  /** The compiled validation function for a schema $id (or a $id with a JSON Pointer fragment). */
  const getSchema = (id) => ajv.getSchema(id) ?? null;

  /**
   * Validates an instance. schemaId is required for anything that is not a message.
   * @returns {{ valid: boolean, schemaId: string|null, errors: object[] }}
   */
  function validate(instance, schemaId = schemaIdFor(instance)) {
    if (!schemaId) {
      return { valid: false, schemaId: null, errors: [{ message: "no schema: not a known messageType, and no schema $id given" }] };
    }
    const fn = getSchema(schemaId);
    if (!fn) return { valid: false, schemaId, errors: [{ message: `unknown schema ${schemaId}` }] };
    const valid = fn(instance);
    return { valid, schemaId, errors: valid ? [] : fn.errors };
  }

  /**
   * Checks index.json against the package: every entry's path exists relative to the package
   * root and holds the schema with the entry's $id, and every schema of the package is listed.
   * @returns {string[]} the problems found; empty when the index is consistent
   */
  function checkIndex() {
    const problems = [];
    const listed = new Set();
    for (const entry of index.schemas) {
      listed.add(entry.$id);
      let schema;
      try { schema = JSON.parse(readFileSync(join(root, entry.path), "utf8")); }
      catch { problems.push(`${entry.$id}: ${entry.path} does not exist in the package`); continue; }
      if (schema.$id !== entry.$id) problems.push(`${entry.path} holds ${schema.$id}, not ${entry.$id}`);
    }
    for (const id of schemas.keys()) if (!listed.has(id)) problems.push(`${id} is not listed in index.json`);
    return problems;
  }

  return {
    protocolVersion: index.protocolVersion,
    checkIndex,
    schemaIds: [...schemas.keys()],
    messageTypes: [...messageTypes.keys()],
    schemaIdFor,
    getSchema,
    validate,
  };
}
