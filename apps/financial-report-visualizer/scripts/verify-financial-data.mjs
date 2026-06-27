import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const constantsPath = path.join(rootDir, 'constants.ts');

const YEARS = ['2021', '2022', '2023', '2024', '2025'];
const TOLERANCE = 0.08; // RMB 0.08 billion, allows only rounding noise after two-decimal display.
const EASTMONEY_BASE = 'https://datacenter-web.eastmoney.com/api/data/v1/get';

const annualReportLinks = {
  2025: 'https://pdf.dfcfw.com/pdf/H2_AN202604011820960993_1.pdf',
  2024: 'https://pdf.dfcfw.com/pdf/H2_AN202503271648298182_1.pdf',
  2023: 'https://pdf.dfcfw.com/pdf/H2_AN202403141626764248_1.pdf',
  2022: 'https://pdf.dfcfw.com/pdf/H2_AN202304201585630163_1.pdf',
  2021: 'https://pdf.dfcfw.com/pdf/H2_AN202203301556075624_1.pdf',
};

const roundYi = (value) => Math.round((Number(value || 0) / 1e8) * 100) / 100;
const round = (value) => Math.round(Number(value || 0) * 100) / 100;

function extractExportedArray(source, name) {
  const match = source.match(new RegExp(`export const ${name}:.*?= (\\[[\\s\\S]*?\\]);`));
  if (!match) {
    throw new Error(`Cannot find ${name} in constants.ts`);
  }
  return Function(`"use strict"; return ${match[1]};`)();
}

function extractExportedObject(source, name) {
  const match = source.match(new RegExp(`export const ${name} = (\\{[\\s\\S]*?\\});`));
  if (!match) {
    throw new Error(`Cannot find ${name} in constants.ts`);
  }
  return Function(`"use strict"; return ${match[1]};`)();
}

async function fetchEastmoney(reportName) {
  const params = new URLSearchParams({
    sortColumns: 'REPORT_DATE',
    sortTypes: '-1',
    pageSize: '30',
    pageNumber: '1',
    reportName,
    columns: 'ALL',
    filter: '(SECURITY_CODE="300179")(REPORT_TYPE="年报")',
  });

  const response = await fetch(`${EASTMONEY_BASE}?${params.toString()}`, {
    headers: {
      accept: 'application/json,text/plain,*/*',
      'user-agent': 'Mozilla/5.0 financial-data-verifier',
    },
  });

  if (!response.ok) {
    throw new Error(`Eastmoney ${reportName} request failed: ${response.status}`);
  }

  const json = await response.json();
  if (!json?.result?.data?.length) {
    throw new Error(`Eastmoney ${reportName} returned no data`);
  }

  return Object.fromEntries(
    json.result.data
      .map((row) => [String(new Date(row.REPORT_DATE).getFullYear()), row])
      .filter(([year]) => YEARS.includes(year)),
  );
}

function buildExpectedIncome(rows) {
  return YEARS.map((year) => {
    const row = rows[year];
    const revenue = roundYi(row.TOTAL_OPERATE_INCOME);
    const profit = roundYi(row.PARENT_NETPROFIT);
    const operatingExpense = roundYi((row.TOTAL_OPERATE_COST || 0) - (row.FINANCE_EXPENSE || 0));
    const taxMinority = roundYi((row.INCOME_TAX || 0) + (row.MINORITY_INTEREST || 0));
    const financeOther = round(revenue - operatingExpense - taxMinority - profit);

    return { year, revenue, operatingExpense, financeOther, taxMinority, profit };
  });
}

