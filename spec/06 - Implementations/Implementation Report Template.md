---
type: implementation
since: unreleased
changed: unreleased
---

# Implementation Report Template

An implementation report says how one implementation conforms to one or more profiles of one released version, requirement by requirement, with the evidence. It is how a claim of conformance ([Conformance](../01%20-%20Front%20Matter/Conformance.md), *Claiming conformance*) is shown rather than asserted. This page is informative.

Send a report with the *Implementation report* issue form, or as a pull request that adds it to [IMPLEMENTATIONS.md](../../IMPLEMENTATIONS.md). Name the implementation as it should be published. Do not name clients, counterparties or matters; evidence that would name them is described, not attached.

## Header

| Field | Content |
|---|---|
| Implementation | name and version, and a link where it is public |
| Implementer | the organization that runs or publishes it |
| Protocol version | the release the report is against, as its tag, for example `v0.9.1` |
| Profiles | each profile claimed, with its conditional modules |
| Date | the date the evidence was taken |
| Contact | where questions about the report go |

## Results

One table per profile. Every requirement of the profile has a row, also the ones not met. The result is one of **met**, **partly met**, **not met** or **not applicable**, as *Claiming conformance* defines them. The evidence follows the *Verified by* column of Conformance: for schema, which instances were validated and with which validator; for a message trace, which workstream or test run; for a resolution probe, which URIs were resolved and how; for an attestation, the documents that *Evidence for an attestation* lists.

| ID | Result | Evidence | Note |
|---|---|---|---|
| G1 | met | 1,240 messages of 18 test workstreams validated with `@ipproto/schemas` 0.9.1, 0 failures | |
| … | | | |

## Gaps and questions

What is not met or only partly met, what the implementer plans for it, and anything in the specification that was unclear while testing. A question about the specification is also worth an issue of its own.
