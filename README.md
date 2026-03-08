# QuantumTask — AI Molecular Property Analyzer

[![Netlify Status](https://api.netlify.com/api/v1/badges/quinone-task-ai/deploy-status)](https://quinone-task-ai.netlify.app)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-quinone--task--ai.netlify.app-6366f1)](https://quinone-task-ai.netlify.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A task-oriented, step-by-step molecular analysis tool for quinone derivatives and arbitrary SMILES molecules. Powered by the **Groq API** with selectable free-plan models (Kimi K2, Llama 3.3 70B, Qwen3 32B, GPT-OSS 120B) and optional thinking mode.

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
| **Model Selector** | Dropdown in header to switch between 4 Groq models (Kimi K2, Llama 3.3 70B, Qwen3 32B, GPT-OSS 120B) |
| **Thinking Mode** | Toggle beside model selector — enabled for Qwen3 32B; reasoning shown in collapsible panel |
| **Auto-retry** | Server retries up to 3× on 502/503/429 errors automatically |

---

## ⚠️ Rate Limits (Groq Free Plan)

Groq's free plan has per-minute token limits per model. If you hit a rate limit (HTTP 429):

1. **Wait 10–30 seconds** and click **Generate AI Report** again — limits reset quickly.
2. **Switch to a different model** using the dropdown in the header.
3. The server retries **up to 3 times** automatically before surfacing an error.

| Model | Free RPM | Free TPM |
|-------|----------|----------|
| Kimi K2 (`moonshotai/kimi-k2-instruct`) | varies | varies |
| Llama 3.3 70B (`llama-3.3-70b-versatile`) | 30 | 6,000 |
| Qwen3 32B (`qwen/qwen3-32b`) | 30 | 6,000 |
| GPT-OSS 120B (`openai/gpt-oss-120b`) | varies | varies |

> Check current limits at [console.groq.com/settings/limits](https://console.groq.com/settings/limits)

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
   │  │  • DFT dataset match │  │  • Groq API         │ │
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
| LLM | Groq API (free plan) | `api.groq.com` |
| Models | Kimi K2, Llama 3.3 70B, Qwen3 32B, GPT-OSS 120B | selectable |
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

The Groq API key is embedded in the serverless function for the free plan. To use your own key, set it as an environment variable:
```env
GROQ_API_KEY=your_groq_api_key_here
```

> Get a free API key at [console.groq.com/keys](https://console.groq.com/keys)

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
| `GROQ_API_KEY` | Optional | Override the built-in Groq API key. Get one at [console.groq.com/keys](https://console.groq.com/keys) |

The default key is embedded in `netlify/functions/report.ts` for the free plan. For production with your own key, set it in **Netlify dashboard → Site settings → Environment variables** and update `report.ts` to read `process.env.GROQ_API_KEY`.

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
3. **Groq backend** — Netlify Functions keep the API key server-side; OpenAI-compatible endpoint, no CORS issues
4. **Model selector** — Dropdown in header right-hand side; auto-disables thinking toggle for non-supporting models
5. **Thinking toggle** — Purple brain icon for Qwen3 32B; sends `reasoning_effort: 'default'` + `reasoning_format: 'parsed'` to Groq; reasoning returned in `message.reasoning` field
6. **3× auto-retry** — Transparent server-side retry with 1.5 s / 3.0 s backoff; handles 429/502/503
7. **Embedded dataset** — Zero-latency DFT lookups without a database
8. **Multi-format export** — jsPDF (Latin-1 sanitised) + docx for offline archival of AI reports

---

## 📝 Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.6.1 | Mar 2026 | **Fix thinking mode**: replace invalid `thinking` param with correct Groq `reasoning_effort=default` + `reasoning_format=parsed` for Qwen3 32B |
| 1.6.0 | Mar 2026 | **Groq API migration**: model selector dropdown (Kimi K2 / Llama 3.3 / Qwen3 / GPT-OSS), thinking mode toggle for Qwen3 32B, 429 rate-limit error handling |
| 1.5.0 | Mar 2026 | PDF export garbled character fix (`sanitiseForPDF` Latin-1 sanitisation) |
| 1.4.0 | Mar 2026 | Server-side 3× retry for 502/503/429; improved error messages |
| 1.3.0 | Mar 2026 | Multi-format export (MD/PDF/DOCX) replaces JSON export |
| 1.2.0 | Mar 2026 | QC Methods Library panel; comprehensive knowledge base in report prompt |
| 1.1.0 | Mar 2026 | k-NN HOMO-LUMO prediction; orange bar in chart; bug fix for empty-name matching |
| 1.0.0 | Mar 2026 | Initial release with 4-step workflow, PubChem, DFT dataset, AI report |

---

## 📄 License

MIT © 2026
