import { useState, useRef, useEffect } from 'react'
import { Download, ChevronDown, Loader2 } from 'lucide-react'
import { exportContent, ExportFormat } from '../lib/exportUtils'

interface Props {
  title: string
  markdownContent: string
  baseFilename: string
  className?: string
  fullWidth?: boolean
}

const FORMAT_LABELS: { format: ExportFormat; label: string; ext: string }[] = [
  { format: 'md', label: 'Markdown (.md)', ext: 'MD' },
  { format: 'pdf', label: 'PDF (.pdf)', ext: 'PDF' },
  { format: 'docx', label: 'Word (.docx)', ext: 'DOCX' },
]

export default function ExportMenu({ title, markdownContent, baseFilename, className = '', fullWidth = false }: Props) {
  const [open, setOpen] = useState(false)
  const [exporting, setExporting] = useState<ExportFormat | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleExport = async (format: ExportFormat) => {
    setOpen(false)
    setExporting(format)
    try {
      await exportContent(format, title, markdownContent, baseFilename)
    } finally {
      setExporting(null)
    }
  }

  const btnClass = fullWidth
    ? 'w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-600/20'
    : 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-emerald-400 hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-700'

  return (
    <div ref={ref} className={`relative ${fullWidth ? 'w-full' : 'inline-flex'} ${className}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className={btnClass}
        title="Export"
      >
        {exporting ? (
          <Loader2 size={fullWidth ? 16 : 13} className="animate-spin" />
        ) : (
          <Download size={fullWidth ? 16 : 13} />
        )}
        {fullWidth ? 'Export Report' : 'Export'}
        <ChevronDown size={fullWidth ? 14 : 11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-1 w-44 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Export as
          </div>
          {FORMAT_LABELS.map(({ format, label, ext }) => (
            <button
              key={format}
              onClick={() => handleExport(format)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-left"
            >
              <span className="w-10 text-center text-xs font-mono font-bold px-1 py-0.5 rounded bg-gray-800 text-emerald-400 border border-gray-700">{ext}</span>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
