---
type: message
category: payments
status: v0.8
---

# Invoice Issued

> A payee issues an invoice to a payor.

## Purpose

Added in 0.2. Carries an invoice as structured data: who invoices whom, for which milestones or subscriptions, in which lines, how much in total, and where the invoice document is.

One message serves both directions of a delivery chain. A supplier invoices the orchestrator for its milestone; the orchestrator invoices the customer once for the whole order. `payee` and `payor` say which it is.

Since 0.8 an invoice can carry what a firm's invoice holds: time entries with hours, rate and timekeeper, task and activity codes, the VAT category of each line and a breakdown per category, amounts passed on outside the VAT base, the date of issue and the tax identifiers of both parties, and the share of each payor where several share a charge. All of it is optional; an invoice of 0.2 is still valid as it was.

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

**Tax identifiers.** Added in 0.8 (decision 100). `payee` and `payor` may each carry `taxIdentifier`: the VAT identification number under which the party is invoiced, an identifier of the shape used on [Actor Reference](../../02%20-%20Foundational%20Structures/Actor%20Reference.md) (`scheme`, `value`), with the scheme `urn:ipproto:scheme:vat` of decision 65 or, outside VAT, a namespaced scheme of the authority that issues the number. Where the party's Actor Reference lists VAT numbers, `taxIdentifier` is one of them: an actor registered for VAT in several countries is invoiced under one, and the invoice says which. A reverse-charge invoice normally states the payor's.

### `issueDate`
Type: ISO 8601 date, conditional

Added in 0.8 (decision 97). The date of issue printed on the invoice document. Required when the invoice carries a `taxBreakdown`, optional otherwise. It is not `producedAt`: an invoice entered in the protocol days after it was issued keeps the date it was issued.

The field is not required for every invoice, because every invoice issued since 0.2 was valid without it and a minor version does not invalidate them; the invoice document always carried the date. An invoice that states its tax in the detail of 0.8 states its date as well, since the two belong together in every tax regime the protocol has met.

### `buyerReference`
Type: string, optional

Added in 0.8 (decision 100). The reference the payor asked to be quoted on its invoices, such as an order number, a cost-centre code or the payor's matter number, as the payor gave it. Where the invoice document is an EN 16931 instance, this is its buyer reference.

### `invoiceLines`
Type: array of structured entries, required (at least one)

Each entry:
- `milestoneReference` — milestoneUri, conditional. The milestone the line is charged for
- `subscriptionReference` — URI, conditional. Added in 0.3. The subscription the line is charged for: the `subscriptionReference` of its [Service Subscription Started](../Subscriptions/Service%20Subscription%20Started.md)
- `billingPeriod` — structured, optional, only on a line that carries `subscriptionReference`. Added in 0.4. The period the line is charged for: `from` and `to`, both ISO 8601 dates, both required
- `servicePeriod` — structured, optional, only on a line that carries `milestoneReference`. Added in 0.8. The period in which the work charged on the line was done: `from` and `to`, both ISO 8601 dates, both required, both inclusive, as in `billingPeriod`
- `lineItemType` — URI, required, in the `urn:ipproto:lineItem:` namespace of [Agreed Price](../../02%20-%20Foundational%20Structures/Agreed%20Price.md)
- `amount` — decimal, required, net of tax, in the currency of `totalAmount`
- `description` — optional string

Since 0.8 a line may also carry the detail of a time entry or an expense, and its tax category. All of it is optional, for every actor (see *Line detail* and *Tax* below):

- `lineId` — string, optional. The payee's own identifier of the line, unique within the invoice
- `quantity` — decimal, optional. How many `unit`s the line charges
- `unit` — optional. Standard values: `hour`, `day`, `item`, `page`, `word`; custom units as namespaced URNs. Required with `quantity`
- `unitPrice` — decimal, optional, net of tax, in the currency of `totalAmount`. The price of one `unit`
- `serviceDate` — ISO 8601 date, optional. The day the work or the expense of the line took place. Not used together with `servicePeriod`
- `timekeeper` — string, optional. The provider's own identifier of the person whose time the line charges, as in the `rateTable` of [Agreed Price](../../02%20-%20Foundational%20Structures/Agreed%20Price.md)
- `rateRole` — URI, optional. The role in which that time is charged, from `urn:ipproto:rateRole:` or a namespaced URN, as in the `rateTable`
- `billingCodes` — array, optional (at least one entry when present). Task, activity or expense codes from a code set the parties use. Each entry: `codeSet` (URI, required, a namespaced URN of the code set), `codeType` (`task`, `activity`, `expense`, `other`; required, closed) and `code` (string, required)
- `taxCategory` — structured, optional. The VAT category of the line: `categoryCode` (required, closed: an EN 16931 VAT category code, see *Tax*), `ratePercent` (decimal, required unless `categoryCode` is `O`), `exemptionReason` (optional string) and `exemptionReasonCode` (optional string, from the code list the EN 16931 instance uses)
- `passThrough` — boolean, optional, default `false`. The line passes on an amount the payee paid in the payor's name and on its account, at cost and outside the payee's own VAT base, such as a court fee advanced for the client. A pass-through line carries no `taxCategory`

