import React from 'react';

interface CompactTooltipProps {
  active?: boolean;
  label?: string;
  payload?: {
    color?: string;
    name?: string;
    value?: number;
  }[];
}

const CompactTooltip: React.FC<CompactTooltipProps> = ({ active, label, payload }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="w-[220px] rounded-lg border border-slate-200 bg-white/95 p-3 text-xs shadow-xl backdrop-blur-sm">
      <div className="mb-2 font-bold text-slate-800">{label} 年</div>
      <div className="space-y-1.5">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-1.5 text-slate-600">
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.name}</span>
            </span>
            <span className="shrink-0 font-semibold text-slate-800">
              {Number(item.value || 0).toFixed(2)} 亿
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompactTooltip;
