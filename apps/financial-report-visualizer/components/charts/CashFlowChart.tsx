import React, { useState } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { CASH_FLOW_DATA, COLORS } from '../../constants';
import CompactTooltip from './CompactTooltip';
import InteractiveLegend, { LegendItem } from './InteractiveLegend';

const LEGEND_ITEMS: LegendItem[] = [
  { dataKey: 'operating', value: '经营现金流', color: COLORS.cash.op, type: 'rect' },
  { dataKey: 'investing', value: '投资现金流', color: COLORS.cash.inv, type: 'rect' },
  { dataKey: 'financing', value: '筹资现金流', color: COLORS.cash.fin, type: 'rect' },
  { dataKey: 'freeCashFlow', value: '自由现金流', color: COLORS.cash.fcf, type: 'line' },
  { dataKey: 'balance', value: '期末现金余额', color: COLORS.cash.bal, type: 'line' },
];

const CashFlowChart: React.FC = () => {
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);
  const isHidden = (dataKey: string) => hiddenKeys.includes(dataKey);
  const toggleKey = (dataKey: string) => {
    setHiddenKeys((current) => (
      current.includes(dataKey)
        ? current.filter((key) => key !== dataKey)
        : [...current, dataKey]
    ));
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={CASH_FLOW_DATA}
        margin={{ top: 20, right: 22, bottom: 20, left: 0 }}
      >
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="year" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
        <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} width={46} />
        <Tooltip
          content={<CompactTooltip />}
          cursor={{ fill: 'rgba(14, 116, 144, 0.06)' }}
          offset={14}
          wrapperStyle={{ pointerEvents: 'none', zIndex: 20 }}
        />
        <Legend
          content={() => <InteractiveLegend hiddenKeys={hiddenKeys} items={LEGEND_ITEMS} onToggle={toggleKey} />}
          wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
        />
        <ReferenceLine y={0} stroke="#94a3b8" />

        <Bar hide={isHidden('operating')} isAnimationActive={false} dataKey="operating" barSize={16} fill={COLORS.cash.op} name="经营现金流" radius={[4, 4, 0, 0]} />
        <Bar hide={isHidden('investing')} isAnimationActive={false} dataKey="investing" barSize={16} fill={COLORS.cash.inv} name="投资现金流" radius={[0, 0, 4, 4]} />
        <Bar hide={isHidden('financing')} isAnimationActive={false} dataKey="financing" barSize={16} fill={COLORS.cash.fin} name="筹资现金流" radius={[0, 0, 4, 4]} />
        <Line hide={isHidden('freeCashFlow')} isAnimationActive={false} type="monotone" dataKey="freeCashFlow" stroke={COLORS.cash.fcf} strokeWidth={3} dot={{r: 4}} name="自由现金流" />
        <Line hide={isHidden('balance')} isAnimationActive={false} type="monotone" dataKey="balance" stroke={COLORS.cash.bal} strokeWidth={2} dot={{r: 3}} strokeDasharray="4 4" name="期末现金余额" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default CashFlowChart;
