import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Code, 
  CheckCircle2, 
  ShieldCheck, 
  Terminal, 
  Share2, 
  ExternalLink,
  Copy,
  Check,
  Lock,
  Printer
} from 'lucide-react';
import { useNegotiation } from '../../context/NegotiationContext';
import { ContractClause } from '../../types/negotiation';

export const ContractViewer: React.FC = () => {
  const { contract, setActiveTab } = useNegotiation();
  const [selectedClause, setSelectedClause] = useState<ContractClause>(contract.clauses[0]);
  const [copiedHash, setCopiedHash] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(contract.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadPDF = () => {
    setDownloadSuccess(true);
    // Simulate downloadable PDF blob / generation
    const element = document.createElement("a");
    const file = new Blob([
      `=== NEGOTIA GOVERNED CONTRACT ===\n\nContract Number: ${contract.contractNumber}\nTitle: ${contract.title}\nBuyer: ${contract.buyerName}\nSupplier: ${contract.supplierName}\nAgreed Total Value: $${contract.totalValue.toLocaleString()}\nDelivery: ${contract.deliveryDays} Days\nSLA: ${contract.sla}%\nPayment: ${contract.paymentTerms}\nPenalty: ${contract.penaltyPercent}% / week\nSHA-256 Hash: ${contract.sha256Hash}\nSigned At: ${contract.ratifiedAt}\n\n=== CLAUSES ===\n` +
      contract.clauses.map(c => `[${c.title}]\n${c.clauseText}\nAgreed Value: ${c.agreedValue} (Originated Round ${c.originatingRound})\n`).join('\n')
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${contract.contractNumber}_Governed_Contract.txt`;
    document.body.appendChild(element);
    element.click();
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(contract, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${contract.contractNumber}_contract_schema.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-[#0D0F13] border border-white/8 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              GOVERNANCE APPROVED
            </span>
            <span className="text-xs font-mono text-[#5F6875]">CONTRACT ID: {contract.contractNumber}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#F5F7FA]">
            {contract.title}
          </h1>
          <p className="text-xs text-[#9BA3AF]">
            Autonomous consensus between {contract.buyerName} and {contract.supplierName}
          </p>
        </div>

        {/* Top Action Deck */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? 'CONTRACT DOWNLOADED' : 'DOWNLOAD PDF'}</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-lg bg-[#151920] hover:bg-[#1C222B] border border-white/10 text-[#F5F7FA] text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <span>EXPORT JSON</span>
          </button>

          <button
            onClick={() => setActiveTab('AUDIT_LEDGER')}
            className="px-3.5 py-2 rounded-lg bg-[#151920] hover:bg-[#1C222B] border border-white/10 text-[#F5F7FA] text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>VIEW AUDIT TRAIL</span>
          </button>
        </div>
      </div>

      {/* Contract Key Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl bg-[#111419] border border-white/6">
          <div className="text-[10px] font-mono text-[#5F6875] uppercase">TOTAL CONSIDERATION</div>
          <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
            ${contract.totalValue.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#9BA3AF] font-mono">10,000 units @ $10.00</div>
        </div>

        <div className="p-3 rounded-xl bg-[#111419] border border-white/6">
          <div className="text-[10px] font-mono text-[#5F6875] uppercase">DELIVERY WINDOW</div>
          <div className="text-lg font-bold font-mono text-[#F5F7FA] mt-0.5">
            {contract.deliveryDays} DAYS
          </div>
          <div className="text-[10px] text-emerald-400 font-mono">Within 35d max cap</div>
        </div>

        <div className="p-3 rounded-xl bg-[#111419] border border-white/6">
          <div className="text-[10px] font-mono text-[#5F6875] uppercase">SLA UPTIME</div>
          <div className="text-lg font-bold font-mono text-[#F5F7FA] mt-0.5">
            {contract.sla}%
          </div>
          <div className="text-[10px] text-emerald-400 font-mono">24-month warranty</div>
        </div>

        <div className="p-3 rounded-xl bg-[#111419] border border-white/6">
          <div className="text-[10px] font-mono text-[#5F6875] uppercase">PAYMENT TERMS</div>
          <div className="text-lg font-bold font-mono text-[#F5F7FA] mt-0.5">
            {contract.paymentTerms}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono">Governed compromise</div>
        </div>

        <div className="p-3 rounded-xl bg-[#111419] border border-white/6">
          <div className="text-[10px] font-mono text-[#5F6875] uppercase">LIQUIDATED DAMAGES</div>
          <div className="text-lg font-bold font-mono text-[#F5F7FA] mt-0.5">
            {contract.penaltyPercent}% / WK
          </div>
          <div className="text-[10px] text-emerald-400 font-mono">Mandatory penalty tier</div>
        </div>

        <div className="p-3 rounded-xl bg-[#111419] border border-white/6">
          <div className="text-[10px] font-mono text-[#5F6875] uppercase">GOVERNING LAW</div>
          <div className="text-xs font-bold font-mono text-[#F5F7FA] mt-1.5 truncate">
            Delaware, USA
          </div>
          <div className="text-[10px] text-indigo-400 font-mono">Safe AI Certified</div>
        </div>
      </div>

      {/* Interactive Contract & Audit Trace Split View (Section 26) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Formal Contract Document */}
        <div className="lg:col-span-7 bg-[#0D0F13] border border-white/8 rounded-xl p-6 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/8">
            <div className="text-xs font-mono uppercase tracking-wider text-[#9BA3AF] font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>OFFICIAL RATIFIED LEGAL TEXT (SELECT A CLAUSE TO TRACE)</span>
            </div>
          </div>

          <div className="space-y-4 font-serif text-sm leading-relaxed text-[#F5F7FA]/90">
            {contract.clauses.map((clause) => {
              const isSelected = selectedClause.id === clause.id;
              return (
                <div
                  key={clause.id}
                  onClick={() => setSelectedClause(clause)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#151920] border-indigo-500/50 shadow-lg ring-1 ring-indigo-500/30'
                      : 'bg-[#111419]/80 hover:bg-[#151920]/60 border-white/6'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs font-bold text-[#F5F7FA] pb-1.5 mb-1.5 border-b border-white/6">
                    <span className="text-indigo-300 font-sans">{clause.title}</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                      ✓ {clause.policyCompliance}
                    </span>
                  </div>

                  <p className="text-xs font-sans text-[#9BA3AF] leading-relaxed">
                    {clause.clauseText}
                  </p>

                  <div className="mt-3 flex items-center justify-between font-mono text-[11px] pt-2 border-t border-white/4">
                    <span className="text-[#5F6875]">Agreed: <strong className="text-[#F5F7FA]">{clause.agreedValue}</strong></span>
                    <span className="text-indigo-400 text-[10px]">Originated in Round {clause.originatingRound} → Click to trace evidence</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Signatures & Seal Block */}
          <div className="p-4 rounded-xl bg-[#111419] border border-white/8 space-y-3 font-mono text-xs">
            <div className="text-[11px] font-bold text-[#F5F7FA] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CRYPTOGRAPHIC ATTESTATION & DIGITAL STAMPS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-[#151920] border border-white/4 space-y-1">
                <span className="text-[#5F6875] text-[10px] block">BUYER AGENT ED25519 STAMP</span>
                <span className="text-emerald-400 truncate block">{contract.signatures.buyerAgentStamp}</span>
              </div>

              <div className="p-2 rounded bg-[#151920] border border-white/4 space-y-1">
                <span className="text-[#5F6875] text-[10px] block">SUPPLIER AGENT ED25519 STAMP</span>
                <span className="text-blue-400 truncate block">{contract.signatures.supplierAgentStamp}</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#151920] border border-white/4 flex items-center justify-between text-[11px]">
              <span className="text-[#5F6875]">CONTRACT SHA-256 HASH:</span>
              <div className="flex items-center gap-2">
                <span className="text-indigo-300 font-semibold truncate max-w-[280px]">
                  {contract.sha256Hash}
                </span>
                <button
                  onClick={handleCopyHash}
                  className="p-1 rounded hover:bg-white/10 text-[#9BA3AF] hover:text-white"
                  title="Copy SHA-256 Hash"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Clause Traceability & Audit Evidence */}
        <div className="lg:col-span-5 bg-[#111419] border border-white/8 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="pb-3 border-b border-white/6">
            <h3 className="text-sm font-bold text-[#F5F7FA] font-mono flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Clause Traceability & Audit Dossier</span>
            </h3>
            <p className="text-[11px] text-[#5F6875] font-mono">
              Live link between contract clause, negotiation turn, and policy rule
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#151920] border border-indigo-500/30 space-y-3 font-mono text-xs">
            <div>
              <span className="text-[10px] text-[#5F6875] block uppercase">SELECTED CLAUSE</span>
              <div className="text-xs font-bold text-indigo-300 mt-0.5">{selectedClause.title}</div>
            </div>

            <div className="space-y-2 py-2 border-y border-white/6">
              <div>
                <span className="text-[10px] text-[#5F6875] block">ORIGINATING TURN & PROPOSAL</span>
                <span className="text-[#F5F7FA] font-bold">Round {selectedClause.originatingRound} Negotiation Turn</span>
              </div>

              <div>
                <span className="text-[10px] text-[#5F6875] block">BASELINE POSITIONS</span>
                <span className="text-[#9BA3AF]">{selectedClause.baselineValue}</span>
              </div>

              <div>
                <span className="text-[10px] text-[#5F6875] block">FINAL RATIFIED VALUE</span>
                <span className="text-emerald-400 font-bold">{selectedClause.agreedValue}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-[#5F6875] block">GOVERNANCE RULE VERIFICATION</span>
              <div className="p-2 rounded bg-[#0D0F13] border border-emerald-500/20 text-emerald-400 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Verified against corporate legal and CFO policy envelope</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-[#5F6875] block">AIMS AUDIT EVENT REFERENCE</span>
              <span className="text-indigo-400 font-semibold">{selectedClause.auditRefId} • Immutable Block Signed</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('AUDIT_LEDGER')}
            className="w-full py-2.5 px-4 rounded-lg bg-[#151920] hover:bg-[#1C222B] border border-white/10 text-[#F5F7FA] text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>INSPECT COMPLETE AIMS LEDGER FOR THIS DEAL</span>
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
