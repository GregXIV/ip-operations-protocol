---
type: message
category: payments
status: v0.3
---

# Invoice Issued

> A payee issues an invoice to a payor.

## Purpose

Added in 0.2. Carries an invoice as structured data: who invoices whom, for which milestones or subscriptions, in which lines, how much in total, and where the invoice document is.

One message serves both directions of a delivery chain. A supplier invoices the orchestrator for its milestone; the orchestrator invoices the customer once for the whole order. `payee` and `payor` say which it is.

The invoice states what is owed. Paying it is the business of [Payment Authorized](Payment%20Authorized.md) and [Payment Executed](Payment%20Executed.md), as before.

## Producer

The payee: the actor that performed the work, the orchestrator towards its customer, or for a subscription its provider or contract holder.

## Recipients

The actor with `payor` assignment on the invoiced milestones or on the invoiced subscription. Where a subscription names no payor, the subscriber.

A supplier's invoice belongs to the workstream the supplier shares with the orchestrator. Under the addressing rule of [Milestone](../../02%20-%20Foundational%20Structures/Milestone.md) it is not addressed to the customer.

## Payload

### `invoiceReference`
Type: URI, required

Stable identifier `urn:ipproto:invoice:{uuid}`.

### `invoiceNumber`
Type: string, required

The payee's own invoice number, as printed on the document.

### `payee`
Type: structured, required

- `actorUri` — [Actor Reference](../../02%20-%20Foundational%20Structures/Actor%20Reference.md) URI, required
- `roleDeclarationUri` — optional [Actor Role Declaration](../../02%20-%20Foundational%20Structures/Actor%20Role%20Declaration.md) URI

### `payor`
Type: structured, required

Same shape as `payee`.

### `invoiceLines`
Type: array of structured entries, required (at least one)

Each entry:
- `milestoneReference` — milestoneUri, conditional. The milestone the line is charged for
- `subscriptionReference` — URI, conditional. Added in 0.3. The subscription the line is charged for: the `subscriptionReference` of its [Service Subscription Started](../Subscriptions/Service%20Subscription%20Started.md)
- `lineItemType` — URI, required, in the `urn:ipproto:lineItem:` namespace of [Agreed Price](../../02%20-%20Foundational%20Structures/Agreed%20Price.md)
- `amount` — decimal, required, net of tax, in the currency of `totalAmount`
- `description` — optional string

Each line carries exactly one of `milestoneReference` and `subscriptionReference`. In 0.2 every line needed a milestone, so a subscription, such as an application licence or a watch service, could not be invoiced line by line. One invoice may hold lines of both kinds.

A subscription line normally uses the line item type `urn:ipproto:lineItem:subscriptionFee`, added in 0.3 for this purpose. The other five standard types describe work on a milestone.

### `totalAmount`
Type: structured, required

- `amount` — the amount payable: the sum of the lines plus tax
- `currency` — ISO 4217

### `taxHandling`
Type: structured, required

- `taxTreatment` — required. Standard values: `taxed`, `reverseCharge`, `exempt`, `outsideScope`. Custom values use namespaced URNs that identify the defining authority (`urn:example-org:taxTreatment:withholdingApplied`)
- `taxRatePercent` — optional decimal
- `taxAmount` — optional decimal, in the currency of `totalAmount`

The protocol carries how tax was handled. It does not decide how it must be.

**Provisional vocabulary.** The four standard values were set when this message was drafted for 0.2. Nobody who issues invoices has reviewed them, and they may be renamed, split or extended before 1.0. Since 0.3 the list is open to custom values; the 0.2 schema held it as a closed enumeration. A receiver that does not recognize a value treats it as unknown and reads the tax position from the invoice document, which remains the invoice in the legal sense. The question is recorded in [Open Questions for Consortium](../../05%20-%20Decisions/Open%20Questions%20for%20Consortium.md), question 7.

### `dueDate`
Type: ISO 8601 date, required

### `invoiceDocument`
Type: [Document Reference](../../02%20-%20Foundational%20Structures/Document%20Reference.md) URI, required

The invoice as a document, of document type `urn:ipproto:doctype:invoice`. The document is the invoice in the legal sense; this message is its structured announcement.

## Worked example — supplier invoice

The agent invoices the orchestrator for the validation in Spain.

```json
{
  "originatingActor": "urn:ipproto:actor:fabrikam-patentes",
  "addressedTo": [
    {"actorUri": "urn:ipproto:actor:meridian-ip-group", "expectedRole": "urn:ipproto:role:payor"}
  ],
  "correlation": {"workstreamUri": "urn:ipproto:workstream:b-agent-es-001"},
  "payload": {
    "invoiceReference": "urn:ipproto:invoice:fabrikam-2026-3381",
    "invoiceNumber": "FP-2026-3381",
    "payee": {"actorUri": "urn:ipproto:actor:fabrikam-patentes"},
    "payor": {"actorUri": "urn:ipproto:actor:meridian-ip-group"},
    "invoiceLines": [
      {"milestoneReference": "urn:ipproto:milestone:b1-es-validation-agent", "lineItemType": "urn:ipproto:lineItem:professionalFee", "amount": 380.00},
      {"milestoneReference": "urn:ipproto:milestone:b1-es-validation-agent", "lineItemType": "urn:ipproto:lineItem:translation", "amount": 850.00},
      {"milestoneReference": "urn:ipproto:milestone:b1-es-validation-agent", "lineItemType": "urn:ipproto:lineItem:officialFee", "amount": 260.00}
    ],
    "totalAmount": {"amount": 1490.00, "currency": "EUR"},
    "taxHandling": {"taxTreatment": "reverseCharge", "taxAmount": 0.00},
    "dueDate": "2026-12-09",
    "invoiceDocument": "urn:ipproto:document:fabrikam-inv-2026-3381"
  }
}
```

