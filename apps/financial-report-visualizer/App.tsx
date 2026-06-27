import React from 'react';
import { Activity, Gift, Landmark, MessageCircle, Percent, TrendingUp, WalletCards } from 'lucide-react';
import DashboardCard from './components/DashboardCard';
import IncomeChart from './components/charts/IncomeChart';
import BalanceChart from './components/charts/BalanceChart';
import CashFlowChart from './components/charts/CashFlowChart';
import MetricModuleChart from './components/charts/MetricModuleChart';
import ShareholderReturnChart from './components/charts/ShareholderReturnChart';
import {
  BALANCE_DATA,
  CASH_FLOW_DATA,
  COMPANY,
  INCOME_DATA,
  LATEST_METRICS,
  SHAREHOLDER_RETURN_DATA,
  SHAREHOLDER_RETURN_SNAPSHOT,
} from './constants';

const formatCny = (value: number) => `${value.toLocaleString('zh-CN', { maximumFractionDigits: 2 })} 亿元`;
const formatPct = (value: number) => `${value.toFixed(1)}%`;
const formatTimes = (value: number) => `${value.toFixed(2)}x`;

const firstIncome = INCOME_DATA[0];
const latestIncome = INCOME_DATA[INCOME_DATA.length - 1];
const latestBalance = BALANCE_DATA[BALANCE_DATA.length - 1];
const latestCash = CASH_FLOW_DATA[CASH_FLOW_DATA.length - 1];
const latestReturn = SHAREHOLDER_RETURN_DATA[SHAREHOLDER_RETURN_DATA.length - 1];

const revenueCagr = (Math.pow(latestIncome.revenue / firstIncome.revenue, 1 / 4) - 1) * 100;
const profitMargin = (latestIncome.profit / latestIncome.revenue) * 100;
const debtRatio = ((latestBalance.liabilityCurrent + latestBalance.liabilityDebt + latestBalance.liabilityOther) / latestBalance.totalAsset) * 100;

const metricGroups = [
  {
    icon: <TrendingUp size={18} />,
    title: '经营质量指标',
    chartKind: 'operation',
    items: [
      { name: '营业收入', value: `${formatCny(LATEST_METRICS.revenue)} / +${formatPct(LATEST_METRICS.revenueGrowth)}`, watch: '收入恢复增长，但规模仍在 5-6 亿元区间，需要观察新业务放量。' },
      { name: '毛利率', value: formatPct(LATEST_METRICS.grossMargin), watch: '2025 年毛利率明显回落，提示产品结构或成本端压力。' },
      { name: '净利率', value: formatPct(LATEST_METRICS.netMargin), watch: '仍有较好盈利能力，但已从 2022 年高点连续下行。' },
      { name: '扣非净利润', value: formatCny(LATEST_METRICS.deductedNetProfit), watch: '主营盈利比归母利润下滑更明显，需关注非经常性收益占比。' },
      { name: '费用率', value: formatPct(LATEST_METRICS.expenseRatio), watch: '费用率约三成，对利润弹性形成持续约束。' },
    ],
  },
  {
    icon: <WalletCards size={18} />,
    title: '现金质量指标',
    chartKind: 'cash',
    items: [
      { name: '经营现金流净额', value: formatCny(LATEST_METRICS.operatingCashFlow), watch: '2025 年转为负值，是这份报表里最需要追踪的信号。' },
      { name: '经营现金流 / 净利润', value: formatTimes(LATEST_METRICS.operatingCashFlowToNetProfit), watch: '利润含金量在 2024-2025 年显著走弱。' },
      { name: '应收账款', value: formatCny(LATEST_METRICS.accountsReceivable), watch: '应收规模约为收入的三分之一，需要看回款节奏。' },
      { name: '存货', value: formatCny(LATEST_METRICS.inventory), watch: '存货连续上升至 4.75 亿元，资金占用和跌价风险都要看。' },
      { name: '合同负债', value: formatCny(LATEST_METRICS.contractLiability), watch: '预收款规模较小，短期需求可见度有限。' },
    ],
  },
  {
    icon: <Landmark size={18} />,
    title: '财务结构指标',
    chartKind: 'structure',
    items: [
      { name: '资产负债率', value: formatPct(LATEST_METRICS.debtRatio), watch: '杠杆不算激进，但 2024 年后负债率上台阶。' },
      { name: '有息负债', value: formatCny(LATEST_METRICS.interestBearingDebt), watch: '有息负债升至 3.68 亿元，资本结构开始更依赖融资。' },
      { name: '货币资金', value: formatCny(LATEST_METRICS.cash), watch: '账上现金 4.95 亿元，短债覆盖仍宽裕。' },
      { name: '短债 / 现金', value: formatTimes(LATEST_METRICS.shortDebtToCash), watch: '短期偿债压力很低，风险更多来自经营现金流和存货。' },
      { name: '商誉', value: formatCny(LATEST_METRICS.goodwill), watch: '商誉为零，并购减值包袱较轻。' },
    ],
  },
  {
    icon: <Activity size={18} />,
    title: '成长与回报指标',
    chartKind: 'return',
    items: [
      { name: 'ROE', value: formatPct(LATEST_METRICS.roe), watch: '股东回报率从 2022 年高点回落到个位数。' },
      { name: 'ROIC', value: `约 ${formatPct(LATEST_METRICS.roic)}`, watch: '投入资本回报为估算口径，2025 年明显承压。' },
      { name: '研发投入', value: formatCny(LATEST_METRICS.researchExpense), watch: '研发费用保持投入，是超硬材料企业的长期竞争要素。' },
      { name: '资本开支', value: formatCny(LATEST_METRICS.capitalExpenditure), watch: '资本开支较 2024 年回落，但仍继续消耗自由现金流。' },
      { name: '分红率', value: formatPct(LATEST_METRICS.payoutRatio), watch: '分红高于当年归母利润，需结合现金流承受力观察。' },
      { name: '每股收益 EPS', value: `${LATEST_METRICS.eps.toFixed(2)} 元`, watch: 'EPS 从 2022 年高点回落，盈利修复是关键变量。' },
    ],
  },
];

