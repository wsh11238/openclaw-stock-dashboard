
export interface Holding {
  ticker: string;
  name: string; // Chinese name preferred
  market: 'US' | 'SH' | 'SZ' | 'HK';
  shares?: number;
  market_value_usd?: number;
  position_pct?: number;
  activity: 'new' | 'add' | 'reduce' | 'sold' | 'unchanged';
  activity_amount?: string;
  note?: string;
}

export interface InvestorProfile {
  id: string;
  name: string;
  name_en?: string;
  firm: string;
  avatar_color: string;
  report_date: string;
  source: string;
  analysis_summary: string; // Markdown supported
  holdings: Holding[];
  retrieved_at: string;
}

export interface StockOverlap {
  ticker: string;
  name: string;
  count: number;
  holders: {
    investor_name: string;
    activity: string;
    pct?: number;
  }[];
}

export interface IncomeData {
  year: string;
  operatingExpense: number;
  financeOther: number;
  taxMinority: number;
  profit: number;
  revenue: number;
}

export interface BalanceData {
  year: string;
  assetCash: number;
  assetCurrentOther: number;
  assetFixed: number;
  assetInvestment: number;
  assetIntangible: number;
  assetOther: number;
  liabilityCurrent: number;
  liabilityDebt: number;
  liabilityOther: number;
  equity: number;
  totalAsset: number;
  totalLiabEq: number;
}

export interface CashFlowData {
  year: string;
  operating: number;
  investing: number;
  financing: number;
  freeCashFlow: number;
  dividendPaid: number;
  balance: number;
}

export interface RatioData {
  year: string;
  pe: number;
  roe: number;
  roic: number;
  divYield: number;
}

export interface MetricTrendData {
  year: string;
  revenue: number;
  revenueGrowth: number;
  grossMargin: number;
  netMargin: number;
  deductedNetProfit: number;
  expenseRatio: number;
  operatingCashFlow: number;
  operatingCashFlowToNetProfit: number;
  accountsReceivable: number;
  inventory: number;
  contractLiability: number;
  debtRatio: number;
  interestBearingDebt: number;
  cash: number;
  shortDebtToCash: number;
  goodwill: number;
  roe: number;
  roic: number;
  researchExpense: number;
  capitalExpenditure: number;
  payoutRatio: number;
  eps: number;
}

export interface ShareholderReturnData {
  year: string;
  cashDividend: number;
  buyback: number;
  totalReturn: number;
  dividendPerShare: number;
  dividendYield: number;
  buybackYield: number;
  payoutRatio: number;
}
