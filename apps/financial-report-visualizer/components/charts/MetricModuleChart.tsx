import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BALANCE_DATA, METRIC_TREND_DATA } from '../../constants';
import InteractiveLegend, { LegendItem } from './InteractiveLegend';

type MetricChartKind = 'operation' | 'cash' | 'structure' | 'return';

interface MetricModuleChartProps {
  kind: MetricChartKind;
}

interface SeriesItem {
  key: string;
  name: string;
  color: string;
  unit: '%' | 'x' | '亿' | 'score';
  type: 'rect' | 'line';
}

const operationBars: SeriesItem[] = [
  { key: 'revenue', name: '营业收入', color: '#99f6e4', unit: '亿', type: 'rect' },
];

const operationLines: SeriesItem[] = [
  { key: 'grossMargin', name: '毛利率', color: '#0f766e', unit: '%', type: 'line' },
  { key: 'netMargin', name: '净利率', color: '#0369a1', unit: '%', type: 'line' },
  { key: 'expenseRatio', name: '费用率', color: '#f97316', unit: '%', type: 'line' },
];

const cashBars: SeriesItem[] = [
  { key: 'deductedNetProfit', name: '扣非净利润', color: '#3b82f6', unit: '亿', type: 'rect' },
  { key: 'operatingCashFlow', name: '经营现金流', color: '#22c55e', unit: '亿', type: 'rect' },
];

const structureSeries: SeriesItem[] = [
  { key: 'assetCash', name: '货币资金', color: '#0e7490', unit: '亿', type: 'rect' },
  { key: 'assetCurrentOther', name: '其他流动资产', color: '#7dd3fc', unit: '亿', type: 'rect' },
  { key: 'assetFixed', name: '固定资产', color: '#34d399', unit: '亿', type: 'rect' },
  { key: 'assetInvestment', name: '长期投资及金融资产', color: '#a7f3d0', unit: '亿', type: 'rect' },
  { key: 'assetIntangible', name: '无形资产/商誉', color: '#fbbf24', unit: '亿', type: 'rect' },
  { key: 'assetOther', name: '其他资产', color: '#e2e8f0', unit: '亿', type: 'rect' },
  { key: 'liabilityCurrent', name: '流动负债', color: '#64748b', unit: '亿', type: 'rect' },
  { key: 'liabilityDebt', name: '长期有息债务', color: '#334155', unit: '亿', type: 'rect' },
  { key: 'liabilityOther', name: '其他负债', color: '#cbd5e1', unit: '亿', type: 'rect' },
  { key: 'equity', name: '所有者权益', color: '#2dd4bf', unit: '亿', type: 'rect' },
];

const radarDimensions = [
  { key: 'roe', name: 'ROE', unit: '%' },
  { key: 'roic', name: 'ROIC', unit: '%' },
  { key: 'eps', name: 'EPS', unit: 'x' },
  { key: 'payoutRatio', name: '分红率', unit: '%' },
  { key: 'researchExpense', name: '研发投入', unit: '亿' },
  { key: 'capitalExpenditure', name: '资本开支', unit: '亿' },
] as const;

const formatValue = (value: number, unit: string) => {
  if (unit === '%') return `${value.toFixed(1)}%`;
  if (unit === 'x') return `${value.toFixed(2)}`;
  if (unit === 'score') return `${value.toFixed(0)}分`;
  return `${value.toFixed(1)} 亿`;
};

const getPayloadUnit = (item: any) => item?.payload?.unit || item?.unit || '';

