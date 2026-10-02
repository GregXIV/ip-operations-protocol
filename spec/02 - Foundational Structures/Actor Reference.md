---
type: foundational
status: v0.4
---

# Actor Reference

> Canonical structure for identifying organizations participating in the protocol.

The protocol's actor model is **organization-level** — actors are corporate entities, service provider firms, registers, payment institutions. Individual humans within actors are tracked through [User Context](User%20Context.md).

## Structure

### `actorUri`
Type: URI, required

Stable protocol identifier of the form `urn:ipproto:actor:{uuid}` for protocol-assigned URIs, or namespaced URIs in well-known patterns:

- `urn:ipproto:actor:meridian-ip-group`
- `urn:ipproto:actor:northwind-industries`
- `urn:ipproto:actor:epo`

### `actorType`
Type: enumeration, required

One of: `corporateIpDepartment`, `serviceProvider`, `externalCounsel`, `registerAuthority`, `registerObserver`, `ipmsVendor`, `platformOperator`, `paymentInstitution`, `softwareService`, `other`.

`softwareService` (added in 0.2) is an application that performs work without a person in the loop — a translation engine, a form generator, a search or docketing service. Before 0.2 an application could only appear as a `serviceProvider` whose messages carried the `automatedAgentIndicator` of [User Context](User%20Context.md), which hid what the actor is. The indicator remains: it says who produced one message; the actor type says what the actor is.

Custom actor types use namespaced URNs that identify the defining authority (`urn:example-org:actorType:translationBureau`), as [Ratified Decisions](../05%20-%20Decisions/Ratified%20Decisions.md) decision 3 states. Since 0.2 the schema accepts such values; the 0.1 schema listed the standard values as a closed enumeration. A receiver that does not recognize an actor type treats it as `other`.

The actorType drives default authority semantics — register authorities typically claim source-of-truth over legal status sections; corporate IP departments typically claim ownership over internal sections.

### `identifiers`
Type: array of structured entries, required (at least one)

Each identifier:
- `scheme` — URI naming the identifier system: `urn:ipproto:scheme:lei` (ISO 17442), `urn:ipproto:scheme:duns`, `urn:ipproto:scheme:epoRepNumber`, `urn:ipproto:scheme:internalReference`, etc.
- `value` — the identifier value
- `verifiedAt` — optional ISO 8601 datetime when verification occurred

LEI is the recommended cross-actor identifier for corporate actors. EPO representative number is recommended for European representatives. Office-specific representative numbers handle other jurisdictions.

### `legalName`
Type: string, required

The actor's legal name as registered. `Northwind Industries SE`, `Meridian IP Group & Co. S.à r.l.`, `European Patent Office`.

### `jurisdictionCode`
Type: ST.3 code, optional

Where the actor is registered. `DE` for Northwind Industries, `LU` for Meridian IP Group, `EP` for the EPO.

### `addresses`
Type: array, optional

Postal and electronic addresses. Each entry: `addressType` (enumeration: `principalOffice`, `correspondence`, `electronic`), `addressLines`, `city`, `postalCode`, `countryCode`, `electronicAddressType` (for electronic), `electronicAddressValue`.

### `displayLabel`
Type: string, optional

Human-readable label. Not authoritative.

## Worked example

```json
{
  "actorUri": "urn:ipproto:actor:northwind-industries",
  "actorType": "corporateIpDepartment",
  "identifiers": [
    {
      "scheme": "urn:ipproto:scheme:lei",
      "value": "EXAMPLE0NORTHWIND000"
    }
  ],
  "legalName": "Northwind Industries SE",
  "jurisdictionCode": "DE",
  "addresses": [
    {
      "addressType": "principalOffice",
      "addressLines": ["Beispielallee 1"],
      "city": "Musterstadt",
      "postalCode": "00000",
      "countryCode": "DE"
    }
  ],
  "displayLabel": "Northwind Industries SE"
}
```

The company, its address and its identifier are invented. The identifier has the length of an LEI but is not one: its check digits do not verify.

## Behavior

ActorReferences are immutable once registered. Legal name changes, jurisdiction changes, mergers, and acquisitions produce a new actor URI with a `succeeds` relationship to the previous URI through the [Authority Claim](Authority%20Claim.md) machinery rather than mutating the existing reference.

## Cross-references

- [Actor Role Declaration](Actor%20Role%20Declaration.md) — actors operate under roles within scoped contexts
- [User Context](User%20Context.md) — individual humans within actors
- [Authority Claim](Authority%20Claim.md) — actors hold claims over record sections
- [Entity Reference](Entity%20Reference.md) — when an entity is itself an actor (e.g., assignees)

## See also

- [Reference Standards](../01%20-%20Front%20Matter/Reference%20Standards.md) for ISO 17442 (LEI) treatment
- [Open Questions for Consortium](../05%20-%20Decisions/Open%20Questions%20for%20Consortium.md) for actor-type extensibility
- [Ratified Decisions](../05%20-%20Decisions/Ratified%20Decisions.md) — decision 3 on custom actor types and the 0.2.0 entries
