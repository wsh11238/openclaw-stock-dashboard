import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { RATIO_DATA, COLORS } from '../../constants';

const RatioChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={RATIO_DATA}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="year" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
        {/* Left Y Axis for Percentages */}
        <YAxis yAxisId="left" tick={{fontSize: 12}} axisLine={false} tickLine={false} unit="%" domain={[0, 50]} />
        {/* Right Y Axis for PE Ratio */}
        <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
        
        <Tooltip 
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          formatter={(value: number, name: string) => [name === 'PE市盈率' ? value : `${value}%`, name]}
        />
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

        <Line yAxisId="right" type="monotone" dataKey="pe" stroke={COLORS.ratio.pe} strokeWidth={2} dot={{r: 3}} name="PE市盈率" />
        <Line yAxisId="left" type="monotone" dataKey="roe" stroke={COLORS.ratio.roe} strokeWidth={3} dot={{r: 4}} name="ROE净资产收益率" />
        <Line yAxisId="left" type="monotone" dataKey="roic" stroke={COLORS.ratio.roic} strokeWidth={2} dot={{r: 3}} name="ROIC投入资本回报" />
        <Line yAxisId="left" type="monotone" dataKey="divYield" stroke={COLORS.ratio.div} strokeWidth={2} strokeDasharray="5 5" name="股息率(%)" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RatioChart;