const shareholderReturnItems = [
  { name: '2025 每股现金分红', value: `${latestReturn.dividendPerShare.toFixed(2)} 元`, watch: '2025 年度权益分派为每 10 股派 3 元。' },
  { name: '静态股息率', value: formatPct(SHAREHOLDER_RETURN_SNAPSHOT.latestDividendYield), watch: `按 ${SHAREHOLDER_RETURN_SNAPSHOT.priceDate} 股价 ${SHAREHOLDER_RETURN_SNAPSHOT.price.toFixed(2)} 元测算。` },
  { name: '现金分红总额', value: formatCny(latestReturn.cashDividend), watch: '2025 年拟派现金分红约 1.45 亿元。' },
  { name: '回购金额', value: formatCny(latestReturn.buyback), watch: '2025 年度口径未计入新增回购；2024 年年报口径约 0.16 亿元。' },
  { name: '分红率', value: formatPct(latestReturn.payoutRatio), watch: '按现金分红 / 归母净利润估算，已高于当年利润。' },
  { name: '股东回报合计', value: formatCny(latestReturn.totalReturn), watch: '现金分红与回购合计，适合和自由现金流一起看。' },
];

const MetricModuleCard: React.FC<(typeof metricGroups)[number]> = ({ icon, title, chartKind, items }) => (
  <section className="min-w-0 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
    <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 text-slate-700">
      {icon}
      <h3 className="font-bold text-slate-800">{title}</h3>
    </div>
    <MetricModuleChart kind={chartKind as 'operation' | 'cash' | 'structure' | 'return'} />
    <div className="divide-y divide-slate-100">
      {items.map((item) => (
        <div key={item.name} className="grid grid-cols-1 sm:grid-cols-[minmax(96px,0.75fr)_minmax(96px,0.75fr)_minmax(0,1.6fr)] gap-1.5 sm:gap-3 px-4 py-3 text-sm">
          <div className="font-semibold text-slate-800">{item.name}</div>
          <div className="text-cyan-800 font-bold whitespace-nowrap">{item.value}</div>
          <div className="text-slate-500 leading-relaxed break-words">{item.watch}</div>
        </div>
      ))}
    </div>
  </section>
);

