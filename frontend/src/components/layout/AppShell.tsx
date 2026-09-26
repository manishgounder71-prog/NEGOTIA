import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { CommandPalette } from './CommandPalette';
import { PolicyViolationModal } from '../governance/PolicyViolationModal';
import { HumanApprovalModal } from '../negotiation/HumanApprovalModal';
import { DeadlockPanel } from '../negotiation/DeadlockPanel';
import { AuthorizedVaultModal } from '../negotiation/AuthorizedVaultModal';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#08090B] text-[#F5F7FA] flex flex-row overflow-x-hidden">
      {/* Left Persistent Sidebar */}
      <Sidebar />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Command Bar */}
        <TopBar />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          {children}
        </main>
      </div>

      {/* Global Modals & Overlays */}
      <CommandPalette />
      <PolicyViolationModal />
      <HumanApprovalModal />
      <DeadlockPanel />
      <AuthorizedVaultModal />
    </div>
  );
};
