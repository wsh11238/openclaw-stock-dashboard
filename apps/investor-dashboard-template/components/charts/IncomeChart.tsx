import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { INCOME_DATA, COLORS } from '../../constants';

const IncomeChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={INCOME_DATA}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.income.profit} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={COLORS.income.profit} stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="year" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
        <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
        <Tooltip 
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          itemStyle={{ fontSize: '12px', padding: 0 }}
          labelStyle={{ fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}
          formatter={(value: number) => [`${value} 亿`, '']}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
        
        <Area type="monotone" dataKey="profit" stackId="1" stroke={COLORS.income.profit} fill="url(#colorProfit)" name="净利润" />
        <Area type="monotone" dataKey="tax" stackId="1" stroke={COLORS.income.tax} fill={COLORS.income.tax} name="税金及附加" />
        <Area type="monotone" dataKey="sga" stackId="1" stroke={COLORS.income.sga} fill={COLORS.income.sga} name="销管研费用" />
        <Area type="monotone" dataKey="cost" stackId="1" stroke={COLORS.income.cost} fill={COLORS.income.cost} name="营业成本" />
        {/* Financial expenses usually negative or small, handled gracefully by stacking logic if positive, strictly speaking fin expenses reduce profit but for visual 'makeup of revenue' we stack positive values. Here we assume positive representation of expense magnitude */}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default IncomeChart;