Each line carries exactly one of `milestoneReference` and `subscriptionReference`. In 0.2 every line needed a milestone, so a subscription, such as an application licence or a watch service, could not be invoiced line by line. One invoice may hold lines of both kinds.

A subscription line normally uses the line item type `urn:ipproto:lineItem:subscriptionFee`, added in 0.3 for this purpose. The other five standard types describe work on a milestone.

**Billing period.** A subscription is charged for a period, and anyone who reconciles invoices needs it as data. Since 0.4 a subscription line states it in `billingPeriod`. `from` is the first day the line covers and `to` the last; both days are included, so a month from 16 December to 15 January is `"from": "2026-12-16", "to": "2027-01-15"`, and a single day has the same date twice. `to` is not before `from`. In 0.3 the period could only be written into `description`.

The field is optional: a 0.3 subscription line has none and remains valid, and a fee that is not charged for a period, such as a fee per finding, needs none. It belongs to subscription lines only. The schema rejects a `billingPeriod` on a line that carries a `milestoneReference`, and one that lacks `from` or `to`. That `to` is not before `from` is a rule the sender follows; JSON Schema cannot compare two values, so a receiver that depends on the order checks it itself.

**Service period.** Added in 0.8 (decision 97). A milestone line may state the period in which its work was done, in `servicePeriod`, with the same shape and rules as `billingPeriod`: both days included, `to` not before `from`. The schema rejects a `servicePeriod` on a line that carries a `subscriptionReference`; a subscription line states its period in `billingPeriod`. A line that charges work of a single day may state that day in `serviceDate` instead. A line carries at most one of `servicePeriod` and `serviceDate`.

#### Line detail

Added in 0.8 (decision 95). A provider that charges by time can show each time entry as a line, and an expense as a line of its own. Until 0.8 a line carried only its type, its amount and a description, so the hours, the rate and who worked them could only be written into `description` or into the document.

- **One time entry, one line.** A time entry is a line with `lineItemType` `professionalFee`, `unit` `hour`, `quantity` the hours worked, `unitPrice` the rate and `amount` the product. Hours are stated to one decimal (`1.5`, not `1.50` or `1.55`); finer units of time are rounded by the payee before it invoices. `timekeeper` and `rateRole` name whose time it is, by the same identifier and role as the `rateTable` of the agreed price, so that the payor can check each rate against the table; a timekeeper entry of the table takes precedence over a role entry, as there. A timekeeper is named by the provider's own identifier and not by a full name (G12 of [Conformance](../../01%20-%20Front%20Matter/Conformance.md)).
- **Amount, quantity and unit price.** Where a line carries `quantity` and `unitPrice`, `amount` is their product, rounded to the minor unit of the currency. `amount` stays required and is what the line charges; a line that charges less than the product, for instance time written off in part, states the reduced `amount` and says why in `description`. `unit` is required with `quantity`; the schema checks this. That `amount` is the product, and that hours have one decimal, are sender rules the schema cannot check.
- **Codes.** `billingCodes` carry task, activity and expense codes from a code set the parties agree, named by a namespaced URN of the authority that defines it. The UTBMS code sets are one such vocabulary, used here as an example; the protocol defines no code set and requires none.
- **`lineId`.** The payee's identifier of the line, unique within the invoice. It lets the payor name a line in [Invoice Disputed](Invoice%20Disputed.md) by something other than its position, and lets a payee map the line to its time-recording system. A replacement invoice may reuse the `lineId`s of the invoice it replaces for the same charges.
- **An electronic billing file.** Where the parties exchange line detail as a file, such as a LEDES 1998B file, the payee names it in `supportingDocuments` as a Document Reference of type `urn:ipproto:doctype:billingDetail`. The file and the lines of the message describe the same charges; where both are given, they agree.