const ModuleTooltip = ({ active, label, payload }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="w-[210px] rounded-lg border border-slate-200 bg-white/95 p-2.5 text-xs shadow-xl backdrop-blur-sm">
      <div className="mb-1.5 font-bold text-slate-800">{label}</div>
      <div className="space-y-1">
        {payload.map((item: any) => (
          <div key={item.dataKey || item.name} className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5 text-slate-600">
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.name}</span>
            </span>
            <span className="shrink-0 font-semibold text-slate-800">
              {formatValue(Number(item.value || 0), getPayloadUnit(item))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RadarTooltip = ({ active, label, payload }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="w-[180px] rounded-lg border border-slate-200 bg-white/95 p-2.5 text-xs shadow-xl backdrop-blur-sm">
      <div className="mb-1.5 font-bold text-slate-800">{label}</div>
      {payload.map((item: any) => (
        <div key={item.dataKey} className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
            {item.name}
          </span>
          <span className="font-semibold text-slate-800">{Number(item.value || 0).toFixed(0)}分</span>
        </div>
      ))}
    </div>
  );
};

const MetricModuleChart: React.FC<MetricModuleChartProps> = ({ kind }) => {
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);
  const isHidden = (dataKey: string) => hiddenKeys.includes(dataKey);
  const toggleKey = (dataKey: string) => {
    setHiddenKeys((current) => (
      current.includes(dataKey)
        ? current.filter((key) => key !== dataKey)
        : [...current, dataKey]
    ));
  };

  const latestBalance = BALANCE_DATA[BALANCE_DATA.length - 1];
  const radarBaseYear = METRIC_TREND_DATA.find((row) => row.roe > 0 && row.roic > 0) || METRIC_TREND_DATA[0];
  const radarLatestYear = METRIC_TREND_DATA[METRIC_TREND_DATA.length - 1];

  const legendItems = useMemo<LegendItem[]>(() => {
    if (kind === 'cash') {
      return cashBars.map((item) => ({
        dataKey: item.key,
        value: item.name,
        color: item.color,
        type: 'rect',
      }));
    }

    if (kind === 'structure') {
      return structureSeries.map((item) => ({
        dataKey: item.key,
        value: item.name,
        color: item.color,
        type: 'rect',
      }));
    }

    if (kind === 'return') {
      return [
        { dataKey: radarBaseYear.year, value: radarBaseYear.year, color: '#94a3b8', type: 'line' },
        { dataKey: radarLatestYear.year, value: radarLatestYear.year, color: '#8b5cf6', type: 'line' },
      ];
    }

    return [...operationBars, ...operationLines].map((item) => ({
      dataKey: item.key,
      value: item.name,
      color: item.color,
      type: item.type,
    }));
  }, [kind, radarBaseYear.year, radarLatestYear.year]);

  const structureData = useMemo(() => ([
    {
      name: '资产结构',
      assetCash: latestBalance.assetCash,
      assetCurrentOther: latestBalance.assetCurrentOther,
      assetFixed: latestBalance.assetFixed,
      assetInvestment: latestBalance.assetInvestment,
      assetIntangible: latestBalance.assetIntangible,
      assetOther: latestBalance.assetOther,
    },
    {
      name: '负债权益',
      liabilityCurrent: latestBalance.liabilityCurrent,
      liabilityDebt: latestBalance.liabilityDebt,
      liabilityOther: latestBalance.liabilityOther,
      equity: latestBalance.equity,
    },
  ]), [latestBalance]);

  const radarData = useMemo(() => (
    radarDimensions.map((dimension) => {
      const maxValue = Math.max(...METRIC_TREND_DATA.map((row) => Number(row[dimension.key]) || 0), 1);
      const baseValue = Number(radarBaseYear[dimension.key]) || 0;
      const latestValue = Number(radarLatestYear[dimension.key]) || 0;

      return {
        subject: dimension.name,
        [radarBaseYear.year]: Math.round((baseValue / maxValue) * 100),
        [radarLatestYear.year]: Math.round((latestValue / maxValue) * 100),
      };
    })
  ), [radarBaseYear, radarLatestYear]);

  const renderOperationChart = () => {
    return (
      <ComposedChart data={METRIC_TREND_DATA} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 11 }} interval={0} minTickGap={0} padding={{ left: 4, right: 8 }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="left" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
        <Tooltip content={<ModuleTooltip />} cursor={{ fill: 'rgba(14, 116, 144, 0.06)' }} wrapperStyle={{ pointerEvents: 'none', zIndex: 20 }} />
        {operationBars.map((item) => (
          <Bar key={item.key} hide={isHidden(item.key)} isAnimationActive={false} yAxisId="left" dataKey={item.key} name={item.name} unit={item.unit} fill={item.color} barSize={16} radius={[3, 3, 0, 0]} />
        ))}
        {operationLines.map((item) => (
          <Line key={item.key} hide={isHidden(item.key)} isAnimationActive={false} yAxisId="right" type="monotone" dataKey={item.key} name={item.name} unit={item.unit} stroke={item.color} strokeWidth={2} dot={{ r: 3 }} />
        ))}
      </ComposedChart>
    );
  };

  const renderCashChart = () => {
    return (
      <BarChart data={METRIC_TREND_DATA} margin={{ top: 8, right: 20, left: -20, bottom: 0 }} barGap={1} barCategoryGap="32%">
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 11 }} interval={0} minTickGap={0} padding={{ left: 4, right: 16 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<ModuleTooltip />} cursor={{ fill: 'rgba(14, 116, 144, 0.06)' }} wrapperStyle={{ pointerEvents: 'none', zIndex: 20 }} />
        {cashBars.map((item) => (
          <Bar key={item.key} hide={isHidden(item.key)} isAnimationActive={false} dataKey={item.key} name={item.name} unit={item.unit} fill={item.color} barSize={10} radius={[3, 3, 0, 0]} />
        ))}
      </BarChart>
    );
  };

  const renderStructureChart = () => {
    return (
      <BarChart data={structureData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barCategoryGap="35%">
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} minTickGap={0} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<ModuleTooltip />} cursor={{ fill: 'rgba(14, 116, 144, 0.06)' }} wrapperStyle={{ pointerEvents: 'none', zIndex: 20 }} />
        {structureSeries.map((item) => (
          <Bar key={item.key} hide={isHidden(item.key)} isAnimationActive={false} dataKey={item.key} stackId="structure" name={item.name} unit={item.unit} fill={item.color} radius={[2, 2, 0, 0]} />
        ))}
      </BarChart>
    );
  };

  const renderReturnChart = () => {
    return (
      <RadarChart data={radarData} margin={{ top: 8, right: 12, left: 12, bottom: 0 }}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#475569' }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} tickCount={4} />
        <Tooltip content={<RadarTooltip />} wrapperStyle={{ pointerEvents: 'none', zIndex: 20 }} />
        <Radar hide={isHidden(radarBaseYear.year)} isAnimationActive={false} name={radarBaseYear.year} dataKey={radarBaseYear.year} stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.18} />
        <Radar hide={isHidden(radarLatestYear.year)} isAnimationActive={false} name={radarLatestYear.year} dataKey={radarLatestYear.year} stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.28} />
      </RadarChart>
    );
  };

  const renderChart = () => {
    if (kind === 'cash') return renderCashChart();
    if (kind === 'structure') return renderStructureChart();
    if (kind === 'return') return renderReturnChart();
    return renderOperationChart();
  };

  return (
    <div className="w-full pl-2 pr-6 pt-4 sm:px-4">
      <div className={`${kind === 'structure' ? 'h-[250px]' : 'h-[220px]'} w-full`}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
      <InteractiveLegend hiddenKeys={hiddenKeys} items={legendItems} onToggle={toggleKey} />
    </div>
  );
};

export default MetricModuleChart;
