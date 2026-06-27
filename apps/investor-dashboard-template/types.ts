
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
  cost: number;
  tax: number;
  sga: number;
  fin: number;
  profit: number;
  revenue: number;
}

export interface BalanceData {
  year: string;
  assetCash: number;
  assetRecv: number;
  assetInv: number;
  assetFixed: number;
  assetOther: number;
  liabCurrent: number;
  liabNonCurrent: number;
  equity: number;
  totalAsset: number;
  totalLiabEq: number;
}

export interface CashFlowData {
  year: string;
  operating: number;
  investing: number;
  financing: number;
  balance: number;
}

export interface RatioData {
  year: string;
  pe: number;
  roe: number;
  roic: number;
  divYield: number;
}