The detail is optional for every actor and in every profile. A fixed price invoiced as one line needs none, and an invoice without it is as valid as before.

Each line carries exactly one of `milestoneReference` and `subscriptionReference`, also a time entry: under a mandate the time is charged on the milestone of the mandate it was spent on.

### `totalAmount`
Type: structured, required

- `amount` — the amount payable: the sum of the lines plus tax
- `currency` — ISO 4217

Pass-through lines are part of the sum: `totalAmount` is what the payor pays, tax and amounts passed on at cost included.

### `taxHandling`
Type: structured, required

- `taxTreatment` — required. Standard values: `taxed`, `reverseCharge`, `exempt`, `outsideScope`, since 0.5 `notStated`, and since 0.8 `perLine`. Custom values use namespaced URNs that identify the defining authority (`urn:example-org:taxTreatment:withholdingApplied`)
- `taxRatePercent` — optional decimal
- `taxAmount` — optional decimal, in the currency of `totalAmount`

The protocol carries how tax was handled. It does not decide how it must be.

**`notStated`.** Added in 0.5. The sender does not know the treatment: the data from which it produces the message does not state it, typically because the invoice was entered from a document whose tax position was not captured. `notStated` claims nothing about the tax position, neither that tax is due nor that none is; the invoice document says what applies. It is not a substitute for the treatment the payee knows: a payee that issues its own invoice states the treatment. `taxRatePercent` and `taxAmount` are normally absent beside it, and a `taxBreakdown` is not given with it.

**`perLine`.** Added in 0.8 (decision 98). The lines are treated differently, for instance a taxed fee beside an exempt one, and the treatment is stated per line in `taxCategory` and per category in `taxBreakdown`, which is then required. `taxRatePercent` is not given beside it. Pass-through lines do not make an invoice `perLine`: an invoice whose only lines outside its one treatment are pass-through lines keeps that treatment.

**Ratified in 0.8.** The vocabulary was provisional from 0.2 to 0.7 ([Open Questions for Consortium](../../05%20-%20Decisions/Open%20Questions%20for%20Consortium.md), question 7). In 0.8 it is ratified as it stands, with `perLine` added, and aligned with EN 16931 through the line categories below (decision 102). It stays open to custom values. A receiver that does not recognize a value treats it as unknown and reads the tax position from the invoice document.

### Tax

Added in 0.8 (decision 98). The invoice-level `taxTreatment` stays required and is enough where one treatment applies to every line, as before. Where a sender knows more, it states the VAT category of each line and a breakdown per category, in the terms of EN 16931, the European standard for the semantic model of an electronic invoice. The protocol adopts its VAT category codes; it does not adopt the rest of the model and requires no electronic invoice.

**Line categories.** `taxCategory.categoryCode` is one of the EN 16931 VAT category codes (code list UNTDID 5305 as restricted by EN 16931):

| Code | Meaning | Usual `taxTreatment` where it is the only category |
|---|---|---|
| `S` | standard rate | `taxed` |
| `Z` | zero rated goods | `taxed` |
| `E` | exempt from tax | `exempt` |
| `AE` | VAT reverse charge | `reverseCharge` |
| `K` | intra-community supply of goods, exempt | `exempt` |
| `G` | export outside the EU, exempt | `exempt` |
| `O` | services outside the scope of tax | `outsideScope` |
| `L` | Canary Islands general indirect tax | `taxed` |
| `M` | tax for production, services and importation in Ceuta and Melilla | `taxed` |

Closed enumeration: the code list belongs to EN 16931, and the protocol does not extend it. `ratePercent` is the rate applied, `0` where no tax is charged (`E`, `AE`, `K`, `G`, `Z`), and is omitted only for `O`. `exemptionReason` and `exemptionReasonCode` state why no tax is charged, as the document states it; the reason code comes from the code list the EN 16931 instance uses for it.

Where a line carries `taxCategory`, every line of the invoice that is not a pass-through line carries one: a breakdown with some lines categorised and others not could not be checked.

### `taxBreakdown`
Type: array of structured entries, conditional (at least one entry)

