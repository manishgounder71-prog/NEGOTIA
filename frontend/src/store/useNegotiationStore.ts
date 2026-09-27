import { create } from 'zustand';
import { 
  NegotiationSession, 
  ContractDocument, 
  AuditEvent, 
  SecurityTestScenario 
} from '../types/negotiation';
import { 
  MOCK_NEGOTIATION_SESSION, 
  MOCK_CONTRACT, 
  MOCK_AUDIT_EVENTS, 
  MOCK_SECURITY_TESTS 
} from '../data/mockData';

export type NavigationTab = 
  | 'COMMAND_CENTER'
  | 'ARENA'
  | 'ACTIVE_DEALS'
  | 'HISTORY'
  | 'PROCUREMENT_WIZARD'
  | 'SUPPLIERS'
  | 'CONTRACT_VAULT'
  | 'POLICY_CENTER'
  | 'SAFETY_EVENTS'
  | 'AUDIT_LEDGER'
  | 'SECURITY_TESTS'
  | 'MULTI_VENDOR_RFQ'
  | 'AGENT_INSPECTOR'
  | 'SYSTEM_STATUS'
  | 'SETTINGS';

export interface NegotiationState {
  activeTab: NavigationTab;
  session: NegotiationSession;
  activeRoundIndex: number;
  isAutoPlaying: boolean;
  isDemoRunning: boolean;
  demoProgressText: string;
  securityTests: SecurityTestScenario[];
  isSecurityAttackRunning: boolean;
  auditEvents: AuditEvent[];
  contract: ContractDocument;
  isCommandPaletteOpen: boolean;
  blockedProposalModalOpen: boolean;
  humanApprovalModalOpen: boolean;
  deadlockModalOpen: boolean;
  authorizedVaultBuyerOpen: boolean;
  authorizedVaultSupplierOpen: boolean;
  selectedAuditEvent: AuditEvent | null;

  // Actions
  setActiveTab: (tab: NavigationTab) => void;
  setSession: (sessionOrUpdater: NegotiationSession | ((prev: NegotiationSession) => NegotiationSession)) => void;
  setActiveRoundIndex: (indexOrUpdater: number | ((prev: number) => number)) => void;
  setIsAutoPlaying: (playing: boolean) => void;
  setIsDemoRunning: (running: boolean) => void;
  setDemoProgressText: (text: string) => void;
  setIsCommandPaletteOpen: (openOrUpdater: boolean | ((prev: boolean) => boolean)) => void;
  setBlockedProposalModalOpen: (open: boolean) => void;
  setHumanApprovalModalOpen: (open: boolean) => void;
  setDeadlockModalOpen: (open: boolean) => void;
  setAuthorizedVaultBuyerOpen: (open: boolean) => void;
  setAuthorizedVaultSupplierOpen: (open: boolean) => void;
  setSelectedAuditEvent: (event: AuditEvent | null) => void;
  setSecurityTests: (tests: SecurityTestScenario[]) => void;
  
  stepForward: () => void;
  stepBackward: () => void;
  resetNegotiation: () => void;
  runDemoMode: () => void;
  runSecurityAttackSimulation: () => void;
  triggerHumanEscalation: () => void;
  resolveHumanApproval: (action: 'APPROVE' | 'MODIFY' | 'REJECT') => void;
}

