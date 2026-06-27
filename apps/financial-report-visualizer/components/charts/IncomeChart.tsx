import React, { useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { INCOME_DATA, COLORS } from '../../constants';
import CompactTooltip from './CompactTooltip';
import InteractiveLegend, { LegendItem } from './InteractiveLegend';

const LEGEND_ITEMS: LegendItem[] = [
  { dataKey: 'profit', value: '归母净利润', color: COLORS.income.profit, type: 'circle' },
  { dataKey: 'taxMinority', value: '所得税及少数股东', color: COLORS.income.taxMinority, type: 'circle' },
  { dataKey: 'financeOther', value: '财务及其他净影响', color: COLORS.income.financeOther, type: 'circle' },
  { dataKey: 'operatingExpense', value: '运营成本费用', color: COLORS.income.operatingExpense, type: 'circle' },
  { dataKey: 'revenue', value: '营业收入', color: COLORS.income.revenue, type: 'line' },
];

const IncomeChart: React.FC = () => {
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
        data={INCOME_DATA}
        margin={{ top: 12, right: 22, left: 0, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="year" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
        <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} width={42} />
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
        
        <Bar hide={isHidden('profit')} isAnimationActive={false} dataKey="profit" stackId="income" fill={COLORS.income.profit} name="归母净利润" radius={[0, 0, 3, 3]} />
        <Bar hide={isHidden('taxMinority')} isAnimationActive={false} dataKey="taxMinority" stackId="income" fill={COLORS.income.taxMinority} name="所得税及少数股东" />
        <Bar hide={isHidden('financeOther')} isAnimationActive={false} dataKey="financeOther" stackId="income" fill={COLORS.income.financeOther} name="财务及其他净影响" />
        <Bar hide={isHidden('operatingExpense')} isAnimationActive={false} dataKey="operatingExpense" stackId="income" fill={COLORS.income.operatingExpense} name="运营成本费用" radius={[3, 3, 0, 0]} />
        <Line hide={isHidden('revenue')} isAnimationActive={false} type="monotone" dataKey="revenue" stroke={COLORS.income.revenue} strokeWidth={3} dot={{r: 4}} name="营业收入" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default IncomeChart;
