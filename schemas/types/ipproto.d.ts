/* IP Operations Protocol v0.5 — TypeScript types.
 * GENERATED from the JSON Schemas. Do not edit by hand; regenerate when the spec versions.
 */

/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ActionConfirmationDispute".
 */
export type ActionConfirmationDispute = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ArtifactReady".
 */
export type ArtifactReady = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "AssetAuthorityDispute".
 */
export type AssetAuthorityDispute = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "AssetBootstrap".
 */
export type AssetBootstrap = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "AssetMatchInquiry".
 */
export type AssetMatchInquiry = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "AssetMatchResponse".
 */
export type AssetMatchResponse = CommonEnvelope;
/**
 * One side confirms a proposed award. The award stands when both the bidder and the work requester have confirmed, which commits the milestone.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "AwardConfirmed".
 */
export type AwardConfirmed = CommonEnvelope;
/**
 * A bidder declines a proposed award, with the reason.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "AwardDeclined".
 */
export type AwardDeclined = CommonEnvelope;
/**
 * A work requester proposes to award the milestone to one bid.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "AwardProposed".
 */
export type AwardProposed = CommonEnvelope;
/**
 * A work requester declines a bid, with its reasons. The ranking behind the decision is not exchanged.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "BidDeclined".
 */
export type BidDeclined = CommonEnvelope;
/**
 * An orchestrator invites suppliers to bid on one milestone. Opens the procurement sequence behind the execution mode thirdPartyRfp.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "BidInvitation".
 */
export type BidInvitation = CommonEnvelope;
/**
 * A bidder submits a binding bid in answer to a bid invitation.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "BidSubmitted".
 */
export type BidSubmitted = CommonEnvelope;
/**
 * A bidder withdraws a bid it has submitted.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "BidWithdrawn".
 */
export type BidWithdrawn = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ClientActionCompleted".
 */
export type ClientActionCompleted = CommonEnvelope;
/**
 * A bidder attests the outcome of its conflict check against the parties named in a bid invitation. Only the attestation is exchanged, not the method.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ConflictCheckAttested".
 */
export type ConflictCheckAttested = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "DeliverableAcknowledged".
 */
export type DeliverableAcknowledged = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "DisputeResolutionDecision".
 */
export type DisputeResolutionDecision = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "GoalDecomposition".
 */
export type GoalDecomposition = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "IdentityResolutionDispute".
 */
export type IdentityResolutionDispute = CommonEnvelope;
/**
 * A work provider accepts a work instruction. Binds both sides to the instruction's price and service levels and commits the milestone.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "InstructionAccepted".
 */
export type InstructionAccepted = CommonEnvelope;
/**
 * A work provider declines a work instruction, with the reason.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "InstructionDeclined".
 */
export type InstructionDeclined = CommonEnvelope;
/**
 * Added in 0.5. The payee cancels an invoice it issued, with the reason, and names the replacement where there is one.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "InvoiceCancelled".
 */
export type InvoiceCancelled = CommonEnvelope;
/**
 * Added in 0.5. The payor disputes an invoice it received, with the reason. Acceptance of an invoice has no message.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "InvoiceDisputed".
 */
export type InvoiceDisputed = CommonEnvelope;
/**
 * A payee issues an invoice to a payor, for milestones, subscriptions or both. One message for supplier invoices and for the customer invoice; payee and payor say which it is.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "InvoiceIssued".
 */
export type InvoiceIssued = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "MilestoneAbandoned".
 */
export type MilestoneAbandoned = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "MilestoneCompleted".
 */
export type MilestoneCompleted = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "MilestoneFailed".
 */
export type MilestoneFailed = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "MilestoneStarted".
 */
export type MilestoneStarted = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "OrchestrationCommitted".
 */
export type OrchestrationCommitted = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "PaymentAuthorized".
 */
export type PaymentAuthorized = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "PaymentExecuted".
 */
export type PaymentExecuted = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "RecordUpdate".
 */
export type RecordUpdate = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "RegisterEvent".
 */
export type RegisterEvent = CommonEnvelope;
/**
 * An orchestrator declines a work request, with the reason. No workstream is created.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "RequestDeclined".
 */
export type RequestDeclined = CommonEnvelope;
/**
 * An orchestrator discloses the work requester to a bidder that has attested a clear conflict check. Sent only where the bid invitation withheld the requester's identity.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "RequesterDisclosed".
 */
export type RequesterDisclosed = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ServiceDeliverable".
 */
export type ServiceDeliverable = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ServiceFinding".
 */
export type ServiceFinding = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ServiceSubscriptionStarted".
 */
export type ServiceSubscriptionStarted = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ServiceSubscriptionTerminated".
 */
