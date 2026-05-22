# Maatri AI

## AI-Powered Maternal & Child Health Intelligence Platform

🔗 **Live Demo:** https://maternal-child-health-dashboard.vercel.app

---

### Problem Statement

Public health datasets are abundant, yet extracting actionable, policy‑relevant insights for maternal and child health remains cumbersome for researchers, NGOs, and policymakers.

---

### Core Features

- **AI‑generated public‑health insights** – natural‑language synthesis of trends and gaps.
- **Interactive India health heatmaps** – drill‑down to state‑level metrics.
- **Maternal & child health analytics** – KPI dashboards, comparative charts, predictive modelling.
- **Explainable AI** – transparent model reasoning behind recommendations.
- **Responsive premium UI** – glass‑morphism, rich gradients, micro‑animations.

---

### Tech Stack

- **Frontend:** Next.js 16 (React 19), Recharts, Tailwind‑CSS‑free custom design system.
- **Data:** NFHS‑5 (core), SDG India Index, Rural Healthcare Infrastructure, Air‑Quality (PM2.5), Census Literacy, NITI‑Aayog MPI.
- **AI:** Gemini‑4 (Gemini API) for natural‑language generation.
- **Deployment:** Vercel – instant static & server‑less functions.

---

### Datasets Utilised

| Dataset | Scope |
|---|---|
| **NFHS‑5 (2019‑21)** | 28 states, 640 districts – maternal mortality, child nutrition, vaccination, anemia, institutional delivery, ANC care. |
| **SDG India Index** | State‑level progress toward 2030 Sustainable Development Goals. |
| **Rural Healthcare Infrastructure** | PHC counts, doctor density, hospital beds per capita. |
| **Air Quality (CPCB)** | PM2.5 concentrations, pollution hotspots. |
| **Education & Literacy (Census 2011)** | Female literacy rates, school enrolment. |
| **Poverty / Economic (NITI‑Aayog MPI)** | Multidimensional poverty index, income deprivation. |

---

### Real‑World Impact

- **Researchers** gain a one‑click natural‑language query engine for hypothesis testing.
- **NGOs & Policymakers** receive data‑backed recommendations (e.g., *"Increase rural maternal‑care outreach in Bihar"*).
- **Health analysts** can visualize cross‑dimensional drivers of maternal mortality, vaccination gaps, and child stunting.

---

### Roadmap

- **Q3 2024:** Full‑text natural‑language querying across all layers.
- **Q4 2024:** AI‑driven recommendation engine with scenario simulations.
- **2025:** District‑level drill‑downs, downloadable policy briefs, multi‑language support.

---

### UI Enhancements

- Added generous whitespace, larger card paddings, pastel glass‑morphism cards, and improved typography hierarchy.
- Updated KPI cards to floating pastel cards with hover glow and soft shadows.
- Refined chart containers with glass cards, subtle shadows, and rounded corners.
- Implemented interactive sliders on the Predictive Analytics page with live‑update projections.
- Enhanced tooltip micro‑interactions (smooth fade, hover glow, animated transitions).
- Redesigned the map page as a central hero component with larger, cleaner interactive map.
- Introduced “Why This Matters” policy implication notes under each insight.
- Planned an “Intervention Impact Simulator” for scenario analysis.

---

### Limitations

- Data is state‑aggregated; district‑level granularity is limited by source availability.
- The platform is **not** a clinical diagnostic tool – it offers population‑level insights only.

---

### Installation

```bash
# Clone the repo
git clone https://github.com/sameekshajangra/Maatri-AI.git
cd Maatri-AI

# Install dependencies
npm install

# Run locally
npm run dev
```

---

### License

MIT © Sameeksha Sharma – Feel free to fork, improve, and contribute!
