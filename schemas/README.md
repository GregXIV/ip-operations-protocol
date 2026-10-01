# Schemas

JSON Schemas, validated examples, generated TypeScript types, and a reference validator
for the IP Operations Protocol **v0.2**. Packaged as `@ipproto/schemas`.

**License:** Apache-2.0 (see [LICENSE](LICENSE)) — the explicit patent grant is deliberate
for a standard in the patent domain.

## What's here

```
schemas/
├── defs/            common-defs.schema.json   (money, codes, dates, JSON Pointer)
├── envelope/        common-envelope.schema.json
├── foundational/    14 structures: asset/entity/document/actor references, actor role
│                    declaration, user context, authority claim, data assertion,
│                    workstream, milestone, outcome details, evidence collection,
│                    agreed price, service level (plus the two resolver profile structures)
├── messages/        all 39 messages: asset bootstrap/match inquiry/match response;
│                    orchestration committed; milestone started/completed/failed/abandoned;
│                    workstream completed/abandoned; service deliverable;
│                    deliverable acknowledged; artifact ready; client action completed;
│                    and since 0.2 work requested; work instruction, instruction
│                    accepted/declined; invoice issued; bid invitation, conflict check
│                    attested, bid submitted/withdrawn/declined, award
│                    proposed/confirmed/declined
├── examples/        complete, validated message instances
├── types/           ipproto.d.ts — TypeScript types GENERATED from the schemas
├── index.json       manifest: messageType / structure -> $id -> path
├── validate.mjs     reference validator (ajv)
└── package.json     @ipproto/schemas
```

## Conventions

- **Dialect:** JSON Schema draft 2020-12.
- **`$id`:** `urn:ipproto:schema:0.2:<name>`. The version is part of the identity and is
  never reused across versions (see ../VERSIONING.md), so the whole set is re-issued under
  `0.2`; the `0.1` identifiers keep naming the 0.1.0 set and nothing else. Cross-schema
  `$ref`s use these URNs; a validator registers all schemas so the URN refs resolve.
- **Open extension:** `additionalProperties` is intentionally left open. The protocol's
  stated behavior is that receivers degrade gracefully on unknown fields rather than
  rejecting, so the schemas enforce shape, required fields, enums, and formats without
  forbidding extension. Generated TypeScript types are strict for developer ergonomics.

## Validate

```bash
npm install ajv@8 ajv-formats@3
node validate.mjs                       # validates examples/*
node validate.mjs path/to/message.json  # validates one message by its messageType
```

## TypeScript

```ts
import type { GoalDecomposition, Milestone, CommonEnvelope } from "@ipproto/schemas/types";
```

Types are generated from the schemas — regenerate them when the spec versions; never hand-edit.

## Coverage

This release schematizes the **complete protocol surface**: the envelope, all 14 foundational
structures, and all 39 messages plus the Resolution Provenance / Resolved Asset profile structures — bootstrap/discovery, workstream and milestone lifecycle,
work instruction, procurement, deliverable and prepared-action handoff, payments and invoices,
subscriptions, steady-state events (register events, service findings), the full dispute
machinery, and the generic record update. That is 57 schema files: common defs, the envelope,
16 under `foundational/` and 39 under `messages/`.

Thirty-one complete examples (messages + structures) validate against the set. The thirteen
carried over from 0.1 keep `"protocolVersion": "0.1"` on purpose: they show that a 0.1
message validates unchanged against the 0.2 schemas. The eighteen added in 0.2 cover every
new message and structure, the new Workstream and Milestone fields, and the new subscription terms.
