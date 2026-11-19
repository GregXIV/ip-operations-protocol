# Conformance fixtures

`invalid/` holds **must-fail fixtures**: instances that break one requirement of
[Conformance](../../spec/01%20-%20Front%20Matter/Conformance.md) and that every conforming
validator must reject. Each file is one case:

```jsonc
{
  "rule": "G6",                      // the requirement the instance breaks
  "description": "…",
  "schema": "actorReference",        // only for an instance that is not a message:
                                     // urn:ipproto:schema:<version>:<schema>
  "requiresFormatAssertion": true,   // only where the error is a `format` error
  "expect": [                        // errors the validator must report
    { "instancePath": "/jurisdictionCode", "keyword": "maxLength" }
  ],
  "instance": { … }
}
```

A message resolves by its `messageType`. The `expect` entries use the JSON Pointer of the
offending value and the JSON Schema keyword that rejects it; `params`, where given, narrows
the match. A validator passes a fixture when it rejects the instance for the stated reason,
not merely when it rejects it.

`format` is an annotation in JSON Schema 2020-12 unless a validator asserts it. A fixture
marked `requiresFormatAssertion` is rejected only by a validator that asserts formats, as
the reference validator does (ajv with ajv-formats).

The fixtures cover the rules a schema can check: G1 (a payload against its message schema),
G2 (the envelope), G5 (closed enumerations) and G6 (dates, amounts, currencies,
jurisdictions). The other requirements are checked against message traces, resolution
probes or attestations, not schemas.

Run them from the repository root, after `npm ci` in `schemas/`:

```bash
node scripts/check-conformance-fixtures.mjs
```
