# OpenClaw Stock Financial Dashboard

A React/Vite financial statement dashboard for investment research, company analysis, and finance product prototyping.

**中文介绍:** [README.md](README.md)

![Demo](docs/demo.gif)

## At A Glance

**Turn company financial statements into a forkable investment-research dashboard.**

- Useful for company analysis pages, finance content, CFO dashboards, and research memos.
- Income statement, cash flow, balance sheet, shareholder returns, and metric explanations are already structured as a product UI.
- Replace the data and reuse the interface instead of rebuilding chart scaffolding from scratch.

## Fork It In 30 Seconds

Fork it, edit the financial data in `apps/financial-report-visualizer`, and ship your own company dashboard.

> If this saves you from rebuilding the same product skeleton later, consider starring the repo.

## Screenshots

The four screenshots below come from the actual rendered Chinese pages in this repository: the opening screen, the scrolled second screen, and two additional feature-focused views. They are real UI captures, not concept art or English placeholder mockups.

| Opening Screen | Scrolled Screen |
|---|---|
| ![Opening screen](docs/screenshot-2.png) | ![Scrolled screen](docs/screenshot-3.png) |
| ![Feature screenshot one](docs/screenshot-4.png) | ![Feature screenshot two](docs/screenshot-5.png) |

## What This System Does

This is a product-oriented financial dashboard template. It turns company financial statements into a readable research interface with charts, metrics, commentary blocks, and investor-facing page structure.

## Core Features

- **Company summary header** with stock identity, business tags, revenue, margin, and cash-flow highlights.
- **Income statement visualization** for revenue, gross profit, expenses, and profitability trends.
- **Cash-flow analysis** covering operating, investing, financing, and free cash-flow paths.
- **Balance-sheet structure** for assets, liabilities, cash, inventory, and receivables.
- **Metric interpretation blocks** that explain what the numbers imply instead of only plotting charts.
- **Investor dashboard baseline** for shareholder return, valuation, consensus, and company research pages.
- **Two reusable app shells**: one chart-focused financial visualizer and one investor-facing dashboard template.
- **Validation script entry point** for checking financial data consistency as the project grows.

## Good Fit For

- Public-company financial dashboards
- Investment research pages
- Industry comparison tools
- Internal finance analysis dashboards
- Finance UI component studies

## Repository Structure

- `apps/financial-report-visualizer`: React/Vite financial visualization app.
- `apps/investor-dashboard-template`: investor-facing company dashboard baseline.
- `docs/`: screenshots and GitHub preview assets.

## Quick Start

```bash
cd apps/financial-report-visualizer
npm install
npm run dev
```

## Public-Safe Version

Private deployment URLs, production credentials, Cloudflare tokens, local environment files, logs, `.wrangler`, `node_modules`, and non-public material were removed before publication.

## Why Star This

Star this repository if you want a practical product pattern that can be studied, forked, customized, and turned into your own dashboard, content system, knowledge portal, or interactive tool.
