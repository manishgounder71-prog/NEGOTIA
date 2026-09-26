import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  NegotiationSession, 
  NegotiationRound, 
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

interface NegotiationContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  session: NegotiationSession;
  setSession: React.Dispatch<React.SetStateAction<NegotiationSession>>;
  activeRoundIndex: number;
  setActiveRoundIndex: (index: number) => void;
  isAutoPlaying: boolean;
  setIsAutoPlaying: (playing: boolean) => void;
  stepForward: () => void;
  stepBackward: () => void;
  resetNegotiation: () => void;
  runDemoMode: () => void;
  isDemoRunning: boolean;
  demoProgressText: string;
  securityTests: SecurityTestScenario[];
  runSecurityAttackSimulation: () => void;
  isSecurityAttackRunning: boolean;
  auditEvents: AuditEvent[];
  contract: ContractDocument;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  blockedProposalModalOpen: boolean;
  setBlockedProposalModalOpen: (open: boolean) => void;
  humanApprovalModalOpen: boolean;
  setHumanApprovalModalOpen: (open: boolean) => void;
  deadlockModalOpen: boolean;
  setDeadlockModalOpen: (open: boolean) => void;
  authorizedVaultBuyerOpen: boolean;
  setAuthorizedVaultBuyerOpen: (open: boolean) => void;
  authorizedVaultSupplierOpen: boolean;
  setAuthorizedVaultSupplierOpen: (open: boolean) => void;
  selectedAuditEvent: AuditEvent | null;
  setSelectedAuditEvent: (event: AuditEvent | null) => void;
  triggerHumanEscalation: () => void;
  resolveHumanApproval: (action: 'APPROVE' | 'MODIFY' | 'REJECT') => void;
}

const NegotiationContext = createContext<NegotiationContextType | undefined>(undefined);

export const NegotiationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('COMMAND_CENTER');
  const [session, setSession] = useState<NegotiationSession>(MOCK_NEGOTIATION_SESSION);
  const [activeRoundIndex, setActiveRoundIndex] = useState<number>(3); // Round 4 (0-indexed = 3)
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [demoProgressText, setDemoProgressText] = useState<string>('');
  
  const [securityTests, setSecurityTests] = useState<SecurityTestScenario[]>(MOCK_SECURITY_TESTS);
  const [isSecurityAttackRunning, setIsSecurityAttackRunning] = useState<boolean>(false);
  
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(MOCK_AUDIT_EVENTS);
  const [contract] = useState<ContractDocument>(MOCK_CONTRACT);
  
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [blockedProposalModalOpen, setBlockedProposalModalOpen] = useState<boolean>(false);
  const [humanApprovalModalOpen, setHumanApprovalModalOpen] = useState<boolean>(false);
  const [deadlockModalOpen, setDeadlockModalOpen] = useState<boolean>(false);
  const [authorizedVaultBuyerOpen, setAuthorizedVaultBuyerOpen] = useState<boolean>(false);
  const [authorizedVaultSupplierOpen, setAuthorizedVaultSupplierOpen] = useState<boolean>(false);
  const [selectedAuditEvent, setSelectedAuditEvent] = useState<AuditEvent | null>(null);

  // Keyboard shortcut listener for Command Palette (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const stepForward = () => {
    if (activeRoundIndex < session.rounds.length - 1) {
      setActiveRoundIndex((prev) => prev + 1);
    }
  };

  const stepBackward = () => {
    if (activeRoundIndex > 0) {
      setActiveRoundIndex((prev) => prev - 1);
    }
  };

  const resetNegotiation = () => {
    setActiveRoundIndex(0);
    setIsAutoPlaying(false);
    setIsDemoRunning(false);
    setDemoProgressText('');
  };

  const runDemoMode = () => {
    setIsDemoRunning(true);
    setActiveTab('ARENA');
    setActiveRoundIndex(0);
    setDemoProgressText('Demo: Initializing Round 1 — Opening Positions Locked...');

    setTimeout(() => {
      setActiveRoundIndex(1);
      setDemoProgressText('Demo: Round 2 — Strategic concessions on delivery timeline...');
    }, 2500);

    setTimeout(() => {
      setActiveRoundIndex(2);
      setDemoProgressText('Demo: Round 3 — Price convergence nearing ZOPA threshold...');
    }, 5000);

    setTimeout(() => {
      setDemoProgressText('Demo: Simulating Out-of-Bounds Proposal ($107K) — Triggering Safe AI Intercept...');
      setBlockedProposalModalOpen(true);
    }, 7500);

    setTimeout(() => {
      setBlockedProposalModalOpen(false);
      setActiveRoundIndex(3);
      setDemoProgressText('Demo: Round 4 — Consensus Reached at $100,000 / Net 45 / 99.5% SLA!');
    }, 10500);

    setTimeout(() => {
      setDemoProgressText('Demo: Compiling Enforceable Contract & Writing to AIMS Ledger...');
      setActiveTab('CONTRACT_VAULT');
      setIsDemoRunning(false);
    }, 13500);
  };

  const runSecurityAttackSimulation = () => {
    setIsSecurityAttackRunning(true);
    setActiveTab('SECURITY_TESTS');

    setTimeout(() => {
      const updated = securityTests.map((t) => ({ ...t, status: 'COMPLETED' as const }));
      setSecurityTests(updated);
      setIsSecurityAttackRunning(false);
    }, 3000);
  };

  const triggerHumanEscalation = () => {
    setHumanApprovalModalOpen(true);
  };

  const resolveHumanApproval = (action: 'APPROVE' | 'MODIFY' | 'REJECT') => {
    setHumanApprovalModalOpen(false);
    if (action === 'APPROVE') {
      setActiveRoundIndex(3);
      setActiveTab('CONTRACT_VAULT');
    } else if (action === 'REJECT') {
      setDeadlockModalOpen(true);
    }
  };

  return (
    <NegotiationContext.Provider
      value={{
        activeTab,
        setActiveTab,
        session,
        setSession,
        activeRoundIndex,
        setActiveRoundIndex,
        isAutoPlaying,
        setIsAutoPlaying,
        stepForward,
        stepBackward,
        resetNegotiation,
        runDemoMode,
        isDemoRunning,
        demoProgressText,
        securityTests,
        runSecurityAttackSimulation,
        isSecurityAttackRunning,
        auditEvents,
        contract,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        blockedProposalModalOpen,
        setBlockedProposalModalOpen,
        humanApprovalModalOpen,
        setHumanApprovalModalOpen,
        deadlockModalOpen,
        setDeadlockModalOpen,
        authorizedVaultBuyerOpen,
        setAuthorizedVaultBuyerOpen,
        authorizedVaultSupplierOpen,
        setAuthorizedVaultSupplierOpen,
        selectedAuditEvent,
        setSelectedAuditEvent,
        triggerHumanEscalation,
        resolveHumanApproval,
      }}
    >
      {children}
    </NegotiationContext.Provider>
  );
};

export const useNegotiation = () => {
  const context = useContext(NegotiationContext);
  if (!context) {
    throw new Error('useNegotiation must be used within a NegotiationProvider');
  }
  return context;
};
