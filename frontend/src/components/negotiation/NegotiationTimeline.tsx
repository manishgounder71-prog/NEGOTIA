import React from 'react';
import { CheckCircle2, ChevronRight, ArrowDown, Sparkles } from 'lucide-react';
import { NegotiationRound } from '../../types/negotiation';

interface NegotiationTimelineProps {
  rounds: NegotiationRound[];
  activeRoundIndex: number;
  onSelectRound: (index: number) => void;
}

export const NegotiationTimeline: React.FC<NegotiationTimelineProps> = ({
  rounds,
  activeRoundIndex,
  onSelectRound
}) => {
  return (
    <div className="bg-[#111419] border border-white/8 rounded-xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/6">
        <div>
          <h3 className="text-sm font-bold text-[#F5F7FA] tracking-tight">
            Multi-Round Negotiation Timeline
          </h3>
          <p className="text-[11px] text-[#5F6875] font-mono">
            Turn-by-turn proposal progression and convergence delta
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          4 / 6 ROUNDS ELAPSED
        </span>
      </div>

      <div className="space-y-3">
        {rounds.map((round, idx) => {
          const isSelected = activeRoundIndex === idx;
          const isFinal = round.isConverged;

          return (
            <div key={round.roundNumber} className="space-y-2">
              <button
                onClick={() => onSelectRound(idx)}
                className={`w-full p-3 rounded-lg text-left transition-all border flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-[#151920] border-indigo-500/40 shadow-md ring-1 ring-indigo-500/20'
                    : 'bg-[#0D0F13]/60 hover:bg-[#151920]/80 border-white/6'
                }`}
              >
                {/* Round Label */}
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded font-mono font-bold text-xs flex items-center justify-center ${
                    isFinal
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isSelected
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-[#1C222B] text-[#9BA3AF] border border-white/6'
                  }`}>
                    0{round.roundNumber}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#F5F7FA] font-mono flex items-center gap-2">
                      <span>ROUND 0{round.roundNumber}</span>
                      {isFinal && (
                        <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.2 rounded font-mono font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> DEAL REACHED
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#5F6875] font-mono">
                      Gap: ${round.priceGap.toLocaleString()} • Delivery Gap: {round.deliveryGap}d
                    </div>
                  </div>
                </div>

                {/* Proposals Comparison Strip */}
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-left md:text-right">
                    <span className="text-[#5F6875] text-[10px] block">BUYER PROPOSAL</span>
                    <span className="text-emerald-400 font-semibold">
                      ${(round.buyerProposal.price / 1000).toFixed(0)}K / {round.buyerProposal.deliveryDays}d / {round.buyerProposal.paymentTerms}
                    </span>
                  </div>

                  <span className="text-[#5F6875]">→</span>

                  <div className="text-left md:text-right">
                    <span className="text-[#5F6875] text-[10px] block">SUPPLIER OFFER</span>
                    <span className="text-blue-400 font-semibold">
                      ${round.supplierProposal ? `${(round.supplierProposal.price / 1000).toFixed(0)}K / ${round.supplierProposal.deliveryDays}d / ${round.supplierProposal.paymentTerms}` : 'Pending...'}
                    </span>
                  </div>
                </div>
              </button>

              {/* Connecting arrow if not last item */}
              {idx < rounds.length - 1 && (
                <div className="flex justify-center text-[#5F6875]">
                  <ArrowDown className="w-3 h-3 opacity-40" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
