---
type: message
category: deliverable-handoff
status: v0.1
---

# Service Deliverable

> Service provider produces a deliverable for review by the receiving actor.

## Purpose

Conveys outputs that the receiving actor reviews — analysis reports, search results, monitoring summaries, FTO reports, prepared documents, anything where structured or document-form output is produced and consumed.

Most patent-operations work involving service-provider production uses this pattern.

## Producer

The actor performing the work in a milestone. Typically issued alongside or immediately after [Milestone Completed](../Milestone%20Lifecycle/Milestone%20Completed.md).

## Recipients

Actor with `deliverableRecipient` role (typically the corporate); other interested parties.

## Payload

### `deliverableReference`
Type: URI, required

Stable identifier `urn:ipproto:deliverable:{uuid}`. Distinct from milestone URI because a milestone may produce multiple deliverables.

### `producingMilestone`
Type: milestoneUri, required

### `deliverableType`
Type: URI, required

Standard types in `urn:ipproto:deliverable:` namespace:
- Analysis: `validationAnalysis`, `freedomToOperateReport`, `priorArtSearchResults`, `patentabilityAssessment`, `portfolioReview`
- Document prep: `preparedOfficeForm`, `preparedTranslation`, `preparedResponse`
- Monitoring: `monitoringSummary`, `oppositionWatchReport`
- Administrative: `costEstimate`, `scheduleProjection`, `invoice`

### `deliverableContent`
Type: structured, required (at least one form)

- `documentReferences` — array of [Document Reference](../../02%20-%20Foundational%20Structures/Document%20Reference.md) URIs (rendered form)
- `structuredContent` — embedded structured representation: `schemaIdentifier`, `content`, `schemaConformanceLevel`

### `deliverableSummary`
Type: structured, required

- `executiveSummary` — 1-3 paragraphs
- `keyFindings` — array, each: `findingCategory`, `findingDescription`, optional `findingSeverity` (`informational`, `recommendation`, `warning`, `critical`)
- `actionsRecommended` — array, each: `recommendationDescription`, `recommendationCategory`, optional `recommendedDeadline`

### `producerAttestation`
Type: structured, required

- `qualityLevel` — enumeration: `draft`, `review`, `final`
- `confidenceLevel` — optional, `high`/`medium`/`low`
- `professionalReview` — optional structured: `reviewerUserContext`, `reviewedAt`, `reviewType` (`peer`, `seniorReview`, `qualifiedProfessional`)
- `disclosures` — optional array of structured disclosures

### `acknowledgmentExpectation`
Type: enumeration, required

- `acknowledgmentRequired` — milestone not complete until acknowledged
- `acknowledgmentRequested` — requested but milestone proceeds regardless
- `acknowledgmentNotRequired` — informational only

### `assertions`
Type: array of [Data Assertion](../../02%20-%20Foundational%20Structures/Data%20Assertion.md) structures, required

DataAssertions the deliverable substantiates against the asset record. The deliverable becomes the source of record for the substantiated sections.

## Worked example — validation analysis

```json
{
  "payload": {
    "deliverableReference": "urn:ipproto:deliverable:val-an-001-...",
    "producingMilestone": "urn:ipproto:milestone:m1-validation-analysis",
    "deliverableType": "urn:ipproto:deliverable:validationAnalysis",
    "deliverableContent": {
      "documentReferences": ["urn:ipproto:document:9c2e4f81-validation-analysis"],
      "structuredContent": {
        "schemaIdentifier": "urn:ipproto:deliverableSchema:validationAnalysis:v1",
        "schemaConformanceLevel": "strict",
        "content": {
          "recommendedJurisdictions": [
            {"officeCode": "DE", "recommendation": "validate", "estimatedCost": {"amount": 1450, "currency": "EUR"}},
            {"officeCode": "FR", "recommendation": "validate"},
            {"officeCode": "GB", "recommendation": "validate"}
          ],
          "totalEstimate": {"amount": 5860, "currency": "EUR"}
        }
      }
    },
    "deliverableSummary": {
      "executiveSummary": "Validation in DE, FR, GB recommended based on portfolio history, competitor activity, market data.",
      "keyFindings": [
        {"findingCategory": "urn:ipproto:finding:jurisdictionalCoverage", "findingDescription": "Five recommended jurisdictions cover 92% of revenue exposure.", "findingSeverity": "informational"}
      ],
      "actionsRecommended": [
        {"recommendationDescription": "Authorize validation in recommended jurisdictions.", "recommendationCategory": "validationDecision", "recommendedDeadline": "2026-05-15"}
      ]
    },
    "producerAttestation": {
      "qualityLevel": "final",
      "confidenceLevel": "high",
      "professionalReview": {
        "reviewerUserContext": {"userIdentifier": "validation-analyst@meridian-ip-group.example", "roleAtActor": "Senior Validation Analyst"},
        "reviewedAt": "2026-05-04T15:45:00Z",
        "reviewType": "qualifiedProfessional"
      }
    },
    "acknowledgmentExpectation": "acknowledgmentRequired"
  }
}
```

## Distinctive contribution

The `assertions` array is what makes a deliverable a protocol-level substantiation rather than just a document. The deliverable carries the claims it makes against the asset record, with full audit trail back to producing milestone, professional reviewer, and substantiating evidence.

In current practice this lives in inboxes; in the protocol it's queryable structure.

## Related messages

- Acknowledged through [Deliverable Acknowledged](Deliverable%20Acknowledged.md)
- Often issued alongside [Milestone Completed](../Milestone%20Lifecycle/Milestone%20Completed.md)
