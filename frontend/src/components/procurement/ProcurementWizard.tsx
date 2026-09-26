import React, { useState } from 'react';
import { 
  FileCode, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sliders, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  Users, 
  Sparkles,
  Layers,
  Cpu
} from 'lucide-react';
import { useNegotiation } from '../../context/NegotiationContext';

export const ProcurementWizard: React.FC = () => {
  const { setActiveTab, runDemoMode } = useNegotiation();
  const [step, setStep] = useState<number>(1);

  const [formData, setFormData] = useState({
    productName: '10,000 Industrial IoT Telemetry Sensors',
    category: 'Enterprise Microcontrollers & Edge Compute',
    quantity: 10000,
    targetPrice: 95000,
    ceilingPrice: 100000,
    targetDeliveryDays: 30,
    maxDeliveryDays: 35,
    minSla: 99.5,
    paymentTerms: 'Net 45',
    delayPenalty: 5.0,
    supplierId: 'supp-01',
    strategy: 'BALANCED',
    requireHumanEscalationOnPriceExceed: true,
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 6));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleLaunch = () => {
    setActiveTab('ARENA');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="p-5 bg-[#0D0F13] border border-white/8 rounded-2xl shadow-xl space-y-1">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-mono font-bold">
            <FileCode className="w-3.5 h-3.5" />
            AUTONOMOUS RFQ SETUP WIZARD
          </span>
          <span className="text-xs font-mono text-[#5F6875]">STEP {step} OF 6</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[#F5F7FA]">
          Launch New Autonomous Procurement Deal
        </h1>
        <p className="text-xs text-[#9BA3AF]">
          Configure procurement scope, CFO policy envelopes, and Safe AI guardrails before releasing agents into the arena.
        </p>
      </div>

      {/* Progress Stepper Strip */}
      <div className="grid grid-cols-6 gap-2 font-mono text-xs">
        {['Requirement', 'Buyer Policy', 'Supplier', 'Strategy', 'Governance', 'Launch'].map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = step === stepNum;
          const isDone = step > stepNum;
          return (
            <div
              key={label}
              onClick={() => setStep(stepNum)}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#151920] border-indigo-500/50 text-indigo-300 font-bold'
                  : isDone
                  ? 'bg-[#111419] border-emerald-500/30 text-emerald-400 font-medium'
                  : 'bg-[#0D0F13] border-white/6 text-[#5F6875]'
              }`}
            >
              <div className="text-[10px]">{stepNum}. {label}</div>
            </div>
          );
        })}
      </div>

      {/* Step Content Card */}
      <div className="p-6 rounded-2xl bg-[#111419] border border-white/8 space-y-6 shadow-2xl">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold font-mono text-[#F5F7FA] uppercase tracking-wider">
              Step 1: Procurement Requirement &amp; Scope
            </h2>
            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[#9BA3AF] block mb-1">PRODUCT / SERVICE TITLE</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full bg-[#151920] border border-white/8 rounded-lg p-2.5 text-[#F5F7FA] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#9BA3AF] block mb-1">PROCUREMENT CATEGORY</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#151920] border border-white/8 rounded-lg p-2.5 text-[#F5F7FA] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#9BA3AF] block mb-1">TOTAL QUANTITY (UNITS)</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full bg-[#151920] border border-white/8 rounded-lg p-2.5 text-[#F5F7FA] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold font-mono text-[#F5F7FA] uppercase tracking-wider">
              Step 2: Private Buyer Policy Envelope (CFO Guardrails)
            </h2>
            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#151920] border border-white/6 space-y-1">
                <label className="text-[#9BA3AF] block">TARGET PRICE ($ USD)</label>
                <input
                  type="number"
                  value={formData.targetPrice}
                  onChange={(e) => setFormData({ ...formData, targetPrice: Number(e.target.value) })}
                  className="w-full bg-[#0D0F13] border border-white/8 rounded p-2 text-emerald-400 font-bold"
                />
                <span className="text-[10px] text-[#5F6875]">Desired initial opening anchor</span>
              </div>

              <div className="p-3 rounded-xl bg-[#151920] border border-red-500/20 space-y-1">
                <label className="text-[#9BA3AF] block">HARD BUDGET CEILING ($ USD)</label>
                <input
                  type="number"
                  value={formData.ceilingPrice}
                  onChange={(e) => setFormData({ ...formData, ceilingPrice: Number(e.target.value) })}
                  className="w-full bg-[#0D0F13] border border-red-500/40 rounded p-2 text-red-400 font-bold"
                />
                <span className="text-[10px] text-red-400/80">Absolute walk-away limit (Enforced by Safe AI)</span>
              </div>

              <div className="p-3 rounded-xl bg-[#151920] border border-white/6 space-y-1">
                <label className="text-[#9BA3AF] block">TARGET DELIVERY (DAYS)</label>
                <input
                  type="number"
                  value={formData.targetDeliveryDays}
                  onChange={(e) => setFormData({ ...formData, targetDeliveryDays: Number(e.target.value) })}
                  className="w-full bg-[#0D0F13] border border-white/8 rounded p-2 text-[#F5F7FA] font-bold"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#151920] border border-white/6 space-y-1">
                <label className="text-[#9BA3AF] block">MAX ACCEPTABLE DELIVERY (DAYS)</label>
                <input
                  type="number"
                  value={formData.maxDeliveryDays}
                  onChange={(e) => setFormData({ ...formData, maxDeliveryDays: Number(e.target.value) })}
                  className="w-full bg-[#0D0F13] border border-white/8 rounded p-2 text-[#F5F7FA] font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold font-mono text-[#F5F7FA] uppercase tracking-wider">
              Step 3: Counterparty Supplier Selection
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {[
                { id: 'supp-01', name: 'Apex Components Ltd.', match: '98% Compliance • Microcontrollers' },
                { id: 'supp-02', name: 'SwiftCargo Logistics Intl.', match: '94% Compliance • Freight 3PL' },
                { id: 'supp-03', name: 'Vanguard Semi Devices', match: '89% Compliance • ASIC Fabricators' },
                { id: 'supp-04', name: 'EcoLogistics Global', match: '99% Compliance • Green Warehousing' }
              ].map((s) => (
                <div
                  key={s.id}
                  onClick={() => setFormData({ ...formData, supplierId: s.id })}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    formData.supplierId === s.id
                      ? 'bg-[#151920] border-indigo-500/50 ring-1 ring-indigo-500/30'
                      : 'bg-[#0D0F13] border-white/6 hover:bg-[#151920]/60'
                  }`}
                >
                  <div className="font-bold text-[#F5F7FA]">{s.name}</div>
                  <div className="text-[11px] text-[#5F6875] mt-1">{s.match}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold font-mono text-[#F5F7FA] uppercase tracking-wider">
              Step 4: Negotiation Strategy Posture
            </h2>
            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              {[
                { id: 'AGGRESSIVE', title: 'Aggressive (Boulware)', desc: 'Slow concessions, holds line on target price until deadline.' },
                { id: 'BALANCED', title: 'Balanced (Tit-for-Tat)', desc: 'Reciprocal concessions, trades delivery speed for price discounts.' },
                { id: 'CONSERVATIVE', title: 'Collaborative (Conceder)', desc: 'Prioritizes rapid convergence & relationship over edge margin.' }
              ].map((strat) => (
                <div
                  key={strat.id}
                  onClick={() => setFormData({ ...formData, strategy: strat.id })}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    formData.strategy === strat.id
                      ? 'bg-[#151920] border-indigo-500/50 ring-1 ring-indigo-500/30'
                      : 'bg-[#0D0F13] border-white/6 hover:bg-[#151920]/60'
                  }`}
                >
                  <div className="font-bold text-[#F5F7FA]">{strat.title}</div>
                  <div className="text-[11px] text-[#9BA3AF] mt-1 leading-relaxed">{strat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold font-mono text-[#F5F7FA] uppercase tracking-wider">
              Step 5: Governance &amp; Safe AI Hard Invariants
            </h2>
            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#151920] border border-white/6 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#F5F7FA]">Safe AI Hard Policy Enforcement</div>
                  <div className="text-[11px] text-[#5F6875]">Block any proposal exceeding CFO ceiling ($100K)</div>
                </div>
                <span className="text-emerald-400 font-bold">MANDATORY (ON)</span>
              </div>

              <div className="p-3 rounded-xl bg-[#151920] border border-white/6 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#F5F7FA]">AIMS Immutable Audit Ledger</div>
                  <div className="text-[11px] text-[#5F6875]">Record all proposal hashes and reasonings</div>
                </div>
                <span className="text-emerald-400 font-bold">ENABLED</span>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4 text-center py-4 font-mono">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-xl">
              ◈
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F5F7FA]">
                Ready to Launch Governed Autonomous Negotiation
              </h2>
              <p className="text-xs text-[#9BA3AF] mt-1 max-w-md mx-auto">
                Buyer Agent and Supplier Agent will be initialized with encrypted private policy vaults.
              </p>
            </div>

            <button
              onClick={handleLaunch}
              className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              START AUTONOMOUS NEGOTIATION IN ARENA →
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-4 border-t border-white/6 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="px-4 py-2 rounded-lg bg-[#151920] hover:bg-[#1C222B] disabled:opacity-30 border border-white/8 text-xs font-mono text-[#F5F7FA] flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>PREVIOUS STEP</span>
          </button>

          {step < 6 && (
            <button
              onClick={nextStep}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <span>CONTINUE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
