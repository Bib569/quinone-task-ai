import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Atom, FlaskConical, Search, ArrowRight, ArrowLeft, Download, Loader2, BarChart3, FileText, Beaker, Sparkles, CheckCircle2, AlertCircle, Home } from 'lucide-react'
import { QUINONE_DATASET, findQuinone, type QuinoneEntry } from './lib/quinoneData'

interface PredictedData {
  homo_ev: number
  lumo_ev: number
  homo_lumo_gap_ev: number
  method: string
  confidence: string
  nearestNeighbor: string
  nearestDistance: number
}

interface MoleculeResult {
  smiles: string
  name?: string
  pubchemProperties?: Record<string, unknown>
  dftData?: {
    name: string
    smiles: string
    homo_ev: number
    lumo_ev: number
    homo_lumo_gap_ev: number
    family: string
    level_of_theory: string
  }
  predictedData?: PredictedData
  inDataset: boolean
}

interface AnalysisState {
  step: number
  smiles: string
  moleculeName: string
  moleculeResult: MoleculeResult | null
  llmReport: string
  llmThinking: string
  loading: boolean
  error: string
}

const STEPS = [
  { id: 1, label: 'Input', icon: Search, desc: 'Enter molecule' },
  { id: 2, label: 'Properties', icon: Beaker, desc: 'Molecular descriptors' },
  { id: 3, label: 'Prediction', icon: BarChart3, desc: 'HOMO-LUMO gap' },
  { id: 4, label: 'Report', icon: FileText, desc: 'AI interpretation' },
]

const PRESET_MOLECULES = [
  { name: '1,4-Benzoquinone', smiles: 'O=C1C=CC(=O)C=C1' },
  { name: '9,10-Anthraquinone', smiles: 'O=C1c2ccccc2C(=O)c2ccccc21' },
  { name: '1,4-Naphthoquinone', smiles: 'O=C1C=CC(=O)c2ccccc21' },
  { name: 'Aspirin', smiles: 'CC(=O)Oc1ccccc1C(O)=O' },
  { name: 'Caffeine', smiles: 'Cn1c(=O)c2c(ncn2C)n(C)c1=O' },
  { name: 'Benzene', smiles: 'c1ccccc1' },
]