export type ServiceSubscriptionTerminated = CommonEnvelope;
/**
 * A work requester instructs a work provider to perform one milestone at an agreed price and under agreed service levels.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "WorkInstruction".
 */
export type WorkInstruction = CommonEnvelope;
/**
 * A work requester places an order or asks for work, on existing assets, on rights still to be created, or both. Opens a catalogue order or one of the three procurement paths.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "WorkRequested".
 */
export type WorkRequested = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "WorkstreamAbandoned".
 */
export type WorkstreamAbandoned = CommonEnvelope;
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "WorkstreamCompleted".
 */
export type WorkstreamCompleted = CommonEnvelope;

export interface IPOperationsProtocol {
  [k: string]: unknown;
}
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "Money".
 */
export interface Money {
  amount: number;
  /**
   * ISO 4217 currency code
   */
  currency: string;
}
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ClaimantRef".
 */
export interface ClaimantRef {
  actorUri: string;
  roleDeclarationUri: string;
}
/**
 * A right that does not exist yet and that the requested work is to create or prepare: a first filing, or an application to be drafted. Added in 0.3.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ProspectiveRight".
 */
export interface ProspectiveRight {
  assetType:
    | "patent"
    | "utilityModel"
    | "designRegistration"
    | "trademark"
    | "plantVariety"
    | "geographicalIndication"
    | "otherIp";
  workingTitle: string;
  intendedJurisdictions?: string[];
  applicant?: EntityReference;
  resultingAssetReferences?: string[];
}
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "EntityReference".
 */
export interface EntityReference {
  literal: {
    value: string;
    source: {
      sourceType: "register" | "corporateRecord" | "selfDeclaration" | "derivedDocument" | "other";
      sourceActorUri?: string;
      sourcePublicationDate?: string;
      sourceDocumentReference?: string;
    };
  };
  resolution?: {
    resolvedEntityUri: string;
    resolvedAt: string;
    confidenceLevel?: "exact" | "high" | "medium" | "low";
    resolutionMethod?: "deterministicIdentifier" | "attributeMatching" | "humanReview" | "priorAssertion" | "automated";
    resolutionBasis?: {};
  };
  crossActorReferences?: {
    actorUri: string;
    entityUriInActor: string;
  }[];
}
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "CommonEnvelope".
 */
export interface CommonEnvelope {
  messageUri: string;
  messageType: string;
  protocolVersion: string;
  originatingActor: string;
  originatingRoleDeclaration: string;
  addressedTo: {
    actorUri: string;
    expectedRole?: string;
  }[];
  producedAt: string;
  userContext?: UserContext;
  /**
   * Added in 0.5. The actor that entered this message on the originating actor's behalf, with the originator's consent. The originating actor stays the originator.
   */
  recordedBy?: {
    actorUri: string;
    userContext?: UserContext;
  };
  correlation?: {
    correlatedToMessageUri?: string;
    workstreamUri?: string;
    milestoneUri?: string;
    subscriptionUri?: string;
    eventChainUri?: string;
  };
  assertions?: DataAssertion[];
  payload: {};
}
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "UserContext".
 */
export interface UserContext {
  userIdentifier: string;
  displayLabel?: string;
  roleAtActor?: string;
  automatedAgentIndicator?: boolean;
}
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "DataAssertion".
 */
export interface DataAssertion {
  assertionUri: string;
  recordUri: string;
  /**
   * RFC 6901 JSON Pointer
   */
  sectionPath: string;
  asserter: ClaimantRef;
  assertionContent:
    | {
        contentType: "fullValue";
        value: unknown;
      }
    | {
        contentType: "patches";
        operations: {
          op: "add" | "remove" | "replace" | "test";
          /**
           * RFC 6901 JSON Pointer
           */
          path: string;
          value?: unknown;
        }[];
      };
  claimReference: string;
  assertedAt: string;
  supersedes?: string[];
  evidenceReference?: string[];
}
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ActorReference".
 */
export interface ActorReference {
  actorUri: string;
  actorType:
    | (
        | "corporateIpDepartment"
        | "serviceProvider"
        | "externalCounsel"
        | "registerAuthority"
        | "registerObserver"
        | "ipmsVendor"
        | "platformOperator"
        | "paymentInstitution"
        | "softwareService"
        | "other"
      )
    | string;
  /**
   * @minItems 1
   */
  identifiers: [
    {
      scheme: string;
      value: string;
      verifiedAt?: string;
      /**
       * Added in 0.5. The register that issued the identifier; required with the scheme urn:ipproto:scheme:companyRegister. Recommended: the register's code in the GLEIF Registration Authorities List.
       */
      registrationAuthority?: string;
    },
    ...{
      scheme: string;
      value: string;
      verifiedAt?: string;
      /**
       * Added in 0.5. The register that issued the identifier; required with the scheme urn:ipproto:scheme:companyRegister. Recommended: the register's code in the GLEIF Registration Authorities List.
       */
      registrationAuthority?: string;
    }[]
  ];
  legalName: string;
  /**
   * WIPO ST.3 office/country code
   */
  jurisdictionCode?: string;
  addresses?: {}[];
  displayLabel?: string;
}
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ActorRoleDeclaration".
 */
