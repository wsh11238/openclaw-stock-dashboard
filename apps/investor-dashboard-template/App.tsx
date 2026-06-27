import React from 'react';
import { MessageCircle } from 'lucide-react';
import DashboardCard from './components/DashboardCard';
import IncomeChart from './components/charts/IncomeChart';
import BalanceChart from './components/charts/BalanceChart';
import CashFlowChart from './components/charts/CashFlowChart';
import RatioChart from './components/charts/RatioChart';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-green-50 font-sans text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-semibold backdrop-blur-sm">益丰药房 / 603939.SH</span>
                <span className="bg-emerald-900/40 px-2 py-0.5 rounded text-xs font-semibold backdrop-blur-sm text-emerald-100">并购之王</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                益丰药房 <span className="text-emerald-200 text-lg font-normal">Yifeng Pharmacy</span>
              </h1>
              <p className="text-emerald-100 mt-2 opacity-90 max-w-2xl">
                中国领先的药品零售连锁企业，以"内生+外延"双轮驱动著称。率先进入"万店时代"，在华中、华东、华南地区拥有极高的市场占有率。
              </p>
            </div>
            <div className="flex gap-4 text-sm font-medium">
              <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <div className="opacity-75 text-xs">动态市盈率 (PE)</div>
                <div className="text-xl font-bold">~20.0x</div>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <div className="opacity-75 text-xs">门店数量</div>
                <div className="text-xl font-bold">13,000+</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Intro Banner */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100 mb-8 flex items-start gap-4">
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mt-1">
            <MessageCircle size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">老王的投资笔记</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              “药房这门生意，核心就是<b>规模效应</b>和<b>精细化管理</b>。益丰是典型的‘并购机器’，这些年通过不停地买买买，硬是砸出了万店规模。过去市场给它60倍PE，是因为看好它的成长速度；现在杀到20倍，是因为担心<b>医保控费</b>和<b>线上药店</b>的冲击。看财报要注意三点：第一是<b>商誉</b>（并购带来的后遗症），第二是<b>应收账款</b>（医保回款周期），第三是单店产出是否下滑。只要老龄化趋势不变，益丰作为渠道龙头的价值就在，但别指望以前那种疯狂的高估值了。”
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Income Statement */}
          <div className="w-full">
            <DashboardCard 
              title="万店扩张" 
              subtitle="Income Statement"
              companyName="Yifeng"
              analysis="营收（柱状图高度）呈现完美的阶梯式增长，这是不断开新店和并购的直接结果。净利润增速略慢于营收，因为零售行业的毛利本身不厚，加上新店培育期会拉低短期净利。销售费用占比很高，主要是门店租金和人员工资。"
            >
              <IncomeChart />
            </DashboardCard>
          </div>

          {/* Balance Sheet */}
          <div className="w-full">
            <DashboardCard 
              title="并购的代价" 
              subtitle="Balance Sheet Structure"
              companyName="Yifeng"
              analysis="资产端有两个显著特点：一是存货（绿色中间层）很高，毕竟几万种药要铺货；二是‘其他资产’（浅色顶层）占比大，这里面包含了巨额的商誉，这是连年并购留下的痕迹。如果被收购标的业绩不达标，会有商誉减值风险。"
            >
              <BalanceChart />
            </DashboardCard>
          </div>

          {/* Cash Flow */}
          <div className="w-full">
            <DashboardCard 
              title="造血与失血" 
              subtitle="Cash Flow Analysis"
              companyName="Yifeng"
              analysis="经营性现金流（亮绿）非常强劲，因为药店大部分是现款现货（除了医保部分）。但投资性现金流（灰色）常年大幅流出，这赚来的钱转手就拿去买新店了。这是一家典型的‘用现金流换增长’的公司。"
            >
              <CashFlowChart />
            </DashboardCard>
          </div>

          {/* Ratios */}
          <div className="w-full">
            <DashboardCard 
              title="估值回归" 
              subtitle="Key Ratios"
              companyName="Yifeng"
              analysis="PE（折线）从高点的60倍一路杀跌至20倍左右，挤干了成长股的泡沫。ROE维持在15%左右的优秀水平，说明管理层在快速扩张中依然保持了不错的运营效率。现在这个位置，更多是赚业绩增长的钱，而非估值提升的钱。"
            >
              <RatioChart />
            </DashboardCard>
          </div>

        </div>
      </main>

      <footer className="text-center text-slate-400 py-8 text-xs">
        <p>Data Source: Yifeng Pharmacy Annual Reports (FY ending Dec 31)</p>
        <p className="mt-1">Disclaimer: Not financial advice. For educational purposes only.</p>
      </footer>
    </div>
  );
};

export default App;