function StepIndicator({ steps, currentStep }: { steps: typeof STEPS; currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {steps.map((step, idx) => {
        const Icon = step.icon
        const isActive = step.id === currentStep
        const isDone = step.id < currentStep
        return (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              isActive ? 'bg-quantum-600/20 border border-quantum-500/50 text-quantum-300' :
              isDone ? 'bg-emerald-600/10 border border-emerald-500/30 text-emerald-400' :
              'bg-gray-800/50 border border-gray-700/50 text-gray-500'
            }`}>
              {isDone ? <CheckCircle2 size={16} /> : <Icon size={16} />}
              <span className="text-xs font-medium hidden sm:inline">{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <ArrowRight size={14} className={`mx-1 ${isDone ? 'text-emerald-500' : 'text-gray-700'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function PropertyCard({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 hover:border-quantum-600/30 transition-colors">
      <div className="text-xs text-gray-400 font-medium mb-1">{label}</div>
      <div className="text-lg font-bold text-white">
        {value}{unit && <span className="text-sm text-gray-400 ml-1">{unit}</span>}
      </div>
    </div>
  )
}

export default function App() {
  const [state, setState] = useState<AnalysisState>({
    step: 1,
    smiles: '',
    moleculeName: '',
    moleculeResult: null,
    llmReport: '',
    llmThinking: '',
    loading: false,
    error: '',
  })
  const updateState = (updates: Partial<AnalysisState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  const analyzeMolecule = async () => {
    if (!state.smiles.trim()) return
    updateState({ loading: true, error: '' })

    try {
      const response = await fetch('/.netlify/functions/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ smiles: state.smiles, name: state.moleculeName }),
      })

      const data = await response.json()
      if (!response.ok) {
        const errMsg = data?.error?.message || data?.error || `API error: ${response.status}`
        throw new Error(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg))
      }
      updateState({ moleculeResult: data, step: 2, loading: false })
    } catch (error) {
      updateState({
        error: error instanceof Error ? error.message : 'Analysis failed',
        loading: false,
      })
    }
  }

  const generateReport = async () => {
    updateState({ loading: true, error: '', llmReport: '', llmThinking: '' })

    try {
      const response = await fetch('/.netlify/functions/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          smiles: state.smiles,
          moleculeName: state.moleculeName,
          moleculeResult: state.moleculeResult,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        const errMsg = data?.error?.message || data?.error || `API error: ${response.status}`
        throw new Error(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg))
      }

      let report = ''
      let thinking = ''
      if (data.choices && data.choices[0]) {
        report = data.choices[0].message?.content || 'Report generation failed.'
        thinking = data.choices[0].message?.reasoning_content || data.choices[0].message?.reasoning || ''
      }

      updateState({ llmReport: report, llmThinking: thinking, step: 4, loading: false })
    } catch (error) {
      updateState({
        error: error instanceof Error ? error.message : 'Report generation failed',
        loading: false,
      })
    }
  }

  const exportResults = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      molecule: {
        smiles: state.smiles,
        name: state.moleculeName || state.moleculeResult?.dftData?.name || 'Unknown',
      },
      properties: state.moleculeResult?.pubchemProperties || {},
      dftReference: state.moleculeResult?.dftData || null,
      inQuinoneDataset: state.moleculeResult?.inDataset || false,
      llmReport: state.llmReport,
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quantumtask_${state.smiles.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const resetAnalysis = () => {
    setState({
      step: 1, smiles: '', moleculeName: '', moleculeResult: null,
      llmReport: '', llmThinking: '', loading: false, error: '',
    })
  }

  const predictedEntry = state.moleculeResult?.predictedData && !state.moleculeResult?.dftData
    ? {
        name: (state.moleculeName || 'Unknown').slice(0, 16) + ' ★',
        fullName: `${state.moleculeName || 'Unknown Molecule'} (ML-Predicted, ±0.4 eV)`,
        gap: state.moleculeResult.predictedData.homo_lumo_gap_ev,
        family: 'predicted' as const,
        isCurrent: false,
        isPredicted: true,
      }
    : null

  const chartData = [
    ...QUINONE_DATASET.map((q) => ({
      name: q.name.length > 20 ? q.name.slice(0, 18) + '...' : q.name,
      fullName: q.name,
      gap: q.homo_lumo_gap_ev,
      family: q.family,
      isCurrent: q.smiles === state.smiles,
      isPredicted: false,
    })),
    ...(predictedEntry ? [predictedEntry] : []),
  ]

  const structureUrl = state.smiles
    ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(state.smiles)}/PNG?record_type=2d&image_size=300x300`
    : ''

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-quantum-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-quantum-500/20">
              <FlaskConical size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">QuantumTask</h1>
              <p className="text-xs text-gray-400">Molecular Property Analyzer</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); resetAnalysis(); }}
              className="p-2 rounded-lg text-gray-400 hover:text-quantum-400 hover:bg-gray-800 transition-colors"
              title="Home"
            >
              <Home size={16} />
            </a>
            {state.step > 1 && (
              <button onClick={resetAnalysis} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">
                New Analysis
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <StepIndicator steps={STEPS} currentStep={state.step} />

        {state.error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-300 text-sm animate-fade-in">
            <AlertCircle size={18} />
            {state.error}
          </div>
        )}

        {/* Step 1: Input */}
        {state.step === 1 && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-quantum-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Atom size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Analyze a Molecule</h2>
              <p className="text-gray-400">Enter a SMILES string or select a preset to begin analysis</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">SMILES String *</label>
                <input
                  type="text"
                  value={state.smiles}
                  onChange={(e) => updateState({ smiles: e.target.value })}
                  placeholder="e.g., O=C1C=CC(=O)C=C1"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-quantum-500/50 focus:border-quantum-500/50 font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Molecule Name (optional)</label>
                <input
                  type="text"
                  value={state.moleculeName}
                  onChange={(e) => updateState({ moleculeName: e.target.value })}
                  placeholder="e.g., 1,4-Benzoquinone"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-quantum-500/50 focus:border-quantum-500/50 text-sm"
                />
              </div>

              <button
                onClick={analyzeMolecule}
                disabled={!state.smiles.trim() || state.loading}
                className="w-full py-3 bg-quantum-600 hover:bg-quantum-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-quantum-600/20 disabled:shadow-none"
              >
                {state.loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {state.loading ? 'Analyzing...' : 'Analyze Molecule'}
              </button>

              <div className="mt-6">
                <p className="text-xs text-gray-500 mb-3 font-medium">Quick presets:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_MOLECULES.map((m) => (
                    <button
                      key={m.smiles}
                      onClick={() => updateState({ smiles: m.smiles, moleculeName: m.name })}
                      className="text-left p-3 rounded-lg border border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:border-quantum-600/40 transition-all"
                    >
                      <div className="text-xs font-medium text-gray-300">{m.name}</div>
                      <div className="text-[10px] text-gray-600 font-mono mt-0.5 truncate">{m.smiles}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Properties */}
        {state.step === 2 && state.moleculeResult && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Structure */}
              <div className="lg:col-span-1">
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">2D Structure</h3>
                  <div className="bg-white rounded-xl p-3 flex items-center justify-center">
                    <img src={structureUrl} alt="Molecule" className="max-w-full max-h-[250px]"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                  <div className="mt-3 text-xs font-mono text-gray-500 break-all">{state.smiles}</div>
                  {state.moleculeResult.dftData && (
                    <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <div className="text-xs text-emerald-400 font-medium">✓ Found in DFT Dataset</div>
                      <div className="text-xs text-gray-400 mt-1">{state.moleculeResult.dftData.name}</div>
                      <div className="text-xs text-gray-500">{state.moleculeResult.dftData.family}</div>
                    </div>
                  )}
                  {state.moleculeResult.predictedData && !state.moleculeResult.dftData && (
                    <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      <div className="text-xs text-amber-400 font-medium">★ ML-Predicted (k-NN)</div>
                      <div className="text-xs text-gray-400 mt-1">Nearest: {state.moleculeResult.predictedData.nearestNeighbor}</div>
                      <div className="text-xs text-gray-500">Confidence: {state.moleculeResult.predictedData.confidence}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Properties Grid */}
              <div className="lg:col-span-2">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Molecular Properties</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {state.moleculeResult.pubchemProperties && (
                    <>
                      <PropertyCard label="Molecular Formula" value={String(state.moleculeResult.pubchemProperties.MolecularFormula || 'N/A')} />
                      <PropertyCard label="Molecular Weight" value={Number(state.moleculeResult.pubchemProperties.MolecularWeight || 0).toFixed(2)} unit="g/mol" />
                      <PropertyCard label="XLogP" value={Number(state.moleculeResult.pubchemProperties.XLogP || 0).toFixed(2)} />
                      <PropertyCard label="TPSA" value={Number(state.moleculeResult.pubchemProperties.TPSA || 0).toFixed(1)} unit="A²" />
                      <PropertyCard label="H-Bond Donors" value={String(state.moleculeResult.pubchemProperties.HBondDonorCount || 0)} />
                      <PropertyCard label="H-Bond Acceptors" value={String(state.moleculeResult.pubchemProperties.HBondAcceptorCount || 0)} />
                      <PropertyCard label="Rotatable Bonds" value={String(state.moleculeResult.pubchemProperties.RotatableBondCount || 0)} />
                      <PropertyCard label="Heavy Atoms" value={String(state.moleculeResult.pubchemProperties.HeavyAtomCount || 0)} />
                      <PropertyCard label="Exact Mass" value={Number(state.moleculeResult.pubchemProperties.ExactMass || 0).toFixed(4)} unit="Da" />
                    </>
                  )}
                  {state.moleculeResult.dftData && (
                    <>
                      <PropertyCard label="HOMO (DFT)" value={state.moleculeResult.dftData.homo_ev.toFixed(2)} unit="eV" />
                      <PropertyCard label="LUMO (DFT)" value={state.moleculeResult.dftData.lumo_ev.toFixed(2)} unit="eV" />
                      <PropertyCard label="Gap (DFT)" value={state.moleculeResult.dftData.homo_lumo_gap_ev.toFixed(2)} unit="eV" />
                    </>
                  )}
                  {state.moleculeResult.predictedData && !state.moleculeResult.dftData && (
                    <>
                      <div className="col-span-full">
                        <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                          <AlertCircle size={13} /> ML-Predicted via k-NN · Confidence: {state.moleculeResult.predictedData.confidence} · ±0.3–0.5 eV uncertainty
                        </div>
                      </div>
                      <PropertyCard label="Predicted HOMO" value={state.moleculeResult.predictedData.homo_ev.toFixed(2)} unit="eV" />
                      <PropertyCard label="Predicted LUMO" value={state.moleculeResult.predictedData.lumo_ev.toFixed(2)} unit="eV" />
                      <PropertyCard label="Predicted Gap" value={state.moleculeResult.predictedData.homo_lumo_gap_ev.toFixed(2)} unit="eV" />
                    </>
                  )}
                  {!state.moleculeResult.pubchemProperties && !state.moleculeResult.dftData && !state.moleculeResult.predictedData && (
                    <div className="col-span-full p-6 text-center text-gray-500 text-sm">
                      Could not fetch properties. The SMILES may be invalid or PubChem may be unavailable.
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <button onClick={() => updateState({ step: 1 })}
                    className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button onClick={() => updateState({ step: 3 })}
                    className="flex-1 py-2.5 rounded-xl bg-quantum-600 hover:bg-quantum-500 text-white font-medium transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-quantum-600/20">
                    View HOMO-LUMO Comparison <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Prediction / Comparison */}
        {state.step === 3 && (
          <div className="animate-fade-in">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">HOMO-LUMO Gap — Dataset Comparison</h3>
              <p className="text-xs text-gray-400 mb-6">
                DFT B3LYP/6-31G* computed HOMO-LUMO gaps for 25 quinone derivatives.
                {state.moleculeResult?.dftData && ' Your molecule is highlighted in cyan.'}
                {state.moleculeResult?.predictedData && !state.moleculeResult?.dftData && ' ML-predicted gap for your molecule shown in orange (★).'}
              </p>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" tick={{ fontSize: 9, fill: '#9CA3AF' }} interval={0} height={80} />
                    <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} label={{ value: 'Gap (eV)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#9CA3AF' } }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }}
                      labelStyle={{ color: '#E5E7EB', fontWeight: 'bold' }}
                      formatter={(value: number) => [`${value.toFixed(2)} eV`, 'HOMO-LUMO Gap']}
                      labelFormatter={(label: string, payload: Array<{ payload?: { fullName?: string } }>) => payload?.[0]?.payload?.fullName || label}
                    />
                    <Bar dataKey="gap" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.isPredicted ? '#F97316' :
                            entry.isCurrent ? '#06B6D4' :
                            entry.family === 'benzoquinone' ? '#3B82F6' :
                            entry.family === 'naphthoquinone' ? '#8B5CF6' : '#F59E0B'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-6 justify-center mt-4 text-xs flex-wrap">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-500" /> Benzoquinone</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-purple-500" /> Naphthoquinone</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-amber-500" /> Anthraquinone</div>
                {state.moleculeResult?.dftData && (
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-cyan-500" /> Your Molecule (DFT)</div>
                )}
                {state.moleculeResult?.predictedData && !state.moleculeResult?.dftData && (
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-orange-500" /> Your Molecule (ML-Predicted)</div>
                )}
              </div>
            </div>

            {state.moleculeResult?.dftData && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">DFT Reference Values (B3LYP/6-31G*)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <PropertyCard label="Name" value={state.moleculeResult.dftData.name} />
                  <PropertyCard label="HOMO" value={state.moleculeResult.dftData.homo_ev.toFixed(2)} unit="eV" />
                  <PropertyCard label="LUMO" value={state.moleculeResult.dftData.lumo_ev.toFixed(2)} unit="eV" />
                  <PropertyCard label="Gap" value={state.moleculeResult.dftData.homo_lumo_gap_ev.toFixed(2)} unit="eV" />
                </div>
              </div>
            )}

            {state.moleculeResult?.predictedData && !state.moleculeResult?.dftData && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mb-3">
                  <AlertCircle size={16} /> ML-Predicted HOMO-LUMO Values
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                  <PropertyCard label="Predicted HOMO" value={state.moleculeResult.predictedData.homo_ev.toFixed(2)} unit="eV" />
                  <PropertyCard label="Predicted LUMO" value={state.moleculeResult.predictedData.lumo_ev.toFixed(2)} unit="eV" />
                  <PropertyCard label="Predicted Gap" value={state.moleculeResult.predictedData.homo_lumo_gap_ev.toFixed(2)} unit="eV" />
                </div>
                <p className="text-xs text-gray-400">
                  Method: {state.moleculeResult.predictedData.method}<br />
                  Nearest reference: <span className="text-amber-300">{state.moleculeResult.predictedData.nearestNeighbor}</span> · 
                  Confidence: <span className="text-amber-300">{state.moleculeResult.predictedData.confidence}</span> · 
                  Estimated uncertainty: ±0.3–0.5 eV
                </p>
              </div>
            )}

            {!state.moleculeResult?.dftData && !state.moleculeResult?.predictedData && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
                  <AlertCircle size={16} /> Molecule Not in DFT Dataset
                </div>
                <p className="text-xs text-gray-400">
                  This molecule is not in our reference dataset of 25 quinone derivatives.
                  The AI report will provide qualitative analysis based on structural features.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => updateState({ step: 2 })}
                className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm">
                <ArrowLeft size={16} /> Back
              </button>
              <button onClick={generateReport} disabled={state.loading}
                className="flex-1 py-2.5 rounded-xl bg-quantum-600 hover:bg-quantum-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-quantum-600/20 disabled:shadow-none">
                {state.loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {state.loading ? 'Generating Report...' : 'Generate AI Report'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: LLM Report */}
        {state.step === 4 && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={18} className="text-quantum-400" />
                <h3 className="text-lg font-semibold text-white">AI Chemistry Report</h3>
              </div>
              <div className="markdown-content text-gray-200">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{state.llmReport}</ReactMarkdown>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => updateState({ step: 3 })}
                className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm">
                <ArrowLeft size={16} /> Back
              </button>
              <button onClick={exportResults}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-600/20">
                <Download size={16} /> Export Results (JSON)
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 border border-gray-800 text-xs text-gray-500">
            <Beaker size={12} />
            Powered by OpenRouter Free Router via OpenRouter | DFT B3LYP/6-31G* quinone dataset (25 molecules) | PubChem API
          </div>
        </div>
      </main>
    </div>
  )
}