Added in 0.8 (decision 98). Required with `taxTreatment` `perLine` and where any line carries `taxCategory`; optional otherwise. One entry per combination of category and rate:

- `categoryCode` — as on the lines, required
- `ratePercent` — decimal, required unless `categoryCode` is `O`
- `taxableAmount` — decimal, required: the sum of the `amount` of the lines in this category and rate
- `taxAmount` — decimal, required: the tax on `taxableAmount`, `0` where none is charged
- `exemptionReason`, `exemptionReasonCode` — optional, as on the lines

The breakdown adds up: the `taxableAmount`s are the sum of the lines that are not pass-through lines, `taxHandling.taxAmount` where given is the sum of the `taxAmount`s, and `totalAmount.amount` is the sum of all lines plus the sum of the `taxAmount`s. An invoice that carries a breakdown carries `issueDate`. These are sender rules; the schema checks that a breakdown is present where it must be, not that it adds up.

### Treatment, categories and pass-through lines

**Treatment and categories agree.** Where the invoice carries line categories and a treatment other than `perLine`, every category is consistent with the treatment as in the table above. A receiver that finds them inconsistent follows the categories and may dispute the invoice with reason `taxTreatmentIncorrect`.

**Pass-through lines.** Added in 0.8 (decision 99). A line with `passThrough: true` passes on an amount the payee paid in the payor's name and on its account, such as a court fee advanced on filing, at cost and without a mark-up. It is outside the payee's VAT base: it carries no `taxCategory`, appears in no `taxBreakdown` entry, and is included in `totalAmount`. Its `lineItemType` is normally `officialFee` (which includes court fees, decision 85) or `disbursement`. Whether an amount may be passed on outside the VAT base is a question of the law that applies to the payee; the flag records the payee's position and the protocol does not check it. An expense the payee bought in its own name and charges on, with or without a mark-up, is not a pass-through line; it is a `disbursement` line with a category of its own.

Withholding tax is not carried in the breakdown. Where one applies, the payee states it with a custom treatment or in the document, as before.

### `dueDate`
Type: ISO 8601 date, required

### `invoiceDocument`
Type: [Document Reference](../../02%20-%20Foundational%20Structures/Document%20Reference.md) URI, required

The invoice as a document, of document type `urn:ipproto:doctype:invoice`. The document is the invoice in the legal sense; this message is its structured announcement.

### `invoiceDocumentSyntax`
Type: optional

Added in 0.8 (decision 101). The syntax of the invoice document where it is a structured electronic invoice. Standard values: `en16931Cii` (an EN 16931 instance in the UN/CEFACT Cross Industry Invoice syntax) and `en16931Ubl` (an EN 16931 instance in the OASIS UBL syntax). A national or sector specification built on EN 16931 is still one of the two, by the syntax it uses. Other syntaxes take namespaced URNs of the authority that defines them. Absent where the document is not a structured invoice, such as a PDF, or where the sender does not say.

**An EN 16931 document wins.** The document has always been the invoice in the legal sense. Where `invoiceDocumentSyntax` is `en16931Cii` or `en16931Ubl`, every value this message carries that the document also carries is the value of the document: the invoice number, `issueDate`, `dueDate`, the tax identifiers of payee and payor, `buyerReference`, the amount, quantity, unit price and tax category of each line, the breakdown, the tax amount and the total. The message does not contradict the document. It may carry less than the document, and it may carry what the document has no place for, such as `milestoneReference`, `timekeeper` or `allocation`. A receiver that finds a contradiction follows the document, and may dispute the invoice with reason `formalDefect`.

Where the document is not structured, the rule of 0.2 stands unchanged: the document is the invoice in the legal sense, and the message is its structured announcement. The message is still not meant to contradict it, but no receiver can check that by machine.

### `supportingDocuments`
Type: array of [Document Reference](../../02%20-%20Foundational%20Structures/Document%20Reference.md) URIs, optional (at least one entry when present)

Added in 0.8 (decision 95). Documents that support the invoice without being the invoice: an electronic billing file of type `urn:ipproto:doctype:billingDetail`, such as a LEDES 1998B file; a receipt for a fee passed on, of type `officialFeeReceipt`; a timesheet. None of them replaces `invoiceDocument`.

### `allocation`
Type: structured, optional

Added in 0.8 (decision 103). Where one charge is shared between several payors, each payor receives its own invoice, as before: an invoice has one `payor`. `allocation` tells each payor that its invoice is its share of a charge invoiced to several:

