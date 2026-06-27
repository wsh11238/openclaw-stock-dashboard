import React from 'react';

export interface LegendItem {
  dataKey: string;
  value: string;
  color: string;
  type?: 'circle' | 'rect' | 'line';
}

interface InteractiveLegendProps {
  hiddenKeys: string[];
  items: LegendItem[];
  onToggle: (dataKey: string) => void;
}

const InteractiveLegend: React.FC<InteractiveLegendProps> = ({ hiddenKeys, items, onToggle }) => {
  return (
    <div className="flex max-w-full flex-wrap justify-center gap-x-3 gap-y-2 px-1 pt-2 text-xs">
      {items.map((item) => {
        const isHidden = hiddenKeys.includes(item.dataKey);
        const color = isHidden ? '#cbd5e1' : item.color;

        return (
          <button
            key={item.dataKey}
            type="button"
            onClick={() => onToggle(item.dataKey)}
            className={`flex max-w-full items-center gap-1.5 transition-colors ${isHidden ? 'text-slate-400 line-through' : 'text-slate-600 hover:text-cyan-700'}`}
            title={isHidden ? `显示${item.value}` : `隐藏${item.value}`}
          >
            {item.type === 'line' ? (
              <span className="h-0 w-5 border-t-2" style={{ borderColor: color }} />
            ) : (
              <span
                className={item.type === 'circle' ? 'h-3 w-3 rounded-full' : 'h-3 w-3 rounded-sm'}
                style={{ backgroundColor: color }}
              />
            )}
            <span className="min-w-0 max-w-[9.5rem] whitespace-normal break-words text-left leading-tight sm:max-w-none">{item.value}</span>
          </button>
        );
      })}
    </div>
  );
};

export default InteractiveLegend;