export interface ActorRoleDeclaration {
  roleDeclarationUri: string;
  actorUri: string;
  role: string;
  scope: {
    scopeType: "asset" | "workstream" | "milestone" | "subscription" | "global";
    scopeUri?: string;
    effectiveFrom: string;
    effectiveTo?: string;
  };
  delegationChain?: {
    delegatingActorUri: string;
    delegatedRoleUri: string;
    delegationBasis: string;
    delegationReference?: string;
  }[];
}
/**
 * A binding price for a unit of work, as opposed to an estimate. Carried on a milestone, in a work instruction and as the price of a bid.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "AgreedPrice".
 */
export interface AgreedPrice {
  amount: number;
  /**
   * ISO 4217 currency code
   */
  currency: string;
  priceBasis: "fixed" | "capped" | "hourly";
  lineItems?: {
    lineItemType: string;
    amount: number;
    quantity?: number;
    note?: string;
  }[];
  officialFeesIncluded: boolean;
  bindingUntil?: string;
  agreementReference?: string;
}
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "AssetReference".
 */
export interface AssetReference {
  assetUri: string;
  assetType:
    | "patent"
    | "utilityModel"
    | "designRegistration"
    | "trademark"
    | "plantVariety"
    | "geographicalIndication"
    | "otherIp";
  /**
   * @minItems 1
   */
  identifiers: [
    {
      scheme: string;
      /**
       * WIPO ST.3 office/country code
       */
      officeCode?: string;
      value: string;
      kindCode?: string;
      referenceType?: "application" | "publication" | "grant" | "internalReference";
      issueDate?: string;
    },
    ...{
      scheme: string;
      /**
       * WIPO ST.3 office/country code
       */
      officeCode?: string;
      value: string;
      kindCode?: string;
      referenceType?: "application" | "publication" | "grant" | "internalReference";
      issueDate?: string;
    }[]
  ];
  relationships?: {
    relatedAssetUri: string;
    relationshipType: string;
    effectiveDate?: string;
  }[];
  displayLabel?: string;
}
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "AuthorityClaim".
 */
export interface AuthorityClaim {
  claimUri: string;
  recordUri: string;
  /**
   * RFC 6901 JSON Pointer
   */
  sectionPath: string;
  claimant: ClaimantRef;
  claimType: "exclusive" | "sourceOfTruth" | "advisory";
  claimBasis: string;
  effectiveFrom: string;
  effectiveTo?: string;
  claimAgreementReference?: string | null;
  supersedes?: string[];
}
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "DocumentReference".
 */
export interface DocumentReference {
  documentUri: string;
  documentType: string;
  documentKind?: {
    kindCode?: string;
    kindAuthority?: string;
  };
  /**
   * @minItems 1
   */
  assetReferences?: [string, ...string[]];
  originator: string;
  originationDate: string;
  /**
   * ISO 639-1 language code
   */
  languageCode?: string;
  /**
   * @minItems 1
   */
  storageLocations: [
    {
      locationUri: string;
      locationType: "httpsRest" | "s3Bucket" | "vault" | "officeRegister" | "email" | "filesystem" | "other";
      accessRequirements?: {
        authMethodHint?: string;
        credentialIssuerActorUri?: string;
        accessExpiresAt?: string;
      };
      mediaType?: string;
      contentHash?: {
        algorithm: string;
        value: string;
      };
      contentSizeBytes?: number;
      pageCount?: number;
    },
    ...{
      locationUri: string;
      locationType: "httpsRest" | "s3Bucket" | "vault" | "officeRegister" | "email" | "filesystem" | "other";
      accessRequirements?: {
        authMethodHint?: string;
        credentialIssuerActorUri?: string;
        accessExpiresAt?: string;
      };
      mediaType?: string;
      contentHash?: {
        algorithm: string;
        value: string;
      };
      contentSizeBytes?: number;
      pageCount?: number;
    }[]
  ];
  structuredContentReference?: {
    schemaIdentifier?: string;
    schemaConformanceLevel?: "strict" | "extended" | "partial";
    structuredContentLocation?: string;
  };
  supersedes?: string;
  supersededBy?: string;
  versionLabel?: string;
  derivedFrom?: string;
  relatedDocuments?: string[];
}
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "EvidenceCollection".
 */
