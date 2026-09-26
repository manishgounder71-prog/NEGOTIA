import React from 'react';
import { NegotiationProvider, useNegotiation } from './context/NegotiationContext';
import { AppShell } from './components/layout/AppShell';
import { CommandCenter } from './components/dashboard/CommandCenter';
import { NegotiationArena } from './components/negotiation/NegotiationArena';
import { ContractViewer } from './components/contracts/ContractViewer';
import { AuditLedger } from './components/audit/AuditLedger';
import { SecurityTestPanel } from './components/governance/SecurityTestPanel';
import { ProcurementWizard } from './components/procurement/ProcurementWizard';
import { SuppliersView } from './components/procurement/SuppliersView';
import { MultiVendorRFQ } from './components/intelligence/MultiVendorRFQ';
import { AgentInspector } from './components/agents/AgentInspector';
import { PolicyCenter } from './components/governance/PolicyCenter';
import { LyzrSystemStatus } from './components/system/LyzrSystemStatus';

const MainViewRouter: React.FC = () => {
  const { activeTab } = useNegotiation();

  switch (activeTab) {
    case 'COMMAND_CENTER':
      return <CommandCenter />;
    case 'ARENA':
    case 'ACTIVE_DEALS':
      return <NegotiationArena />;
    case 'HISTORY':
    case 'AUDIT_LEDGER':
      return <AuditLedger />;
    case 'PROCUREMENT_WIZARD':
      return <ProcurementWizard />;
    case 'SUPPLIERS':
      return <SuppliersView />;
    case 'CONTRACT_VAULT':
      return <ContractViewer />;
    case 'POLICY_CENTER':
    case 'SAFETY_EVENTS':
      return <PolicyCenter />;
    case 'SECURITY_TESTS':
      return <SecurityTestPanel />;
    case 'MULTI_VENDOR_RFQ':
      return <MultiVendorRFQ />;
    case 'AGENT_INSPECTOR':
      return <AgentInspector />;
    case 'SYSTEM_STATUS':
    case 'SETTINGS':
      return <LyzrSystemStatus />;
    default:
      return <CommandCenter />;
  }
};

export function App() {
  return (
    <NegotiationProvider>
      <AppShell>
        <MainViewRouter />
      </AppShell>
    </NegotiationProvider>
  );
}

export default App;
