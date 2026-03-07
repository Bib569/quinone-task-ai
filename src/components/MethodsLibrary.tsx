import { useState } from 'react'
import { X, Search, ChevronDown, ChevronUp, BookOpen, Atom, Layers, Zap, FlaskConical, Hash } from 'lucide-react'
import { QC_METHODS, DFT_FUNCTIONALS, BASIS_SETS, KEY_EQUATIONS, SPECTROSCOPY_GUIDE } from '../lib/quantumChemKnowledge'

type Tab = 'methods' | 'functionals' | 'basis' | 'equations' | 'guide'

interface Props { onClose: () => void }

function Badge({ text, color }: { text: string; color: string }) {
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{text}</span>
}

function AccuracyBadge({ accuracy }: { accuracy: string }) {
  const colors: Record<string, string> = {
    'low': 'bg-red-500/20 text-red-300','moderate': 'bg-yellow-500/20 text-yellow-300',
    'good': 'bg-blue-500/20 text-blue-300','high': 'bg-emerald-500/20 text-emerald-300',
    'very high': 'bg-purple-500/20 text-purple-300','exact (FCI limit)': 'bg-pink-500/20 text-pink-300',
  }
  return <Badge text={accuracy} color={colors[accuracy] || 'bg-gray-500/20 text-gray-300'} />
}

function RungBadge({ rung, name }: { rung: number; name: string }) {
  const colors = ['','bg-gray-500/20 text-gray-300','bg-blue-500/20 text-blue-300','bg-cyan-500/20 text-cyan-300','bg-purple-500/20 text-purple-300','bg-pink-500/20 text-pink-300']
  return <Badge text={`Rung ${rung}: ${name}`} color={colors[rung] || 'bg-gray-500/20 text-gray-300'} />
}

function ExpandCard({ title, subtitle, badge, children }: { title: string; subtitle: string; badge?: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border rounded-xl transition-all ${open ? 'border-quantum-500/50 bg-gray-800/80' : 'border-gray-700/50 bg-gray-800/40 hover:border-gray-600/50'}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-start gap-3 p-4 text-left">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white text-sm">{title}</span>{badge}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle.substring(0,110)}{subtitle.length>110?'...':''}</p>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0 mt-0.5" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />}
      </button>
      {open && <div className="px-4 pb-4 space-y-3 border-t border-gray-700/50 pt-3">{children}</div>}
    </div>
  )
}

function InfoRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</div>
      <ul className="space-y-0.5">{items.map((item,i) => <li key={i} className="text-xs text-gray-300 flex gap-1.5"><span className="text-quantum-400 flex-shrink-0">-</span><span>{item}</span></li>)}</ul>
    </div>
  )
}