function buildExpectedBalance(rows) {
  return YEARS.map((year) => {
    const row = rows[year];
    const assetCash = roundYi(row.MONETARYFUNDS);
    const assetCurrentOther = roundYi((row.TOTAL_CURRENT_ASSETS || 0) - (row.MONETARYFUNDS || 0));
    const assetFixed = roundYi((row.FIXED_ASSET || 0) + (row.CIP || 0) + (row.USERIGHT_ASSET || 0));
    const assetInvestment = roundYi(
      (row.LONG_EQUITY_INVEST || 0) +
      (row.OTHER_NONCURRENT_FINASSET || 0) +
      (row.CREDITOR_INVEST || 0),
    );
    const assetIntangible = roundYi((row.INTANGIBLE_ASSET || 0) + (row.GOODWILL || 0));
    const totalAsset = roundYi(row.TOTAL_ASSETS);
    const assetOther = round(totalAsset - assetCash - assetCurrentOther - assetFixed - assetInvestment - assetIntangible);

    const liabilityCurrent = roundYi(row.TOTAL_CURRENT_LIAB);
    const liabilityDebt = roundYi((row.LONG_LOAN || 0) + (row.BOND_PAYABLE || 0) + (row.LEASE_LIAB || 0));
    const totalLiabilities = roundYi(row.TOTAL_LIABILITIES);
    const liabilityOther = round(totalLiabilities - liabilityCurrent - liabilityDebt);
    const equity = roundYi(row.TOTAL_EQUITY);

    return {
      year,
      assetCash,
      assetCurrentOther,
      assetFixed,
      assetInvestment,
      assetIntangible,
      assetOther,
      liabilityCurrent,
      liabilityDebt,
      liabilityOther,
      equity,
      totalAsset,
      totalLiabEq: roundYi(row.TOTAL_LIAB_EQUITY || row.TOTAL_ASSETS),
    };
  });
}

function buildExpectedCashFlow(rows) {
  return YEARS.map((year) => {
    const row = rows[year];
    const operating = roundYi(row.NETCASH_OPERATE);
    const investing = roundYi(row.NETCASH_INVEST);
    const financing = roundYi(row.NETCASH_FINANCE);
    const freeCashFlow = roundYi((row.NETCASH_OPERATE || 0) - (row.CONSTRUCT_LONG_ASSET || 0));

    return {
      year,
      operating,
      investing,
      financing,
      freeCashFlow,
      dividendPaid: -roundYi(row.ASSIGN_DIVIDEND_PORFIT),
      balance: roundYi(row.END_CASH || row.END_CCE),
    };
  });
}

