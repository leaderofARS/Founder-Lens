# 🔍 Founder-Lens

> **A Forensic Decision Intelligence Tool for Predicting Startup Success.**
> Founder-Lens is a machine learning research project that identifies high-potential startups by correlating historical financial data with real-world forensic signals — integrating live market momentum, labor cost benchmarks, and regulatory transparency indicators far beyond what any static dataset can reveal.

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-39ff6b?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active%20Research-ff3d57?style=flat-square)
![Data](https://img.shields.io/badge/Dataset-10M%2B%20Rows-00e5ff?style=flat-square)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
- [Data Engine: The Harvester](#-data-engine-the-harvester)
- [Research & Methodology](#-research--methodology)
- [Tech Stack](#-tech-stack)
- [Upcoming Milestones](#-upcoming-milestones)
- [License](#-license)

---

## 🧭 Overview

Traditional startup analysis relies on narrative pitch decks and lagging indicators. Founder-Lens takes a different approach — applying **forensic intelligence** to the signals that founders cannot fabricate:

- **Market Momentum** via Alpha Vantage (QQQ / Nasdaq live & historical data)
- **Labor Cost Benchmarks** via the Bureau of Labor Statistics (CPI + Tech Salary trends)
- **Regulatory Transparency** via SEC EDGAR (10-K Risk Factor extraction, filing cadence)

These live signals are harmonized with a curated corpus of 60,000+ historical startup outcomes to train a viability classifier that audits early-stage companies on evidence, not narrative.

---

## 🏗 Repository Structure

```
founder-lens/
│
├── backend/    
├── frontend/
│
├── research/
│   ├── notebooks/
│   │
│   ├── scripts/
│   │
│   └── data/
│       ├── raw/
│       │
│       └── processed/
│
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure the following are available before setup:

- **Python 3.11+**
- **Kaggle API Credentials** — required for `kagglehub` dataset access
- **API Keys** for the following services:

| Service | Purpose | Obtain At |
|---|---|---|
| **Alpha Vantage** | Live & historical market data (QQQ, AAPL) | [alphavantage.co](https://www.alphavantage.co/support/#api-key) |
| **SEC-API.io** | Regulatory forensics — 10-K Item 1A extraction | [sec-api.io](https://sec-api.io) |
| **BLS Public API** | Labor cost indices & tech salary benchmarks | [bls.gov/developers](https://www.bls.gov/developers/) |

---

### 2. Installation

**Clone the repository:**

```bash
git clone https://github.com/leaderofARS/Founder-Lens.git
cd Founder-Lens
```

**Create and activate a virtual environment:**

```bash
python -m venv .venv
source .venv/bin/activate        # macOS / Linux
.venv\Scripts\activate           # Windows
```

**Install dependencies:**

```bash
pip install -r backend/requirements.txt
```

**Configure your environment:**

Create a `.env` file inside the `backend/` directory:

```env
# ── Market Intelligence ──────────────────────────────
ALPHA_VANTAGE_KEY=your_alpha_vantage_key

# ── SEC Forensics ────────────────────────────────────
SEC_API_KEY=your_sec_api_key

# ── Labor Benchmarks ─────────────────────────────────
BLS_API_KEY=your_bls_api_key

# ── Dataset Access ───────────────────────────────────
KAGGLE_USERNAME=your_kaggle_username
KAGGLE_KEY=your_kaggle_api_key
```

> ⚠️ The `.env` file is listed in `.gitignore` by default and must **never** be committed to version control.

---

## 📡 Data Engine: The Harvester

The `research/scripts/harvester.py` script is the core of the **Live Signal** system. It is engineered to operate continuously — including on non-trading days — through **historical randomization**, ensuring the model is always exposed to diverse market conditions regardless of when it runs.

### Signal Sources

**Market Context — `market_harvester.py`**

Pulls 20 years of daily OHLCV history for QQQ to simulate a full range of bull, bear, and sideways market conditions. On weekends or market-closed hours, the harvester samples a random historical trading day to generate a valid signal without stalling the pipeline.

**Labor Benchmarks — `labor_harvester.py`**

Samples 10-year CPI and Tech Salary trends from the Bureau of Labor Statistics. These benchmarks feed the **Burn Efficiency Score**, normalizing startup funding totals against real-world regional hiring costs (INR and USD).

**SEC Forensics — `sec_harvester.py`**

Uses the SEC-API Extractor to pull **Item 1A (Risk Factors)** from benchmark 10-K filings — initially seeded with large-cap anchors (MSFT, GOOGL) and extended to startups via CIK lookup with automatic fallback resolution.

### Running the Harvester

```bash
# Run the full harvesting pipeline (all three sources)
python research/scripts/harvester.py

# Run individual harvesters
python research/scripts/market_harvester.py
python research/scripts/sec_harvester.py
python research/scripts/labor_harvester.py
```

> **Append-Only Design:** All harvester outputs are appended to rolling log files in `research/data/raw/`. Logs are never overwritten, preserving full time-series integrity for model training.

---

## 📊 Research & Methodology

### Phase 1 — Ingestion (`01_ingestion.ipynb`)

The **Master Ingestor** notebook pulls over **10M+ rows** of historical data from Kaggle via `kagglehub`, forming the static backbone of the training corpus:

| Dataset | Rows | Description |
|---|---|---|
| Crunchbase Startup Records | ~60,000 | Success/failure labels, funding totals, founding dates |
| Nasdaq 100 Historical Prices | ~5M+ | Daily OHLCV for all Nasdaq-100 constituents (2000–2026) |
| SEC EDGAR Filing Index | ~4M+ | Partitioned Parquet indices of all filings (1993–2026) |
| India Job Market & Salary Trends 2026 | ~50,000 | Regional tech salary benchmarks for INR burn calculations |

All raw data is written to `research/data/raw/` and treated as **immutable** — downstream notebooks read from this directory but never modify it.

---

### Phase 2 — Exploratory Data Analysis (`02_eda.ipynb`)

Key questions examined during EDA:

- What is the success/failure label distribution across industry verticals and founding years?
- How does funding stage (Seed vs. Series A/B) correlate with survival rates?
- Are there market-cycle patterns — do startups founded during high-volatility periods perform differently?
- Which geographies show the strongest burn efficiency relative to funding totals?

---

### Phase 3 — Feature Engineering (`03_feature_engineering.ipynb`)

The **Harmonizer** logic merges the static Kaggle training corpus with dynamic live signals to produce the final feature matrix. Three forensic features are central to the model:

**1. Market Sentiment Index**

Measures the macro environment at the time of a startup's founding by computing the ratio of the founding-date closing price of QQQ to its 30-day moving average. A value above 1.0 indicates the startup launched in a bullish regime; below 1.0 flags a recessionary or volatile founding context.

```
Market Sentiment Index = QQQ_close(founding_date) / QQQ_30d_MA(founding_date)
```

**2. Burn Efficiency Score**

Benchmarks a startup's total funding against regional industry salary data to estimate how many months of engineering runway the capital represents. Calculated separately for INR (India) and USD (US) cohorts using BLS and India Salary 2026 benchmarks.

```
Burn Efficiency Score = total_funding_usd / (avg_local_tech_salary_annual × headcount_estimate)
```

**3. Regulatory Pulse**

Counts the number of SEC filings associated with a company or its known institutional backers as a proxy for regulatory maturity and institutional transparency. Companies backed by investors with strong SEC disclosure histories receive a higher Regulatory Pulse score.

```
Regulatory Pulse = count(SEC_filings) / years_since_founding
```

---

### Phase 4 — Model Training (`04_model_training.ipynb`)

The harmonized feature matrix feeds an **XGBoost** binary classifier trained to predict startup success (1) or failure (0).

**Target variable:** `is_successful` — derived from Crunchbase outcome labels (IPO / Acquired = 1, Closed / Zombie = 0)

**Feature set:**

```
market_sentiment_index      burn_efficiency_score       regulatory_pulse
cpi_adjusted_runway         total_funding_usd           funding_rounds
days_to_series_a            industry_vertical_encoded   founding_year
founder_count               country_encoded             sec_transparency_score
```

**Validation strategy:** Stratified 5-fold cross-validation with temporal holdout — all startups founded after 2022 are withheld as a final out-of-sample test set to prevent data leakage from market regime overlap.

---

## 🛠 Tech Stack

| Category | Tools |
|---|---|
| **Data Science** | `pandas`, `numpy`, `pyarrow` (Parquet / Big Data) |
| **Machine Learning** | `xgboost`, `scikit-learn` |
| **NLP** *(upcoming)* | `google-generativeai` (Gemini) for SEC Risk Factor sentiment |
| **APIs & Data Access** | `kagglehub`, `requests`, `sec-api`, `python-dotenv` |
| **Environment** | JupyterLab, Python 3.11, virtualenv |
| **Code Quality** | `black` (formatting), `pytest` (unit tests) |

---

## 🗺 Upcoming Milestones

- [ ] **NLP Sentiment Analysis** — Implement Gemini-powered scoring of SEC Item 1A Risk Factor text to detect language drift and founder-filing divergence
- [ ] **XGBoost Classifier** — Train and evaluate the binary success/failure prediction model with full cross-validation and SHAP explainability
- [ ] **Streamlit Dashboard** — Deploy a real-time founder auditing interface that accepts a company name or CIK and returns a forensic viability report
- [ ] **Founder-Market Fit Signal** — Join social media sentiment data to founder profiles to quantify narrative-market alignment
- [ ] **API Integration** — Connect the trained model to the FastAPI backend for programmatic access via REST and GraphQL

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for full details.

---

<div align="center">

**Founder-Lens** · ML Research Project · Built with Python 3.11

*Forensic intelligence for the venture ecosystem — because data doesn't lie.*

</div>