const ShareholderReturnCard: React.FC = () => (
  <section className="min-w-0 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
    <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 text-slate-700">
      <Gift size={18} />
      <h3 className="font-bold text-slate-800">分红回购与股息率</h3>
    </div>
    <ShareholderReturnChart />
    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
      <div className="divide-y divide-slate-100">
        {shareholderReturnItems.slice(0, 3).map((item) => (
          <div key={item.name} className="grid grid-cols-1 sm:grid-cols-[minmax(120px,0.8fr)_minmax(96px,0.65fr)_minmax(0,1.55fr)] gap-1.5 sm:gap-3 px-4 py-3 text-sm">
            <div className="font-semibold text-slate-800">{item.name}</div>
            <div className="text-cyan-800 font-bold whitespace-nowrap">{item.value}</div>
            <div className="text-slate-500 leading-relaxed break-words">{item.watch}</div>
          </div>
        ))}
      </div>
      <div className="divide-y divide-slate-100">
        {shareholderReturnItems.slice(3).map((item) => (
          <div key={item.name} className="grid grid-cols-1 sm:grid-cols-[minmax(120px,0.8fr)_minmax(96px,0.65fr)_minmax(0,1.55fr)] gap-1.5 sm:gap-3 px-4 py-3 text-sm">
            <div className="font-semibold text-slate-800">{item.name}</div>
            <div className="text-cyan-800 font-bold whitespace-nowrap">{item.value}</div>
            <div className="text-slate-500 leading-relaxed break-words">{item.watch}</div>
          </div>
        ))}
      </div>
    </div>
    <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
      {SHAREHOLDER_RETURN_SNAPSHOT.source} 股息率会随股价变化，页面使用的是生成时快照。
    </div>
  </section>
);

const FlowSection: React.FC<{ label: string; title: string; children: React.ReactNode }> = ({ label, title, children }) => (
  <section className="space-y-3">
    <div className="flex items-center gap-3 px-1">
      <span className="rounded bg-slate-900 px-2 py-0.5 text-xs font-bold text-white">{label}</span>
      <h2 className="text-base sm:text-lg font-bold text-slate-800">{title}</h2>
    </div>
    <div className="grid min-w-0 grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      {children}
    </div>
  </section>
);

