import React, { useState } from 'react';
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
import CompactTooltip from './CompactTooltip';
import InteractiveLegend, { LegendItem } from './InteractiveLegend';

const LEGEND_ITEMS: LegendItem[] = [
  { dataKey: 'assetCash', value: '货币资金', color: COLORS.balance.cash, type: 'rect' },
  { dataKey: 'assetCurrentOther', value: '其他流动资产', color: COLORS.balance.current, type: 'rect' },
  { dataKey: 'assetFixed', value: '固定资产', color: COLORS.balance.fixed, type: 'rect' },
  { dataKey: 'assetInvestment', value: '长期投资及金融资产', color: COLORS.balance.investment, type: 'rect' },
  { dataKey: 'assetIntangible', value: '无形资产/商誉', color: COLORS.balance.intangible, type: 'rect' },
  { dataKey: 'assetOther', value: '其他资产', color: COLORS.balance.otherAsset, type: 'rect' },
  { dataKey: 'liabilityCurrent', value: '流动负债', color: COLORS.balance.liabilityCurrent, type: 'rect' },
  { dataKey: 'liabilityDebt', value: '长期有息债务', color: COLORS.balance.liabilityDebt, type: 'rect' },
  { dataKey: 'liabilityOther', value: '其他负债', color: COLORS.balance.liabilityOther, type: 'rect' },
  { dataKey: 'equity', value: '所有者权益', color: COLORS.balance.equity, type: 'rect' },
];

const BalanceChart: React.FC = () => {
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
      <BarChart
        data={BALANCE_DATA}
        margin={{ top: 20, right: 22, left: 0, bottom: 10 }}
        barGap={4}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="year" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
        <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} width={46} />
        <Tooltip
          content={<CompactTooltip />}
          cursor={{ fill: '#f8fafc' }}
          offset={14}
          wrapperStyle={{ pointerEvents: 'none', zIndex: 20 }}
        />
        <Legend
          content={() => <InteractiveLegend hiddenKeys={hiddenKeys} items={LEGEND_ITEMS} onToggle={toggleKey} />}
          wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
        />

        {/* Left Column: Assets */}
        <Bar hide={isHidden('assetCash')} isAnimationActive={false} dataKey="assetCash" stackId="assets" fill={COLORS.balance.cash} name="货币资金" radius={[0, 0, 0, 0]} />
        <Bar hide={isHidden('assetCurrentOther')} isAnimationActive={false} dataKey="assetCurrentOther" stackId="assets" fill={COLORS.balance.current} name="其他流动资产" />
        <Bar hide={isHidden('assetFixed')} isAnimationActive={false} dataKey="assetFixed" stackId="assets" fill={COLORS.balance.fixed} name="固定资产" />
        <Bar hide={isHidden('assetInvestment')} isAnimationActive={false} dataKey="assetInvestment" stackId="assets" fill={COLORS.balance.investment} name="长期投资及金融资产" />
        <Bar hide={isHidden('assetIntangible')} isAnimationActive={false} dataKey="assetIntangible" stackId="assets" fill={COLORS.balance.intangible} name="无形资产/商誉" />
        <Bar hide={isHidden('assetOther')} isAnimationActive={false} dataKey="assetOther" stackId="assets" fill={COLORS.balance.otherAsset} name="其他资产" radius={[4, 4, 0, 0]} />

        {/* Right Column: Liabilities + Equity */}
        <Bar hide={isHidden('liabilityCurrent')} isAnimationActive={false} dataKey="liabilityCurrent" stackId="capital" fill={COLORS.balance.liabilityCurrent} name="流动负债" radius={[0, 0, 0, 0]} />
        <Bar hide={isHidden('liabilityDebt')} isAnimationActive={false} dataKey="liabilityDebt" stackId="capital" fill={COLORS.balance.liabilityDebt} name="长期有息债务" />
        <Bar hide={isHidden('liabilityOther')} isAnimationActive={false} dataKey="liabilityOther" stackId="capital" fill={COLORS.balance.liabilityOther} name="其他负债" />
        <Bar hide={isHidden('equity')} isAnimationActive={false} dataKey="equity" stackId="capital" fill={COLORS.balance.equity} name="所有者权益" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BalanceChart;
