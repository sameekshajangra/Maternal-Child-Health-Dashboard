# Maatri AI

## AI-Powered Maternal & Child Health Intelligence Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-maternal--child--health--dashboard.vercel.app-6366f1?style=for-the-badge&logo=vercel)](https://maternal-child-health-dashboard.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)](LICENSE)

---

### Problem Statement

Public health datasets are abundant, yet extracting actionable, policy-relevant insights for maternal and child health remains cumbersome for researchers, NGOs, and policymakers. **Maatri AI** bridges that gap by unifying 6 NFHS‑5-era datasets into a single glassmorphic intelligence platform with real-time AI analysis.

---

### ✨ Core Features

| Module | Description |
|---|---|
| 🗺️ **India Health Heatmap** | State-level choropleth maps for MMR, IMR, stunting, and 4 more indicators with animated pill tabs |
| 📊 **KPI Dashboard** | Animated KPI cards with SDG target progress bars, count-up animations, and hover glow |
| 🔮 **Predictive Analytics** | XGBoost-powered MMR projection to 2030 with animated scenario sliders (framer-motion) |
| 🧠 **Explainable AI (LIME)** | Per-patient SHAP/LIME feature attribution with force-plot-style bars |
| ⚡ **Intervention Simulator** | Drag 5 policy levers (ANC, SBA, Nutrition, WASH, PHCs) → see real-time projected impact across 6 outcomes + radar chart |
| 🔬 **Cross-Dim. Insights** | Scatter correlation matrix across socioeconomic, environmental, and infrastructure layers with AI policy implication cards |
| 🏥 **Policy Recommendations** | Expandable priority-ranked policy cards with AI evidence base, cost estimates, and target states |
| 🔍 **Research Assistant** | AI-powered PubMed-style query interface with 3-step flowchart explainer |
| 📈 **Compare States** | Side-by-side radar + bar chart comparison of any two Indian states |
| ♿ **Health Access** | Rural healthcare accessibility scoring with doctor density and PHC coverage |

---

### 🎨 Design System (v2 Refresh)

- **Font:** Inter (300–800 weight) via Google Fonts
- **Glassmorphism:** `backdrop-filter: blur(12px)` + semi-transparent cards, used globally via `.glass-card` utility
- **Active Sidebar Accent:** Left colour-bar (`border-left: 4px solid`) + gradient background per route
- **Micro-animations:** `framer-motion` AnimatePresence for number flip, scale pop, and slide-in transitions
- **Smooth Scroll:** `html { scroll-behavior: smooth }` with `#kpis`, `#trends`, `#priorities` anchors
- **Spacing Token:** `--spacing: 1.5rem` applied consistently across all cards and nav

---

### 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, Turbopack)
- **Styling:** Tailwind CSS + custom design-token layer in `globals.css`
- **Charts:** Recharts (Area, Bar, Scatter, Radar charts)
- **Animations:** Framer Motion (`AnimatePresence`, `motion.div`)
- **Data:** NFHS-5, SDG India Index, CPCB Air Quality, MoHFW, Census 2011, NITI Aayog MPI
- **Deployment:** Vercel (serverless + edge)

---

### 📦 Datasets Utilised

| Dataset | Scope |
|---|---|
| **NFHS-5 (2019–21)** | 28 states – MMR, IMR, child nutrition, vaccination, anemia, ANC, institutional delivery |
| **SDG India Index** | State-level progress toward 17 SDG goals |
| **Rural Healthcare Infrastructure** | PHC counts, doctor density, hospital beds per capita |
| **Air Quality (CPCB)** | PM2.5 concentrations, pollution hotspots across states |
| **Education & Literacy (Census 2011)** | Female literacy rates, school enrolment ratios |
| **Poverty / Economic (NITI Aayog MPI)** | Multidimensional poverty index, income deprivation scores |

---

### 🌍 Real-World Impact

- **Researchers** get a natural-language query engine for rapid hypothesis testing across 6 data layers.
- **NGOs & Policymakers** receive AI-ranked, evidence-backed recommendations with cost and impact estimates.
- **Health Analysts** can simulate the impact of 5 policy interventions in real time before committing resources.
- **Data Journalists** can export comparative state visualisations for editorial reporting.

---

### 🗺️ Roadmap

| Quarter | Milestone |
|---|---|
| **Q3 2025** | Full-text NL querying across all layers (Gemini API streaming) |
| **Q4 2025** | District-level drill-downs with block-level PHC mapping |
| **Q1 2026** | Downloadable AI policy briefs (PDF export) |
| **Q2 2026** | Multi-language support (Hindi, Tamil, Telugu) |
| **2027** | Live data ingestion from HMIS and Aadhaar-linked beneficiary systems |

---

### 🚀 Installation

```bash
# Clone the repo
git clone https://github.com/sameekshajangra/Maternal-Child-Health-Dashboard.git
cd Maternal-Child-Health-Dashboard

# Install dependencies
npm install

# Run locally (Turbopack dev server)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 📁 Project Structure

```
app/
  page.tsx              ← Dashboard (KPIs, Trend Chart, State Breakdown)
  heatmaps/page.tsx     ← India Health Heatmap
  predictive/page.tsx   ← Predictive Risk Analytics
  explainable-ai/       ← LIME/SHAP Explainability
  compare/              ← State Comparison
  research/             ← Research Assistant
  accessibility/        ← Health Access Scores
  policy/               ← Policy Recommendations
  insights/             ← Cross-Dimensional Insights
  simulator/page.tsx    ← Intervention Impact Simulator ✨ NEW
components/
  Sidebar.tsx           ← Navigation with active accent bars + ARIA
  KPICardPremium.tsx    ← Animated KPI card with count-up & hover glow
  ChartWrapper.tsx      ← Reusable glass-card chart container
lib/
  data.ts               ← All NFHS-5 and derived datasets
```

---

### License

MIT © Sameeksha Sharma – Feel free to fork, improve, and contribute!
