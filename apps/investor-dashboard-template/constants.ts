import { IncomeData, BalanceData, CashFlowData, RatioData } from './types';

// Data Source: Yifeng Pharmacy (603939.SH)
// Approximated Data for Visualization (Units: 亿元)

export const INCOME_DATA: IncomeData[] = [
  { year: '2019', cost: 65, tax: 1, sga: 25, fin: 1, profit: 6, revenue: 102 },
  { year: '2020', cost: 85, tax: 2, sga: 30, fin: 2, profit: 8, revenue: 131 },
  { year: '2021', cost: 100, tax: 2, sga: 35, fin: 3, profit: 9, revenue: 153 },
  { year: '2022', cost: 125, tax: 3, sga: 45, fin: 4, profit: 13, revenue: 198 },
  { year: '2023', cost: 140, tax: 4, sga: 55, fin: 5, profit: 14, revenue: 225 },
];

export const BALANCE_DATA: BalanceData[] = [
  { year: '2019', assetCash: 20, assetRecv: 5, assetInv: 25, assetFixed: 15, assetOther: 35, liabCurrent: 40, liabNonCurrent: 10, equity: 50, totalAsset: 100, totalLiabEq: 100 },
  { year: '2020', assetCash: 35, assetRecv: 8, assetInv: 30, assetFixed: 20, assetOther: 45, liabCurrent: 55, liabNonCurrent: 20, equity: 63, totalAsset: 138, totalLiabEq: 138 },
  { year: '2021', assetCash: 30, assetRecv: 12, assetInv: 35, assetFixed: 25, assetOther: 60, liabCurrent: 65, liabNonCurrent: 30, equity: 67, totalAsset: 162, totalLiabEq: 162 },
  { year: '2022', assetCash: 40, assetRecv: 15, assetInv: 40, assetFixed: 30, assetOther: 75, liabCurrent: 80, liabNonCurrent: 35, equity: 85, totalAsset: 200, totalLiabEq: 200 },
  { year: '2023', assetCash: 45, assetRecv: 18, assetInv: 45, assetFixed: 35, assetOther: 85, liabCurrent: 90, liabNonCurrent: 40, equity: 98, totalAsset: 228, totalLiabEq: 228 },
];
// Note: 'assetOther' heavily includes Goodwill (商誉) from acquisitions and Intangible assets.
// 'assetRecv' includes Medical Insurance receivables.

export const CASH_FLOW_DATA: CashFlowData[] = [
  { year: '2019', operating: 15, investing: -12, financing: 5, balance: 20 },
  { year: '2020', operating: 20, investing: -25, financing: 20, balance: 35 }, // Convertible bond issuance etc.
  { year: '2021', operating: 22, investing: -30, financing: 5, balance: 30 }, // Heavy M&A
  { year: '2022', operating: 35, investing: -25, financing: 0, balance: 40 },
  { year: '2023', operating: 40, investing: -28, financing: -5, balance: 45 },
];

export const RATIO_DATA: RatioData[] = [
  { year: '2019', pe: 45.0, roe: 14.0, roic: 12.0, divYield: 0.5 },
  { year: '2020', pe: 60.0, roe: 13.5, roic: 11.5, divYield: 0.4 },
  { year: '2021', pe: 40.0, roe: 14.5, roic: 11.0, divYield: 0.6 },
  { year: '2022', pe: 35.0, roe: 16.0, roic: 12.0, divYield: 0.8 },
  { year: '2023', pe: 20.0, roe: 15.5, roic: 11.5, divYield: 1.5 }, // Valuation compression
];

export const COLORS = {
  income: {
    profit: '#16a34a', // Green-600 (Pharmacy/Health vibe)
    cost: '#86efac', // Green-300
    sga: '#4ade80', // Green-400
    tax: '#94a3b8', // Slate-400
    fin: '#e2e8f0', 
  },
  balance: {
    asset: '#15803d', // Green-700
    assetLight: '#bbf7d0', 
    assetDark: '#14532d', 
    liab: '#475569', // Slate-600
    equity: '#f0fdf4', // Green-50
  },
  cash: {
    op: '#22c55e', // Green-500
    inv: '#94a3b8', // Slate-400
    fin: '#f59e0b', // Amber-500
    bal: '#166534', // Green-800
  },
  ratio: {
    pe: '#16a34a',
    roe: '#22c55e',
    roic: '#15803d',
    div: '#14532d',
  }
};