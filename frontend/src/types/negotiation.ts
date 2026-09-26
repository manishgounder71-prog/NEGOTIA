export type NegotiationStatus = 
  | 'INITIALIZING' 
  | 'IN_PROGRESS' 
  | 'POLICY_BLOCKED' 
  | 'AGREEMENT_REACHED' 
  | 'DEADLOCK' 
  | 'HUMAN_REVIEW_REQUIRED' 
  | 'TERMINATED';

export type AgentRole = 'BUYER' | 'SUPPLIER' | 'LEGAL_ARBITER' | 'GOVERNANCE_GATE' | 'HUMAN_OPERATOR';

export interface Proposal {
  id: string;
  round: number;
  actor: 'BUYER' | 'SUPPLIER';
  price: number;
  deliveryDays: number;
  sla: number; // e.g., 99.5
  paymentTerms: string; // e.g., 'Net 45'
  penaltyPercent: number; // e.g., 5
  quantity: number;
  timestamp: string;
  rationale?: string;
  isAcceptance?: boolean;
}

export interface PrivateBuyerEnvelope {
  targetPrice: number;
  ceilingPrice: number;
  targetDeliveryDays: number;
  maxDeliveryDays: number;
  minSla: number;
  targetPaymentTerms: string;
  acceptablePaymentTerms: string[];
  minPenaltyPercent: number;
  maxPenaltyPercent: number;
  batna: string;
  strategy: 'AGGRESSIVE' | 'BALANCED' | 'CONSERVATIVE';
}

export interface PrivateSupplierEnvelope {
  targetPrice: number;
  floorPrice: number;
  minDeliveryDays: number;
  standardDeliveryDays: number;
  maxSla: number;
  targetPaymentTerms: string;
  acceptablePaymentTerms: string[];
  minPenaltyPercent: number;
  maxPenaltyPercent: number;
  marginFloorPercent: number;
  strategy: 'AGGRESSIVE' | 'BALANCED' | 'CONSERVATIVE';
}

export interface PolicyCheckItem {
  id: string;
  name: string;
  category: 'PRICE' | 'DELIVERY' | 'SLA' | 'PAYMENT' | 'PENALTY' | 'PRIVACY' | 'LIABILITY';
  status: 'PASSED' | 'VIOLATION' | 'WARNING';
  ruleDescription: string;
  testedValue: string;
  authorizedLimit: string;
}

export interface PolicyResult {
  status: 'AUTHORIZED' | 'BLOCKED' | 'WARNING';
  timestamp: string;
  checks: PolicyCheckItem[];
  violations: string[];
  remediationAdvice?: string;
}

export interface NegotiationRound {
  roundNumber: number;
  buyerProposal: Proposal;
  supplierProposal?: Proposal;
  priceGap: number;
  deliveryGap: number;
  policyResult: PolicyResult;
  timestamp: string;
  isConverged?: boolean;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: AgentRole;
  eventType: 
    | 'NEGOTIATION_INIT' 
    | 'PROPOSAL_SUBMITTED' 
    | 'POLICY_EVALUATION' 
    | 'POLICY_BLOCKED' 
    | 'CONVERGENCE_CHECK' 
    | 'ATTACK_DETECTED' 
    | 'AGREEMENT_RATIFIED' 
    | 'CONTRACT_COMPILED' 
    | 'AUDIT_COMMITTED'
    | 'HUMAN_ESCALATION';
  action: string;
  inputSummary: string;
  decision: string;
  policyResult: 'PASSED' | 'BLOCKED' | 'WARNING' | 'N/A';
  hash: string;
  previousHash: string;
  rawPayload?: Record<string, any>;
  clauseRef?: string;
}

export interface ContractClause {
  id: string;
  title: string;
  clauseText: string;
  category: 'COMMERCIAL' | 'DELIVERY' | 'SLA' | 'PAYMENT' | 'LIABILITY' | 'GOVERNANCE';
  agreedValue: string;
  baselineValue: string;
  originatingRound: number;
  policyCompliance: 'VERIFIED' | 'AMENDED';
  auditRefId: string;
}

export interface ContractDocument {
  id: string;
  negotiationId: string;
  contractNumber: string;
  title: string;
  buyerName: string;
  supplierName: string;
  status: 'GOVERNANCE_APPROVED' | 'PENDING_SIGNATURE' | 'RATIFIED';
  finalPrice: number;
  quantity: number;
  totalValue: number;
  deliveryDays: number;
  sla: number;
  paymentTerms: string;
  penaltyPercent: number;
  governingLaw: string;
  sha256Hash: string;
  createdAt: string;
  ratifiedAt?: string;
  clauses: ContractClause[];
  signatures: {
    buyerAgentStamp: string;
    supplierAgentStamp: string;
    legalArbiterSeal: string;
  };
}

export interface SupplierProfile {
  id: string;
  name: string;
  category: string;
  negotiationCount: number;
  dealsClosed: number;
  avgConcessionPercent: number;
  complianceScore: number;
  reliabilityScore: number;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'ACTIVE' | 'PREFERRED' | 'UNDER_REVIEW';
  avatarInitials: string;
  contactEmail: string;
}

export interface NegotiationSession {
  id: string;
  title: string;
  category: string;
  buyerName: string;
  buyerAgentId: string;
  supplierName: string;
  supplierAgentId: string;
  status: NegotiationStatus;
  currentRound: number;
  maxRounds: number;
  currentProposal: Proposal;
  buyerEnvelope: PrivateBuyerEnvelope;
  supplierEnvelope: PrivateSupplierEnvelope;
  rounds: NegotiationRound[];
  convergence: number; // 0 to 100%
  deadlockRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  concessionVelocity: string;
  negotiationMomentum: 'CONVERGING' | 'STALLED' | 'AGGRESSIVE';
  informationLeakageCount: number;
  policyCompliancePercent: number;
  contract?: ContractDocument;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityTestScenario {
  id: string;
  title: string;
  attackType: 'PROMPT_INJECTION' | 'BUDGET_EXCEED' | 'UNAUTHORIZED_PENALTY' | 'BATNA_EXTRACTION';
  simulatedInput: string;
  detectionResult: 'BLOCKED' | 'FLAGGED';
  ruleViolated: string;
  status: 'COMPLETED' | 'PENDING';
  timestamp: string;
}
