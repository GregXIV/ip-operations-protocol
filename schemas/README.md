# Schemas

JSON Schemas, validated examples, generated TypeScript types, and a reference validator
for the IP Operations Protocol **v0.9**. Packaged as `@ipproto/schemas`.

**License:** Apache-2.0 (see [LICENSE](LICENSE)) — the explicit patent grant is deliberate
for a standard in the patent domain.

## What's here

```
schemas/
├── defs/            common-defs.schema.json   (money, codes, dates, JSON Pointer, prospective right)
├── envelope/        common-envelope.schema.json
├── foundational/    15 structures: asset/entity/document/actor references, actor role
│                    declaration, user context, authority claim, data assertion,
│                    workstream, milestone, outcome details, evidence collection,
│                    agreed price, service level (plus the two resolver profile structures)
├── messages/        all 44 messages: asset bootstrap/match inquiry/match response;
│                    orchestration committed; milestone started/completed/failed/abandoned;
│                    workstream completed/abandoned; service deliverable;
│                    deliverable acknowledged; artifact ready; client action completed;
│                    and since 0.2 work requested; work instruction, instruction
│                    accepted/declined; invoice issued; bid invitation, conflict check
│                    attested, bid submitted/withdrawn/declined, award
│                    proposed/confirmed/declined; since 0.3 request declined
│                    and requester disclosed; since 0.5 invoice disputed
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
- **`$id`:** `urn:ipproto:schema:0.9:<name>`. The version is part of the identity and is
  never reused across versions (see ../VERSIONING.md), so the whole set is re-issued under
  `0.9`; the `0.1`, `0.2`, `0.3`, `0.4`, `0.5`, `0.6`, `0.7` and `0.8` identifiers keep naming the
  0.1.0, 0.2.0, 0.3.0, 0.4.x, 0.5.0, 0.6.0, 0.7.0 and 0.8.0 sets and nothing else. Cross-schema
  `$ref`s use these URNs; a validator registers all schemas so the URN refs resolve.
- **Open extension:** `additionalProperties` is intentionally left open. The protocol's
  stated behavior is that receivers degrade gracefully on unknown fields rather than
  rejecting, so the schemas enforce shape, required fields, enums, and formats without
  forbidding extension. Generated TypeScript types are strict for developer ergonomics.
- **No alternative decided by `format` alone** (since 0.9, decision 109). JSON Schema
  2020-12 treats `format` as an annotation unless a validator opts in, so a `oneOf` whose
  branches differ only by `format` fails wherever formats are not asserted. Such
  alternatives are written as `anyOf`.

## Validate

```bash
npm install ajv@8 ajv-formats@3
node validate.mjs                       # validates examples/*
node validate.mjs path/to/message.json  # validates one message by its messageType
```

Since 0.9 CI also validates every example with Python `jsonschema` 4.26 without format
checking (no `rfc3339-validator`), with the same mapping (`messageType`, then
`examples/_index.json`):

```bash
pip install -r ../scripts/requirements-validate.txt
python3 ../scripts/validate_examples.py
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

This release schematizes the **complete protocol surface**: the envelope, all 15 foundational
structures, and all 44 messages plus the Resolution Provenance / Resolved Asset profile structures — bootstrap/discovery, workstream and milestone lifecycle,
work instruction, procurement, deliverable and prepared-action handoff, payments and invoices,
subscriptions, steady-state events (register events, service findings), the full dispute
machinery, and the generic record update. That is 63 schema files: common defs, the envelope,
17 under `foundational/` and 44 under `messages/`.

Sixty-two complete examples (messages + structures) validate against the set. The thirteen
carried over from 0.1 keep `"protocolVersion": "0.1"` and the eighteen added in 0.2 keep
`"protocolVersion": "0.2"` on purpose: they show that a 0.1 or 0.2 message validates
unchanged against the 0.9 schemas. The six added in 0.3 cover the two messages of 0.3, a
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
company register numbers. The four added in 0.6 say `"0.6"`: a mandate instruction that a
provider recorded from its client's e-mail (`recordedBy`, `recordedFrom`, `confidentiality`),
the provider's conflict check on that mandate kept as an internal record
(`clearedAfterReview`, no addressee), a milestone failure with typed deadlines at risk, and
a hearing as a Deadline structure that supersedes an earlier one. The five added in 0.7
say `"0.7"` where they are messages: a workstream in an infringement action with a
counterclaim (`proceedings`, `assetRoles`, court deadlines), a mandate for that action priced
by the hour with a rate table, a budget and a statutory fee floor, a court order whose
originator is an Entity Reference and which records `servedAt`, a flat fee per month with a
budget, and a work instruction that its provider recorded from an e-mail without service
levels or a response deadline. The seven added in 0.8 say `"0.8"`: an hourly invoice whose
lines are time entries with timekeeper, rate role, billing codes and a VAT category, with a
breakdown and an EN 16931 invoice document; an invoice that passes on a court fee outside
the VAT base; a pair of invoices that share one charge between two payors, one taxed and
one reverse-charged, and the milestone that states the payors' shares; a dispute that names
a line by `lineId`; and a payment executed that names the invoice it settles. The one added
in 0.9 is a workstream for a freedom-to-operate opinion that names no asset.

**Fictional patent numbers** (since 0.9, decision 111). Every patent number in an example is
fictional and must not be real. It uses the ST.3 code `XX`, which names no office, in the
digit layout of the number it stands for (`XX 0 000 001 B1`). Where an example shows the
behaviour of one office, it keeps that office's code with a number that cannot exist, and
the page says so: the EP post-grant running example is application `21000000.0`, published
as `EP 0 000 000`. In 0.9 the numbers of earlier examples were replaced this way; nothing
else in them changed.

Between 0.8 and 0.9 every 0.8 message validates against the 0.9 schemas: all 61 examples of
the tag `v0.8.0` do, unchanged, under `validate.mjs` and under Python `jsonschema` without
format checking. A strict 0.8 validator rejects a workstream or a request that names neither
an asset nor a prospective right and, where it does not assert formats, every value of the
four date fields that 0.9 moves from `oneOf` to `anyOf`.

Between 0.7 and 0.8 every 0.7 message validates against the 0.8 schemas: all 54 examples of
the tag `v0.7.0` do, unchanged. A strict 0.7 validator accepts the new optional fields,
because unknown fields pass, but rejects the tax treatment `perLine` and a disputed line
named by `lineId` alone.

Between 0.6 and 0.7 every 0.6 message validates against the 0.7 schemas: all 49 examples of
the tag `v0.6.0` do, unchanged. A strict 0.6 validator accepts the new optional fields,
because unknown fields pass, but rejects the price basis `periodicFlat`, a Document
Reference whose `originator` is an Entity Reference, and a Work Instruction without
`serviceLevels` or `responseDeadline`.

Between 0.5 and 0.6 every 0.5 message validates against the 0.6 schemas: all 45 examples of
the tag `v0.5.0` do, unchanged. A strict 0.5 validator accepts the new fields, because unknown
fields pass, but rejects the Mandate Instruction, the outcome `clearedAfterReview`, a Conflict
Check Attested without `invitationReference`, checked parties given with their roles, and
the new conflict party roles.

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
