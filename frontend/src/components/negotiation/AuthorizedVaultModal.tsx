import React from 'react';
import { Lock, ShieldCheck, Eye, X, CheckCircle2 } from 'lucide-react';
import { useNegotiation } from '../../context/NegotiationContext';

export const AuthorizedVaultModal: React.FC = () => {
  const { 
    authorizedVaultBuyerOpen, 
    setAuthorizedVaultBuyerOpen, 
    authorizedVaultSupplierOpen, 
    setAuthorizedVaultSupplierOpen,
    session 
  } = useNegotiation();

  const isOpen = authorizedVaultBuyerOpen || authorizedVaultSupplierOpen;
  const isBuyer = authorizedVaultBuyerOpen;

  if (!isOpen) return null;

  const handleClose = () => {
    setAuthorizedVaultBuyerOpen(false);
    setAuthorizedVaultSupplierOpen(false);
  };

  const buyerEnv = session.buyerEnvelope;
  const suppEnv = session.supplierEnvelope;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0D0F13] border border-white/12 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isBuyer ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
            }`}>
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#5F6875] font-semibold">
                AUTHORIZED AUDITOR VIEW • AIR-GAPPED
              </div>
              <h3 className="text-base font-bold text-[#F5F7FA] font-mono">
                {isBuyer ? 'NovaTech Buyer Policy Envelope' : 'Apex Supplier Private Envelope'}
              </h3>
            </div>
          </div>

          <button onClick={handleClose} className="p-1 rounded hover:bg-white/10 text-[#9BA3AF] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isBuyer ? (
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#111419] border border-white/6 space-y-2">
              <div className="flex justify-between text-[#9BA3AF]">
                <span>Target Ideal Price:</span>
                <span className="text-emerald-400 font-bold">${buyerEnv.targetPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#9BA3AF]">
                <span>Absolute Budget Ceiling (Hard Cap):</span>
                <span className="text-red-400 font-bold">${buyerEnv.ceilingPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#9BA3AF]">
                <span>Target Delivery Days:</span>
                <span className="text-[#F5F7FA] font-bold">{buyerEnv.targetDeliveryDays} Days</span>
              </div>
              <div className="flex justify-between text-[#9BA3AF]">
                <span>Latest Acceptable Delivery Date:</span>
                <span className="text-[#F5F7FA] font-bold">{buyerEnv.maxDeliveryDays} Days Max</span>
              </div>
              <div className="flex justify-between text-[#9BA3AF]">
                <span>Minimum Required SLA:</span>
                <span className="text-[#F5F7FA] font-bold">{buyerEnv.minSla}%</span>
              </div>
              <div className="flex justify-between text-[#9BA3AF]">
                <span>Target Payment Terms:</span>
                <span className="text-[#F5F7FA] font-bold">{buyerEnv.targetPaymentTerms}</span>
              </div>
              <div className="flex justify-between text-[#9BA3AF]">
                <span>Private BATNA:</span>
                <span className="text-indigo-400 font-bold">{buyerEnv.batna}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#111419] border border-white/6 space-y-2">
              <div className="flex justify-between text-[#9BA3AF]">
                <span>Target List Price:</span>
                <span className="text-blue-400 font-bold">${suppEnv.targetPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#9BA3AF]">
                <span>Hard Cost Floor (Walk-away):</span>
                <span className="text-red-400 font-bold">${suppEnv.floorPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#9BA3AF]">
                <span>Standard Production Time:</span>
                <span className="text-[#F5F7FA] font-bold">{suppEnv.standardDeliveryDays} Days</span>
              </div>
              <div className="flex justify-between text-[#9BA3AF]">
                <span>Fastest Feasible Lead Time:</span>
                <span className="text-[#F5F7FA] font-bold">{suppEnv.minDeliveryDays} Days Min</span>
              </div>
              <div className="flex justify-between text-[#9BA3AF]">
                <span>Gross Margin Floor:</span>
                <span className="text-[#F5F7FA] font-bold">{suppEnv.marginFloorPercent}%</span>
              </div>
              <div className="flex justify-between text-[#9BA3AF]">
                <span>Max Delay Penalty Allowed:</span>
                <span className="text-[#F5F7FA] font-bold">{suppEnv.maxPenaltyPercent}% / week</span>
              </div>
            </div>
          </div>
        )}

        <div className="p-3 rounded-lg bg-[#151920] border border-white/6 text-xs text-[#9BA3AF] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Zero-Knowledge Policy Isolation: Counterparty cannot read these encrypted values during automated turns.</span>
        </div>

        <button
          onClick={handleClose}
          className="w-full py-2 px-4 rounded-lg bg-[#151920] hover:bg-[#1C222B] border border-white/10 text-white text-xs font-semibold cursor-pointer"
        >
          CLOSE POLICY INSPECTOR
        </button>
      </div>
    </div>
  );
};
