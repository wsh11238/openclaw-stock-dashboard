import React from 'react';
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

const CashFlowChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={CASH_FLOW_DATA}
        margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
      >
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="year" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
        <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
        <Tooltip 
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          formatter={(value: number) => [`${value} 亿`, '']}
        />
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
        <ReferenceLine y={0} stroke="#94a3b8" />

        <Bar dataKey="operating" barSize={12} fill={COLORS.cash.op} name="经营性现金流" radius={[4, 4, 0, 0]} />
        <Bar dataKey="investing" barSize={12} fill={COLORS.cash.inv} name="投资性现金流" radius={[0, 0, 4, 4]} />
        <Bar dataKey="financing" barSize={12} fill={COLORS.cash.fin} name="筹资性现金流" radius={[0, 0, 4, 4]} />
        <Line type="monotone" dataKey="balance" stroke={COLORS.cash.bal} strokeWidth={3} dot={{r: 4}} name="期末现金余额" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default CashFlowChart;