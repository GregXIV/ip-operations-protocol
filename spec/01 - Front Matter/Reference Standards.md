---
type: front-matter
since: 0.1.0
changed: unreleased
---

# Reference Standards

This protocol references existing standards in three modes. Each external reference is explicitly classified.

## Three referencing modes

**Incorporation by reference** — the protocol says "this field carries a value conformant to standard X" and the external definition is binding. The protocol does not redefine, does not extend, and changes when the referenced standard changes. Right for stable, mature, well-governed standards covering exactly what is needed.

**Structural alignment** — the protocol's data shapes mirror the referenced standard's structure but live in the protocol's own namespace, with a commitment to maintain alignment as the referenced standard evolves. Right for cases where structure is needed but the referenced standard is too document-centric or transport-coupled to use directly.

**Scope demarcation** — the protocol says "this concern is governed by standard X" and references it without redefining its internals. Right for document content and other topics governed elsewhere.

## Reference table

| Standard | Domain | Mode |
|---|---|---|
| WIPO ST.3 | Country, region, and office codes | Incorporation |
| WIPO ST.13 | Application and publication numbering | Incorporation |
| WIPO ST.16 | Kind codes | Incorporation |
| WIPO ST.27 | Legal status events | Structural alignment |
| WIPO ST.37 | Authority files | Scope demarcation |
| WIPO ST.96 | IP information XML — bibliographic | Structural alignment |
| WIPO ST.96 | IP information XML — document content | Scope demarcation |
| WIPO ST.97 | IP data in JSON | Structural alignment, as for ST.96 bibliographic data |
| WIPO ST.90 | Web APIs for IP data | Scope demarcation (transport) |
| ISO 8601 | Dates and times | Incorporation |
| ISO 4217 | Currency codes | Incorporation |
| ISO 17442 | Legal Entity Identifier (LEI) | Incorporation when present |
| ISO 639-1 | Language codes | Incorporation |
| ISO 3166-1 | Country codes (alpha-2) | Incorporation, through ST.3 |
| RFC 6901 | JSON Pointer | Incorporation |
| RFC 6902 | JSON Patch | Incorporation (subset) |
| RFC 9562 | UUIDs in protocol-assigned URIs | Incorporation |
| JSON Schema 2020-12 | The dialect of the published schemas | Incorporation |
| EN 16931 | European electronic invoicing | Incorporation (VAT category codes); scope demarcation (the invoice document) |
| ISO 20022 | Payment messages between financial institutions | Scope demarcation |
| Office-specific schemas (EPO, USPTO, JPO, etc.) | Office-published documents and data | Scope demarcation |

## Notes on specific standards

### ST.13 (application numbers)

Application numbers in the protocol use ST.13 as the recommended format but accommodate the substantial variation in office practice. EPO uses 4-digit year + 6-digit serial + check digit; Japan uses 4-digit year + 6 digits; China uses 4-digit year + 8 digits + check digit. The protocol's [Asset Reference](../02%20-%20Foundational%20Structures/Asset%20Reference.md) identifier sub-structure carries office-specific values as published; ST.13 conformance is aspirational rather than enforced.

### ST.16 (kind codes) and ST.27 (legal status events)

[Register Event](../03%20-%20Messages/Steady-State%20Events/Register%20Event.md) messages align with ST.27 event categorization. The `st27Mapping` field is optional but strongly recommended. Where the protocol's `registerEventCategory` does not map cleanly to ST.27 (e.g., for custom subscription types with no register parallel), the field is omitted, which itself is useful information for receivers — it signals that the event is operational rather than register-derived.

### ST.96 (XML schemas)

[Asset Reference](../02%20-%20Foundational%20Structures/Asset%20Reference.md) bibliographic fields align structurally with ST.96 PatentDocumentIdentification. The protocol carries the same data with structural compatibility — ST.96-conformant adapters can map cleanly in either direction. Document content remains governed by ST.96 where applicable; the protocol carries [Document Reference](../02%20-%20Foundational%20Structures/Document%20Reference.md) pointers, not document internals.

### ST.97 (JSON) and ST.90 (Web APIs)

ST.97 gives the JSON form of ST.96 data, so the alignment of [Asset Reference](../02%20-%20Foundational%20Structures/Asset%20Reference.md) with ST.96 holds for it as well: an adapter maps ST.97 bibliographic data the way it maps ST.96. ST.90 recommends how IP data is exchanged over Web APIs. The protocol does not bind a transport ([Non-Scope](Non-Scope.md)); an implementation that offers an HTTP API may follow ST.90.

### ISO 8601 and the schemas' date formats

This note is informative. The published schemas check dates and date-times with the `date` and `date-time` formats of JSON Schema 2020-12, which are defined by RFC 3339, a profile of ISO 8601. A validator that asserts formats, as the reference validator does, therefore rejects ISO 8601 forms outside that profile, such as a date-time without an offset. The specification's rule stays ISO 8601, as the field pages state.

### EN 16931 and ISO 20022

[Invoice Issued](../03%20-%20Messages/Payments/Invoice%20Issued.md) takes the VAT category codes of a line from EN 16931 as a closed list, and where the invoice document is a structured EN 16931 invoice, that document governs (see its *Tax* section and `invoiceDocumentSyntax`). The execution of a payment belongs to the banking systems and their message standards, such as ISO 20022; [Payment Executed](../03%20-%20Messages/Payments/Payment%20Executed.md) carries the paying agent's claim that the payment was executed, not the payment itself.

### ISO 17442 (LEI)

[Actor Reference](../02%20-%20Foundational%20Structures/Actor%20Reference.md) supports LEI codes as a recognized identifier scheme. LEI is the right cross-actor identifier where present, but is not required — the protocol accommodates actors without LEI through other identifier schemes (EPO representative number, internal references, etc.).

## Conformance commitment

The protocol commits to maintaining alignment with referenced standards as those standards evolve. Where the protocol's operational requirements appear to conflict with a referenced standard, the conflict is treated as a defect in the protocol and resolved in favor of the referenced standard.
