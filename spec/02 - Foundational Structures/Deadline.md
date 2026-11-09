---
type: foundational
status: v0.7
---

# Deadline

> A time limit the work must observe that the parties did not set for each other: one ordered by a court or an office, one that a law sets, one agreed with a third party, or a hearing.

Added in 0.6. Until 0.6 the protocol had only the [Service Level](Service%20Level.md), an agreed clock between work requester and provider, and decision 60 forbids inventing one. A deadline set by a court, by a statute or by an office could not be expressed: `failureImpact.affectedDeadlines` of [Milestone Failed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Failed.md) and `goalConstraints.deadlineConstraints` of a [Workstream](Workstream.md) were untyped. A provider instructed directly by its client works to such deadlines from the first day.

A deadline and a service level are different things. A service level is the clock one party gives the other on the work and is measured against the messages they exchange. A deadline exists outside the two of them, and missing it has consequences the parties do not control. Neither is derived from the other: a service level is never filled from a deadline, and decision 60 stands.

## Structure

### `deadlineUri`
Type: URI, required

Stable identifier of the form `urn:ipproto:deadline:{uuid}`, assigned by the actor that first records the deadline. An extension gets a new URI and points at the deadline it replaces (see `supersedes`).

### `deadlineKind`
Type: enumeration or namespaced URN, required

- `courtOrdered` — set by a court or a tribunal in an order or a direction
- `statutory` — follows from a provision of law or of procedural rules, counted from a trigger. Time limits set by an office under its rules count here
- `agreed` — agreed with a third party, for instance between the parties to a proceeding with the court's leave, or a date the client fixes as a constraint on the goal. Not a [Service Level](Service%20Level.md) between work requester and provider
- `hearing` — an appointment the actors must attend: an oral hearing, an oral proceeding, an interview. Carries `appointment`

Custom kinds use namespaced URNs. Values specific to one kind of proceeding belong in a vocabulary of that proceeding, not in this list.

### `title`
Type: string, optional

Short human-readable label: "Statement of defence", "Reply to the communication under Rule 71(3) EPC".

### `basis`
Type: structured, optional; strongly recommended for `courtOrdered` and `statutory`

What sets the deadline:
- `basisText` — string, optional: the order or the provision in words
- `legalProvision` — string, optional: the provision as cited, "Rule 71(3) EPC"
- `basisDocument` — [Document Reference](Document%20Reference.md) URI, optional: the order, the communication or the summons

At least one of the three is present when `basis` is.

### `trigger`
Type: structured, optional

The event from which the deadline is counted:
- `eventType` — URI, required. Standard values in `urn:ipproto:deadlineTrigger:`: `service` (a document was served on the party), `notification` (an office or a court notified it), `publication`, `filing`, `decision`, `other`. Custom values through namespaced URNs
- `triggerDate` — ISO 8601 date, optional: the date of the event as the actor counts it
- `triggerDocument` — [Document Reference](Document%20Reference.md) URI, optional: the document whose service, notification or publication starts the period

Since 0.7 a Document Reference can record when a document was served (`servedAt`) and received (`receivedAt`). Where the trigger is `service` or `notification` and names a `triggerDocument`, `triggerDate` is the date of that document's `servedAt` or `receivedAt`, unless the law deems the event to have happened on another day; the deadline's `triggerDate` then governs the counting. See *Link to a deadline* in [Document Reference](Document%20Reference.md) (decision 91).

### `dueDate`
Type: ISO 8601 date, required

The last day on which the deadline can be met, in the calendar of `jurisdictionCode` where it is given. For a hearing, the day of the hearing.

### `dueAt`
Type: ISO 8601 datetime, optional

The moment, where a time of day matters: a filing deadline that ends at midnight of the court's time zone, or the start of a hearing.

### `jurisdictionCode`
Type: ST.3 code, optional

The jurisdiction whose calendar governs `dueDate`.

### `appointment`
Type: structured, conditional

Required when `deadlineKind` is `hearing`, and not used otherwise. A hearing is an appointment, not a period:
- `startsAt` — ISO 8601 datetime, required
- `endsAt` — ISO 8601 datetime, optional
- `location` — string, optional: the venue or the room
- `attendanceMode` — enumeration, optional: `inPerson`, `remote`, `hybrid`

### `reminderDates`
Type: array of ISO 8601 dates, optional

