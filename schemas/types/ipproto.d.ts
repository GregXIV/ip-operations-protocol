/* IP Operations Protocol v0.9 — TypeScript types.
 * GENERATED from the JSON Schemas. Do not edit by hand; regenerate when the spec versions.
 */

/**
 * A time limit the work must observe that the parties did not set for each other: court-ordered, statutory, agreed with a third party, or a hearing. Not a Service Level. Added in 0.6.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "Deadline".
 */
export type Deadline = {
  [k: string]: unknown;
} & {
  deadlineUri: string;
  deadlineKind: ("courtOrdered" | "statutory" | "agreed" | "hearing") | string;
  title?: string;
  basis?: {
    basisText?: string;
    legalProvision?: string;
    basisDocument?: string;
  };
  trigger?: {
    eventType: string;
    triggerDate?: string;
    triggerDocument?: string;
  };
  dueDate: string;
  dueAt?: string;
  /**
   * WIPO ST.3 office/country code
   */
  jurisdictionCode?: string;
  appointment?: {
    startsAt: string;
    endsAt?: string;
    location?: string;
    attendanceMode?: "inPerson" | "remote" | "hybrid";
  };
  reminderDates?: string[];
  supersedes?: {
    deadlineUri: string;
    grantingDocument?: string;
  };
  status: "open" | "met" | "missed" | "superseded" | "withdrawn";
  metBy?: {
    metAt: string;
    messageUri?: string;
    document?: string;
  };
  milestoneReferences?: string[];
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ActionConfirmationDispute".
 */
export type ActionConfirmationDispute = CommonEnvelope & {
  messageType: "urn:ipproto:message:actionConfirmationDispute";
  payload: {
    disputeReference: string;
    claimingMessage: string;
    expectedConfirmation: {
      expectedRegisterEventType?: string;
      expectedActorReference?: string;
      windowStartedAt?: string;
      windowExpectedAt?: string;
      windowExpiredAt?: string;
    };
    divergenceDetectedAt: string;
    partialEvidence?: {};
    disputeRoutingTarget: {
      targetActorUri: string;
      targetRoleDeclaration?: string;
      routingBasis?: string;
    };
    disputeImpact: {
      blockedAssertions?: unknown[];
      blockedMilestones?: string[];
      blockedWorkstreams?: string[];
    };
    investigativeActions?: {}[];
    responseDeadline: string;
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ArtifactReady".
 */
export type ArtifactReady = CommonEnvelope & {
  messageType: "urn:ipproto:message:artifactReady";
  payload: {
    artifactReference: {
      documentReferences: string[];
      structuredArtifactContent?: {};
    };
    actionDeclaration: {
      actionCategory: string;
      actionTarget: {
        targetSystem?: string;
        targetUri?: string;
        targetCredentialIssuer?: string;
      };
      actionInstructions?: {};
      actionDeadline?: {
        deadlineDate?: string;
        deadlineSource?: string;
        deadlineImpact?: "bindingLegal" | "proceduralRequirement" | "internalSchedule" | "advisory";
      };
    };
    expectedConfirmation: {
      confirmationMessage: "clientActionCompleted" | "paymentExecuted" | "custom";
      confirmationDeadline?: string;
      evidenceExpectations?: {
        evidenceTypes?: string[];
        evidenceMandatory?: "required" | "recommended" | "optional";
      };
    };
    expectedRegisterConfirmation: {
      expectedRegisterEventType?: string;
      expectedRegisterEventWindow?: {
        minimumDelayDays?: number;
        expectedDelayDays?: number;
        maximumDelayDays?: number;
      };
      divergenceHandling?: {};
    };
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "AssetAuthorityDispute".
 */
export type AssetAuthorityDispute = CommonEnvelope & {
  messageType: "urn:ipproto:message:assetAuthorityDispute";
  payload: {
    disputeReference: string;
    disputedRecord: string;
    /**
     * RFC 6901 JSON Pointer
     */
    disputedSectionPath: string;
    /**
     * @minItems 2
     * @maxItems 2
     */
    competingClaims: [string, string];
    conflictType:
      | "overlappingExclusive"
      | "sourceOfTruthChallenge"
      | "supersessionDispute"
      | "expiredClaim"
      | "delegationChainBroken";
    disputeNarrative: string;
    disputeRoutingTarget: {
      targetActorUri: string;
      targetRoleDeclaration?: string;
      routingBasis?: string;
    };
    disputeImpact: {
      blockedAssertions?: unknown[];
      blockedMilestones?: string[];
      blockedWorkstreams?: string[];
    };
    proposedResolution?: {
      resolutionType?:
        | "revokeClaim"
        | "narrowClaimScope"
        | "extendClaimTimebound"
        | "transferClaim"
        | "acknowledgeJointHolding"
        | "other";
      resolutionDescription?: string;
    };
    responseDeadline: string;
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "AssetBootstrap".
 */
export type AssetBootstrap = CommonEnvelope & {
  messageType: "urn:ipproto:message:assetBootstrap";
  payload: {
    asset: AssetReference;
    bootstrapBasis: {
      basisType:
        | "registerDetection"
        | "corporateIntroduction"
        | "serviceProviderInitialization"
        | "protocolMigration"
        | "manualEntry";
      triggeringReference?: string;
    };
    initialAssertions: DataAssertion[];
    initialAuthorityClaims: AuthorityClaim[];
    subscriptionInvitations?: {}[];
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "AssetMatchInquiry".
 */
export type AssetMatchInquiry = CommonEnvelope & {
  messageType: "urn:ipproto:message:assetMatchInquiry";
  payload: {
    assetReference: string;
    inquiryType: "recognitionAndAuthorization" | "enrichment" | "correspondenceMatch" | "authorityVerification";
    inquiryScope: string[];
    assertedResolution?: {
      entityReferences?: EntityReference[];
    };
    responseDeadline?: string;
    operationalContext?: {
      workstreamUri?: string;
      triggeringEventUri?: string;
      urgency?: "routine" | "expedited" | "urgent";
    };
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "AssetMatchResponse".
 */
export type AssetMatchResponse = CommonEnvelope & {
  messageType: "urn:ipproto:message:assetMatchResponse";
  payload: {
    inquiryReference: string;
    responseOutcome: "confirmed" | "confirmedWithEnrichment" | "denied" | "unknown" | "disputedResolution";
    outcomeDetails: OutcomeDetails;
    additionalAuthorityClaims?: AuthorityClaim[];
  };
};
/**
 * One side confirms a proposed award. The award stands when both the bidder and the work requester have confirmed, which commits the milestone.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "AwardConfirmed".
 */
export type AwardConfirmed = CommonEnvelope & {
  messageType: "urn:ipproto:message:awardConfirmed";
  payload: {
    awardReference: string;
    confirmedBy: UserContext;
    confirmingRole: string;
  };
};
/**
 * A bidder declines a proposed award, with the reason.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "AwardDeclined".
 */
export type AwardDeclined = CommonEnvelope & {
  messageType: "urn:ipproto:message:awardDeclined";
  payload: {
    awardReference: string;
    declineReason: {
      reasonCategory: "conflictOfInterest" | "noCapacity" | "bidExpired" | "scopeChanged" | "other";
      reasonNarrative?: string;
    };
  };
};
/**
 * A work requester proposes to award the milestone to one bid.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "AwardProposed".
 */
export type AwardProposed = CommonEnvelope & {
  messageType: "urn:ipproto:message:awardProposed";
  payload: {
    bidReference: string;
    confirmationDeadline: string;
    rank?: number;
  };
};
/**
 * A work requester declines a bid, with its reasons. The ranking behind the decision is not exchanged.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "BidDeclined".
 */
export type BidDeclined = CommonEnvelope & {
  messageType: "urn:ipproto:message:bidDeclined";
  payload: {
    bidReference: string;
    /**
     * @minItems 1
     */
    declineReasons: [
      {
        reasonCategory:
          "price" | "turnaround" | "staffing" | "scopeFit" | "anotherBidAwarded" | "requestWithdrawn" | "other";
        reasonNarrative?: string;
      },
      ...{
        reasonCategory:
          "price" | "turnaround" | "staffing" | "scopeFit" | "anotherBidAwarded" | "requestWithdrawn" | "other";
        reasonNarrative?: string;
      }[]
    ];
  };
};
/**
 * An orchestrator invites suppliers to bid on one milestone. Opens the procurement sequence behind the execution mode thirdPartyRfp.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "BidInvitation".
 */
export type BidInvitation = CommonEnvelope & {
  messageType: "urn:ipproto:message:bidInvitation";
  payload: {
    requestReference: string;
    milestoneReference: string;
    scope: {
      scopeText: string;
      milestoneCategory?: string;
      /**
       * WIPO ST.3 office/country code
       */
      jurisdictionCode?: string;
      assetReferences?: string[];
      /**
       * The rights the work is to create or prepare where no asset exists yet, as on Work Requested. While requesterIdentityWithheld is true no entry carries an applicant. Added in 0.4.
       *
       * @minItems 1
       */
      prospectiveRights?: [ProspectiveRight, ...ProspectiveRight[]];
    };
    /**
     * @minItems 1
     */
    lineItemTemplate: [string, ...string[]];
    bidDeadline: string;
    audience: "single" | "panel" | "open";
    conflictParties: ConflictParty[];
    requesterIdentityWithheld?: boolean;
    requester?: ActorReference;
  };
};
/**
 * A bidder submits a binding bid in answer to a bid invitation.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "BidSubmitted".
 */
export type BidSubmitted = CommonEnvelope & {
  messageType: "urn:ipproto:message:bidSubmitted";
  payload: {
    bidReference: string;
    invitationReference: string;
    price: AgreedPrice & {
      [k: string]: unknown;
    };
    committedTurnaroundDays: number;
    staffing?: {
      roleAtActor?: string;
      qualification?: string;
      userContext?: UserContext;
    }[];
    comments?: string;
  };
};
/**
 * A bidder withdraws a bid it has submitted.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "BidWithdrawn".
 */
export type BidWithdrawn = CommonEnvelope & {
  messageType: "urn:ipproto:message:bidWithdrawn";
  payload: {
    bidReference: string;
    withdrawalReason: {
      reasonCategory: "conflictOfInterest" | "noCapacity" | "pricingError" | "scopeChanged" | "other";
      reasonNarrative?: string;
    };
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ClientActionCompleted".
 */
export type ClientActionCompleted = CommonEnvelope & {
  messageType: "urn:ipproto:message:clientActionCompleted";
  payload: {
    artifactReadyReference: string;
    actionPerformedAt: string;
    performingUserContext?: UserContext;
    evidence: EvidenceCollection;
    actionOutcome: "successfullyPerformed" | "partiallyPerformed" | "couldNotPerform" | "performedWithDeviation";
    outcomeDetails?: OutcomeDetails;
  };
};
/**
 * A provider attests the outcome of its conflict check against the parties of the work it is asked to take: a bid invitation, a work instruction, a mandate instruction or a request. Only the attestation is exchanged, not the method. Generalised in 0.6.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ConflictCheckAttested".
 */
export type ConflictCheckAttested = CommonEnvelope & {
  messageType: "urn:ipproto:message:conflictCheckAttested";
  payload: {
    /**
     * Added in 0.6. What the attestation is about.
     */
    subjectReference?: {
      subjectType: "bidInvitation" | "workInstruction" | "mandateInstruction" | "request";
      reference: string;
    };
    invitationReference?: string;
    /**
     * @minItems 1
     */
    checkedParties: [EntityReference | ConflictParty, ...(EntityReference | ConflictParty)[]];
    checkedAt?: string;
    outcome: "clear" | "clearedAfterReview" | "conflict";
    attestedBy: UserContext;
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "DeliverableAcknowledged".
 */
export type DeliverableAcknowledged = CommonEnvelope & {
  messageType: "urn:ipproto:message:deliverableAcknowledged";
  payload: {
    deliverableReference: string;
    acknowledgmentType: "simpleAcknowledgment" | "acceptance" | "conditionalAcceptance" | "objection";
    acknowledgedAt: string;
    receiverUserContext?: UserContext;
    reviewSummary?: string;
    annotations?: {}[];
    conditions?: {}[];
    objectionDetails?: {};
    downstreamMilestoneRelease: {
      releasedMilestones?: string[];
      blockedMilestones?: {}[];
    };
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "DisputeResolutionDecision".
 */
export type DisputeResolutionDecision = CommonEnvelope & {
  messageType: "urn:ipproto:message:disputeResolutionDecision";
  payload: {
    disputeReference: string;
    decidedAt: string;
    decisionUserContext?: UserContext;
    decisionType:
      | "claimUpheld"
      | "claimRevoked"
      | "claimNarrowed"
      | "claimTransferred"
      | "claimsCoexistAsAdvisory"
      | "acknowledgeRegisterArrival"
      | "actionRequiresReExecution"
      | "actionAcknowledgedAdministrative"
      | "actionDisputed"
      | "oneResolutionDesignatedCanonical"
      | "bothResolutionsRetained"
      | "resolutionDeferredToBilateral"
      | "resolutionRequiresHumanInvestigation";
    decisionDetails: OutcomeDetails;
    decisionRationale: string;
    cascadeActions?: {
      actionType?:
        | "releaseBlockedMilestone"
        | "applyHeldAssertion"
        | "terminateClaim"
        | "recordResolutionForRouting"
        | "produceCorrectiveMessage";
      actionTarget?: string;
      actionTiming?: string;
    }[];
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "GoalDecomposition".
 */
export type GoalDecomposition = CommonEnvelope & {
  messageType: "urn:ipproto:message:goalDecomposition";
  payload: {
    proposedWorkstream: Workstream;
    proposalRationale: {
      analyticsSummary: string;
      dataInputs: {
        inputType: string;
        inputDescription: string;
        inputDocumentUri?: string;
      }[];
      alternativesConsidered?: {}[];
    };
    deliveryRouteSimulations?: {}[];
    acceptanceConstraints?: {};
    responseDeadline: string;
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "IdentityResolutionDispute".
 */
export type IdentityResolutionDispute = CommonEnvelope & {
  messageType: "urn:ipproto:message:identityResolutionDispute";
  payload: {
    disputeReference: string;
    disputedLiteral: {
      literal: {};
      appearanceContext?: {};
    };
    /**
     * @minItems 2
     * @maxItems 2
     */
    competingResolutions: [
      {
        assertingActorUri: string;
        resolvedEntityUri: string;
        resolutionMethod?: string;
        confidenceLevel?: string;
        resolutionBasis?: string;
      },
      {
        assertingActorUri: string;
        resolvedEntityUri: string;
        resolutionMethod?: string;
        confidenceLevel?: string;
        resolutionBasis?: string;
      }
    ];
    materialImpact: {
      impactDescription: string;
      affectedAssertions?: unknown[];
      affectedDecisions?: string;
    };
    disputeNarrative: string;
    disputeRoutingTarget?: {
      targetActorUri: string;
      targetRoleDeclaration?: string;
      routingBasis?: string;
    };
    responseDeadline?: string;
  };
};
/**
 * A work provider accepts a work instruction. Binds both sides to the instruction's price and service levels and commits the milestone.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "InstructionAccepted".
 */
export type InstructionAccepted = CommonEnvelope & {
  messageType: "urn:ipproto:message:instructionAccepted";
  payload: {
    instructionReference: string;
    acceptedAt: string;
    responsibleUser?: UserContext;
  };
};
/**
 * A work provider declines a work instruction, with the reason.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "InstructionDeclined".
 */
export type InstructionDeclined = CommonEnvelope & {
  messageType: "urn:ipproto:message:instructionDeclined";
  payload: {
    instructionReference: string;
    declineReason: {
      reasonCategory:
        | "conflictOfInterest"
        | "noCapacity"
        | "outsideCompetence"
        | "priceNotAccepted"
        | "serviceLevelNotFeasible"
        | "other";
      reasonNarrative?: string;
    };
  };
};
/**
 * Added in 0.5. The payee cancels an invoice it issued, with the reason, and names the replacement where there is one.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "InvoiceCancelled".
 */
export type InvoiceCancelled = CommonEnvelope & {
  messageType: "urn:ipproto:message:invoiceCancelled";
  payload: {
    invoiceReference: string;
    cancelledAt: string;
    cancellationReason: {
      reasonCategory: "issuedInError" | "disputeAccepted" | "workAbandoned" | "other";
      reasonNarrative?: string;
    };
    replacementInvoiceReference?: string;
    cancellationDocument?: string;
  };
};
/**
 * Added in 0.5. The payor disputes an invoice it received, with the reason. Acceptance of an invoice has no message.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "InvoiceDisputed".
 */
export type InvoiceDisputed = CommonEnvelope & {
  messageType: "urn:ipproto:message:invoiceDisputed";
  payload: {
    invoiceReference: string;
    disputedAt: string;
    disputeReason: {
      reasonCategory:
        | "amountNotAgreed"
        | "workNotCompleted"
        | "notOrderedByPayor"
        | "duplicateInvoice"
        | "taxTreatmentIncorrect"
        | "formalDefect"
        | "other";
      reasonNarrative?: string;
    };
    /**
     * @minItems 1
     */
    disputedLines?: [
      {
        lineIndex?: number;
        /**
         * Added in 0.8. The lineId of the line in the invoice. Since 0.8 a line is named by lineIndex, lineId or both.
         */
        lineId?: string;
        note?: string;
      },
      ...{
        lineIndex?: number;
        /**
         * Added in 0.8. The lineId of the line in the invoice. Since 0.8 a line is named by lineIndex, lineId or both.
         */
        lineId?: string;
        note?: string;
      }[]
    ];
    disputedAmount?: Money;
  };
};
/**
 * A payee issues an invoice to a payor, for milestones, subscriptions or both. One message for supplier invoices and for the customer invoice; payee and payor say which it is.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "InvoiceIssued".
 */
export type InvoiceIssued = CommonEnvelope & {
  messageType: "urn:ipproto:message:invoiceIssued";
  payload: {
    [k: string]: unknown;
  };
};
/**
 * A work requester instructs a work provider to handle a whole matter: one workstream, within a stated scope, rather than one milestone. Added in 0.6.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "MandateInstruction".
 */
export type MandateInstruction = CommonEnvelope & {
  messageType: "urn:ipproto:message:mandateInstruction";
  payload: {
    workstreamReference: string;
    instruction: {
      instructionText: string;
      instructionConstraints?: {};
    };
    mandateScope: {
      scopeText: string;
      milestoneCategories?: string[];
      jurisdictionCodes?: string[];
      assetReferences?: string[];
      /**
       * @minItems 1
       */
      prospectiveRights?: [ProspectiveRight, ...ProspectiveRight[]];
      excludedWork?: string;
      validUntil?: string;
    };
    conflictParties?: ConflictParty[];
    agreedPrice?: AgreedPrice;
    serviceLevels?: ServiceLevel[];
    responseDeadline?: string;
    deadlines?: Deadline[];
    providedDocuments?: string[];
    expectedDeliverables?: {
      deliverableType?: string;
      documentType?: string;
    }[];
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "MilestoneAbandoned".
 */
export type MilestoneAbandoned = CommonEnvelope & {
  messageType: "urn:ipproto:message:milestoneAbandoned";
  payload: {
    milestoneReference: string;
    abandonedAt: string;
    abandonmentReason: {
      reasonCategory:
        | "corporateWithdrawal"
        | "strategicRedirection"
        | "cascadingFromUpstream"
        | "disputeUnresolvable"
        | "assetStatusChange"
        | "other";
      reasonNarrative: string;
      decisionAuthority: string;
      decisionUserContext?: UserContext;
    };
    partialOutputs?: {};
    abandonmentImpact: {
      cascadingAbandonments?: string[];
      releasedResources?: string;
      unwindObligations?: unknown[];
    };
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "MilestoneCompleted".
 */
export type MilestoneCompleted = CommonEnvelope & {
  messageType: "urn:ipproto:message:milestoneCompleted";
  payload: {
    milestoneReference: string;
    completedAt: string;
    actuals: {
      actualCost?: Money;
      actualDuration?: number;
      varianceFromEstimate?: string;
    };
    outputs: {
      producedDocuments?: string[];
      producedSubscriptions?: string[];
      producedAssertions?: string[];
    };
    completionType: "definitiveCompletion" | "awaitingExternalAction";
    acknowledgmentRequired?: boolean;
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "MilestoneFailed".
 */
export type MilestoneFailed = CommonEnvelope & {
  messageType: "urn:ipproto:message:milestoneFailed";
  payload: {
    milestoneReference: string;
    failedAt: string;
    failureReason: {
      reasonCategory:
        | "technicalFailure"
        | "externalDependencyUnavailable"
        | "dataInsufficient"
        | "qualityThresholdNotMet"
        | "deadlineMissed"
        | "policyViolation"
        | "humanError"
        | "other";
      reasonNarrative: string;
      recoverable: boolean;
      suggestedRemediation?: string;
    };
    partialOutputs?: {};
    failureImpact: {
      affectedDownstreamMilestones?: string[];
      /**
       * Since 0.6 each entry is a Deadline structure or the deadlineUri of a deadline the recipients already hold.
       */
      affectedDeadlines?: (string | Deadline)[];
      requiredAction:
        "escalateToCorporate" | "retryAutomatic" | "redesignWorkstream" | "abandonWorkstream" | "noActionRequired";
    };
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "MilestoneStarted".
 */
export type MilestoneStarted = CommonEnvelope & {
  messageType: "urn:ipproto:message:milestoneStarted";
  payload: {
    milestoneReference: string;
    startedAt: string;
    actualResources?: {
      assignedUsers?: UserContext[];
      expectedCompletionEstimate?: {
        estimatedCompletionDate?: string;
        confidenceLevel?: string;
      };
    };
    startupNotes?: string;
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "OrchestrationCommitted".
 */
export type OrchestrationCommitted = CommonEnvelope & {
  messageType: "urn:ipproto:message:orchestrationCommitted";
  payload: {
    proposalReference: string;
    commitmentDecision:
      "committed" | "committedWithModifications" | "committedWithRouteSelection" | "rejected" | "deferred";
    modifications?: {
      modificationType:
        | "addMilestone"
        | "removeMilestone"
        | "modifyMilestone"
        | "modifyDependency"
        | "modifyExecutionMode"
        | "modifyActorAssignment"
        | "modifyEstimate"
        | "modifyGoalConstraint";
      targetMilestoneUri?: string;
      modificationContent?: {};
      modificationRationale?: string;
      modificationUserContext?: UserContext;
    }[];
    selectedRoute?: {
      routeName: string;
    };
    commitmentAssertions: DataAssertion[];
    rejectionReason?: string;
    deferralExpiry?: string;
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "PaymentAuthorized".
 */
export type PaymentAuthorized = CommonEnvelope & {
  messageType: "urn:ipproto:message:paymentAuthorized";
  payload: {
    paymentReference: string;
    paymentPurpose: {
      purposeCategory: string;
      purposeNarrative?: string;
      relatedMilestoneUri?: string;
      relatedSubscriptionUri?: string;
    };
    paymentAmount: {
      amount: number;
      /**
       * ISO 4217 currency code
       */
      currency: string;
      amountBreakdown?: unknown[];
      taxHandling?: {};
    };
    payee: {
      payeeType: "officeAuthority" | "actor";
      /**
       * WIPO ST.3 office/country code
       */
      officeCode?: string;
      payeeIdentifier?: string;
      payeeActorReference?: string;
      payeeAccountReference?: string;
    };
    paymentAgent: {
      agentActorReference: string;
      agentRoleDeclaration: string;
      executionAuthorityReference?: string;
    };
    payorReferences: {};
    executionWindow: {
      executeNotBefore?: string;
      executeBy: string;
      urgency?: "routine" | "expedited" | "urgent";
    };
    expectedConfirmation: {};
    expectedExternalConfirmation?: {};
    /**
     * Added in 0.8. The invoices the payment settles, with the amount applied to each where the payment settles several or part of one.
     *
     * @minItems 1
     */
    invoiceReferences?: [
      {
        invoiceReference: string;
        appliedAmount?: Money;
      },
      ...{
        invoiceReference: string;
        appliedAmount?: Money;
      }[]
    ];
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "PaymentExecuted".
 */
export type PaymentExecuted = CommonEnvelope & {
  messageType: "urn:ipproto:message:paymentExecuted";
  payload: {
    paymentReference: string;
    authorizationReference: string;
    executedAt: string;
    executingUserContext?: UserContext;
    executedAmount: {
      amount: number;
      /**
       * ISO 4217 currency code
       */
      currency: string;
    };
    executionDeviation?: {};
    executionEvidence: EvidenceCollection;
    executionOutcome: "successfullyExecuted" | "executionFailed" | "executionPartial" | "executionPending";
    failureDetails?: {
      failureCategory?:
        | "insufficientFunds"
        | "bankingSystemError"
        | "payeeRejection"
        | "complianceHold"
        | "currencyConversionFailure"
        | "other";
      failureNarrative?: string;
      recoverable?: boolean;
      suggestedRemediation?: string;
    };
    /**
     * Added in 0.8. The invoices the payment settles, with the amount applied to each where the payment settles several or part of one.
     *
     * @minItems 1
     */
    invoiceReferences?: [
      {
        invoiceReference: string;
        appliedAmount?: Money;
      },
      ...{
        invoiceReference: string;
        appliedAmount?: Money;
      }[]
    ];
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "RecordUpdate".
 */
export type RecordUpdate = CommonEnvelope & {
  messageType: "urn:ipproto:message:recordUpdate";
  payload: {
    updatedRecord: string;
    updateNarrative: string;
    updateCategory: "correction" | "internalReorganization" | "routineMaintenance" | "metadataRefresh" | "other";
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "RegisterEvent".
 */
export type RegisterEvent = CommonEnvelope & {
  messageType: "urn:ipproto:message:registerEvent";
  payload: {
    registerEventReference: string;
    publishingRegister: {
      registerActorUri: string;
      observerActorUri?: string;
    };
    registerEventCategory: string;
    st27Mapping?: {
      st27Code?: string;
      st27Subcategory?: string;
      st27Version?: string;
    };
    /**
     * @minItems 1
     */
    relatedAssetReferences: [string, ...string[]];
    registerPublicationDate: string;
    registerEventContent: {};
  };
};
/**
 * An orchestrator declines a work request, with the reason. No workstream is created.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "RequestDeclined".
 */
export type RequestDeclined = CommonEnvelope & {
  messageType: "urn:ipproto:message:requestDeclined";
  payload: {
    requestReference: string;
    declineReason: {
      reasonCategory:
        | "serviceNotOffered"
        | "offerNotAvailable"
        | "requesterNotEligible"
        | "conflictOfInterest"
        | "noSupplierAvailable"
        | "insufficientInformation"
        | "other";
      reasonNarrative?: string;
    };
  };
};
/**
 * An orchestrator discloses the work requester to a bidder that has attested a clear conflict check. Sent only where the bid invitation withheld the requester's identity.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "RequesterDisclosed".
 */
export type RequesterDisclosed = CommonEnvelope & {
  messageType: "urn:ipproto:message:requesterDisclosed";
  payload: {
    invitationReference: string;
    requester: ActorReference;
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ServiceDeliverable".
 */
export type ServiceDeliverable = CommonEnvelope & {
  messageType: "urn:ipproto:message:serviceDeliverable";
  payload: {
    deliverableReference: string;
    producingMilestone: string;
    deliverableType: string;
    deliverableContent: {
      documentReferences?: string[];
      structuredContent?: {
        schemaIdentifier?: string;
        content?: unknown;
        schemaConformanceLevel?: "strict" | "extended" | "partial";
      };
    };
    deliverableSummary: {
      executiveSummary: string;
      keyFindings?: {
        findingCategory?: string;
        findingDescription?: string;
        findingSeverity?: "informational" | "recommendation" | "warning" | "critical";
      }[];
      actionsRecommended?: {}[];
    };
    producerAttestation: {
      qualityLevel: "draft" | "review" | "final";
      confidenceLevel?: "high" | "medium" | "low";
      professionalReview?: {};
      disclosures?: unknown[];
    };
    acknowledgmentExpectation: "acknowledgmentRequired" | "acknowledgmentRequested" | "acknowledgmentNotRequired";
    assertions?: DataAssertion[];
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ServiceFinding".
 */
export type ServiceFinding = CommonEnvelope & {
  messageType: "urn:ipproto:message:serviceFinding";
  payload: {
    findingReference: string;
    producingSubscription: string;
    findingCategory: string;
    /**
     * @minItems 1
     */
    relatedAssetReferences: [string, ...string[]];
    findingSeverity: "informational" | "recommendation" | "warning" | "critical";
    findingTimestamp: string;
    findingContent: {};
    findingSource: {
      sourceType: "registerEvent" | "automatedAnalysis" | "humanReview" | "combinedSourceDerivation";
      sourceDocumentReferences?: string[];
      sourceRegisterEventReferences?: string[];
      analysisUserContext?: UserContext;
    };
    recommendedActions?: {}[];
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ServiceSubscriptionStarted".
 */
export type ServiceSubscriptionStarted = CommonEnvelope & {
  messageType: "urn:ipproto:message:serviceSubscriptionStarted";
  payload: {
    subscriptionReference: string;
    subscriptionType: string;
    subscriptionScope: {
      scopedAssetReferences: string[];
      scopedDefinition?: {};
      scopeStartDate: string;
      scopeEndDate?: string;
    };
    /**
     * @minItems 1
     */
    actorAssignments: [
      {
        actorUri: string;
        roleDeclarationUri: string;
        assignmentType:
          | "subscriptionProvider"
          | "subscriptionContractHolder"
          | "subscriptionOperator"
          | "subscriber"
          | "payor"
          | "accountableTo";
        /**
         * Added in 0.8. Only on a payor assignment: this payor's share, in percent, of the charges for the milestone or subscription. The shares of all payor assignments add up to 100 (a spec rule).
         */
        payorShare?: number;
      },
      ...{
        actorUri: string;
        roleDeclarationUri: string;
        assignmentType:
          | "subscriptionProvider"
          | "subscriptionContractHolder"
          | "subscriptionOperator"
          | "subscriber"
          | "payor"
          | "accountableTo";
        /**
         * Added in 0.8. Only on a payor assignment: this payor's share, in percent, of the charges for the milestone or subscription. The shares of all payor assignments add up to 100 (a spec rule).
         */
        payorShare?: number;
      }[]
    ];
    cadence: {
      cadenceType: "eventDriven" | "periodic" | "hybrid";
      periodicSchedule?: {};
      eventTriggers?: unknown[];
    };
    commercialTerms: {
      feeStructure: "flatPeriodicFee" | "perFindingFee" | "tieredFee" | "revenueShare" | "custom";
      feeAmount?: {
        sharePercent?: number;
        [k: string]: unknown;
      };
      billingCadence: "inAdvance" | "inArrears" | "perFinding" | "custom";
      commercialAgreementReference?: string;
      planReference?: string;
      trial?: {
        trialEndsAt: string;
        afterTrial: "convertsToPaid" | "endsUnlessConfirmed";
      };
    };
    findingsConfiguration: {
      findingDeliveryMethod: "serviceFinding" | "aggregatedReport" | "notificationOnly";
      findingSeverityThresholds?: {};
      findingRecipients?: unknown[];
    };
    subscriptionAuthorityClaims: AuthorityClaim[];
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ServiceSubscriptionTerminated".
 */
export type ServiceSubscriptionTerminated = CommonEnvelope & {
  messageType: "urn:ipproto:message:serviceSubscriptionTerminated";
  payload: {
    subscriptionReference: string;
    terminationDate: string;
    terminationReason: {
      reasonCategory:
        | "subscriberWithdrawal"
        | "providerWithdrawal"
        | "assetStatusChange"
        | "commercialDispute"
        | "delegationCessation"
        | "policyChange"
        | "scopeNaturalCompletion"
        | "other";
      reasonNarrative: string;
      terminationInitiator: string;
      terminationUserContext?: UserContext;
    };
    effectiveTerminationTiming: {
      terminationType: "immediate" | "endOfPeriod" | "customDate" | "gracefulShutdown";
      effectiveDate: string;
      gracePeriodHandling?: {};
    };
    finalSettlement?: {};
    postTerminationObligations?: {}[];
  };
};
/**
 * A work requester instructs a work provider to perform one milestone at an agreed price and under agreed service levels.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "WorkInstruction".
 */
export type WorkInstruction = CommonEnvelope & {
  messageType: "urn:ipproto:message:workInstruction";
  payload: {
    milestoneReference: string;
    instruction: {
      instructionText: string;
      instructionConstraints?: {};
    };
    agreedPrice: AgreedPrice;
    /**
     * Required unless the envelope carries recordedBy (an instruction recorded by its provider); relaxed in 0.7.
     *
     * @minItems 1
     */
    serviceLevels?: [ServiceLevel, ...ServiceLevel[]];
    providedDocuments: string[];
    /**
     * @minItems 1
     */
    expectedDeliverables: [
      {
        deliverableType?: string;
        documentType?: string;
      },
      ...{
        deliverableType?: string;
        documentType?: string;
      }[]
    ];
    responseDeadline?: string;
    /**
     * Added in 0.6. The parties the provider checks for conflicts of interest before it accepts.
     */
    conflictParties?: ConflictParty[];
  };
};
/**
 * A work requester places an order or asks for work, on existing assets, on rights still to be created, or both. Opens a catalogue order or one of the three procurement paths.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "WorkRequested".
 */
export type WorkRequested = CommonEnvelope & {
  messageType: "urn:ipproto:message:workRequested";
  payload: {
    requestReference: string;
    goalStatement: {
      goalText: string;
      goalCategory?: string;
      goalConstraints?: {
        /**
         * Since 0.6 an array of Deadline structures: the deadlines the goal must observe.
         */
        deadlineConstraints?: Deadline[];
      };
    };
    /**
     * Optional since 0.9 (decision 107): a request for advisory work may carry neither assetReferences nor prospectiveRights.
     *
     * @minItems 1
     */
    assetReferences?: [string, ...string[]];
    /**
     * Optional since 0.9 (decision 107): a request for advisory work may carry neither assetReferences nor prospectiveRights.
     *
     * @minItems 1
     */
    prospectiveRights?: [ProspectiveRight, ...ProspectiveRight[]];
    /**
     * @minItems 1
     */
    requestedWork: [
      {
        milestoneCategory: string;
        /**
         * WIPO ST.3 office/country code
         */
        jurisdictionCode?: string;
      },
      ...{
        milestoneCategory: string;
        /**
         * WIPO ST.3 office/country code
         */
        jurisdictionCode?: string;
      }[]
    ];
    instructingCapacity: "own" | "onBehalf";
    beneficiary?: EntityReference;
    requestMode: "catalogueOrder" | "directQuote" | "panel" | "openRfp";
    offerReference?: string;
    preAuthorized?: boolean;
    responseDeadline?: string;
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "WorkstreamAbandoned".
 */
export type WorkstreamAbandoned = CommonEnvelope & {
  messageType: "urn:ipproto:message:workstreamAbandoned";
  payload: {
    workstreamReference: string;
    abandonmentReason: {
      reasonType:
        | "corporateWithdrawal"
        | "disputeDeadlock"
        | "forceMajeure"
        | "assetStatusChange"
        | "externalEvent"
        | "policyChange"
        | "other";
      reasonNarrative: string;
      abandonmentInitiator: string;
      abandonmentUserContext?: UserContext;
    };
    milestoneStateAtAbandonment: {
      milestoneUri: string;
      statusAtAbandonment: string;
      dispositionAfterAbandonment:
        "completedBeforeAbandonment" | "inProgressAtAbandonment" | "cancelled" | "partialDeliverableRetained";
    }[];
    partialOutcomes?: {};
    abandonmentAssertions: DataAssertion[];
    unwindObligations?: {}[];
  };
};
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "WorkstreamCompleted".
 */
export type WorkstreamCompleted = CommonEnvelope & {
  messageType: "urn:ipproto:message:workstreamCompleted";
  payload: {
    workstreamReference: string;
    completionSummary: {
      completionOutcome: "fullSuccess" | "partialSuccess" | "mixedOutcome";
      aggregatedActuals?: {};
      outputArtifacts?: string[];
      subscriptionsCreated?: string[];
      derivedAssetsCreated?: string[];
    };
    completionAssertions: DataAssertion[];
    postCompletionState: {
      assetStateNotes?: string;
      outstandingObligations?: {}[];
      auditCompletionDate?: string;
    };
  };
};
/**
 * Any message of this version, discriminated on messageType.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "IpprotoMessage".
 */
export type IpprotoMessage =
  | ActionConfirmationDispute
  | ArtifactReady
  | AssetAuthorityDispute
  | AssetBootstrap
  | AssetMatchInquiry
  | AssetMatchResponse
  | AwardConfirmed
  | AwardDeclined
  | AwardProposed
  | BidDeclined
  | BidInvitation
  | BidSubmitted
  | BidWithdrawn
  | ClientActionCompleted
  | ConflictCheckAttested
  | DeliverableAcknowledged
  | DisputeResolutionDecision
  | GoalDecomposition
  | IdentityResolutionDispute
  | InstructionAccepted
  | InstructionDeclined
  | InvoiceCancelled
  | InvoiceDisputed
  | InvoiceIssued
  | MandateInstruction
  | MilestoneAbandoned
  | MilestoneCompleted
  | MilestoneFailed
  | MilestoneStarted
  | OrchestrationCommitted
  | PaymentAuthorized
  | PaymentExecuted
  | RecordUpdate
  | RegisterEvent
  | RequestDeclined
  | RequesterDisclosed
  | ServiceDeliverable
  | ServiceFinding
  | ServiceSubscriptionStarted
  | ServiceSubscriptionTerminated
  | WorkInstruction
  | WorkRequested
  | WorkstreamAbandoned
  | WorkstreamCompleted;

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
  /**
   * Added in 0.6. Identifiers of the entity known to the asserter, as on Actor Reference.
   */
  identifiers?: Identifier[];
  /**
   * Added in 0.6. Other names under which the entity is known.
   */
  aliases?: string[];
  /**
   * Added in 0.7. Whether the entity is a legal or a natural person.
   */
  entityKind?: "legalPerson" | "naturalPerson";
  crossActorReferences?: {
    actorUri: string;
    entityUriInActor: string;
  }[];
}
/**
 * An identifier of an organization or a person, as on Actor Reference. Added to defs in 0.6 for Entity Reference.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "Identifier".
 */
export interface Identifier {
  scheme: string;
  value: string;
  verifiedAt?: string;
  /**
   * The register that issued the identifier; required with the scheme urn:ipproto:scheme:companyRegister.
   */
  registrationAuthority?: string;
}
/**
 * A party to be checked for conflicts of interest, with its role in the work. Shared by Bid Invitation, Work Instruction, Mandate Instruction and Conflict Check Attested. partyRole adds applicant and namespaced URNs in 0.6.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ConflictParty".
 */
export interface ConflictParty {
  partyRole: ("beneficiary" | "applicant" | "adverseParty" | "other") | string;
  party: EntityReference;
}
/**
 * A party to a proceeding: its role towards the client and its position in the proceeding. Added in 0.7.
 *
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "ProceedingParty".
 */
export interface ProceedingParty {
  partyRole: ("client" | "adverseParty" | "intervener" | "other") | string;
  party: EntityReference;
  proceduralPosition?: string;
}
/**
 * This interface was referenced by `IPOperationsProtocol`'s JSON-Schema
 * via the `definition` "CommonEnvelope".
 */
export interface CommonEnvelope {
  messageUri: string;
  messageType: string;
  /**
   * MAJOR.MINOR without the patch number. Pattern added in 0.6.
   */
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
  /**
   * Added in 0.6. How a message recorded by another actor reached it. Used only together with recordedBy.
   */
  recordedFrom?: {
    channel?: ("email" | "letter" | "telephone" | "inPerson" | "fax" | "portal" | "other") | string;
    sourceDocument?: string;
    receivedAt?: string;
  };
  /**
   * Added in 0.6. How the content of the message may be handled. Under privileged: no broadcast, no bootstrap subscription invitations, resolution only for originator and addressees, no forwarding, no third-party asset lookup.
   */
  confidentiality?: {
    level: "privileged" | "confidential" | "normal";
    basis?: string;
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
 * A binding price for a unit of work, as opposed to an estimate. Carried on a milestone, in a work instruction and a mandate instruction, and as the price of a bid.
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
  priceBasis: "fixed" | "capped" | "hourly" | "periodicFlat";
  lineItems?: {
    lineItemType: string;
    amount: number;
    quantity?: number;
    note?: string;
  }[];
  /**
   * Added in 0.7. Required when priceBasis is periodicFlat, not used otherwise.
   */
  periodicity?: "monthly" | "quarterly" | "semiAnnual" | "annual";
  /**
   * Added in 0.7. Rates for time-based work per role or per timekeeper; used with hourly and capped.
   */
  rateTable?: {
    rateRole?: string;
    timekeeper?: string;
    rate: number;
    rateUnit?: "hour" | "day";
    note?: string;
  }[];
  /**
   * Added in 0.7. An agreed expectation of cost with a rule for exceeding it; not a cap.
   */
  budget?: {
    amount: number;
    onExceeding: "notify" | "approvalRequired";
    note?: string;
  };
  /**
   * Added in 0.7. A statutory fee schedule the fee is not below.
   */
  statutoryFeeFloor?: {
    feeSchedule: string;
    valueOfMatter?: Money;
    note?: string;
  };
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
  /**
   * An Actor Reference URI, or since 0.7 an Entity Reference for an originator that is not a protocol actor, such as a court.
   */
  originator: string | EntityReference;
  originationDate: string;
  /**
   * Added in 0.7. When the document was served on the party for which the issuer of this reference acts.
   */
  servedAt?: string;
  /**
   * Added in 0.7. When the issuer of this reference, or its client, received the document.
   */
  receivedAt?: string;
  /**
   * Added in 0.7. The designation of a document submitted in proceedings, typically an exhibit.
   */
  courtDesignation?: {
    proceedingReference?: string;
    side?: string;
    designation: string;
    sequenceNumber?: number;
  };
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
      /**
       * Added in 0.8. Only on a payor assignment: this payor's share, in percent, of the charges for the milestone or subscription. The shares of all payor assignments add up to 100 (a spec rule).
       */
      payorShare?: number;
    },
    ...{
      actorUri: string;
      roleDeclarationUri: string;
      assignmentType: "primary" | "delegatedFrom" | "accountableTo" | "payor" | "observer";
      /**
       * Added in 0.8. Only on a payor assignment: this payor's share, in percent, of the charges for the milestone or subscription. The shares of all payor assignments add up to 100 (a spec rule).
       */
      payorShare?: number;
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
  /**
   * Added in 0.6. The deadlines the milestone's work serves. Not service levels.
   */
  deadlines?: Deadline[];
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
   * Optional since 0.9 (decision 106): advisory work may carry neither assetReferences nor prospectiveRights. A workstream about a specific right lists it as soon as it is known.
   *
   * @minItems 1
   */
  assetReferences?: [string, ...string[]];
  /**
   * Added in 0.3. Optional since 0.9 (decision 106); from 0.3 to 0.8 one of assetReferences and prospectiveRights was required.
   *
   * @minItems 1
   */
  prospectiveRights?: [ProspectiveRight, ...ProspectiveRight[]];
  /**
   * Added in 0.7. The role each asset plays in a dispute; every assetUri is an entry of assetReferences. Recorded under the status claim since 0.9 (decision 108).
   */
  assetRoles?: {
    assetUri: string;
    role: ("patentInSuit" | "challengedPatent" | "counterAsserted" | "other") | string;
    proceedingReference?: string;
  }[];
  /**
   * Added in 0.7. The proceedings in which the work is done, with their parties. Carried only to the workstream's own actors. Recorded under the status claim since 0.9 (decision 108).
   */
  proceedings?: {
    proceedingUri: string;
    proceedingType: string;
    forum: EntityReference;
    forumDocketNumber?: string;
    instance?: ("firstInstance" | "appeal" | "furtherAppeal") | string;
    /**
     * @minItems 1
     */
    parties: [ProceedingParty, ...ProceedingParty[]];
    relatedProceedings?: {
      proceedingUri: string;
      relationshipType: ("appealFrom" | "counterclaimIn" | "consolidatedWith" | "stayedPending") | string;
    }[];
  }[];
  triggeringEvent: {
    eventType: "registerEvent" | "clientRequest" | "subscriptionFinding" | "internalDecision" | "manualEntry";
    eventReference?: string;
    triggeredAt: string;
  };
  goalStatement: {
    goalText: string;
    goalCategory?: string;
    goalConstraints?: {
      /**
       * Since 0.6 an array of Deadline structures: the deadlines the goal must observe.
       */
      deadlineConstraints?: Deadline[];
      [k: string]: unknown;
    };
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
