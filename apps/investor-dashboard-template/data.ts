
import { InvestorProfile } from './types';

// NOTE: This data is a simulation based on Q3 2024 13F filings and recent public disclosures.
// In a real production app, this would be fetched from a live backend.

export const INVESTORS_DATA: InvestorProfile[] = [
  {
    id: "buffett",
    name: "沃伦·巴菲特",
    name_en: "Warren Buffett",
    firm: "伯克希尔·哈撒韦 (Berkshire Hathaway)",
    avatar_color: "bg-blue-600",
    report_date: "2024-09-30",
    source: "SEC 13F Q3 2024",
    retrieved_at: "2025-02-23",
    analysis_summary: `
### 核心变化
巴菲特在Q3继续**大幅减持**核心资产。最引人注目的是对**苹果 (AAPL)** 的减持，持仓减少了约25%，同时基本清仓了**美国银行 (BAC)**。

### 新进关注
令人意外的是，伯克希尔建仓了**达美乐比萨 (DPZ)** 和 **Pool Corp (POOL)**，这显示出他对消费和美国本土服务业的某种防御性看好。

### 现金储备
伯克希尔的现金储备已突破3000亿美元大关，显示出巴菲特在当前美股估值下的极度谨慎态度。
    `,
    holdings: [
      { ticker: "AAPL", name: "苹果公司", market: "US", activity: "reduce", position_pct: 28.0, note: "减持约1亿股" },
      { ticker: "AXP", name: "美国运通", market: "US", activity: "unchanged", position_pct: 13.5 },
      { ticker: "BAC", name: "美国银行", market: "US", activity: "reduce", position_pct: 10.1, note: "持续减持" },
      { ticker: "KO", name: "可口可乐", market: "US", activity: "unchanged", position_pct: 9.2 },
      { ticker: "CVX", name: "雪佛龙", market: "US", activity: "reduce", position_pct: 5.8 },
      { ticker: "DPZ", name: "达美乐比萨", market: "US", activity: "new", note: "新建仓约130万股" },
      { ticker: "POOL", name: "Pool Corp", market: "US", activity: "new", note: "新建仓泳池供应链" },
      { ticker: "ULTA", name: "Ulta Beauty", market: "US", activity: "sold", note: "几乎清仓" }
    ]
  },
  {
    id: "lilu",
    name: "李录",
    name_en: "Li Lu",
    firm: "喜马拉雅资本 (Himalaya Capital)",
    avatar_color: "bg-red-600",
    report_date: "2024-09-30",
    source: "SEC 13F Q3 2024",
    retrieved_at: "2025-02-23",
    analysis_summary: `
### 投资风格
李录作为查理·芒格家族资产的管理者，投资风格极度精简且长情。Q3投资组合几乎没有变化，展示了典型的“买入并持有”策略。

### 重点持仓
继续重仓**谷歌 (GOOG)** 和 **美国银行 (BAC)**（注：与巴菲特不同，李录未减持BAC）。他对中国资产的配置主要体现在港股（未完全显示在13F），但其长期持有的**华美银行**反映了对华裔经济圈的看好。
    `,
    holdings: [
      { ticker: "GOOG", name: "谷歌", market: "US", activity: "unchanged", position_pct: 42.0 },
      { ticker: "BAC", name: "美国银行", market: "US", activity: "unchanged", position_pct: 28.5 },
      { ticker: "EWBC", name: "华美银行", market: "US", activity: "unchanged", position_pct: 18.2 },
      { ticker: "BRK.B", name: "伯克希尔", market: "US", activity: "unchanged", position_pct: 11.3 }
    ]
  },
  {
    id: "hhlr",
    name: "高瓴资本",
    name_en: "Hillhouse (HHLR)",
    firm: "HHLR Advisors",
    avatar_color: "bg-emerald-600",
    report_date: "2024-09-30",
    source: "SEC 13F Q3 2024",
    retrieved_at: "2025-02-23",
    analysis_summary: `
### 中概股回归
高瓴在Q3大幅加仓中国资产。**阿里巴巴 (BABA)** 成为其头号重仓股，增持幅度显著。同时，对**百济神州**、**贝壳**等行业龙头保持高配。

### 科技关注
除了中概股，HHLR对美国科技巨头如亚马逊、微软等也有配置，但核心重心明显向估值较低的中国互联网龙头倾斜，押注中国资产反弹。
    `,
    holdings: [
      { ticker: "BABA", name: "阿里巴巴", market: "US", activity: "add", position_pct: 22.1, note: "大幅增持" },
      { ticker: "PDD", name: "拼多多", market: "US", activity: "reduce", position_pct: 12.4 },
      { ticker: "BGNE", name: "百济神州", market: "US", activity: "unchanged", position_pct: 11.0 },
      { ticker: "BEKE", name: "贝壳", market: "US", activity: "add", position_pct: 6.5 },
      { ticker: "VIPS", name: "唯品会", market: "US", activity: "add", position_pct: 4.2 },
      { ticker: "BILI", name: "哔哩哔哩", market: "US", activity: "sold", note: "清仓/大幅减持" }
    ]
  },
  {
    id: "duan",
    name: "段永平",
    name_en: "Duan Yongping",
    firm: "H&H International",
    avatar_color: "bg-orange-500",
    report_date: "2024-09-30",
    source: "SEC 13F Q3 2024",
    retrieved_at: "2025-02-23",
    analysis_summary: `
### 抄作业之王
段永平的账户H&H International高度复制巴菲特的作业，但在**苹果**上持有更坚定。尽管巴菲特减持，H&H的苹果仓位依然极重。

### 腾讯真爱
虽然13F只显示美股（如**拼多多**、**西方石油**），但段永平在社交媒体频繁表示对**腾讯 (00700.HK)** 的买入和持有，腾讯实际上是其隐形第一大仓位之一。
    `,
    holdings: [
      { ticker: "AAPL", name: "苹果公司", market: "US", activity: "reduce", position_pct: 75.0, note: "随大流小幅减持" },
      { ticker: "BRK.B", name: "伯克希尔", market: "US", activity: "add", position_pct: 12.0 },
      { ticker: "GOOG", name: "谷歌", market: "US", activity: "unchanged", position_pct: 5.5 },
      { ticker: "BABA", name: "阿里巴巴", market: "US", activity: "add", position_pct: 4.0 },
      { ticker: "PDD", name: "拼多多", market: "US", activity: "new", note: "Q3新建仓/增持" },
      { ticker: "OXY", name: "西方石油", market: "US", activity: "add", position_pct: 2.0 }
    ]
  },
  {
    id: "zhangkun",
    name: "张坤",
    name_en: "Zhang Kun",
    firm: "易方达基金 (E Fund)",
    avatar_color: "bg-indigo-600",
    report_date: "2024-09-30",
    source: "基金三季报",
    retrieved_at: "2025-02-23",
    analysis_summary: `
### 消费坚守
张坤依然是“白酒+互联网”的坚定持有者。前十大重仓股中，**五粮液**、**茅台**占据绝对核心。

### 港股互联网
他对港股互联网龙头（腾讯、阿里）的配置依然很高，认为目前估值具有极高的赔率。操作上整体换手率极低，维持高仓位运行，静待消费复苏。
    `,
    holdings: [
      { ticker: "000858", name: "五粮液", market: "SZ", activity: "add", position_pct: 9.8 },
      { ticker: "00700", name: "腾讯控股", market: "HK", activity: "unchanged", position_pct: 9.5 },
      { ticker: "600519", name: "贵州茅台", market: "SH", activity: "unchanged", position_pct: 9.2 },
      { ticker: "09988", name: "阿里巴巴-W", market: "HK", activity: "add", position_pct: 8.5 },
      { ticker: "000568", name: "泸州老窖", market: "SZ", activity: "reduce", position_pct: 7.0 },
      { ticker: "00883", name: "中国海洋石油", market: "HK", activity: "unchanged", position_pct: 6.0 }
    ]
  },
  {
    id: "jinglin",
    name: "景林资产",
    name_en: "Greenwoods",
    firm: "景林 (Jinglin)",
    avatar_color: "bg-green-700",
    report_date: "2024-09-30",
    source: "SEC 13F Q3 2024",
    retrieved_at: "2025-02-23",
    analysis_summary: `
### 拼多多第一大仓
景林继续重仓**拼多多 (PDD)**，尽管股价波动，但仍是其第一大重仓股。

### 增持中概互联
Q3景林大幅增持了**中通快递**和**腾讯音乐**，显示出对中国细分行业龙头的看好。同时也建仓了部分**苹果**，增加了科技股的配置。
    `,
    holdings: [
      { ticker: "PDD", name: "拼多多", market: "US", activity: "unchanged", position_pct: 25.0, note: "第一大重仓" },
      { ticker: "META", name: "Meta", market: "US", activity: "reduce", position_pct: 10.5 },
      { ticker: "TSM", name: "台积电", market: "US", activity: "add", position_pct: 9.0 },
      { ticker: "ZTO", name: "中通快递", market: "US", activity: "add", position_pct: 6.5 },
      { ticker: "TME", name: "腾讯音乐", market: "US", activity: "add", position_pct: 4.0 },
      { ticker: "AAPL", name: "苹果公司", market: "US", activity: "new", note: "新建仓" }
    ]
  }
];

export const REPORT_DATE = "2024 Q3";
