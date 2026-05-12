import { jsPDF } from 'jspdf'

type PdfColumn = {
  key: string
  title: string
}

type ExportPdfParams = {
  filename: string
  title: string
  columns: PdfColumn[]
  rows: Record<string, unknown>[]
}

const PAGE_MARGIN = 14
const HEADER_GAP = 8
const CELL_PADDING_X = 1.5
const CELL_PADDING_Y = 2
const MIN_ROW_HEIGHT = 8
const LINE_HEIGHT = 3.8

const toCellText = (value: unknown) => {
  if (value === null || value === undefined) return '-'
  // jsPDF built-in fonts do not reliably support the peso sign glyph (₱).
  // Replace it with "PHP " to avoid corrupted symbols in exported PDFs.
  return String(value).replace(/₱/g, 'PHP ')
}

export function exportTableToPdf({ filename, title, columns, rows }: ExportPdfParams) {
  const isWideTable = columns.length > 10
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: isWideTable ? 'a3' : 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const tableWidth = pageWidth - PAGE_MARGIN * 2
  const colWidth = tableWidth / columns.length

  const drawHeader = () => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text(title, PAGE_MARGIN, PAGE_MARGIN)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(`Generated: ${new Date().toLocaleString()}`, PAGE_MARGIN, PAGE_MARGIN + 5)
    doc.text(`Total Records: ${rows.length}`, PAGE_MARGIN, PAGE_MARGIN + 10)
  }

  const splitCellText = (text: string) => doc.splitTextToSize(text, Math.max(colWidth - CELL_PADDING_X * 2, 6))

  const drawTableHeader = (startY: number) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)

    const headerLinesPerColumn = columns.map((column) => splitCellText(column.title))
    const maxHeaderLines = Math.max(...headerLinesPerColumn.map((lines) => lines.length), 1)
    const headerHeight = Math.max(MIN_ROW_HEIGHT, CELL_PADDING_Y * 2 + maxHeaderLines * LINE_HEIGHT)

    doc.setFillColor(234, 243, 239)
    doc.rect(PAGE_MARGIN, startY, tableWidth, headerHeight, 'F')

    columns.forEach((_, index) => {
      const x = PAGE_MARGIN + index * colWidth
      doc.rect(x, startY, colWidth, headerHeight)
      doc.text(headerLinesPerColumn[index], x + CELL_PADDING_X, startY + CELL_PADDING_Y + LINE_HEIGHT - 0.6)
    })

    return headerHeight
  }

  drawHeader()
  let y = PAGE_MARGIN + 10 + HEADER_GAP
  y += drawTableHeader(y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)

  for (const row of rows) {
    const rowLinesByColumn = columns.map((column) => splitCellText(toCellText(row[column.key])))
    const maxRowLines = Math.max(...rowLinesByColumn.map((lines) => lines.length), 1)
    const rowHeight = Math.max(MIN_ROW_HEIGHT, CELL_PADDING_Y * 2 + maxRowLines * LINE_HEIGHT)

    if (y + rowHeight > pageHeight - PAGE_MARGIN) {
      doc.addPage()
      drawHeader()
      y = PAGE_MARGIN + 10 + HEADER_GAP
      y += drawTableHeader(y)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
    }

    doc.rect(PAGE_MARGIN, y, tableWidth, rowHeight)

    columns.forEach((_, index) => {
      const x = PAGE_MARGIN + index * colWidth
      doc.rect(x, y, colWidth, rowHeight)
      doc.text(rowLinesByColumn[index], x + CELL_PADDING_X, y + CELL_PADDING_Y + LINE_HEIGHT - 0.6)
    })

    y += rowHeight
  }

  doc.save(filename)
}