function buildExpectedLatestMetrics(incomeRows, balanceRows, cashRows) {
  const latestIncome = incomeRows['2025'];
  const previousIncome = incomeRows['2024'];
  const latestBalance = balanceRows['2025'];
  const previousBalance = balanceRows['2024'];
  const latestCash = cashRows['2025'];

  const revenue = roundYi(latestIncome.TOTAL_OPERATE_INCOME);
  const profit = roundYi(latestIncome.PARENT_NETPROFIT);
  const interestBearingDebt = roundYi(
    (latestBalance.SHORT_LOAN || 0) +
    (latestBalance.NONCURRENT_LIAB_1YEAR || 0) +
    (latestBalance.LONG_LOAN || 0) +
    (latestBalance.BOND_PAYABLE || 0) +
    (latestBalance.LEASE_LIAB || 0),
  );
  const previousInterestBearingDebt =
    (previousBalance.SHORT_LOAN || 0) +
    (previousBalance.NONCURRENT_LIAB_1YEAR || 0) +
    (previousBalance.LONG_LOAN || 0) +
    (previousBalance.BOND_PAYABLE || 0) +
    (previousBalance.LEASE_LIAB || 0);
  const totalLiabilities = roundYi(latestBalance.TOTAL_LIABILITIES);
  const totalAssets = roundYi(latestBalance.TOTAL_ASSETS);
  const shortDebt = roundYi((latestBalance.SHORT_LOAN || 0) + (latestBalance.NONCURRENT_LIAB_1YEAR || 0));
  const cash = roundYi(latestBalance.MONETARYFUNDS);
  const totalProfit = roundYi(latestIncome.TOTAL_PROFIT);
  const financeExpense = roundYi(latestIncome.FINANCE_EXPENSE);
  const taxRate = Number(latestIncome.INCOME_TAX || 0) / Number(latestIncome.TOTAL_PROFIT || 1);
  const nopat = (totalProfit + financeExpense) * (1 - taxRate);
  const averageEquity = (Number(latestBalance.TOTAL_EQUITY || 0) + Number(previousBalance.TOTAL_EQUITY || 0)) / 2;
  const averageDebt = (Number(
    (latestBalance.SHORT_LOAN || 0) +
    (latestBalance.NONCURRENT_LIAB_1YEAR || 0) +
    (latestBalance.LONG_LOAN || 0) +
    (latestBalance.BOND_PAYABLE || 0) +
    (latestBalance.LEASE_LIAB || 0),
  ) + previousInterestBearingDebt) / 2;
  const averageCash = (Number(latestBalance.MONETARYFUNDS || 0) + Number(previousBalance.MONETARYFUNDS || 0)) / 2;

  return {
    revenue,
    revenueGrowth: round(((Number(latestIncome.TOTAL_OPERATE_INCOME || 0) / Number(previousIncome.TOTAL_OPERATE_INCOME || 1)) - 1) * 100),
    grossMargin: round(((Number(latestIncome.TOTAL_OPERATE_INCOME || 0) - Number(latestIncome.OPERATE_COST || 0)) / Number(latestIncome.TOTAL_OPERATE_INCOME || 1)) * 100),
    netMargin: round((Number(latestIncome.PARENT_NETPROFIT || 0) / Number(latestIncome.TOTAL_OPERATE_INCOME || 1)) * 100),
    deductedNetProfit: roundYi(latestIncome.DEDUCT_PARENT_NETPROFIT),
    expenseRatio: round(((Number(latestIncome.SALE_EXPENSE || 0) + Number(latestIncome.MANAGE_EXPENSE || 0) + Number(latestIncome.RESEARCH_EXPENSE || 0) + Number(latestIncome.FINANCE_EXPENSE || 0)) / Number(latestIncome.TOTAL_OPERATE_INCOME || 1)) * 100),
    operatingCashFlow: roundYi(latestCash.NETCASH_OPERATE),
    operatingCashFlowToNetProfit: round(roundYi(latestCash.NETCASH_OPERATE) / profit),
    accountsReceivable: roundYi(latestBalance.ACCOUNTS_RECE),
    inventory: roundYi(latestBalance.INVENTORY),
    contractLiability: roundYi(latestBalance.CONTRACT_LIAB),
    debtRatio: round((totalLiabilities / totalAssets) * 100),
    interestBearingDebt,
    cash,
    shortDebtToCash: round(shortDebt / cash),
    goodwill: roundYi(latestBalance.GOODWILL),
    roe: round((Number(latestIncome.PARENT_NETPROFIT || 0) / averageEquity) * 100),
    roic: round((nopat / roundYi(averageEquity + averageDebt - averageCash)) * 100),
    researchExpense: roundYi(latestIncome.RESEARCH_EXPENSE),
    capitalExpenditure: roundYi(latestCash.CONSTRUCT_LONG_ASSET),
    payoutRatio: round((Number(latestCash.ASSIGN_DIVIDEND_PORFIT || 0) / Number(latestIncome.PARENT_NETPROFIT || 1)) * 100),
    eps: Number(latestIncome.BASIC_EPS),
  };
}

