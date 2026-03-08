import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

export type ExportFormat = 'md' | 'pdf' | 'docx'

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ── Markdown ──────────────────────────────────────────────────────────────────
export function exportAsMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown' })
  triggerDownload(blob, filename)
}

// Sanitise a string to Latin-1 safe characters for jsPDF standard fonts.
// jsPDF helvetica/courier/times only encode ISO-8859-1 (code points 0x00-0xFF).
// Anything outside that range produces garbled glyphs or question marks.
function sanitiseForPDF(text: string): string {
  return text
    // Smart / curly quotes -> ASCII quotes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    // Dashes: em-dash, en-dash, horizontal bar -> hyphen
    .replace(/[\u2013\u2014\u2015]/g, '-')
    // Ellipsis
    .replace(/\u2026/g, '...')
    // Bullet variants -> ASCII asterisk
    .replace(/[\u2022\u2023\u2024\u2043\u204C\u204D\u2219]/g, '*')
    // Box-drawing / block characters (used in separators) -> ASCII dash
    .replace(/[\u2500-\u257F]/g, '-')
    // Arrows -> ASCII equivalents
    .replace(/\u2192/g, '->')
    .replace(/\u2190/g, '<-')
    .replace(/\u2194/g, '<->')
    .replace(/\u21D2/g, '=>')
    .replace(/\u2191/g, '^')
    .replace(/\u2193/g, 'v')
    // Mathematical / scientific
    .replace(/\u00B1/g, '+/-')
    .replace(/\u00D7/g, 'x')
    .replace(/\u00F7/g, '/')
    .replace(/\u2265/g, '>=')
    .replace(/\u2264/g, '<=')
    .replace(/\u2260/g, '!=')
    .replace(/\u2248/g, '~=')
    .replace(/\u221E/g, 'inf')
    .replace(/\u03B1/g, 'alpha')
    .replace(/\u03B2/g, 'beta')
    .replace(/\u03B3/g, 'gamma')
    .replace(/\u03C0/g, 'pi')
    .replace(/\u03BC/g, 'mu')
    .replace(/\u03C3/g, 'sigma')
    .replace(/\u03C9/g, 'omega')
    .replace(/\u0394/g, 'Delta')
    .replace(/\u03A9/g, 'Omega')
    // Degree, prime
    .replace(/\u00B0/g, ' deg')
    .replace(/\u2032/g, "'")
    .replace(/\u2033/g, '"')
    // Superscript digits -> plain digits
    .replace(/[\u2070\u00B9\u00B2\u00B3\u2074-\u2079]/g, (c) => {
      const map: Record<string, string> = {
        '\u2070': '0', '\u00B9': '1', '\u00B2': '2', '\u00B3': '3',
        '\u2074': '4', '\u2075': '5', '\u2076': '6', '\u2077': '7',
        '\u2078': '8', '\u2079': '9',
      }
      return map[c] ?? ''
    })
    // Fraction slash, middle dot
    .replace(/\u2044/g, '/')
    .replace(/\u00B7/g, '.')
    // Non-breaking space -> regular space
    .replace(/\u00A0/g, ' ')
    // Catch-all: strip any remaining non-Latin-1 character (> U+00FF)
    .replace(/[^\x00-\xFF]/g, '?')
}