## Worked example — the one customer invoice

The orchestrator invoices the customer for both countries of the order. The lines refer to the milestones of the customer's workstream and to the prices agreed there. The agents' invoices do not appear.

```json
{
  "originatingActor": "urn:ipproto:actor:meridian-ip-group",
  "addressedTo": [
    {"actorUri": "urn:ipproto:actor:contoso-legal", "expectedRole": "urn:ipproto:role:payor"}
  ],
  "correlation": {"workstreamUri": "urn:ipproto:workstream:a-validation-order-001"},
  "payload": {
    "invoiceReference": "urn:ipproto:invoice:meridian-2026-20417",
    "invoiceNumber": "MIG-2026-20417",
    "payee": {"actorUri": "urn:ipproto:actor:meridian-ip-group"},
    "payor": {"actorUri": "urn:ipproto:actor:contoso-legal"},
    "invoiceLines": [
      {"milestoneReference": "urn:ipproto:milestone:a1-es-validation", "lineItemType": "urn:ipproto:lineItem:professionalFee", "amount": 620.00},
      {"milestoneReference": "urn:ipproto:milestone:a1-es-validation", "lineItemType": "urn:ipproto:lineItem:translation", "amount": 1180.00},
      {"milestoneReference": "urn:ipproto:milestone:a1-es-validation", "lineItemType": "urn:ipproto:lineItem:officialFee", "amount": 260.00},
      {"milestoneReference": "urn:ipproto:milestone:a1-es-validation", "lineItemType": "urn:ipproto:lineItem:handling", "amount": 80.00},
      {"milestoneReference": "urn:ipproto:milestone:a2-it-validation", "lineItemType": "urn:ipproto:lineItem:professionalFee", "amount": 690.00},
      {"milestoneReference": "urn:ipproto:milestone:a2-it-validation", "lineItemType": "urn:ipproto:lineItem:translation", "amount": 1390.00},
      {"milestoneReference": "urn:ipproto:milestone:a2-it-validation", "lineItemType": "urn:ipproto:lineItem:officialFee", "amount": 220.00},
      {"milestoneReference": "urn:ipproto:milestone:a2-it-validation", "lineItemType": "urn:ipproto:lineItem:handling", "amount": 80.00}
    ],
    "totalAmount": {"amount": 4520.00, "currency": "EUR"},
    "taxHandling": {"taxTreatment": "reverseCharge", "taxAmount": 0.00},
    "dueDate": "2026-12-20",
    "invoiceDocument": "urn:ipproto:document:meridian-inv-2026-20417"
  }
}
```

## Worked example — subscription invoice

Added in 0.3. The contract holder invoices the subscriber for the first paid month of an application licence. The line refers to the subscription; there is no milestone.

```json
{
  "originatingActor": "urn:ipproto:actor:meridian-ip-group",
  "addressedTo": [
    {"actorUri": "urn:ipproto:actor:northwind-industries", "expectedRole": "urn:ipproto:role:subscriber"}
  ],
  "correlation": {"subscriptionUri": "urn:ipproto:subscription:litware-translate-nw-001"},
  "payload": {
    "invoiceReference": "urn:ipproto:invoice:meridian-2027-00112",
    "invoiceNumber": "MIG-2027-00112",
    "payee": {"actorUri": "urn:ipproto:actor:meridian-ip-group"},
    "payor": {"actorUri": "urn:ipproto:actor:northwind-industries"},
    "invoiceLines": [
      {
        "subscriptionReference": "urn:ipproto:subscription:litware-translate-nw-001",
        "lineItemType": "urn:ipproto:lineItem:subscriptionFee",
        "amount": 245.00,
        "description": "Litware Translate, plan professional, 5 seats, 16 December 2026 to 15 January 2027"
      }
    ],
    "totalAmount": {"amount": 245.00, "currency": "EUR"},
    "taxHandling": {"taxTreatment": "reverseCharge", "taxAmount": 0.00},
    "dueDate": "2027-02-15",
    "invoiceDocument": "urn:ipproto:document:meridian-inv-2027-00112"
  }
}
```

## Behavior on receipt

The payor checks milestone lines against the `agreedPrice` of the milestones they name, and subscription lines against the `commercialTerms` of the subscription. Where the two agree, the payor authorizes payment through [Payment Authorized](Payment%20Authorized.md), with `payeeType: "actor"`.

The protocol does not match invoices to prices and does not reject an invoice that exceeds one. A disagreement over an invoice is settled between the parties.

## Related messages

- Follows [Milestone Completed](../Milestone%20Lifecycle/Milestone%20Completed.md) for the invoiced milestones
- For a subscription line, follows the billing cadence of the subscription begun with [Service Subscription Started](../Subscriptions/Service%20Subscription%20Started.md)
- Paid through [Payment Authorized](Payment%20Authorized.md) and [Payment Executed](Payment%20Executed.md)

## See also

- [Agreed Price](../../02%20-%20Foundational%20Structures/Agreed%20Price.md) — the price an invoice is measured against
- [Document Reference](../../02%20-%20Foundational%20Structures/Document%20Reference.md) — the `invoice` document type
