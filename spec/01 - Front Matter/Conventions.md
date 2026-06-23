---
type: front-matter
status: v0.1
---

# Conventions

Naming, type, and structural conventions used throughout the protocol. Reading this once before navigating the rest of the spec is recommended.

## Naming

### URIs

URIs are used pervasively as stable identifiers. All protocol-assigned URIs use the form `urn:ipproto:{type}:{value}`. The `{value}` is typically a UUID. Examples:

- `urn:ipproto:asset:7c4f9a82-3e15-4d0a-9f62-1b8c5e23a4d8`
- `urn:ipproto:workstream:8a4b1c92-...`
- `urn:ipproto:milestone:m1-validation-analysis`
- `urn:ipproto:document:f8e2c91a-...`
- `urn:ipproto:authorityClaim:7c1d4b82-...`

URIs are **opaque** from the protocol's perspective. They do not encode semantic meaning and should not be parsed for content; they are stable handles only.

### Field naming

| Pattern | Use |
|---|---|
| `xUri` | Field carries a single URI |
| `xReferences` | Field carries an array of URIs |
| `xReference` | Field carries a structured reference object containing URI plus metadata, not a bare URI |
| `xAt` | ISO 8601 datetime (full precision, including time and timezone) |
| `xDate` | ISO 8601 date-only (no time component) |
| `xType` | Enumeration value naming a kind |
| `xCategory` | URI naming a typed classification |

Enumeration values are camelCase: `successfullyExecuted`, `actionPerformed`, `informational`, `registerObserverDelegated`. URN namespaces are kebab-case: `urn:ipproto:basis:registerObserverDelegated`.

### URN namespaces

Several controlled vocabularies live in URN namespaces:

- `urn:ipproto:role:` — actor roles within scopes
- `urn:ipproto:basis:` — authority claim bases
- `urn:ipproto:scheme:` — identifier schemes for assets, actors, and entities
- `urn:ipproto:doctype:` — document type classifications
- `urn:ipproto:milestoneCategory:` — milestone work categories
- `urn:ipproto:workstream:` — workstream type classifications
- `urn:ipproto:registerEvent:` — register event categories
- `urn:ipproto:finding:` — service finding categories
- `urn:ipproto:action:` — prepared-action categories
- `urn:ipproto:paymentPurpose:` — payment purpose categories
- `urn:ipproto:evidence:` — evidence type classifications
- `urn:ipproto:trigger:` — subscription trigger types

Custom values in any namespace are allowed but must use namespaced URNs that identify the defining authority. Receivers handling unknown values degrade gracefully to "unknown" rather than failing.

## Structural patterns

### Common envelope

Every message shares a [Common Envelope](../02%20-%20Foundational%20Structures/Common%20Envelope.md) containing message metadata (URI, type, version), originating actor and role, recipients, timestamp, optional correlation, and the message-specific payload. Per-message documentation describes only the payload structure; the envelope is implicit.

### Authority and assertions

Every change to a protocol record is governed by [Authority Claim](../02%20-%20Foundational%20Structures/Authority%20Claim.md) (who has the right) and conveyed through [Data Assertion](../02%20-%20Foundational%20Structures/Data%20Assertion.md) (the actual claim being made). Most messages carry one or more DataAssertions in the envelope's `assertions` array. The architecture is **explicit-authority** rather than CRDT-style merge — conflicts surface as disputes rather than being silently resolved.

### Identity resolution

Entity references (assignees, applicants, inventors, representatives, opponents) carry [resolution context](../02%20-%20Foundational%20Structures/Entity%20Reference.md) showing the literal as observed plus the asserter's resolution to an entity in their graph. Receivers may accept, ignore, or dispute the resolution.

### Event-sourced flow

The protocol is **event-sourced**. Records are populated by sequences of events (messages), and the current state is the result of applying events in order. Authority claims and data assertions are the protocol's primitives; messages are envelopes carrying them.

### Optional fields

Fields marked **optional** may be omitted; receivers must handle absence cleanly. Fields marked **required** must be present; absence is a protocol violation. Fields marked **conditional** are required when a stated condition holds and absent otherwise.

### Extensibility

Where the protocol defines enumerated types, custom values are allowed through namespaced URNs unless the field is explicitly marked as a closed enumeration. The set of standard values is defined in the spec; custom extensions live in custom namespaces.

## Worked examples

Throughout the spec, JSON examples use the following stylistic conventions:

- Stable URIs are written with `-...` suffixes (`urn:ipproto:asset:7c4f9a82-...`) for readability. Real implementations use full UUIDs.
- Timestamps use UTC where reasonable, with the ISO 8601 `Z` suffix.
- Currency amounts use decimal notation with two decimal places (`1080.00`).
- ISO 4217 codes are upper-case (`EUR`, `USD`).
- ISO 3166-1 / ST.3 codes are upper-case (`EP`, `DE`, `FR`, `WO`).

## Versioning

The protocol version is carried in every message's `protocolVersion` field. Version `0.1` is the initial draft. Backward compatibility is a goal but not yet a commitment — until v1.0, breaking changes may occur with consortium ratification.