- `sharePercent` — decimal, required, greater than 0 and not above 100. The payor's share of the shared charge
- `siblingInvoiceReferences` — array of URIs, optional (at least one entry when present). The `invoiceReference`s of the invoices that charge the other shares. The payee assigns them, so it may name them before they are sent, as with `replacementInvoiceReference` of [Invoice Cancelled](Invoice%20Cancelled.md)
- `note` — optional string

The lines and the total of each invoice are that payor's share: what this payor owes, not the whole charge. The share is applied to each line and the result rounded to the minor unit of the currency; any rounding difference goes to the invoice of the largest share, or, where shares are equal, to the first sibling the payee issues. The shares of the sibling invoices add up to 100. Where the milestones invoiced carry `payorShare` on their payor assignments (see [Milestone](../../02%20-%20Foundational%20Structures/Milestone.md), `actorAssignments`), `sharePercent` is the share of this payor there.

Each sibling invoice is a full invoice of its own, with its own number, tax identifiers and tax: each payor may be taxed differently, so a reverse-charge share may sit beside a taxed one. A cancellation of one sibling does not cancel the others; where the shares change, the payee cancels every sibling and issues new ones.

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

Added in 0.3. The contract holder invoices the subscriber for the first paid month of an application licence. The line refers to the subscription; there is no milestone. Since 0.4 the month is stated in `billingPeriod` instead of in the description.

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
        "billingPeriod": {"from": "2026-12-16", "to": "2027-01-15"},
        "lineItemType": "urn:ipproto:lineItem:subscriptionFee",
        "amount": 245.00,
        "description": "Litware Translate, plan professional, 5 seats"
      }
    ],
    "totalAmount": {"amount": 245.00, "currency": "EUR"},
    "taxHandling": {"taxTreatment": "reverseCharge", "taxAmount": 0.00},
    "dueDate": "2027-02-15",
    "invoiceDocument": "urn:ipproto:document:meridian-inv-2027-00112"
  }
}
```

## Worked example — hourly invoice with time entries

Added in 0.8. Counsel instructed directly under a mandate priced by the hour with a rate table (see the worked example in [Mandate Instruction](../Work%20Instruction/Mandate%20Instruction.md)) invoices the client for the first month's work on the statement of claim. Each time entry is a line, with its hours to one decimal, the rate of the table, the timekeeper by the firm's own identifier and its role, and task and activity codes from a code set the parties agreed. Associate `WG-017` is charged at the individually agreed 380.00, not the role rate of 340.00, because a timekeeper entry of the table takes precedence. Every line is taxed at the standard rate, so the treatment stays `taxed` and the breakdown has one entry. The document is an EN 16931 instance, so it wins over the message, and the line detail also travels as a billing file.

```json
{
  "originatingActor": "urn:ipproto:actor:woodgrove-ip",
  "addressedTo": [
    {
      "actorUri": "urn:ipproto:actor:northwind-industries",
      "expectedRole": "urn:ipproto:role:payor"
    }
  ],
  "confidentiality": {
    "level": "confidential"
  },
  "correlation": {
    "workstreamUri": "urn:ipproto:workstream:inf-0001"
  },
  "payload": {
    "invoiceReference": "urn:ipproto:invoice:woodgrove-2027-0042",
    "invoiceNumber": "WG-2027-0042",
    "payee": {
      "actorUri": "urn:ipproto:actor:woodgrove-ip",
      "roleDeclarationUri": "urn:ipproto:roleDeclaration:woodgrove-provider-inf-0001",
      "taxIdentifier": {
        "scheme": "urn:ipproto:scheme:vat",
        "value": "DE000000000"
      }
    },
    "payor": {
      "actorUri": "urn:ipproto:actor:northwind-industries",
      "roleDeclarationUri": "urn:ipproto:roleDeclaration:northwind-requester-inf-0001",
      "taxIdentifier": {
        "scheme": "urn:ipproto:scheme:vat",
        "value": "DE999999999"
      }
    },
    "issueDate": "2027-02-03",
    "buyerReference": "NW-LEGAL-2026-091",
    "invoiceLines": [
      {
        "lineId": "T-0001",
        "milestoneReference": "urn:ipproto:milestone:inf-0001-m1-claim",
        "lineItemType": "urn:ipproto:lineItem:professionalFee",
        "quantity": 3.5,
        "unit": "hour",
        "unitPrice": 520.0,
        "amount": 1820.0,
        "serviceDate": "2027-01-12",
        "timekeeper": "WG-003",
        "rateRole": "urn:ipproto:rateRole:partner",
        "billingCodes": [
          {
            "codeSet": "urn:example-billing:codeSet:utbms-litigation",
            "codeType": "task",
            "code": "L210"
          },
          {
            "codeSet": "urn:example-billing:codeSet:utbms-litigation",
            "codeType": "activity",
            "code": "A104"
          }
        ],
        "taxCategory": {
          "categoryCode": "S",
          "ratePercent": 19.0
        },
        "description": "Review of the infringement analysis; strategy for the statement of claim"
      },
      "… T-0002 (WG-017, associate, 6.0 h at 380.00) and T-0003 (WG-031, paralegal, 1.5 h at 140.00) …",
      {
        "lineId": "E-0001",
        "milestoneReference": "urn:ipproto:milestone:inf-0001-m1-claim",
        "lineItemType": "urn:ipproto:lineItem:disbursement",
        "quantity": 1,
        "unit": "item",
        "unitPrice": 48.0,
        "amount": 48.0,
        "serviceDate": "2027-01-15",
        "billingCodes": [
          {
            "codeSet": "urn:example-billing:codeSet:utbms-litigation",
            "codeType": "expense",
            "code": "E107"
          }
        ],
        "taxCategory": {
          "categoryCode": "S",
          "ratePercent": 19.0
        },
        "description": "Courier, exhibit originals to the Client"
      }
    ],
    "totalAmount": {
      "amount": 5186.02,
      "currency": "EUR"
    },
    "taxHandling": {
      "taxTreatment": "taxed",
      "taxRatePercent": 19.0,
      "taxAmount": 828.02
    },
    "taxBreakdown": [
      {
        "categoryCode": "S",
        "ratePercent": 19.0,
        "taxableAmount": 4358.0,
        "taxAmount": 828.02
      }
    ],
    "dueDate": "2027-03-05",
    "invoiceDocument": "urn:ipproto:document:woodgrove-inv-2027-0042",
    "invoiceDocumentSyntax": "en16931Cii",
    "supportingDocuments": [
      "urn:ipproto:document:woodgrove-billing-detail-2027-0042"
    ]
  }
}
```

The full message, with all four lines, is `invoice-issued-hourly-time-entries.example.json` in `schemas/examples/`. The taxable amount is 1,820.00 + 2,280.00 + 210.00 + 48.00 = 4,358.00; tax at 19 % is 828.02; the total is 5,186.02.

## Worked example — a court fee passed on

Added in 0.8. Counsel invoices the filing of the statement of claim and passes on the court fee it advanced in the client's name. The fee line is a pass-through line: no tax category, not in the breakdown, part of the total. The document is a PDF, so no syntax is given and the precedence rule of an EN 16931 document does not apply.

```json
{
  "originatingActor": "urn:ipproto:actor:woodgrove-ip",
  "correlation": {
    "workstreamUri": "urn:ipproto:workstream:inf-0001"
  },
  "payload": {
    "invoiceReference": "urn:ipproto:invoice:woodgrove-2027-0051",
    "invoiceNumber": "WG-2027-0051",
    "payee": {
      "actorUri": "urn:ipproto:actor:woodgrove-ip",
      "roleDeclarationUri": "urn:ipproto:roleDeclaration:woodgrove-provider-inf-0001",
      "taxIdentifier": {
        "scheme": "urn:ipproto:scheme:vat",
        "value": "DE000000000"
      }
    },
    "payor": {
      "actorUri": "urn:ipproto:actor:northwind-industries",
      "roleDeclarationUri": "urn:ipproto:roleDeclaration:northwind-requester-inf-0001"
    },
    "issueDate": "2027-02-12",
    "buyerReference": "NW-LEGAL-2026-091",
    "invoiceLines": [
      {
        "lineId": "F-0001",
        "milestoneReference": "urn:ipproto:milestone:inf-0001-m2-filing",
        "servicePeriod": {
          "from": "2027-02-01",
          "to": "2027-02-10"
        },
        "lineItemType": "urn:ipproto:lineItem:professionalFee",
        "amount": 1200.0,
        "taxCategory": {
          "categoryCode": "S",
          "ratePercent": 19.0
        },
        "description": "Finalising and filing the statement of claim"
      },
      {
        "lineId": "P-0001",
        "milestoneReference": "urn:ipproto:milestone:inf-0001-m2-filing",
        "serviceDate": "2027-02-10",
        "lineItemType": "urn:ipproto:lineItem:officialFee",
        "amount": 9000.0,
        "passThrough": true,
        "description": "Court fee for the infringement action, advanced in the Client's name on filing"
      }
    ],
    "totalAmount": {
      "amount": 10428.0,
      "currency": "EUR"
    },
    "taxHandling": {
      "taxTreatment": "taxed",
      "taxRatePercent": 19.0,
      "taxAmount": 228.0
    },
    "taxBreakdown": [
      {
        "categoryCode": "S",
        "ratePercent": 19.0,
        "taxableAmount": 1200.0,
        "taxAmount": 228.0
      }
    ],
    "dueDate": "2027-02-26",
    "invoiceDocument": "urn:ipproto:document:woodgrove-inv-2027-0051",
    "supportingDocuments": [
      "urn:ipproto:document:court-fee-receipt-inf-0001"
    ]
  }
}
```

The full message is `invoice-issued-pass-through-court-fee.example.json` in `schemas/examples/`. The total is 1,200.00 + 228.00 tax + 9,000.00 passed on = 10,428.00.

## Worked example — two payors sharing one charge

Added in 0.8. Two companies oppose a patent jointly through the same counsel and share its fixed fee of 8,000.00 and the opposition fee of 880.00, 60 to 40, as the milestone's payor assignments state (`milestone-split-payors.example.json`). Each receives its own invoice for its share, naming the other in `allocation`. The first payor is taxed at the standard rate; the second is established in another Member State and the reverse charge applies to it. Only the payload parts that differ are shown.

```json
{
  "invoiceReference": "urn:ipproto:invoice:woodgrove-2027-0060",
  "payor": {
    "actorUri": "urn:ipproto:actor:northwind-industries",
    "roleDeclarationUri": "urn:ipproto:roleDeclaration:northwind-requester-opp-joint-0001",
    "taxIdentifier": {
      "scheme": "urn:ipproto:scheme:vat",
      "value": "DE999999999"
    }
  },
  "invoiceLines": [
    {
      "lineId": "F-0001",
      "milestoneReference": "urn:ipproto:milestone:opp-joint-0001-m1-notice",
      "servicePeriod": {
        "from": "2027-03-01",
        "to": "2027-04-30"
      },
      "lineItemType": "urn:ipproto:lineItem:professionalFee",
      "amount": 4800.0,
      "taxCategory": {
        "categoryCode": "S",
        "ratePercent": 19.0
      },
      "description": "Notice of opposition, fixed fee of EUR 8,000.00; 60 % share"
    },
    {
      "lineId": "P-0001",
      "milestoneReference": "urn:ipproto:milestone:opp-joint-0001-m1-notice",
      "serviceDate": "2027-04-28",
      "lineItemType": "urn:ipproto:lineItem:officialFee",
      "amount": 528.0,
      "passThrough": true,
      "description": "Opposition fee of EUR 880.00 paid in the opponents' name; 60 % share"
    }
  ],
  "totalAmount": {
    "amount": 6240.0,
    "currency": "EUR"
  },
  "taxHandling": {
    "taxTreatment": "taxed",
    "taxRatePercent": 19.0,
    "taxAmount": 912.0
  },
  "taxBreakdown": [
    {
      "categoryCode": "S",
      "ratePercent": 19.0,
      "taxableAmount": 4800.0,
      "taxAmount": 912.0
    }
  ],
  "allocation": {
    "sharePercent": 60.0,
    "siblingInvoiceReferences": [
      "urn:ipproto:invoice:woodgrove-2027-0061"
    ],
    "note": "Opposition filed jointly; costs shared as agreed in the engagement terms"
  }
}
```

```json
{
  "invoiceReference": "urn:ipproto:invoice:woodgrove-2027-0061",
  "payor": {
    "actorUri": "urn:ipproto:actor:contoso-legal",
    "roleDeclarationUri": "urn:ipproto:roleDeclaration:contoso-requester-opp-joint-0001",
    "taxIdentifier": {
      "scheme": "urn:ipproto:scheme:vat",
      "value": "NL000000000B00"
    }
  },
  "invoiceLines": [
    {
      "lineId": "F-0001",
      "milestoneReference": "urn:ipproto:milestone:opp-joint-0001-m1-notice",
      "servicePeriod": {
        "from": "2027-03-01",
        "to": "2027-04-30"
      },
      "lineItemType": "urn:ipproto:lineItem:professionalFee",
      "amount": 3200.0,
      "taxCategory": {
        "categoryCode": "AE",
        "ratePercent": 0.0,
        "exemptionReason": "Reverse charge"
      },
      "description": "Notice of opposition, fixed fee of EUR 8,000.00; 40 % share"
    },
    {
      "lineId": "P-0001",
      "milestoneReference": "urn:ipproto:milestone:opp-joint-0001-m1-notice",
      "serviceDate": "2027-04-28",
      "lineItemType": "urn:ipproto:lineItem:officialFee",
      "amount": 352.0,
      "passThrough": true,
      "description": "Opposition fee of EUR 880.00 paid in the opponents' name; 40 % share"
    }
  ],
  "totalAmount": {
    "amount": 3552.0,
    "currency": "EUR"
  },
  "taxHandling": {
    "taxTreatment": "reverseCharge",
    "taxAmount": 0.0
  },
  "taxBreakdown": [
    {
      "categoryCode": "AE",
      "ratePercent": 0.0,
      "taxableAmount": 3200.0,
      "taxAmount": 0.0
    }
  ],
  "allocation": {
    "sharePercent": 40.0,
    "siblingInvoiceReferences": [
      "urn:ipproto:invoice:woodgrove-2027-0060"
    ],
    "note": "Opposition filed jointly; costs shared as agreed in the engagement terms"
  }
}
```

The full messages are `invoice-issued-split-payor-a.example.json` and `invoice-issued-split-payor-b.example.json` in `schemas/examples/`.

## Behavior on receipt

The payor checks milestone lines against the `agreedPrice` of the milestones they name, and subscription lines against the `commercialTerms` of the subscription, for the `billingPeriod` where the line states one. Where the two agree, the payor authorizes payment through [Payment Authorized](Payment%20Authorized.md), with `payeeType: "actor"`.

Since 0.8, where lines carry time-entry detail, the payor can check each `unitPrice` against the `rateTable` of the agreed price for the line's `timekeeper` or `rateRole`, and the sum of the lines against a `budget` or a cap. Where the invoice carries a `taxBreakdown`, the payor can check that it adds up. Where it carries `allocation`, the payor can check its `sharePercent` against its `payorShare` on the milestone. A line it disputes is named by its `lineId` where it has one.

The protocol does not match invoices to prices and does not reject an invoice that exceeds one. A disagreement over an invoice is settled between the parties. Since 0.5 the payor can state it in the protocol with [Invoice Disputed](Invoice%20Disputed.md), and the payee can withdraw an invoice with [Invoice Cancelled](Invoice%20Cancelled.md). An invoice is never changed: a correction is a cancellation and a new Invoice Issued with a new `invoiceReference`.

The protocol has no message for accepting an invoice. An invoice the payor does not dispute stands; Payment Authorized, where the parties use it, is the payor's affirmative step.

## Related messages

- Follows [Milestone Completed](../Milestone%20Lifecycle/Milestone%20Completed.md) for the invoiced milestones
- For a subscription line, follows the billing cadence of the subscription begun with [Service Subscription Started](../Subscriptions/Service%20Subscription%20Started.md)
- Paid through [Payment Authorized](Payment%20Authorized.md) and [Payment Executed](Payment%20Executed.md), which since 0.8 name it in `invoiceReferences`
- Disputed by the payor with [Invoice Disputed](Invoice%20Disputed.md) and cancelled by the payee with [Invoice Cancelled](Invoice%20Cancelled.md) (added in 0.5)

## See also

- [Agreed Price](../../02%20-%20Foundational%20Structures/Agreed%20Price.md) — the price an invoice is measured against
- [Document Reference](../../02%20-%20Foundational%20Structures/Document%20Reference.md) — the `invoice` and, since 0.8, `billingDetail` document types
- [Milestone](../../02%20-%20Foundational%20Structures/Milestone.md) — `payorShare` on payor assignments (since 0.8)
- [Actor Reference](../../02%20-%20Foundational%20Structures/Actor%20Reference.md) — the VAT identifier scheme used in `taxIdentifier`
