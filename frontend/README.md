# FounderLens // Frontend 
> **Decision Intelligence & Forensic Startup Auditing**

FounderLens is a high-fidelity diagnostic platform designed to deconstruct startup viability. Unlike traditional generative AI tools that offer confirmatory bias, FounderLens utilizes **Deterministic Logic Modeling** to identify structural fragility in business assumptions.

---

## 🏗️ System Architecture

The frontend is built with a modular "Service-First" architecture to ensure mathematical accuracy and UI performance.

### 1. Forensic Lab (The Intake)
A multi-step diagnostic interface that captures project identity, atomic assumptions, and economic parameters.
* **State Management:** Powered by `Zustand` for cross-step persistence.
* **UX:** Orchestrated with `Framer Motion` for high-end state transitions.

### 2. Logic Engine (The Brain)
A decoupled TypeScript service (`analysisEngine.ts`) that processes raw input into quantitative risk scores.
* **Deterministic Math:** Zero LLM hallucinations; calculations are based on hard-coded economic models.
* **Risk Scoring:** Generates a 1.0 - 9.9 Fragility Score based on burn-to-scale ratios.

### 3. Command Center (The Dashboard)
A reactive data visualization suite providing a "Forensic Report" of the audit.
* **Stress Testing:** Real-time mapping of user assumptions.
* **Runway Simulation:** Bar chart visualizations of projected economic load.

---

## 💻 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router + Turbopack) |
| **Styling** | Tailwind CSS (Strategic Dark Mode) |
| **State** | Zustand |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Type Safety** | TypeScript |

---

## 🚀 Deployment & Installation

### 1. Clone & Install
```bash
cd frontend
npm install
'''