function buildExpectedMetricTrendRows(incomeRows, balanceRows, cashRows) {
  return YEARS.map((year, index) => {
    const latestIncome = incomeRows[year];
    const previousIncome = incomeRows[YEARS[index - 1]];
    const latestBalance = balanceRows[year];
    const previousBalance = balanceRows[YEARS[index - 1]];
    const latestCash = cashRows[year];

    const revenue = roundYi(latestIncome.TOTAL_OPERATE_INCOME);
    const profit = roundYi(latestIncome.PARENT_NETPROFIT);
    const interestBearingDebt = roundYi(
      (latestBalance.SHORT_LOAN || 0) +
      (latestBalance.NONCURRENT_LIAB_1YEAR || 0) +
      (latestBalance.LONG_LOAN || 0) +
      (latestBalance.BOND_PAYABLE || 0) +
      (latestBalance.LEASE_LIAB || 0),
    );
    const totalLiabilities = roundYi(latestBalance.TOTAL_LIABILITIES);
    const totalAssets = roundYi(latestBalance.TOTAL_ASSETS);
    const cash = roundYi(latestBalance.MONETARYFUNDS);
    const shortDebt = roundYi((latestBalance.SHORT_LOAN || 0) + (latestBalance.NONCURRENT_LIAB_1YEAR || 0));

    let roe = 0;
    let roic = 0;
    if (previousBalance) {
      const averageEquity = (Number(latestBalance.TOTAL_EQUITY || 0) + Number(previousBalance.TOTAL_EQUITY || 0)) / 2;
      const currentDebt =
        (latestBalance.SHORT_LOAN || 0) +
        (latestBalance.NONCURRENT_LIAB_1YEAR || 0) +
        (latestBalance.LONG_LOAN || 0) +
        (latestBalance.BOND_PAYABLE || 0) +
        (latestBalance.LEASE_LIAB || 0);
      const previousDebt =
        (previousBalance.SHORT_LOAN || 0) +
        (previousBalance.NONCURRENT_LIAB_1YEAR || 0) +
        (previousBalance.LONG_LOAN || 0) +
        (previousBalance.BOND_PAYABLE || 0) +
        (previousBalance.LEASE_LIAB || 0);
      const averageDebt = (Number(currentDebt) + Number(previousDebt)) / 2;
      const averageCash = (Number(latestBalance.MONETARYFUNDS || 0) + Number(previousBalance.MONETARYFUNDS || 0)) / 2;
      const totalProfit = roundYi(latestIncome.TOTAL_PROFIT);
      const financeExpense = roundYi(latestIncome.FINANCE_EXPENSE);
      const taxRate = Number(latestIncome.INCOME_TAX || 0) / Number(latestIncome.TOTAL_PROFIT || 1);
      const nopat = (totalProfit + financeExpense) * (1 - taxRate);

      roe = round((Number(latestIncome.PARENT_NETPROFIT || 0) / averageEquity) * 100);
      roic = round((nopat / roundYi(averageEquity + averageDebt - averageCash)) * 100);
    }

    return {
      year,
      revenue,
      revenueGrowth: previousIncome ? round(((Number(latestIncome.TOTAL_OPERATE_INCOME || 0) / Number(previousIncome.TOTAL_OPERATE_INCOME || 1)) - 1) * 100) : 0,
      grossMargin: round(((Number(latestIncome.TOTAL_OPERATE_INCOME || 0) - Number(latestIncome.OPERATE_COST || 0)) / Number(latestIncome.TOTAL_OPERATE_INCOME || 1)) * 100),
      netMargin: round((Number(latestIncome.PARENT_NETPROFIT || 0) / Number(latestIncome.TOTAL_OPERATE_INCOME || 1)) * 100),
      deductedNetProfit: roundYi(latestIncome.DEDUCT_PARENT_NETPROFIT),
      expenseRatio: round(((Number(latestIncome.SALE_EXPENSE || 0) + Number(latestIncome.MANAGE_EXPENSE || 0) + Number(latestIncome.RESEARCH_EXPENSE || 0) + Number(latestIncome.FINANCE_EXPENSE || 0)) / Number(latestIncome.TOTAL_OPERATE_INCOME || 1)) * 100),
      operatingCashFlow: roundYi(latestCash.NETCASH_OPERATE),
      operatingCashFlowToNetProfit: round(roundYi(latestCash.NETCASH_OPERATE) / profit),
      accountsReceivable: roundYi(latestBalance.ACCOUNTS_RECE),
      inventory: roundYi(latestBalance.INVENTORY),
      contractLiability: roundYi(latestBalance.CONTRACT_LIAB),
      debtRatio: round((totalLiabilities / totalAssets) * 100),
      interestBearingDebt,
      cash,
      shortDebtToCash: round(shortDebt / cash),
      goodwill: roundYi(latestBalance.GOODWILL),
      roe,
      roic,
      researchExpense: roundYi(latestIncome.RESEARCH_EXPENSE),
      capitalExpenditure: roundYi(latestCash.CONSTRUCT_LONG_ASSET),
      payoutRatio: round((Number(latestCash.ASSIGN_DIVIDEND_PORFIT || 0) / Number(latestIncome.PARENT_NETPROFIT || 1)) * 100),
      eps: Number(Number(latestIncome.BASIC_EPS || 0).toFixed(2)),
    };
  });
}

