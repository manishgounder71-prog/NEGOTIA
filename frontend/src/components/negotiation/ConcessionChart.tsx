import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceArea,
  ReferenceLine
} from 'recharts';
import { NegotiationRound } from '../../types/negotiation';

interface ConcessionChartProps {
  rounds: NegotiationRound[];
  activeRoundIndex: number;
}

export const ConcessionChart: React.FC<ConcessionChartProps> = ({
  rounds,
  activeRoundIndex
}) => {
  // Build chart dataset
  const chartData = rounds.map((r) => ({
    round: `Round ${r.roundNumber}`,
    buyerPrice: r.buyerProposal.price,
    supplierPrice: r.supplierProposal?.price || r.buyerProposal.price,
    gap: r.priceGap,
  }));

  const currentRound = rounds[activeRoundIndex] || rounds[rounds.length - 1];
  const currentBuyerPrice = currentRound?.buyerProposal?.price || 100000;
  const currentSupplierPrice = currentRound?.supplierProposal?.price || 100000;
  const currentDistance = Math.abs(currentSupplierPrice - currentBuyerPrice);

  return (
    <div className="bg-[#111419] border border-white/8 rounded-xl p-5 space-y-4 shadow-xl">
      {/* Chart Header & KPIs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/6">
        <div>
          <h3 className="text-sm font-bold text-[#F5F7FA] tracking-tight">
            Bid Concession & Convergence Curves
          </h3>
          <p className="text-[11px] text-[#5F6875] font-mono">
            Bargaining Zone (ZOPA) & Multi-Round Price Trajectory
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
            <span className="text-[#9BA3AF]">Buyer Bid:</span>
            <span className="text-emerald-400 font-bold">${currentBuyerPrice.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block"></span>
            <span className="text-[#9BA3AF]">Supplier Offer:</span>
            <span className="text-blue-400 font-bold">${currentSupplierPrice.toLocaleString()}</span>
          </div>

          <div className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold">
            DISTANCE: ${currentDistance.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Main Recharts Container */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 15, right: 25, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            
            <XAxis 
              dataKey="round" 
              stroke="#5F6875" 
              fontSize={11} 
              fontFamily="JetBrains Mono"
              tickLine={false}
            />
            
            <YAxis 
              stroke="#5F6875" 
              fontSize={11} 
              fontFamily="JetBrains Mono"
              domain={[92000, 115000]}
              tickFormatter={(val) => `$${val / 1000}k`}
              tickLine={false}
              orientation="left"
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: '#0D0F13',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono',
                color: '#F5F7FA',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
              formatter={(value: any, name: any) => [
                `$${Number(value).toLocaleString()}`, 
                name === 'buyerPrice' ? 'Buyer Proposal' : 'Supplier Offer'
              ]}
            />

            {/* Shaded ZOPA Agreement Band ($98,000 to $100,000) */}
            <ReferenceArea 
              y1={98000} 
              y2={100000} 
              fill="#6366F1" 
              fillOpacity={0.08}
              stroke="#6366F1"
              strokeDasharray="2 2"
              strokeOpacity={0.3}
              label={{ value: 'GOVERNED ZOPA DEAL ZONE ($98K - $100K)', fill: '#818CF8', fontSize: 10, position: 'insideTopRight' }}
            />

            {/* Target Ratified Price Line ($100,000) */}
            <ReferenceLine 
              y={100000} 
              stroke="#10B981" 
              strokeDasharray="3 3" 
              strokeOpacity={0.6}
            />

            {/* Buyer Curve (Emerald) */}
            <Line
              type="monotone"
              dataKey="buyerPrice"
              name="buyerPrice"
              stroke="#10B981"
              strokeWidth={2.5}
              dot={{ fill: '#10B981', r: 4, strokeWidth: 2, stroke: '#08090B' }}
              activeDot={{ r: 6, fill: '#10B981' }}
            />

            {/* Supplier Curve (Cobalt Blue) */}
            <Line
              type="monotone"
              dataKey="supplierPrice"
              name="supplierPrice"
              stroke="#3B82F6"
              strokeWidth={2.5}
              dot={{ fill: '#3B82F6', r: 4, strokeWidth: 2, stroke: '#08090B' }}
              activeDot={{ r: 6, fill: '#3B82F6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Analytics Footer Strip: Concession Velocity, Deadlock Risk, Momentum */}
      <div className="pt-3 border-t border-white/6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-[#151920] border border-white/6 flex items-center justify-between">
          <span className="text-[#5F6875]">CONCESSION VELOCITY:</span>
          <span className="text-emerald-400 font-bold">+3.4% / round</span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#151920] border border-white/6 flex items-center justify-between">
          <span className="text-[#5F6875]">DEADLOCK RISK:</span>
          <span className="text-emerald-400 font-bold">LOW (0.04)</span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#151920] border border-white/6 flex items-center justify-between">
          <span className="text-[#5F6875]">NEGOTIATION MOMENTUM:</span>
          <span className="text-indigo-400 font-bold">CONVERGED</span>
        </div>
      </div>
    </div>
  );
};