export default function MethodsLibrary({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('methods')
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { id:'methods', label:'QC Methods', icon:<Atom size={14}/>, count:QC_METHODS.length },
    { id:'functionals', label:'DFT Functionals', icon:<Layers size={14}/>, count:DFT_FUNCTIONALS.length },
    { id:'basis', label:'Basis Sets', icon:<Hash size={14}/>, count:BASIS_SETS.length },
    { id:'equations', label:'Key Equations', icon:<Zap size={14}/>, count:KEY_EQUATIONS.length },
    { id:'guide', label:'Method Guide', icon:<FlaskConical size={14}/>, count:SPECTROSCOPY_GUIDE.length },
  ]

  const q = search.toLowerCase()
  const filteredMethods = QC_METHODS.filter(m => (catFilter==='all'||m.category===catFilter)&&(m.name.toLowerCase().includes(q)||m.fullName.toLowerCase().includes(q)||m.description.toLowerCase().includes(q)))
  const filteredFunctionals = DFT_FUNCTIONALS.filter(f => (catFilter==='all'||String(f.rung)===catFilter)&&(f.name.toLowerCase().includes(q)||f.description.toLowerCase().includes(q)))
  const filteredBasis = BASIS_SETS.filter(b => (catFilter==='all'||b.family===catFilter)&&(b.name.toLowerCase().includes(q)||b.family.toLowerCase().includes(q)||b.description.toLowerCase().includes(q)))

  const methodCats = ['all',...Array.from(new Set(QC_METHODS.map(m=>m.category)))]
  const basisFamilies = ['all',...Array.from(new Set(BASIS_SETS.map(b=>b.family)))]

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl my-4">
        <div className="flex items-center gap-3 p-5 border-b border-gray-800">
          <BookOpen size={20} className="text-quantum-400" />
          <div>
            <h2 className="text-lg font-bold text-white">Quantum Chemistry Methods Library</h2>
            <p className="text-xs text-gray-400">{QC_METHODS.length} methods · {DFT_FUNCTIONALS.length} functionals · {BASIS_SETS.length} basis sets · comprehensive reference</p>
          </div>
          <button onClick={onClose} className="ml-auto p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"><X size={18}/></button>
        </div>
        <div className="flex gap-1 p-3 border-b border-gray-800 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={()=>{setActiveTab(tab.id);setSearch('');setCatFilter('all')}}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeTab===tab.id?'bg-quantum-600/20 text-quantum-300 border border-quantum-500/40':'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}>
              {tab.icon} {tab.label}
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeTab===tab.id?'bg-quantum-500/30 text-quantum-300':'bg-gray-700 text-gray-400'}`}>{tab.count}</span>
            </button>
          ))}
        </div>
        {activeTab!=='equations'&&activeTab!=='guide'&&(
          <div className="flex gap-2 p-3 border-b border-gray-800">
            <div className="flex-1 flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
              <Search size={14} className="text-gray-400"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${activeTab}...`}
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"/>
            </div>
            <select value={catFilter} onChange={e=>setCatFilter(e.target.value)}
              className="bg-gray-800 text-xs text-gray-300 rounded-lg px-3 py-2 border border-gray-700 outline-none">
              {activeTab==='methods'&&methodCats.map(c=><option key={c} value={c}>{c==='all'?'All categories':c}</option>)}
              {activeTab==='functionals'&&['all','1','2','3','4','5'].map(r=><option key={r} value={r}>{r==='all'?'All rungs':'Rung '+r}</option>)}
              {activeTab==='basis'&&basisFamilies.map(f=><option key={f} value={f}>{f==='all'?'All families':f}</option>)}
            </select>
          </div>
        )}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
          {activeTab==='methods'&&filteredMethods.map(m=>(
            <ExpandCard key={m.id} title={m.name+' — '+m.fullName} subtitle={m.description} badge={<AccuracyBadge accuracy={m.accuracy}/>}>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-gray-400">Category:</span> <span className="text-gray-200">{m.category}</span></div>
                <div><span className="text-gray-400">Scaling:</span> <span className="text-quantum-300 font-mono">{m.scaling}</span></div>
              </div>
              <div className="text-xs text-gray-300 bg-gray-900/50 rounded-lg p-3 font-mono leading-relaxed">{m.math}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow label="Benefits" items={m.benefits}/>
                <InfoRow label="Limitations" items={m.limitations}/>
              </div>
              <InfoRow label="Best for" items={m.bestFor}/>
              <div className="text-xs text-gray-400"><span className="font-semibold text-gray-300">Software: </span>{m.software.join(', ')}{m.year&&<span className="ml-3 text-gray-500">Introduced: {m.year}</span>}</div>
            </ExpandCard>
          ))}
          {activeTab==='functionals'&&filteredFunctionals.map(f=>(
            <ExpandCard key={f.id} title={f.name} subtitle={f.description} badge={<RungBadge rung={f.rung} name={f.rungName}/>}>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-gray-400">Exact Exchange:</span> <span className="text-quantum-300 font-semibold">{f.hfx}</span></div>
                {f.year&&<div><span className="text-gray-400">Year:</span> <span className="text-gray-200">{f.year}</span></div>}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{f.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow label="Strengths" items={f.strengths}/>
                <InfoRow label="Weaknesses" items={f.weaknesses}/>
              </div>
              <InfoRow label="Best for" items={f.bestFor}/>
            </ExpandCard>
          ))}
          {activeTab==='basis'&&filteredBasis.map(b=>(
            <ExpandCard key={b.id} title={b.name} subtitle={b.description} badge={<Badge text={b.quality} color="bg-teal-500/20 text-teal-300"/>}>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-gray-400">Family:</span> <span className="text-gray-200">{b.family}</span></div>
                <div><span className="text-gray-400">Elements:</span> <span className="text-gray-200">{b.elementCoverage}</span></div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{b.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow label="Best for" items={b.bestFor}/>
                <InfoRow label="Limitations" items={b.limitations}/>
              </div>
            </ExpandCard>
          ))}
          {activeTab==='equations'&&KEY_EQUATIONS.map((eq,i)=>(
            <div key={i} className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 hover:border-quantum-500/30 transition-colors">
              <h4 className="font-semibold text-white text-sm mb-2">{eq.name}</h4>
              <div className="bg-gray-900/80 rounded-lg px-4 py-3 font-mono text-quantum-300 text-sm mb-2 overflow-x-auto">{eq.eq}</div>
              <p className="text-xs text-gray-400 leading-relaxed">{eq.description}</p>
            </div>
          ))}
          {activeTab==='guide'&&(
            <div className="space-y-2">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-3">
                <p className="text-xs text-blue-300">Method selection guide for common quantum chemistry properties. Recommendations reflect current best practices.</p>
              </div>
              {SPECTROSCOPY_GUIDE.map((g,i)=>(
                <div key={i} className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
                  <h4 className="font-semibold text-white text-sm mb-1">{g.property}</h4>
                  <div className="text-xs font-mono text-quantum-300 bg-gray-900/60 rounded px-3 py-1.5 mb-2">{g.method}</div>
                  <p className="text-xs text-gray-400">{g.notes}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab==='methods'&&filteredMethods.length===0&&<div className="text-center py-8 text-gray-500 text-sm">No methods match your search</div>}
          {activeTab==='functionals'&&filteredFunctionals.length===0&&<div className="text-center py-8 text-gray-500 text-sm">No functionals match your search</div>}
          {activeTab==='basis'&&filteredBasis.length===0&&<div className="text-center py-8 text-gray-500 text-sm">No basis sets match your search</div>}
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800 text-xs text-gray-500">
          <span>QuantumTask/QuantumChat Knowledge Base · Jacob's Ladder · All major QC methods</span>
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors">Close</button>
        </div>
      </div>
    </div>
  )
}
