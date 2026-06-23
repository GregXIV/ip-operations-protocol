/* IP Operations Protocol v0.1 — TypeScript types.
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
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ClientActionCompleted".
 */
export type ClientActionCompleted = CommonEnvelope;
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
    | "corporateIpDepartment"
    | "serviceProvider"
    | "externalCounsel"
    | "registerAuthority"
    | "registerObserver"
    | "ipmsVendor"
    | "platformOperator"
    | "paymentInstitution"
    | "other";
  /**
   * @minItems 1
   */
  identifiers: [
    {
      scheme: string;
      value: string;
      verifiedAt?: string;
    },
    ...{
      scheme: string;
      value: string;
      verifiedAt?: string;
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
  assetReferences: [string, ...string[]];
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
  deliverables?: string[];
  milestoneAuthorityClaims: string[];
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
  assetReferences: [string, ...string[]];
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