function compareSection(sectionName, localRows, expectedRows) {
  const failures = [];

  for (const expected of expectedRows) {
    const local = localRows.find((row) => row.year === expected.year);
    if (!local) {
      failures.push(`${sectionName} ${expected.year}: missing local row`);
      continue;
    }

    for (const [key, expectedValue] of Object.entries(expected)) {
      if (key === 'year') continue;
      const localValue = Number(local[key]);
      const diff = round(localValue - Number(expectedValue));
      if (Math.abs(diff) > TOLERANCE) {
        failures.push(`${sectionName} ${expected.year}.${key}: local=${localValue}, expected=${expectedValue}, diff=${diff}`);
      }
    }
  }

  return failures;
}

async function main() {
  const source = await fs.readFile(constantsPath, 'utf8');
  const localIncome = extractExportedArray(source, 'INCOME_DATA');
  const localBalance = extractExportedArray(source, 'BALANCE_DATA');
  const localCashFlow = extractExportedArray(source, 'CASH_FLOW_DATA');
  const localLatestMetrics = extractExportedObject(source, 'LATEST_METRICS');
  const localMetricTrend = extractExportedArray(source, 'METRIC_TREND_DATA');

  const [incomeRows, balanceRows, cashRows] = await Promise.all([
    fetchEastmoney('RPT_F10_FINANCE_GINCOME'),
    fetchEastmoney('RPT_F10_FINANCE_GBALANCE'),
    fetchEastmoney('RPT_F10_FINANCE_GCASHFLOW'),
  ]);

  const expectedIncome = buildExpectedIncome(incomeRows);
  const expectedBalance = buildExpectedBalance(balanceRows);
  const expectedCashFlow = buildExpectedCashFlow(cashRows);
  const expectedLatestMetrics = buildExpectedLatestMetrics(incomeRows, balanceRows, cashRows);
  const expectedMetricTrend = buildExpectedMetricTrendRows(incomeRows, balanceRows, cashRows);

  const failures = [
    ...compareSection('income', localIncome, expectedIncome),
    ...compareSection('balance', localBalance, expectedBalance),
    ...compareSection('cashFlow', localCashFlow, expectedCashFlow),
    ...compareSection('latestMetrics', [localLatestMetrics], [{ year: localLatestMetrics.year, ...expectedLatestMetrics }]),
    ...compareSection('metricTrend', localMetricTrend, expectedMetricTrend),
  ];

  console.log('300179 四方达财报图表数据交叉校验');
  console.log(`校验口径：东方财富 F10 结构化财务报表，单位换算为亿元，容差 ±${TOLERANCE} 亿`);
  console.log('年报 PDF 备查链接：');
  for (const year of YEARS) {
    console.log(`- ${year}: ${annualReportLinks[year]}`);
  }

  if (failures.length) {
    console.log('\n结果：未通过');
    failures.forEach((failure) => console.log(`- ${failure}`));
    process.exitCode = 1;
    return;
  }

  console.log('\n结果：通过。网页 constants.ts 与校验源一致。');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