export const useNegotiationStore = create<NegotiationState>((set, get) => ({
  activeTab: 'COMMAND_CENTER',
  session: MOCK_NEGOTIATION_SESSION,
  activeRoundIndex: 3,
  isAutoPlaying: false,
  isDemoRunning: false,
  demoProgressText: '',
  securityTests: MOCK_SECURITY_TESTS,
  isSecurityAttackRunning: false,
  auditEvents: MOCK_AUDIT_EVENTS,
  contract: MOCK_CONTRACT,
  isCommandPaletteOpen: false,
  blockedProposalModalOpen: false,
  humanApprovalModalOpen: false,
  deadlockModalOpen: false,
  authorizedVaultBuyerOpen: false,
  authorizedVaultSupplierOpen: false,
  selectedAuditEvent: null,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSession: (sessionOrUpdater) => set((state) => ({
    session: typeof sessionOrUpdater === 'function' ? sessionOrUpdater(state.session) : sessionOrUpdater
  })),
  setActiveRoundIndex: (indexOrUpdater) => set((state) => ({
    activeRoundIndex: typeof indexOrUpdater === 'function' ? indexOrUpdater(state.activeRoundIndex) : indexOrUpdater
  })),
  setIsAutoPlaying: (playing) => set({ isAutoPlaying: playing }),
  setIsDemoRunning: (running) => set({ isDemoRunning: running }),
  setDemoProgressText: (text) => set({ demoProgressText: text }),
  setIsCommandPaletteOpen: (openOrUpdater) => set((state) => ({
    isCommandPaletteOpen: typeof openOrUpdater === 'function' ? openOrUpdater(state.isCommandPaletteOpen) : openOrUpdater
  })),
  setBlockedProposalModalOpen: (open) => set({ blockedProposalModalOpen: open }),
  setHumanApprovalModalOpen: (open) => set({ humanApprovalModalOpen: open }),
  setDeadlockModalOpen: (open) => set({ deadlockModalOpen: open }),
  setAuthorizedVaultBuyerOpen: (open) => set({ authorizedVaultBuyerOpen: open }),
  setAuthorizedVaultSupplierOpen: (open) => set({ authorizedVaultSupplierOpen: open }),
  setSelectedAuditEvent: (event) => set({ selectedAuditEvent: event }),
  setSecurityTests: (tests) => set({ securityTests: tests }),

  stepForward: () => {
    const { activeRoundIndex, session } = get();
    if (activeRoundIndex < session.rounds.length - 1) {
      set({ activeRoundIndex: activeRoundIndex + 1 });
    }
  },

  stepBackward: () => {
    const { activeRoundIndex } = get();
    if (activeRoundIndex > 0) {
      set({ activeRoundIndex: activeRoundIndex - 1 });
    }
  },

  resetNegotiation: () => set({
    activeRoundIndex: 0,
    isAutoPlaying: false,
    isDemoRunning: false,
    demoProgressText: ''
  }),

  runDemoMode: () => {
    set({
      isDemoRunning: true,
      activeTab: 'ARENA',
      activeRoundIndex: 0,
      demoProgressText: 'Demo: Initializing Round 1 — Opening Positions Locked...'
    });

    setTimeout(() => {
      set({
        activeRoundIndex: 1,
        demoProgressText: 'Demo: Round 2 — Strategic concessions on delivery timeline...'
      });
    }, 2500);

    setTimeout(() => {
      set({
        activeRoundIndex: 2,
        demoProgressText: 'Demo: Round 3 — Price convergence nearing ZOPA threshold...'
      });
    }, 5000);

    setTimeout(() => {
      set({
        demoProgressText: 'Demo: Simulating Out-of-Bounds Proposal ($107K) — Triggering Safe AI Intercept...',
        blockedProposalModalOpen: true
      });
    }, 7500);

    setTimeout(() => {
      set({
        blockedProposalModalOpen: false,
        activeRoundIndex: 3,
        demoProgressText: 'Demo: Round 4 — Consensus Reached at $100,000 / Net 45 / 99.5% SLA!'
      });
    }, 10500);

    setTimeout(() => {
      set({
        demoProgressText: 'Demo: Compiling Enforceable Contract & Writing to AIMS Ledger...',
        activeTab: 'CONTRACT_VAULT',
        isDemoRunning: false
      });
    }, 13500);
  },

  runSecurityAttackSimulation: () => {
    set({
      isSecurityAttackRunning: true,
      activeTab: 'SECURITY_TESTS'
    });

    setTimeout(() => {
      const { securityTests } = get();
      const updated = securityTests.map((t) => ({ ...t, status: 'COMPLETED' as const }));
      set({
        securityTests: updated,
        isSecurityAttackRunning: false
      });
    }, 3000);
  },

  triggerHumanEscalation: () => {
    set({ humanApprovalModalOpen: true });
  },

  resolveHumanApproval: (action: 'APPROVE' | 'MODIFY' | 'REJECT') => {
    set({ humanApprovalModalOpen: false });
    if (action === 'APPROVE') {
      set({
        activeRoundIndex: 3,
        activeTab: 'CONTRACT_VAULT'
      });
    } else if (action === 'REJECT') {
      set({ deadlockModalOpen: true });
    }
  }
}));