// ── PDF ───────────────────────────────────────────────────────────────────────
export function exportAsPDF(title: string, content: string, filename: string) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 16
  const maxW = pageW - margin * 2
  let y = margin

  // Strip markdown syntax to plain text, then sanitise to Latin-1 for jsPDF
  const plain = sanitiseForPDF(
    content
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`{1,3}[^`]*`{1,3}/g, (m) => m.replace(/`/g, ''))
      .replace(/^\s*[-*+]\s/gm, '* ')
      .replace(/^\s*\d+\.\s/gm, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/---+/g, '------------------------------')
  )

  // Header
  doc.setFillColor(15, 23, 42)
  doc.rect(0, 0, pageW, 14, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(139, 92, 246)
  doc.text(title, margin, 9)
  doc.setTextColor(100, 116, 139)
  doc.setFontSize(7)
  doc.text(new Date().toLocaleString(), pageW - margin, 9, { align: 'right' })
  y = 22

  doc.setTextColor(30, 30, 30)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)

  const lines = plain.split('\n')
  for (const raw of lines) {
    const wrapped = doc.splitTextToSize(raw.trimEnd() || ' ', maxW)
    for (const line of wrapped) {
      if (y + 5 > pageH - margin) {
        doc.addPage()
        y = margin
      }
      doc.text(line, margin, y)
      y += 5
    }
  }

  doc.save(filename)
}

// ── DOCX ──────────────────────────────────────────────────────────────────────
export async function exportAsDOCX(title: string, content: string, filename: string) {
  const children: Paragraph[] = []

  // Title paragraph
  children.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.LEFT,
    })
  )
  children.push(
    new Paragraph({
      children: [new TextRun({ text: `Generated: ${new Date().toLocaleString()}`, size: 18, color: '888888' })],
    })
  )
  children.push(new Paragraph({ text: '' }))

  const lines = content.split('\n')
  for (const line of lines) {
    const h6 = line.match(/^#{1,6}\s+(.+)/)
    if (h6) {
      const level = (line.match(/^(#+)/) || [''])[0].length
      const headingLevels = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4, HeadingLevel.HEADING_5, HeadingLevel.HEADING_6]
      children.push(new Paragraph({ text: h6[1], heading: headingLevels[Math.min(level - 1, 5)] || HeadingLevel.HEADING_3 }))
      continue
    }

    // Separator
    if (/^---+$/.test(line.trim())) {
      children.push(new Paragraph({ text: '─────────────────────────────────────────' }))
      continue
    }

    // Bullet list
    const bullet = line.match(/^\s*[-*+]\s+(.+)/)
    if (bullet) {
      children.push(new Paragraph({ text: `• ${bullet[1]}`, indent: { left: 360 } }))
      continue
    }

    // Numbered list
    const numbered = line.match(/^\s*\d+\.\s+(.+)/)
    if (numbered) {
      children.push(new Paragraph({ text: numbered[1], indent: { left: 360 } }))
      continue
    }

    // Normal line — parse inline bold/italic
    const runs: TextRun[] = []
    let remaining = line
    const tokenRe = /\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`/g
    let lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = tokenRe.exec(remaining)) !== null) {
      if (match.index > lastIndex) {
        runs.push(new TextRun({ text: remaining.slice(lastIndex, match.index) }))
      }
      if (match[1]) runs.push(new TextRun({ text: match[1], bold: true }))
      else if (match[2]) runs.push(new TextRun({ text: match[2], italics: true }))
      else if (match[3]) runs.push(new TextRun({ text: match[3], font: 'Courier New', size: 18 }))
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < remaining.length) {
      runs.push(new TextRun({ text: remaining.slice(lastIndex) }))
    }
    children.push(new Paragraph({ children: runs.length ? runs : [new TextRun({ text: '' })] }))
  }

  const doc = new Document({ sections: [{ properties: {}, children }] })
  const buffer = await Packer.toBlob(doc)
  triggerDownload(buffer, filename)
}

// ── Dispatcher ────────────────────────────────────────────────────────────────
export async function exportContent(
  format: ExportFormat,
  title: string,
  markdownContent: string,
  baseFilename: string
) {
  const safe = baseFilename.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40)
  if (format === 'md') exportAsMarkdown(markdownContent, `${safe}.md`)
  else if (format === 'pdf') exportAsPDF(title, markdownContent, `${safe}.pdf`)
  else if (format === 'docx') await exportAsDOCX(title, markdownContent, `${safe}.docx`)
}
