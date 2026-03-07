# QuantumTask — AI Molecular Property Analyzer

[![Netlify Status](https://api.netlify.com/api/v1/badges/quinone-task-ai/deploy-status)](https://quinone-task-ai.netlify.app)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-quinone--task--ai.netlify.app-6366f1)](https://quinone-task-ai.netlify.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A task-oriented, step-by-step molecular analysis tool for quinone derivatives and arbitrary SMILES molecules. Powered by the **OpenRouter Free Router** via the OpenRouter API.

**🔗 Live Demo:** [https://quinone-task-ai.netlify.app](https://quinone-task-ai.netlify.app)  
**🔗 Companion App (chat-based):** [QuantumChat](https://github.com/Bib569/quinone-chat-ai)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **4-Step Workflow** | Input → Properties → HOMO-LUMO Chart → AI Report |
| **Molecular Descriptors** | MW, XLogP, TPSA, HBD/HBA, rotatable bonds from PubChem |
| **HOMO-LUMO Bar Chart** | Interactive Recharts chart comparing all 25 quinones + your molecule |
| **DFT Reference Data** | Instant lookup against B3LYP/6-31G* computed HOMO/LUMO/gap |
| **k-NN ML Prediction** | Gap estimates for unknown molecules with confidence scoring (±0.3–0.5 eV) |
| **AI Report** | Publication-quality chemistry report with method recommendations |
| **QC Methods Library** | Searchable panel: 20+ methods, 25+ functionals, 18+ basis sets |
| **Export Report** | Download report as **Markdown**, **PDF**, or **Word (.docx)** |
| **Auto-retry** | Server retries up to 3× on 502/503/429 errors automatically |

---

## ⚠️ Known Issue: 502 Errors (Free Tier)

> **The OpenRouter Free Router is occasionally overloaded**, returning HTTP 502 or empty responses. This is a known limitation of free-tier LLM routing.

**What happens automatically:**
- The server retries **up to 3 times** with 1.2 s / 2.4 s backoff before returning an error.

**What to do if you see a 502 error:**
1. **Click "Generate AI Report" again** — the router usually recovers within seconds.
2. If errors persist, wait **30–60 seconds** and try again.
3. Peak hours (UTC 14:00–22:00) have higher failure rates.

This limitation is inherent to free-tier AI routing and cannot be fully eliminated without a paid API plan.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  React + Vite Frontend                   │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐  │
│  │ Step 1   │→ │ Step 2   │→ │ Step 3  │→ │ Step 4   │  │
│  │ SMILES   │  │ Props +  │  │ HOMO-   │  │ AI Report│  │
│  │ Input    │  │ DFT Data │  │ LUMO    │  │+ExportMenu│  │
│  └────┬─────┘  └────┬─────┘  │ Chart   │  └────┬─────┘  │
│       │             │        └─────────┘       │        │
└───────┼─────────────┼───────────────────────── ┼────────┘
        │             │                           │
   ┌────▼─────────────▼───────────────────────────▼────┐
   │              Netlify Serverless Functions          │
   │  ┌──────────────────────┐  ┌─────────────────────┐ │
   │  │  /analyze            │  │  /report            │ │
   │  │  • PubChem lookup    │  │  • 3× retry         │ │
   │  │  • DFT dataset match │  │  • OpenRouter API   │ │
   │  │  • k-NN prediction   │  │  • System prompt    │ │
   │  └──────────────────────┘  └─────────────────────┘ │
   └────────────────────────────────────────────────────┘
```

---

## 🧪 Quantum Chemistry Knowledge Base

The LLM report generator has **PhD-level expertise** covering:

- **Wavefunction theory**: HF, MP2–MP4, CCSD, CCSD(T) O(N⁷), EOM-CCSD, ADC, CISD, FCI
- **Multi-reference**: CASSCF, CASPT2, NEVPT2, MRCI+Q, DMRG, Selected-CI
- **DFT — Jacob's Ladder**: LDA → GGA (PBE, BLYP) → meta-GGA (SCAN, r²SCAN) → hybrid (B3LYP, PBE0, M06-2X) → RSH (CAM-B3LYP, ωB97X-D) → double hybrid (B2-PLYP, XYG3)
- **TD-DFT**: Casida equation, CT state handling, TDA, excited-state geometry
- **Basis sets**: Pople, Dunning cc-pVxZ, def2, Jensen pc-n, ANO-RCC, ECPs
- **Report sections**: Identity, structural analysis, electronic properties, recommended methods, dataset comparison, applications, future perspectives

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + TypeScript | 18 / 5.5 |
| Build | Vite | 5 |
| Styling | TailwindCSS | 3 |
| Charts | Recharts | 2 |
| Icons | Lucide React | 0.468 |
| Markdown | react-markdown + remark-gfm | 9 / 4 |
| Export | jsPDF + docx | latest |
| Backend | Netlify Functions (serverless) | — |
| LLM | OpenRouter Free Router | `openrouter/free` |
| Chemistry | PubChem PUG-REST API | — |
| Dataset | 25 quinones DFT B3LYP/6-31G* | — |
| Hosting | Netlify (free tier) | — |

---

## 🚀 Quick Start

```bash
git clone https://github.com/Bib569/quinone-task-ai.git
cd quinone-task-ai
npm install
```

Create a `.env` file in the project root:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

> Get a free API key at [openrouter.ai/keys](https://openrouter.ai/keys)

Run locally with Netlify CLI (required for serverless functions):
```bash
npx netlify dev
```

Build for production:
```bash
npm run build
```

Deploy to Netlify:
```bash
netlify deploy --prod --dir=dist
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | ✅ Yes | API key from [openrouter.ai](https://openrouter.ai) |

Set this in the **Netlify dashboard → Site settings → Environment variables** for production.

---

## 📁 Project Structure

```
quinone-task-ai/
├── index.html
├── netlify.toml                    # Netlify build + functions config
├── package.json
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── main.tsx
│   ├── index.css
│   ├── App.tsx                     # Main 4-step wizard UI + state
│   ├── components/
│   │   ├── ExportMenu.tsx          # MD / PDF / DOCX export dropdown
│   │   └── MethodsLibrary.tsx      # QC methods reference panel (modal)
│   └── lib/
│       ├── exportUtils.ts          # jsPDF + docx export engine
│       ├── quinoneData.ts          # 25-molecule DFT dataset + findQuinone()
│       └── quantumChemKnowledge.ts # Full QC knowledge base
└── netlify/
    └── functions/
        ├── analyze.ts              # PubChem lookup + k-NN HOMO-LUMO prediction
        └── report.ts               # LLM report generator (3× retry, system prompt)
```

---

## 🔬 k-NN HOMO-LUMO Prediction

For molecules **not in the DFT dataset**, a k-NN model predicts HOMO/LUMO/gap:

**Features extracted from SMILES (regex):**
- Aromatic carbons (`c`)
- Carbonyl groups (`=O`, minus sulfone oxygens)
- Halogens (`Cl`, `Br`, `F`)
- Amino groups (`N`)
- Aromatic nitrogens (`n`)

**Algorithm:** k=3 nearest neighbours, normalised Euclidean distance, inverse-distance weighted average of DFT reference values.

**Confidence thresholds:**
| Distance | Confidence |
|----------|------------|
| < 0.25 | High |
| 0.25 – 0.60 | Medium |
| > 0.60 | Low |

Uncertainty: ±0.3–0.5 eV typical. Displayed as orange bar in the chart with amber info panel.

---

## 📊 Quinone Reference Dataset

25 quinone derivatives with DFT B3LYP/6-31G* computed values:

| Family | Count | Color in chart | HOMO-LUMO Gap Range |
|--------|-------|---------------|---------------------|
| Benzoquinones | 11 | 🔵 Blue | 3.72 – 4.27 eV |
| Naphthoquinones | 7 | 🟣 Purple | 3.05 – 3.52 eV |
| Anthraquinones | 7 | 🟡 Amber | 2.78 – 3.12 eV |
| ML-Predicted | — | 🟠 Orange | varies |
| Your molecule (DFT) | — | 🔵 Cyan | — |

---

## 🔧 Design Decisions

1. **Task-oriented UX** — Step-by-step wizard guides users through a structured analysis pipeline
2. **Recharts visualization** — Interactive bar chart with family-based color coding and tooltip
3. **Serverless backend** — Netlify Functions secure the API key; no CORS issues
4. **3× auto-retry** — Transparent server-side retry absorbs most transient 502/503 failures
5. **Embedded dataset** — Zero-latency DFT lookups without a database
6. **Multi-format export** — jsPDF + docx for offline archival of AI reports
7. **No thinking toggle** — Removed in final release; free-tier models don't support reliable reasoning mode

---

## 📝 Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.4.0 | Mar 2026 | Server-side 3× retry for 502/503/429; improved error messages |
| 1.3.0 | Mar 2026 | Multi-format export (MD/PDF/DOCX) replaces JSON export |
| 1.2.0 | Mar 2026 | QC Methods Library panel; comprehensive knowledge base in report prompt |
| 1.1.0 | Mar 2026 | k-NN HOMO-LUMO prediction; orange bar in chart; bug fix for empty-name matching |
| 1.0.0 | Mar 2026 | Initial release with 4-step workflow, PubChem, DFT dataset, AI report |

---

## 📄 License

MIT © 2026