The internal dates on which the holder of the deadline wants to be reminded. They are the holder's own: a sender may leave them out of what it sends, and a receiver does not treat them as part of the deadline.

### `supersedes`
Type: structured, optional

Where the deadline replaces an earlier one, typically by an extension:
- `deadlineUri` — URI, required: the deadline replaced
- `grantingDocument` — [Document Reference](Document%20Reference.md) URI, optional: the order or the communication that granted the extension

The replaced deadline keeps its URI and moves to status `superseded`. The chain of `supersedes` links is the history of the deadline; nothing in it is deleted.

### `status`
Type: enumeration, required

- `open` — not yet met
- `met` — met; `metBy` says how
- `missed` — passed without being met
- `superseded` — replaced by a later deadline that names it in `supersedes`
- `withdrawn` — no longer applies: the order was set aside, the hearing was cancelled, the proceeding ended

Closed enumeration.

### `metBy`
Type: structured, conditional

Required when `status` is `met`, and not used otherwise:
- `metAt` — ISO 8601 datetime, required
- `messageUri` — URI, optional: the message that reports the act, typically a [Milestone Completed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Completed.md)
- `document` — [Document Reference](Document%20Reference.md) URI, optional: the filing receipt or the record of attendance

### `milestoneReferences`
Type: array of milestoneUris, optional

The milestones whose work serves the deadline.

## Where deadlines are carried

- `goalStatement.goalConstraints.deadlineConstraints` of a [Workstream](Workstream.md) and of [Work Requested](../03%20-%20Messages/Workstream%20Lifecycle/Work%20Requested.md): the deadlines the goal must observe
- `deadlines` of a [Milestone](Milestone.md): the deadlines the milestone's work serves
- `deadlines` of a [Mandate Instruction](../03%20-%20Messages/Work%20Instruction/Mandate%20Instruction.md): the deadlines known when the mandate is given
- `failureImpact.affectedDeadlines` of [Milestone Failed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Failed.md): the deadlines at risk, as structures or by their `deadlineUri`

A change to a deadline that an actor has shared, such as a status moving to `met`, travels as a [Data Assertion](Data%20Assertion.md) on the record that carries it.

## Worked example — a statutory deadline, extended

```json
[
  {
    "deadlineUri": "urn:ipproto:deadline:d-71-3-001",
    "deadlineKind": "statutory",
    "title": "Reply to the communication under Rule 71(3) EPC",
    "basis": {"legalProvision": "Rule 71(3) EPC", "basisDocument": "urn:ipproto:document:ep0000000-r71-3"},
    "trigger": {"eventType": "urn:ipproto:deadlineTrigger:notification", "triggerDate": "2026-04-28", "triggerDocument": "urn:ipproto:document:ep0000000-r71-3"},
    "dueDate": "2026-08-28",
    "jurisdictionCode": "EP",
    "reminderDates": ["2026-08-14", "2026-08-21"],
    "status": "superseded"
  },
  {
    "deadlineUri": "urn:ipproto:deadline:d-71-3-002",
    "deadlineKind": "statutory",
    "title": "Reply to the communication under Rule 71(3) EPC, extended",
    "supersedes": {"deadlineUri": "urn:ipproto:deadline:d-71-3-001", "grantingDocument": "urn:ipproto:document:ep0000000-extension"},
    "dueDate": "2026-10-28",
    "jurisdictionCode": "EP",
    "status": "met",
    "metBy": {"metAt": "2026-10-20T10:15:00Z", "document": "urn:ipproto:document:ep0000000-reply-receipt"}
  }
]
```

## Worked example — a hearing

```json
{
  "deadlineUri": "urn:ipproto:deadline:d-hearing-001",
  "deadlineKind": "hearing",
  "title": "Oral proceedings before the Court",
  "basis": {"basisDocument": "urn:ipproto:document:summons-001"},
  "dueDate": "2027-02-11",
  "dueAt": "2027-02-11T09:30:00+01:00",
  "appointment": {"startsAt": "2027-02-11T09:30:00+01:00", "endsAt": "2027-02-11T17:00:00+01:00", "location": "Court, Room 2", "attendanceMode": "inPerson"},
  "status": "open"
}
```

## See also

- [Service Level](Service%20Level.md) — the agreed clock between requester and provider, which a deadline is not
- [Workstream](Workstream.md), [Milestone](Milestone.md) — where deadlines are carried
- [Milestone Failed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Failed.md) — deadlines at risk
