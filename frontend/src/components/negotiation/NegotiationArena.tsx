import React from 'react';
import { 
  Radio, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  UserCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Terminal,
  Cpu
} from 'lucide-react';
import { useNegotiation } from '../../context/NegotiationContext';
import { AgentCard } from './AgentCard';
import { GovernanceGate } from './GovernanceGate';
import { ConcessionChart } from './ConcessionChart';
import { NegotiationTimeline } from './NegotiationTimeline';
import { NegotiationHealth } from './NegotiationHealth';
import { AgentActivityStream } from './AgentActivityStream';
import { PrivacyBoundaryView } from './PrivacyBoundaryView';

export const NegotiationArena: React.FC = () => {
  const { 
    session, 
    activeRoundIndex, 
    setActiveRoundIndex, 
    isAutoPlaying, 
    setIsAutoPlaying, 
    stepForward, 
    stepBackward, 
    resetNegotiation, 
    setActiveTab,
    setBlockedProposalModalOpen,
    triggerHumanEscalation,
    setAuthorizedVaultBuyerOpen,
    setAuthorizedVaultSupplierOpen
  } = useNegotiation();

  const currentRound = session.rounds[activeRoundIndex] || session.rounds[session.rounds.length - 1];
  const buyerProposal = currentRound.buyerProposal;
  const supplierProposal = currentRound.supplierProposal || buyerProposal;
  const isFinalRound = currentRound.isConverged;

  return (
    <div className="space-y-6 pb-12">
      {/* Arena Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-[#0D0F13] border border-white/8 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-subtle-pulse"></span>
              LIVE
            </span>
            <span className="text-xs font-mono text-[#5F6875]">ID: {session.id}</span>
            <span className="text-white/20">|</span>
            <span className="text-xs font-mono text-indigo-400 font-semibold">
              ROUND: {activeRoundIndex + 1} / {session.maxRounds}
            </span>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-[#F5F7FA]">
            Autonomous Negotiation Arena
          </h1>
          <p className="text-xs text-[#9BA3AF]">
            {session.title}
          </p>
        </div>

        {/* Stepper & Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={stepBackward}
            disabled={activeRoundIndex === 0}
            className="px-3 py-2 rounded-lg bg-[#151920] hover:bg-[#1C222B] disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 text-xs font-mono text-[#F5F7FA] flex items-center gap-1 transition-all cursor-pointer"
            title="Step back 1 round"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>PREV</span>
          </button>

          <button
            onClick={stepForward}
            disabled={activeRoundIndex === session.rounds.length - 1}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-mono font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            title="Advance 1 round"
          >
            <span>NEXT ROUND</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="px-3 py-2 rounded-lg bg-[#151920] hover:bg-[#1C222B] border border-white/10 text-xs font-mono text-[#F5F7FA] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isAutoPlaying ? 'PAUSE' : 'AUTO-PLAY'}</span>
          </button>

          <button
            onClick={resetNegotiation}
            className="p-2 rounded-lg bg-[#151920] hover:bg-[#1C222B] border border-white/10 text-[#9BA3AF] hover:text-white transition-all cursor-pointer"
            title="Reset to Round 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={triggerHumanEscalation}
            className="px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>HUMAN REVIEW</span>
          </button>

          {isFinalRound && (
            <button
              onClick={() => setActiveTab('CONTRACT_VAULT')}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>VIEW COMPILED CONTRACT</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 3-Column Duel Arena Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Buyer Agent */}
        <div className="lg:col-span-4">
          <AgentCard
            role="BUYER"
            agentName={session.buyerName}
            agentModel="Lyzr Automata / GPT-4o"
            proposal={buyerProposal}
            envelope={session.buyerEnvelope}
            isTurnActive={true}
            onInspectPolicy={() => setAuthorizedVaultBuyerOpen(true)}
          />
        </div>

        {/* Center Column: Governance Gate & Live Convergence Curve */}
        <div className="lg:col-span-4 space-y-6">
          <GovernanceGate
            policyResult={currentRound.policyResult}
            onSimulateViolation={() => setBlockedProposalModalOpen(true)}
          />
          <NegotiationTimeline
            rounds={session.rounds}
            activeRoundIndex={activeRoundIndex}
            onSelectRound={(idx) => setActiveRoundIndex(idx)}
          />
        </div>

        {/* Right Column: Supplier Agent */}
        <div className="lg:col-span-4">
          <AgentCard
            role="SUPPLIER"
            agentName={session.supplierName}
            agentModel="Lyzr Automata / GPT-4o"
            proposal={supplierProposal}
            envelope={session.supplierEnvelope}
            isTurnActive={true}
            onInspectPolicy={() => setAuthorizedVaultSupplierOpen(true)}
          />
        </div>
      </div>

      {/* Full-width Concession Chart */}
      <ConcessionChart
        rounds={session.rounds}
        activeRoundIndex={activeRoundIndex}
      />

      {/* Privacy Boundary Visualization */}
      <PrivacyBoundaryView />

      {/* Bottom Sub-Panels: Negotiation Health & Live Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <NegotiationHealth session={session} />
        </div>
        <div className="lg:col-span-7">
          <AgentActivityStream />
        </div>
      </div>
    </div>
  );
};
