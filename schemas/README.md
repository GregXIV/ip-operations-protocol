# Schemas

JSON Schemas, validated examples, generated TypeScript types, and a reference validator
for the IP Operations Protocol **v0.5**. Packaged as `@ipproto/schemas`.

**License:** Apache-2.0 (see [LICENSE](LICENSE)) — the explicit patent grant is deliberate
for a standard in the patent domain.

## What's here

```
schemas/
├── defs/            common-defs.schema.json   (money, codes, dates, JSON Pointer, prospective right)
├── envelope/        common-envelope.schema.json
├── foundational/    14 structures: asset/entity/document/actor references, actor role
│                    declaration, user context, authority claim, data assertion,
│                    workstream, milestone, outcome details, evidence collection,
│                    agreed price, service level (plus the two resolver profile structures)
├── messages/        all 43 messages: asset bootstrap/match inquiry/match response;
│                    orchestration committed; milestone started/completed/failed/abandoned;
│                    workstream completed/abandoned; service deliverable;
│                    deliverable acknowledged; artifact ready; client action completed;
│                    and since 0.2 work requested; work instruction, instruction
│                    accepted/declined; invoice issued; bid invitation, conflict check
│                    attested, bid submitted/withdrawn/declined, award
│                    proposed/confirmed/declined; since 0.3 request declined
│                    and requester disclosed; and since 0.5 invoice disputed
│                    and invoice cancelled
├── examples/        complete, validated message instances
├── types/           ipproto.d.ts — TypeScript types GENERATED from the schemas
├── index.json       manifest: messageType / structure -> $id -> path
├── validate.mjs     reference validator (ajv)
├── generate-types.mjs   generator for types/ipproto.d.ts
└── package.json     @ipproto/schemas
```

## Conventions

- **Dialect:** JSON Schema draft 2020-12.
- **`$id`:** `urn:ipproto:schema:0.5:<name>`. The version is part of the identity and is
  never reused across versions (see ../VERSIONING.md), so the whole set is re-issued under
  `0.5`; the `0.1`, `0.2`, `0.3` and `0.4` identifiers keep naming the 0.1.0, 0.2.0, 0.3.0
  and 0.4.x sets and nothing else. Cross-schema
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

```bash
npm install json-schema-to-typescript@15.0.4
npm run generate-types            # rewrites types/ipproto.d.ts
node generate-types.mjs --check   # exits 1 if the committed types are out of date
```

The generator version is pinned because its output is committed. Every message type comes out
as an alias of `CommonEnvelope`; payloads are not typed. Rules that say "at least one of" or
"exactly one of" several fields are left to the validator, and those fields are optional in the types.

## Coverage

This release schematizes the **complete protocol surface**: the envelope, all 14 foundational
structures, and all 43 messages plus the Resolution Provenance / Resolved Asset profile structures — bootstrap/discovery, workstream and milestone lifecycle,
work instruction, procurement, deliverable and prepared-action handoff, payments and invoices,
subscriptions, steady-state events (register events, service findings), the full dispute
machinery, and the generic record update. That is 61 schema files: common defs, the envelope,
16 under `foundational/` and 43 under `messages/`.

Forty-five complete examples (messages + structures) validate against the set. The thirteen
carried over from 0.1 keep `"protocolVersion": "0.1"` and the eighteen added in 0.2 keep
`"protocolVersion": "0.2"` on purpose: they show that a 0.1 or 0.2 message validates
unchanged against the 0.5 schemas. The six added in 0.3 cover the two messages of 0.3, a
request and a workstream for a first filing, a document reference without an asset, and
an invoice for a subscription. Five of them are unchanged and keep `"0.3"`, for the same
reason. The sixth, the subscription invoice, now states its month in `billingPeriod` and
says `"0.4"`. The two added in 0.4 are bid invitations for a first filing: one with the
requester withheld and no applicant, one with the requester named. Since 0.4.1 the withheld
one also shows the three sender rules of that release: the applicant as a conflict party, no
requester in any source, and only the jurisdiction the invitation covers. The six added in
0.5 say `"0.5"`: an instruction acceptance recorded by the work requester for the provider
(`recordedBy`), an invoice dispute and the cancellation that answers it, the replacement
invoice with the tax treatment `notStated`, a milestone the work requester abandons because
its provider did not perform, and an actor reference of a supplier identified by VAT and
company register numbers.

Between 0.4 and 0.5 every 0.4 message validates against the 0.5 schemas: all 39 examples of
the tag `v0.4.1` do, unchanged. A strict 0.4 validator accepts the new fields `recordedBy`
and `registrationAuthority`, because unknown fields pass, but rejects the two new message
types and the tax treatment `notStated`.

Between 0.3 and 0.4 validity holds in both directions. Every 0.3 message validates against
the 0.4 schemas: all 37 examples of the tag `v0.3.0` do, unchanged. And a 0.4 message
validates against the 0.3 schemas, because 0.4 adds optional fields only and unknown fields
pass. A 0.3 validator does not check the rules that come with the new fields: no
`requester` and no `applicant` while the requester's identity is withheld, and
`billingPeriod` only on a subscription line.

Further back the reverse does not hold. A 0.3 message that uses what 0.3 added or relaxed
does not validate against the 0.2 schemas; see the *Compatibility* sections of the changelog.
