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

// ── PDF ───────────────────────────────────────────────────────────────────────
export function exportAsPDF(title: string, content: string, filename: string) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 16
  const maxW = pageW - margin * 2
  let y = margin

  // Strip markdown syntax to plain text for PDF
  const plain = content
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, (m) => m.replace(/`/g, ''))
    .replace(/^\s*[-*+]\s/gm, '• ')
    .replace(/^\s*\d+\.\s/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/---+/g, '──────────────────────────────')

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
