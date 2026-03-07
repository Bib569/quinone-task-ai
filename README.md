# QuantumTask — LLM-Powered Molecular Property Analyzer

A task-oriented, step-by-step molecular analysis tool for quinone derivatives and arbitrary SMILES molecules, powered by Qwen3 Coder via OpenRouter.

**Live Demo:** [https://quinone-task-ai.netlify.app](https://quinone-task-ai.netlify.app)

## Features

- **4-Step Workflow** — Input → Properties → HOMO-LUMO Comparison → AI Report
- **Molecular Descriptors** — Automated retrieval of MW, XLogP, TPSA, HBD/HBA, and more from PubChem
- **HOMO-LUMO Bar Chart** — Interactive Recharts visualization comparing all 25 quinone derivatives
- **DFT Reference Data** — Instant lookup against B3LYP/6-31G* computed HOMO, LUMO, and gap values
- **AI Report Generation** — Publication-quality chemistry reports from Qwen3 Coder LLM
- **Dual Mode** — Fast mode or Thinking mode with visible chain-of-thought reasoning
- **JSON Export** — Download complete analysis results for further processing

## Architecture

```
┌──────────────────────────────────────────────────┐
│               React + Vite Frontend              │
│  ┌──────┐  ┌──────────┐  ┌───────┐  ┌────────┐  │
│  │Input │→ │Properties│→ │Chart  │→ │Report  │  │
│  │Step  │  │Step      │  │Step   │  │Step    │  │
│  └──┬───┘  └────┬─────┘  └───┬───┘  └───┬────┘  │
│     │           │             │           │       │
└─────┼───────────┼─────────────┼───────────┼───────┘
      │           │             │           │
 ┌────▼───────────▼─────────────▼───────────▼────┐
 │         Netlify Serverless Functions          │
 │  ┌──────────────────┐  ┌───────────────────┐  │
 │  │ /analyze         │  │ /report           │  │
 │  │ PubChem + DFT    │  │ OpenRouter LLM    │  │
 │  │ Property Lookup  │  │ Report Generator  │  │
 │  └──────────────────┘  └───────────────────┘  │
 └───────────────────────────────────────────────┘
```

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, TypeScript, Vite 5      |
| Styling   | TailwindCSS 3, custom theme       |
| Charts    | Recharts                          |
| Icons     | Lucide React                      |
| Markdown  | react-markdown + remark-gfm       |
| Backend   | Netlify Functions (serverless)    |
| LLM       | Qwen3 Coder (480B) via OpenRouter |
| Chemistry | PubChem PUG-REST API              |
| Dataset   | 25 quinones, DFT B3LYP/6-31G*    |
| Hosting   | Netlify                           |

## Quick Start

```bash
git clone https://github.com/Bib569/quinone-task-ai.git
cd quinone-task-ai
npm install
```

Create a `.env` file:
```
OPENROUTER_API_KEY=your_openrouter_api_key
```

Run locally with Netlify CLI:
```bash
npx netlify dev
```

Build for production:
```bash
npm run build
```

## Environment Variables

| Variable            | Description                  |
|---------------------|------------------------------|
| `OPENROUTER_API_KEY`| API key from openrouter.ai   |

## Project Structure

```
├── index.html
├── netlify.toml
├── package.json
├── src/
│   ├── main.tsx
│   ├── index.css
│   ├── App.tsx
│   └── lib/
│       └── quinoneData.ts      # 25-molecule DFT dataset
├── netlify/
│   └── functions/
│       ├── analyze.ts          # PubChem + DFT property lookup
│       └── report.ts           # LLM report generator
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## Design Choices

1. **Task-oriented UX** — Step-by-step wizard guides users through a structured analysis pipeline instead of free-form chat
2. **Recharts visualization** — Interactive bar chart comparing HOMO-LUMO gaps across 25 quinone derivatives with family-based color coding
3. **Serverless backend** — Netlify Functions secure the API key and handle PubChem/OpenRouter proxying
4. **Embedded dataset** — DFT reference data embedded in both frontend and backend for zero-latency lookups
5. **JSON export** — Full analysis results downloadable for integration with other workflows

## License

MIT
