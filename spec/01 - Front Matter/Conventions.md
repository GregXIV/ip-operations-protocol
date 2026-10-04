---
type: front-matter
status: v0.5
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
- `urn:ipproto:lineItem:` — line item types of a price, a bid or an invoice: `professionalFee`, `translation`, `officialFee`, `handling`, `disbursement` (added in 0.2) and `subscriptionFee` (added in 0.3; see [Agreed Price](../02%20-%20Foundational%20Structures/Agreed%20Price.md))
- `urn:ipproto:address:` — electronic address types of an [Actor Reference](../02%20-%20Foundational%20Structures/Actor%20Reference.md): `recordResolution` (added in 0.5; see *Record resolution* below)
- `urn:ipproto:serviceLevel:` — service level kinds, naming what a clock measures: `acknowledgement`, `delivery`, `bidResponse`, `introduction` (added in 0.2; see [Service Level](../02%20-%20Foundational%20Structures/Service%20Level.md))

Custom values in any namespace are allowed but must use namespaced URNs that identify the defining authority. Receivers handling unknown values degrade gracefully to "unknown" rather than failing.

## Structural patterns

### Common envelope

Every message shares a [Common Envelope](../02%20-%20Foundational%20Structures/Common%20Envelope.md) containing message metadata (URI, type, version), originating actor and role, recipients, timestamp, optional correlation, and the message-specific payload. Per-message documentation describes only the payload structure; the envelope is implicit.

### Authority and assertions

Every change to a protocol record is governed by [Authority Claim](../02%20-%20Foundational%20Structures/Authority%20Claim.md) (who has the right) and conveyed through [Data Assertion](../02%20-%20Foundational%20Structures/Data%20Assertion.md) (the actual claim being made). Most messages carry one or more DataAssertions in the envelope's `assertions` array. The architecture is **explicit-authority** rather than CRDT-style merge — conflicts surface as disputes rather than being silently resolved.

### Identity resolution

Entity references (assignees, applicants, inventors, representatives, opponents) carry [resolution context](../02%20-%20Foundational%20Structures/Entity%20Reference.md) showing the literal as observed plus the asserter's resolution to an entity in their graph. Receivers may accept, ignore, or dispute the resolution.

### Record resolution

Added in 0.5. Messages name most of the records they rely on by URI only: the originator by its actor URI, its role by a role declaration URI, documents by document URI, the right to change a record by an authority claim URI. Apart from [Requester Disclosed](../03%20-%20Messages/Procurement/Requester%20Disclosed.md) and the `requester` of [Bid Invitation](../03%20-%20Messages/Procurement/Bid%20Invitation.md), which carry a full Actor Reference, no message carries these records. A receiver that needs one resolves its URI:

1. **What is resolvable.** At least [Actor References](../02%20-%20Foundational%20Structures/Actor%20Reference.md), [Actor Role Declarations](../02%20-%20Foundational%20Structures/Actor%20Role%20Declaration.md), [Document References](../02%20-%20Foundational%20Structures/Document%20Reference.md) and [Authority Claims](../02%20-%20Foundational%20Structures/Authority%20Claim.md). Workstream and milestone records may be resolvable in the same way; their state is otherwise built from the messages of the workstream.
2. **Who answers.** The actor that issued the record, that is, the actor that assigned its URI. An actor that sends a message answers for every record the message names: it holds the record, or it can name the issuer. A receiver therefore asks the sender first.
3. **What comes back.** The record in the structure this specification defines, valid against its schema. For a document, that is the Document Reference; the content is fetched from its `storageLocations`, under the access requirements stated there.
4. **Who may resolve.** The issuer decides. It answers at least every actor that produced or was addressed by a message naming the URI, and may refuse anyone else. Resolution never discloses what a message may not: an orchestrator does not serve a withheld requester's Actor Reference to a bidder before [Requester Disclosed](../03%20-%20Messages/Procurement/Requester%20Disclosed.md).
5. **Stability.** An Actor Reference does not change under its URI once it is published (see its *Behavior*). A record that changes over time through assertions, such as an authority claim that is superseded, is returned as the issuer currently holds it.

The transport is open, as for messages (see [Non-Scope](Non-Scope.md)). Two actors may agree any means of resolution. **Recommended shape, not normative:** an HTTPS `GET` of `{base}/records/{uri}`, where `{uri}` is the URI percent-encoded and `{base}` is the address that the issuer's Actor Reference lists with `addressType` `electronic` and `electronicAddressType` `urn:ipproto:address:recordResolution`. The answer is the record as `application/json` with status 200, or status 404 for a URI the issuer does not know and 403 for a caller it does not serve. Schemas resolve by their `$id` from the schema set of the release, as listed in `schemas/index.json` (see the discoverability note in [VERSIONING](../../VERSIONING.md)).

### Event-sourced flow

The protocol is **event-sourced**. Records are populated by sequences of events (messages), and the current state is the result of applying events in order. Authority claims and data assertions are the protocol's primitives; messages are envelopes carrying them.

**A message is a record, not only a transmission.** Stated in 0.5. A message exists once its originator has produced it and it is recorded, whether or not a transport has carried it to another system. Where both parties work on the same platform, the platform records the message between them all the same: the action is one between two organizations, and the record is what makes it auditable and replayable. See requirement OR-J1 of the orchestrator profile in [Conformance](Conformance.md).

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

The protocol version is carried in every message's `protocolVersion` field. Version `0.1` is the initial draft. Version `0.2` adds messages, structures and vocabulary values and removes or renames nothing. A `0.1` receiver that degrades on unknown message types, fields and values keeps working and treats the additions as unknown; one that validates strictly against the 0.1 schemas rejects the new values `softwareService` and `revenueShare` (see [VERSIONING](../../VERSIONING.md)). Version `0.3` adds two messages and relaxes three rules of `0.2`: a workstream no longer needs an existing asset, a document reference no longer needs one either, and an invoice line no longer needs a milestone. A `0.2` message remains valid under `0.3`; a `0.2` receiver that relies on one of these rules must be changed. Version `0.4` adds three optional fields and changes no rule. A `0.3` message remains valid under `0.4`, a `0.3` receiver needs no change, and even a receiver that validates strictly against the 0.3 schemas accepts `0.4` messages, because unknown fields pass. Version `0.5` adds two messages, two optional fields, a tax treatment value, two identifier schemes and a conformance page, and relaxes no rule of `0.4`. A `0.4` message remains valid under `0.5`; a receiver that validates strictly against the 0.4 schemas rejects the two new messages and the value `notStated`, and accepts the rest. Backward compatibility is a goal but not yet a commitment — until v1.0, breaking changes may occur with consortium ratification.
