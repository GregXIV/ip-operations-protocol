#!/usr/bin/env python3
"""Validate every schema example with Python jsonschema, without format checking.

A second, independent validator beside schemas/validate.mjs (ajv + ajv-formats).
JSON Schema 2020-12 treats `format` as an annotation unless a validator opts in,
and Python jsonschema checks no format by default. A schema that only works when
`format` is asserted (for example a `oneOf` whose branches differ only by
`format`) fails here, which is the point of this run.

The mapping mirrors validate.mjs: a message example resolves by its
`messageType` (the schema whose `properties.messageType.const` matches it);
any other example resolves through schemas/examples/_index.json.

Usage: python3 scripts/validate_examples.py [example.json ...]
Requires: jsonschema (tested with 4.26), no format extras.
"""
import json
import sys
from pathlib import Path

from jsonschema import Draft202012Validator
from referencing import Registry, Resource
from referencing.jsonschema import DRAFT202012

ROOT = Path(__file__).resolve().parent.parent / "schemas"
EXAMPLES = ROOT / "examples"

schemas = {}
type_to_id = {}
for path in sorted(ROOT.rglob("*.schema.json")):
    if "node_modules" in path.parts:
        continue
    schema = json.loads(path.read_text(encoding="utf-8"))
    schemas[schema["$id"]] = schema
    message_type = schema.get("properties", {}).get("messageType", {}).get("const")
    if message_type:
        type_to_id[message_type] = schema["$id"]

registry = Registry().with_resources(
    (sid, Resource.from_contents(s, default_specification=DRAFT202012)) for sid, s in schemas.items()
)

index_path = EXAMPLES / "_index.json"
struct_map = json.loads(index_path.read_text(encoding="utf-8")) if index_path.exists() else {}


def schema_id_for(path, instance):
    message_type = instance.get("messageType") if isinstance(instance, dict) else None
    if message_type in type_to_id:
        return type_to_id[message_type]
    return struct_map.get(path.name)


targets = [Path(a) for a in sys.argv[1:]] or sorted(EXAMPLES.glob("*.example.json"))
failed = 0
for target in targets:
    instance = json.loads(target.read_text(encoding="utf-8"))
    sid = schema_id_for(target, instance)
    if not sid:
        failed += 1
        print(f"FAIL  {target.name}: no schema mapping")
        continue
    validator = Draft202012Validator(schemas[sid], registry=registry)  # no format_checker
    errors = sorted(validator.iter_errors(instance), key=lambda e: list(e.absolute_path))
    if errors:
        failed += 1
        print(f"FAIL  {target.name}  ->  {sid}")
        for e in errors:
            print(f"      {e.json_path}: {e.message[:300]}")
    else:
        print(f"PASS  {target.name}  ->  {sid}")

print(f"\n{len(targets) - failed} passed, {failed} failed ({len(schemas)} schemas registered)")
sys.exit(1 if failed else 0)