export interface EvidenceCollection {
  /**
   * @minItems 1
   */
  evidenceItems: [
    {
      evidenceType: string;
      evidenceContent: {};
      evidenceProvenance?: {
        captureMethod?: "automatedSystemExport" | "manualEntry" | "screenshot" | "signedReceipt";
        captureUserContext?: UserContext;
        integrityHash?: string;
      };
    },
    ...{
      evidenceType: string;
      evidenceContent: {};
      evidenceProvenance?: {
        captureMethod?: "automatedSystemExport" | "manualEntry" | "screenshot" | "signedReceipt";
        captureUserContext?: UserContext;
        integrityHash?: string;
      };
    }[]
  ];
}
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "Milestone".
 */
export interface Milestone {
  milestoneUri: string;
  milestoneSequence: number;
  milestoneTitle: string;
  milestoneDescription?: string;
  milestoneCategory: string;
  /**
   * @minItems 1
   */
  actorAssignments: [
    {
      actorUri: string;
      roleDeclarationUri: string;
      assignmentType: "primary" | "delegatedFrom" | "accountableTo" | "payor" | "observer";
    },
    ...{
      actorUri: string;
      roleDeclarationUri: string;
      assignmentType: "primary" | "delegatedFrom" | "accountableTo" | "payor" | "observer";
    }[]
  ];
  executionMode: "serviceProviderManaged" | "selfService" | "thirdPartyRfp";
  serviceProviderActorUri?: string;
  dependencies?: {
    dependsOnMilestoneUri: string;
    requiredState: "committed" | "started" | "completed";
  }[];
  milestoneStatus:
    | "proposed"
    | "committed"
    | "notReady"
    | "ready"
    | "inProgress"
    | "awaitingExternalAction"
    | "completed"
    | "failed"
    | "abandoned";
  statusHistory?: {}[];
  estimates: {
    estimatedCost?: Money;
    estimatedDuration?: {
      minimumDays?: number;
      expectedDays?: number;
      maximumDays?: number;
    };
    estimatedAt?: string;
  };
  actuals?: {};
  agreedPrice?: AgreedPrice;
  serviceLevels?: ServiceLevel[];
  deliverables?: string[];
  milestoneAuthorityClaims: string[];
  parentMilestoneUri?: string;
}
/**
 * A clock on one step of the work: what is measured and when it runs out. The protocol carries the clock, not the consequence of missing it.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ServiceLevel".
 */
export interface ServiceLevel {
  serviceLevelKind: string;
  dueAt: string;
  agreedDurationHours?: number;
  agreementReference?: string;
}
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "OutcomeDetails".
 */
export interface OutcomeDetails {
  outcomeType: string;
  details: {};
}
/**
 * How an observed-identifier set was resolved to a canonical asset. Produced by any resolver. Defined in the Asset Identification and Resolution profile.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ResolutionProvenance".
 */
export interface ResolutionProvenance {
  resolvedAssetUri: string;
  resolvedAt: string;
  confidenceLevel: "exact" | "high" | "medium" | "low";
  resolutionMethod: "deterministicIdentifier" | "familyLookup" | "attributeMatching" | "humanReview" | "priorAssertion";
  resolutionBasis: {
    source: "epoOps" | "jpo" | "national" | "priorAssertion";
    matchedIdentifiers?: unknown[];
    docdbFamilyId?: string;
    notes?: string;
  };
  inputIdentifiers?: unknown[];
}
/**
 * A resolver's emission: the canonical Asset Reference plus the provenance of how it was resolved.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ResolvedAsset".
 */
export interface ResolvedAsset {
  assetReference: AssetReference;
  resolutionProvenance: ResolutionProvenance;
}
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "Workstream".
 */
export interface Workstream {
  workstreamUri: string;
  workstreamType: string;
  /**
   * @minItems 1
   */
  assetReferences?: [string, ...string[]];
  /**
   * @minItems 1
   */
  prospectiveRights?: [ProspectiveRight, ...ProspectiveRight[]];
  triggeringEvent: {
    eventType: "registerEvent" | "clientRequest" | "subscriptionFinding" | "internalDecision" | "manualEntry";
    eventReference?: string;
    triggeredAt: string;
  };
  goalStatement: {
    goalText: string;
    goalCategory?: string;
    goalConstraints?: {};
  };
  instructingCapacity?: "own" | "onBehalf";
  beneficiary?: EntityReference;
  milestoneChain: {
    milestones: Milestone[];
    chainExecutionPolicy?: "strict" | "optimistic" | "manual";
  };
  workstreamStatus: "proposed" | "committed" | "inProgress" | "completed" | "abandoned" | "disputed";
  statusHistory?: {}[];
  authorityRegistry?: string[];
  createdAt?: string;
  committedAt?: string;
  completedAt?: string;
  relatedWorkstreams?: {}[];
}
