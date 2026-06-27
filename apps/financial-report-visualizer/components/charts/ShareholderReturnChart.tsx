import React, { useMemo, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { SHAREHOLDER_RETURN_DATA } from '../../constants';
import InteractiveLegend, { LegendItem } from './InteractiveLegend';

const series = [
  { key: 'cashDividend', name: '现金分红', color: '#0f766e', unit: '亿元', type: 'rect' },
  { key: 'buyback', name: '回购金额', color: '#f97316', unit: '亿元', type: 'rect' },
  { key: 'dividendYield', name: '股息率', color: '#2563eb', unit: '%', type: 'line' },
  { key: 'payoutRatio', name: '分红率', color: '#7c3aed', unit: '%', type: 'line' },
] as const;

const formatValue = (value: number, unit: string) => {
  if (unit === '%') return `${value.toFixed(1)}%`;
  return `${value.toFixed(2)} 亿元`;
};

const ReturnTooltip = ({ active, label, payload }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="w-[220px] rounded-lg border border-slate-200 bg-white/95 p-2.5 text-xs shadow-xl backdrop-blur-sm">
      <div className="mb-1.5 font-bold text-slate-800">{label}</div>
      <div className="space-y-1">
        {payload.map((item: any) => (
          <div key={item.dataKey || item.name} className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5 text-slate-600">
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.name}</span>
            </span>
            <span className="shrink-0 font-semibold text-slate-800">
              {formatValue(Number(item.value || 0), item?.unit || '')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ShareholderReturnChart: React.FC = () => {
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);
  const isHidden = (dataKey: string) => hiddenKeys.includes(dataKey);
  const toggleKey = (dataKey: string) => {
    setHiddenKeys((current) => (
      current.includes(dataKey)
        ? current.filter((key) => key !== dataKey)
        : [...current, dataKey]
    ));
  };

  const legendItems = useMemo<LegendItem[]>(() => (
    series.map((item) => ({
      dataKey: item.key,
      value: item.name,
      color: item.color,
      type: item.type,
    }))
  ), []);

  return (
    <div className="w-full pl-2 pr-6 pt-4 sm:px-4">
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={SHAREHOLDER_RETURN_DATA} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barGap={2} barCategoryGap="28%">
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} interval={0} minTickGap={0} padding={{ left: 4, right: 8 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip content={<ReturnTooltip />} cursor={{ fill: 'rgba(14, 116, 144, 0.06)' }} wrapperStyle={{ pointerEvents: 'none', zIndex: 20 }} />
            <Bar hide={isHidden('cashDividend')} isAnimationActive={false} yAxisId="left" dataKey="cashDividend" name="现金分红" unit="亿元" stackId="return" fill="#0f766e" barSize={18} radius={[3, 3, 0, 0]} />
            <Bar hide={isHidden('buyback')} isAnimationActive={false} yAxisId="left" dataKey="buyback" name="回购金额" unit="亿元" stackId="return" fill="#f97316" barSize={18} radius={[3, 3, 0, 0]} />
            <Line hide={isHidden('dividendYield')} isAnimationActive={false} yAxisId="right" type="monotone" dataKey="dividendYield" name="股息率" unit="%" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
            <Line hide={isHidden('payoutRatio')} isAnimationActive={false} yAxisId="right" type="monotone" dataKey="payoutRatio" name="分红率" unit="%" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <InteractiveLegend hiddenKeys={hiddenKeys} items={legendItems} onToggle={toggleKey} />
    </div>
  );
};

export default ShareholderReturnChart;
