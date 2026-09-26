import React from 'react';
import { CheckCircle2, Cpu, ShieldCheck, Terminal, Database, Server, RefreshCw } from 'lucide-react';

export const LyzrSystemStatus: React.FC = () => {
  const systems = [
    { name: 'LYZR AGENT API', status: 'CONNECTED', icon: Cpu, latency: '42ms', version: 'v2.8.4', color: 'emerald' },
    { name: 'LYZR SAFE AI CONTROLS', status: 'ACTIVE', icon: ShieldCheck, latency: '12ms', version: 'v1.4.1', color: 'emerald' },
    { name: 'LYZR AIMS AUDIT LEDGER', status: 'CONNECTED', icon: Terminal, latency: '18ms', version: 'v3.0.2', color: 'emerald' },
    { name: 'FASTAPI BACKEND ORCHESTRATOR', status: 'HEALTHY', icon: Server, latency: '8ms', version: 'v1.0.0', color: 'emerald' },
    { name: 'IMMUTABLE AUDIT DATABASE', status: 'HEALTHY', icon: Database, latency: '4ms', version: 'SQLite-WAL', color: 'emerald' },
    { name: 'CRYPTOGRAPHIC HASH ENGINE', status: 'VERIFIED', icon: CheckCircle2, latency: '1ms', version: 'SHA-256', color: 'emerald' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-[#0D0F13] border border-white/8 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-subtle-pulse"></span>
              ALL SYSTEMS FULLY OPERATIONAL
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#F5F7FA]">
            Lyzr Core Infrastructure &amp; Connectivity Status
          </h1>
          <p className="text-xs text-[#9BA3AF]">
            Real-time telemetry of agent runtimes, Safe AI governance interceptors, and AIMS ledger synchronizations.
          </p>
        </div>

        <button className="px-3.5 py-2 rounded-lg bg-[#151920] hover:bg-[#1C222B] border border-white/10 text-xs font-mono text-[#F5F7FA] flex items-center gap-1.5 cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Ping All Services</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {systems.map((sys) => {
          const Icon = sys.icon;
          return (
            <div key={sys.name} className="p-5 rounded-xl bg-[#111419] border border-white/8 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-[#151920] border border-white/8 flex items-center justify-center text-indigo-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#F5F7FA]">{sys.name}</h3>
                    <span className="text-[10px] text-[#5F6875]">{sys.version}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-subtle-pulse"></span>
                  {sys.status}
                </span>
              </div>

              <div className="flex justify-between text-xs text-[#9BA3AF] pt-1">
                <span>Response Latency:</span>
                <span className="text-emerald-400 font-bold">{sys.latency}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