const App: React.FC = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 font-sans text-slate-900 pb-12">
      <header className="bg-gradient-to-r from-cyan-800 via-teal-700 to-emerald-600 text-white shadow-lg">
        <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:py-7">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-white/18 px-2 py-0.5 rounded text-xs font-semibold backdrop-blur-sm">{COMPANY.name} / {COMPANY.ticker}</span>
                <span className="bg-slate-950/25 px-2 py-0.5 rounded text-xs font-semibold backdrop-blur-sm text-cyan-50">{COMPANY.tag}</span>
                <span className="bg-white/18 px-2 py-0.5 rounded text-xs font-semibold backdrop-blur-sm">{COMPANY.period}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex flex-wrap items-end gap-3 break-words">
                {COMPANY.name}
                <span className="text-cyan-100 text-lg font-normal">{COMPANY.nameEn}</span>
              </h1>
              <p className="text-cyan-50 mt-3 opacity-90 max-w-3xl leading-relaxed break-words">
                四方达是超硬材料与精密工具企业，财报阅读重点不只在收入增速，也在毛利率、存货、现金流与新增融资的同步变化。2025 年收入恢复增长，但经营现金流转负，盈利质量和分红承受力需要一起看。
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-3 text-sm font-medium">
              <div className="bg-white/12 px-4 py-3 rounded-lg backdrop-blur-sm">
                <div className="opacity-75 text-xs flex items-center gap-1"><TrendingUp size={14} /> 2025 营收</div>
                <div className="text-xl font-bold mt-1">{formatCny(latestIncome.revenue)}</div>
              </div>
              <div className="bg-white/12 px-4 py-3 rounded-lg backdrop-blur-sm">
                <div className="opacity-75 text-xs flex items-center gap-1"><WalletCards size={14} /> 归母净利率</div>
                <div className="text-xl font-bold mt-1">{profitMargin.toFixed(1)}%</div>
              </div>
              <div className="bg-white/12 px-4 py-3 rounded-lg backdrop-blur-sm">
                <div className="opacity-75 text-xs flex items-center gap-1"><Percent size={14} /> 静态股息率</div>
                <div className="text-xl font-bold mt-1">{formatPct(SHAREHOLDER_RETURN_SNAPSHOT.latestDividendYield)}</div>
              </div>
              <div className="bg-white/12 px-4 py-3 rounded-lg backdrop-blur-sm">
                <div className="opacity-75 text-xs flex items-center gap-1"><Activity size={14} /> 自由现金流</div>
                <div className="text-xl font-bold mt-1">{formatCny(latestCash.freeCashFlow)}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 py-8">
        <section className="min-w-0 bg-white border border-cyan-100 rounded-lg p-4 sm:p-6 mb-8 flex items-start gap-4 shadow-sm">
          <div className="hidden sm:block bg-cyan-50 p-3 rounded-full text-cyan-700 mt-1">
            <MessageCircle size={24} />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-800 mb-2">财报速读</h2>
            <p className="text-slate-600 leading-relaxed text-sm break-words">
              过去五年四方达营收从 {formatCny(firstIncome.revenue)} 增至 {formatCny(latestIncome.revenue)}，复合增速约 {revenueCagr.toFixed(1)}%。但 2025 年毛利率降至 {formatPct(LATEST_METRICS.grossMargin)}、经营现金流为 {formatCny(latestCash.operating)}、自由现金流为 {formatCny(latestCash.freeCashFlow)}。公司 2025 年拟每股分红 {latestReturn.dividendPerShare.toFixed(2)} 元，静态股息率约 {formatPct(SHAREHOLDER_RETURN_SNAPSHOT.latestDividendYield)}，分红力度不低，但需要和现金流质量一起判断。
            </p>
          </div>
        </section>

        <div className="space-y-8">
          <FlowSection label="01" title="先看经营和盈利">
            <MetricModuleCard {...metricGroups[0]} />
            <DashboardCard
              title="利润表拆解"
              subtitle={`Income Statement / 单位：${COMPANY.unit}`}
              companyName="300179"
              analysis="收入在 2022 年跃升后进入平台期，2025 年重新增长到 5.67 亿元；但归母净利润从 2022 年 1.54 亿元回落到 2025 年 0.93 亿元。利润被成本费用吸收的比例提高，尤其毛利率下行，是盈利能力走弱的核心解释。"
            >
              <IncomeChart />
            </DashboardCard>
          </FlowSection>

          <FlowSection label="02" title="再看利润有没有现金支撑">
            <MetricModuleCard {...metricGroups[1]} />
            <DashboardCard
              title="现金流路径"
              subtitle={`Cash Flow / 单位：${COMPANY.unit}`}
              companyName="300179"
              analysis="2021-2023 年经营现金流尚能覆盖部分资本开支，2024 年明显降至 0.25 亿元，2025 年进一步转负至 -0.47 亿元。与此同时公司仍有分红和投资支出，自由现金流连续四年为负，现金流质量是最重要的后续观察点。"
            >
              <CashFlowChart />
            </DashboardCard>
          </FlowSection>

          <FlowSection label="03" title="接着看资产、债务和安全边际">
            <MetricModuleCard {...metricGroups[2]} />
            <DashboardCard
              title="资产负债结构"
              subtitle={`Balance Sheet / 单位：${COMPANY.unit}`}
              companyName="300179"
              analysis="总资产从 2021 年 12.33 亿元扩张到 2025 年 21.74 亿元，现金和存货是近两年变化最明显的资产项。负债端有息负债升至 3.68 亿元，不过货币资金 4.95 亿元，短期偿债压力不高；真正要看的是存货扩张能否转化为收入和现金回款。"
            >
              <BalanceChart />
            </DashboardCard>
          </FlowSection>

          <FlowSection label="04" title="再看分红、回购和股息率">
            <div className="xl:col-span-2">
              <ShareholderReturnCard />
            </div>
          </FlowSection>

          <FlowSection label="05" title="最后看成长和股东回报">
            <div className="xl:col-span-2">
              <MetricModuleCard {...metricGroups[3]} />
            </div>
          </FlowSection>
        </div>
      </main>

      <footer className="text-center text-slate-500 py-8 text-xs px-4">
        <p>Data: 四方达 2021-2025 年度财务报表，单位换算为亿元人民币，并通过东方财富 F10 结构化数据交叉校验。</p>
        <p className="mt-1">
          Annual reports:
          {' '}
          <a className="text-cyan-700 hover:underline" href="https://pdf.dfcfw.com/pdf/H2_AN202203301556075624_1.pdf" target="_blank" rel="noreferrer">2021</a>
          {' · '}
          <a className="text-cyan-700 hover:underline" href="https://pdf.dfcfw.com/pdf/H2_AN202304201585630163_1.pdf" target="_blank" rel="noreferrer">2022</a>
          {' · '}
          <a className="text-cyan-700 hover:underline" href="https://pdf.dfcfw.com/pdf/H2_AN202403141626764248_1.pdf" target="_blank" rel="noreferrer">2023</a>
          {' · '}
          <a className="text-cyan-700 hover:underline" href="https://pdf.dfcfw.com/pdf/H2_AN202503271648298182_1.pdf" target="_blank" rel="noreferrer">2024</a>
          {' · '}
          <a className="text-cyan-700 hover:underline" href="https://pdf.dfcfw.com/pdf/H2_AN202604011820960993_1.pdf" target="_blank" rel="noreferrer">2025</a>
        </p>
        <p className="mt-1">仅用于财报阅读与可视化，不构成投资建议。</p>
      </footer>
    </div>
  );
};

export default App;
