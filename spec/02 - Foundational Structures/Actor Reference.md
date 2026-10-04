---
type: foundational
status: v0.5
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
- `scheme` — URI naming the identifier system: `urn:ipproto:scheme:lei` (ISO 17442), `urn:ipproto:scheme:duns`, `urn:ipproto:scheme:epoRepNumber`, `urn:ipproto:scheme:internalReference`, and since 0.5 `urn:ipproto:scheme:vat` and `urn:ipproto:scheme:companyRegister` (see below), etc.
- `value` — the identifier value
- `verifiedAt` — optional ISO 8601 datetime when verification occurred
- `registrationAuthority` — string, conditional. Added in 0.5. The register that issued the identifier. Required with the scheme `urn:ipproto:scheme:companyRegister`, optional otherwise. Recommended value: the register's code in the GLEIF Registration Authorities List (the list LEI issuers use to name the business registers of the world); the register's name where it has no code

LEI is the recommended cross-actor identifier for corporate actors. EPO representative number is recommended for European representatives. Office-specific representative numbers handle other jurisdictions.

**VAT and company register numbers.** Added in 0.5. Many suppliers, small firms especially, have neither an LEI nor a DUNS number, but every one of them has a tax number and is entered in a register. Two schemes name them:

- `urn:ipproto:scheme:vat` — a VAT identification number. `value` is the number as issued, with the country prefix the issuing tax authority uses (`DE`, `FR`, `EL` for Greece) and without spaces or punctuation: `DE123456789`. For a number used for VAT or GST outside the European Union, the ISO 3166-1 alpha-2 code of the issuing country followed by the number.
- `urn:ipproto:scheme:companyRegister` — a number in a company or commercial register. `value` is the number as the register prints it (`HRB 12345`); `registrationAuthority` names the register, because the same number exists in many registers (every German local court keeps its own commercial register). The schema requires `registrationAuthority` with this scheme.

Neither replaces an LEI where one exists. Before 0.5 implementations used private scheme names such as `vat`, which are not URNs and which no receiver could rely on.

### `legalName`
Type: string, required

The actor's legal name as registered. `Northwind Industries SE`, `Meridian IP Group & Co. S.à r.l.`, `European Patent Office`.

### `jurisdictionCode`
Type: ST.3 code, optional

Where the actor is registered. `DE` for Northwind Industries, `LU` for Meridian IP Group, `EP` for the EPO.

### `addresses`
Type: array, optional

Postal and electronic addresses. Each entry: `addressType` (enumeration: `principalOffice`, `correspondence`, `electronic`), `addressLines`, `city`, `postalCode`, `countryCode`, `electronicAddressType` (for electronic), `electronicAddressValue`.

An electronic address with `electronicAddressType` `urn:ipproto:address:recordResolution` (added in 0.5) is the base address at which the actor resolves the records it issued. See *Record resolution* in [Conventions](../01%20-%20Front%20Matter/Conventions.md).

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

A supplier without an LEI, identified by its VAT and register numbers (added in 0.5). All values are invented, the register code too.

```json
{
  "actorUri": "urn:ipproto:actor:fabrikam-patentes",
  "actorType": "serviceProvider",
  "identifiers": [
    {"scheme": "urn:ipproto:scheme:vat", "value": "ESB00000000", "verifiedAt": "2026-09-14T08:00:00Z"},
    {"scheme": "urn:ipproto:scheme:companyRegister", "value": "M-000000", "registrationAuthority": "RA999999"},
    {"scheme": "urn:ipproto:scheme:epoRepNumber", "value": "000000"}
  ],
  "legalName": "Fabrikam Patentes S.L.",
  "jurisdictionCode": "ES"
}
```

The full structure, with addresses, is `actor-reference-supplier.example.json` in `schemas/examples/`.

## Behavior

ActorReferences are immutable once published. Legal name changes, jurisdiction changes, mergers, and acquisitions produce a new actor URI with a `succeeds` relationship to the previous URI through the [Authority Claim](Authority%20Claim.md) machinery rather than mutating the existing reference.

**When immutability begins.** Stated in 0.5. An Actor Reference is published when another actor can first see it: when its `actorUri` first appears in a message sent to another actor, or when the reference is first served through record resolution (see *Record resolution* in [Conventions](../01%20-%20Front%20Matter/Conventions.md)). Before that, the actor that keeps the reference may correct it, for example a misspelt legal name found while the organization is being verified; nobody has relied on it yet. From then on a change of legal name or jurisdiction takes a new actor URI as described above. Adding an identifier, or the `verifiedAt` of an identifier, describes the same actor and is not such a change. Until 0.5 this page said "once registered", which left open whether entering an organization in one's own system already counted.

## Cross-references

- [Actor Role Declaration](Actor%20Role%20Declaration.md) — actors operate under roles within scoped contexts
- [User Context](User%20Context.md) — individual humans within actors
- [Authority Claim](Authority%20Claim.md) — actors hold claims over record sections
- [Entity Reference](Entity%20Reference.md) — when an entity is itself an actor (e.g., assignees)

## See also

- [Reference Standards](../01%20-%20Front%20Matter/Reference%20Standards.md) for ISO 17442 (LEI) treatment
- [Open Questions for Consortium](../05%20-%20Decisions/Open%20Questions%20for%20Consortium.md) for actor-type extensibility
- [Ratified Decisions](../05%20-%20Decisions/Ratified%20Decisions.md) — decision 3 on custom actor types and the 0.2.0 entries
