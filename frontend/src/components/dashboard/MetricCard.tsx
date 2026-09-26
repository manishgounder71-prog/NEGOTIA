import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend: string;
  trendPositive?: boolean;
  context: string;
  icon: LucideIcon;
  accentColor?: 'emerald' | 'indigo' | 'amber' | 'blue' | 'red';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  trend,
  trendPositive = true,
  context,
  icon: Icon,
  accentColor = 'indigo'
}) => {
  const getAccentClass = () => {
    switch (accentColor) {
      case 'emerald': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'amber': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'red': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'blue': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    }
  };

  return (
    <div className="bg-[#111419] border border-white/8 hover:border-white/16 rounded-xl p-4.5 transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between pb-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#5F6875] font-semibold">
            {label}
          </span>
          <div className={`w-7 h-7 rounded-md border flex items-center justify-center ${getAccentClass()}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold font-mono tracking-tight text-[#F5F7FA]">
            {value}
          </div>
          <div className={`text-[11px] font-mono font-medium ${trendPositive ? 'text-emerald-400' : 'text-amber-400'}`}>
            {trend}
          </div>
        </div>
      </div>

      <div className="pt-3 mt-2 border-t border-white/4 text-[11px] text-[#9BA3AF] truncate">
        {context}
      </div>
    </div>
  );
};
