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
const ROW_HEIGHT = 8

const toCellText = (value: unknown) => {
  if (value === null || value === undefined) return '-'
  return String(value)
}

export function exportTableToPdf({ filename, title, columns, rows }: ExportPdfParams) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
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

  const drawTableHeader = (startY: number) => {
    doc.setFillColor(234, 243, 239)
    doc.rect(PAGE_MARGIN, startY, tableWidth, ROW_HEIGHT, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)

    columns.forEach((column, index) => {
      const x = PAGE_MARGIN + index * colWidth + 1.5
      doc.text(column.title, x, startY + 5.5, { maxWidth: colWidth - 3 })
    })
  }

  drawHeader()
  let y = PAGE_MARGIN + 10 + HEADER_GAP
  drawTableHeader(y)
  y += ROW_HEIGHT

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)

  for (const row of rows) {
    if (y + ROW_HEIGHT > pageHeight - PAGE_MARGIN) {
      doc.addPage()
      drawHeader()
      y = PAGE_MARGIN + 10 + HEADER_GAP
      drawTableHeader(y)
      y += ROW_HEIGHT
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
    }

    doc.rect(PAGE_MARGIN, y - ROW_HEIGHT, tableWidth, ROW_HEIGHT)

    columns.forEach((column, index) => {
      const x = PAGE_MARGIN + index * colWidth
      doc.rect(x, y - ROW_HEIGHT, colWidth, ROW_HEIGHT)
      doc.text(toCellText(row[column.key]), x + 1.5, y - 2.5, { maxWidth: colWidth - 3 })
    })

    y += ROW_HEIGHT
  }

  doc.save(filename)
}
