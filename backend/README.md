# 🔬 Founder-Lens — Backend Intelligence Engine

> **Forensic decision intelligence for startup viability auditing.**
> This is the core backend powering Founder-Lens — handling real-time data ingestion, SEC forensic analysis, market sentiment scoring, and the API layer that serves the frontend dashboard.

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [System Architecture](#-system-architecture)
- [Data Harvesters](#-data-harvesters)
- [Forensic Harmonizer](#-forensic-harmonizer)
- [LLM Analysis Layer](#-llm-analysis-layer-gemini)
- [API Endpoints](#-api-endpoints)
- [Data Pipeline Structure](#-data-pipeline-structure)
- [Contributing](#-contributing)

---

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in the `backend/` directory and populate it with your credentials:

```env
# ── Market Intelligence ──────────────────────────────
ALPHA_VANTAGE_KEY=your_alpha_vantage_api_key

# ── SEC Forensics ────────────────────────────────────
SEC_API_KEY=your_sec_api_io_key

# ── LLM Layer ────────────────────────────────────────
GEMINI_API_KEY=your_google_gemini_api_key

# ── Data Access ──────────────────────────────────────
KAGGLE_USERNAME=your_kaggle_username
KAGGLE_KEY=your_kaggle_api_key

# ── Server Config ────────────────────────────────────
PORT=8000
DEBUG=false
```

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore` by default.

---

### 2. Installation

We recommend using a virtual environment to isolate dependencies:

```bash
# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate          # macOS / Linux
.venv\Scripts\activate             # Windows

# Install all dependencies
pip install -r requirements.txt
```

**Core dependencies include:**

| Package | Purpose |
|---|---|
| `fastapi` | REST & GraphQL API server |
| `pandas` | Data harmonization & feature engineering |
| `requests` | HTTP calls to Alpha Vantage, BLS, SEC-API |
| `pyarrow` | Reading Parquet datasets (SEC EDGAR) |
| `kagglehub` | Programmatic access to Kaggle datasets |
| `google-generativeai` | Gemini LLM integration |
| `python-dotenv` | Environment variable management |
| `black` | Code formatting (dev dependency) |

---

### 3. Running the Engine

```bash
# Start the backend API server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Run the full data harvesting pipeline manually
python ../research/scripts/harvester.py

# Run only the SEC forensic harvester
python ../research/scripts/sec_harvester.py

# Run the Forensic Harmonizer to regenerate training features
python ../research/scripts/feature_engineer.py
```

The API will be available at `http://localhost:8000` with interactive docs at `http://localhost:8000/docs`.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FOUNDER-LENS BACKEND                    │
│                                                             │
│   ┌─────────────┐    ┌──────────────┐    ┌──────────────┐  │
│   │   DATA      │    │  FORENSIC    │    │     API      │  │
│   │ HARVESTERS  │───▶│ HARMONIZER   │───▶│    LAYER     │  │
│   │             │    │              │    │              │  │
│   │ · Market    │    │ · Feature    │    │ · REST       │  │
│   │ · SEC       │    │   Engineer   │    │ · GraphQL    │  │
│   │ · Labor     │    │ · LLM Layer  │    │ · WebSocket  │  │
│   └─────────────┘    └──────────────┘    └──────────────┘  │
│          │                  │                    │          │
│          ▼                  ▼                    ▼          │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              research/data/ (Shared Store)          │  │
│   │  raw/crunchbase · raw/nasdaq · raw/sec · raw/bls    │  │
│   └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

The backend maintains a strict **separation of concerns**: harvesters write only to `research/data/raw/`, the harmonizer reads raw data and writes to `research/data/processed/`, and the API layer serves only from processed outputs.

---

## 📡 Data Harvesters

Located in `../research/scripts/`, harvesters are triggered by the backend scheduler to fetch **Truth Signals** from authoritative external sources. All harvesters follow an **append-only** pattern to preserve time-series integrity.

### Market Harvester (`market_harvester.py`)

Fetches real-time and historical market data as proxies for tech-sector momentum.

- **Source:** Alpha Vantage API
- **Signals:** QQQ & AAPL daily OHLCV, rolling 20/50-day volatility, Nasdaq-100 momentum index
- **Output:** `research/data/raw/market_signals_log.csv` *(append-only)*
- **Fallback:** On weekends or market-closed hours, samples a random historical day from the last 20 years to maintain training diversity

```python
# Example: Triggering the market harvester from the backend
from research.scripts.market_harvester import MarketHarvester

harvester = MarketHarvester(api_key=os.getenv("ALPHA_VANTAGE_KEY"))
harvester.run(symbols=["QQQ", "AAPL"], mode="live")  # or mode="historical"
```

---

### SEC Harvester (`sec_harvester.py`)

Extracts qualitative and quantitative forensic signals from SEC regulatory filings.

- **Source:** SEC-API.io Extractor + SEC EDGAR Parquet indices (1993–2026)
- **Signals extracted:**
  - **Item 1A** — Risk Factors (full text for LLM analysis)
  - **Item 7** — Management Discussion & Analysis (OpEx trends)
  - **CIK Lookup** — Company identifier with automatic fallback resolution
- **Output:** `research/data/raw/sec_forensics_log.csv` *(append-only)*
- **Transparency Score:** Each filing is assigned a raw score based on disclosure completeness

> **CIK Fallback Rule:** All SEC extraction logic must utilize the CIK fallback mechanism. If a ticker-based lookup fails, the harvester automatically retries using the company's SEC Central Index Key to ensure reliability across renamed or delisted entities.

---

### Labor Harvester (`labor_harvester.py`)

Benchmarks startup operational costs against real-world labor market conditions.

- **Source:** Bureau of Labor Statistics (BLS) Public API
- **Signals:**
  - **CPI-U** — Consumer Price Index for inflation adjustment
  - **OES** — Occupational Employment Statistics for tech salary benchmarks
  - **India 2026 Salary Data** — Regional benchmarks for Burn Efficiency scoring
- **Output:** `research/data/raw/bls_benchmarks_log.csv` *(append-only)*

---

## 🧠 Forensic Harmonizer

The **Harmonizer** is the central intelligence layer. It fuses raw signals from all three harvesters with the Kaggle training corpus to produce the final feature matrix used for viability prediction.

### Harmonization Pipeline

```
Step 1: Load Kaggle Training Matrix
        research/data/raw/crunchbase_startups.csv
        → 60,000+ startup records with success/failure labels

Step 2: Inject Real-Time Signals
        market_signals_log.csv     → Market Sentiment Index
        sec_forensics_log.csv      → SEC Transparency Score
        bls_benchmarks_log.csv     → Burn Efficiency Score

Step 3: Feature Engineering
        → Normalize founding dates against historical volatility windows
        → Calculate per-company Burn Efficiency vs. regional salary benchmarks
        → Quantify SEC disclosure completeness into a 0–100 transparency score

Step 4: Output Processed Matrix
        research/data/processed/harmonized_features.parquet
```

### Engineered Features

| Feature | Description | Source |
|---|---|---|
| `sec_transparency_score` | Quantifies regulatory disclosure completeness (0–100) | SEC EDGAR |
| `burn_efficiency_score` | Funding total benchmarked against regional tech salaries | BLS + Crunchbase |
| `market_sentiment_index` | Founding-date normalized against 90-day market volatility | Alpha Vantage |
| `language_drift_delta` | YoY semantic shift in 10-K risk factor language | SEC + Gemini |
| `cpi_adjusted_runway` | Estimated runway in months, inflation-adjusted | BLS CPI |

---

## 🤖 LLM Analysis Layer (Gemini)

The backend uses **Google Gemini** to perform **Qualitative Forensics** — transforming unstructured text into structured, auditable risk signals that quantitative data alone cannot surface.

### Capabilities

**1. Pitch vs. Filing Divergence**

Compares language in a founder's pitch deck against the Risk Factors extracted from their SEC 10-K filings. Flags material discrepancies between what is promised to investors and what is disclosed to regulators.

```
Input:  [Founder Pitch Text] + [SEC Item 1A Risk Factor Text]
Output: Divergence Score (0–1), flagged clauses, risk summary
```

**2. Language Drift Detection**

Analyzes year-over-year semantic shifts in a company's 10-K filings. Significant drift in how a company describes its risks often precedes financial distress.

```
Input:  [10-K Filing Year N] + [10-K Filing Year N-1]
Output: Drift Delta Score, changed risk categories, trend classification
```

**3. Risk Factor Sentiment Scoring**

Assigns weighted sentiment to individual risk factors, distinguishing between boilerplate legal disclaimers and material operational risks.

---

## 🛠️ API Endpoints

The backend exposes a **FastAPI** server with both REST and GraphQL interfaces.

### REST Endpoints

```
GET  /health
     → Returns server status and last harvester run timestamps

POST /api/v1/audit
     Body: { "company_name": str, "cik": str (optional), "pitch_text": str (optional) }
     → Triggers a full forensic audit for a given company
     → Returns: viability_score, sec_transparency_score, burn_efficiency_score,
                market_sentiment_index, language_drift_delta, risk_summary

GET  /api/v1/market/snapshot
     → Returns latest QQQ/AAPL signals and Market Sentiment Index

GET  /api/v1/sec/{cik}/risk-factors
     → Returns extracted Item 1A text and transparency score for a given CIK

GET  /api/v1/labor/benchmarks
     Query params: ?region=india&year=2026
     → Returns CPI and salary benchmarks for burn efficiency calculations

GET  /api/v1/dataset/stats
     → Returns training corpus statistics (record count, label distribution, last updated)
```

### GraphQL Endpoint

```
POST /graphql

# Example query — full startup audit
query AuditStartup($cik: String!) {
  audit(cik: $cik) {
    companyName
    viabilityScore
    forensics {
      secTransparencyScore
      burnEfficiencyScore
      marketSentimentIndex
      languageDriftDelta
    }
    riskFactors {
      text
      sentimentScore
      category
    }
    pitchDivergence {
      divergenceScore
      flaggedClauses
    }
  }
}
```

---

## 📊 Data Pipeline Structure

The backend interacts with the `research/` folder through a strict one-way data flow, maintaining a clean separation of concerns between ingestion, processing, and serving.

```
research/
├── scripts/                        # Triggered by backend scheduler
│   ├── harvester.py                # Master harvester (runs all three)
│   ├── market_harvester.py
│   ├── sec_harvester.py
│   ├── labor_harvester.py
│   └── feature_engineer.py         # Forensic Harmonizer entry point
│
└── data/
    ├── raw/                        # Append-only. Never modified by backend.
    │   ├── crunchbase_startups.csv  # Kaggle training corpus (60k+ records)
    │   ├── nasdaq100_historical.parquet
    │   ├── sec_filings_index.parquet
    │   ├── market_signals_log.csv   # Rolling live market log
    │   ├── sec_forensics_log.csv    # Rolling SEC extraction log
    │   └── bls_benchmarks_log.csv   # Rolling labor benchmark log
    │
    └── processed/                  # Written by Harmonizer. Read by API.
        ├── harmonized_features.parquet
        └── model_predictions_cache.parquet
```

**Data flow rules:**

- `raw/` is **append-only**. Harvesters only ever append new rows — they never overwrite or delete existing records.
- `processed/` is **regenerated** on each Harmonizer run from the full raw history.
- The API layer reads **only** from `processed/`. It never touches `raw/` directly.
- The backend **never writes** to `research/data/` directly — only the harvester scripts may do so.

---

## 🤝 Contributing

Thank you for contributing to Founder-Lens. Please follow these guidelines to maintain data integrity and code quality across the engine.

### Rules for New Harvesters

1. **Append-Only Logic** — All new harvesters must append to existing log files rather than overwriting them. Time-series integrity is critical for the Harmonizer's feature engineering. Violating this corrupts the historical training signal.

2. **CIK Fallback Requirement** — All SEC extraction logic must implement the CIK fallback mechanism. If a ticker-based lookup fails, the harvester must automatically retry using the company's Central Index Key. This ensures reliability across renamed, merged, or delisted entities.

3. **Code Formatting** — Format all Python code using `black` before submitting a pull request:

```bash
black research/scripts/your_new_harvester.py
```

### Pull Request Checklist

```
[ ] .env.example updated if new keys were added
[ ] New harvester follows append-only pattern
[ ] SEC logic implements CIK fallback
[ ] Code formatted with black
[ ] Docstrings added to all public functions
[ ] README updated if new endpoints or features added
```

### Reporting Issues

If you discover a data integrity issue, API inconsistency, or forensic scoring anomaly, please open a GitHub Issue with:

- The affected harvester or endpoint
- A sample payload or log snippet
- The expected vs. actual output

---

<div align="center">

**Founder-Lens Backend** · Built with Python & FastAPI · Powered by Alpha Vantage, SEC-API, BLS & Gemini

*Forensic intelligence for the venture ecosystem.*

</div>