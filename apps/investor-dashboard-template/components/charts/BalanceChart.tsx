import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { BALANCE_DATA, COLORS } from '../../constants';

const BalanceChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={BALANCE_DATA}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        barGap={2}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="year" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
        <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
        <Tooltip 
          cursor={{ fill: '#f8fafc' }}
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          formatter={(value: number) => [`${value} 亿`, '']}
        />
        <Legend iconType="rect" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

        {/* Left Column: Assets */}
        <Bar dataKey="assetCash" stackId="a" fill={COLORS.balance.assetDark} name="货币资金" radius={[0, 0, 0, 0]} />
        <Bar dataKey="assetInv" stackId="a" fill={COLORS.balance.asset} name="存货" />
        <Bar dataKey="assetRecv" stackId="a" fill={COLORS.balance.assetLight} name="应收账款" />
        <Bar dataKey="assetFixed" stackId="a" fill="#93c5fd" name="固定资产" />
        <Bar dataKey="assetOther" stackId="a" fill="#bfdbfe" name="其他资产" radius={[4, 4, 0, 0]} />

        {/* Right Column: Liabilities + Equity */}
        <Bar dataKey="liabCurrent" stackId="b" fill={COLORS.balance.liab} name="流动负债" radius={[0, 0, 0, 0]} />
        <Bar dataKey="liabNonCurrent" stackId="b" fill="#fdba74" name="非流动负债" />
        <Bar dataKey="equity" stackId="b" fill={COLORS.balance.equity} name="所有者权益" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BalanceChart;