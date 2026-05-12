import { supabase } from '../lib/supabase'

const DISBURSEMENT_TABLE = 'disbursement'

export type RequestStatus = 'Processed' | 'Pending' | 'Paid' | 'For Liquidation'

export type DisbursementItem = {
  key: string
  id: number
  dateProcessed: string
  requestDate: string
  applicableMonth: string
  particulars: string
  operationType: string
  operationTypeId: number | null
  designation: string
  typeOfExpense: string
  expenseTypeId: number | null
  tinNumber: string
  supplier: string
  supplierId: number | null
  date: string
  sourceDocument: string
  referenceNo: string
  vatType: string
  amountRequested: number
  vatAmount: number
  netAmount: number
  gjDisbursement: string
  gjLiquidation: string
  abLinkRequest: string
  abLinkLiquidation: string
  requestTitle: string
  requestStatus: RequestStatus
  datePaid: string
  referenceNumber: string
  remarks: string
}

export type DisbursementUpsertInput = {
  id?: number
  dateProcessed?: string | null
  requestDate?: string | null
  applicableMonth?: string | null
  operationTypeId?: number | null
  particulars?: string | null
  designation?: string | null
  tinNumber?: string | null
  supplierId?: number | null
  expenseTypeId?: number | null
  sourceDocument?: string | null
  sourceDocumentReferenceNo?: string | null
  sourceDocumentDate?: string | null
  vatType?: string | null
  amountRequested?: number | null
  vatAmount?: number | null
  netAmount?: number | null
  referenceNo?: string | null
  gjDisbursement?: string | null
  gjLiquidation?: string | null
  abLinkRequest?: string | null
  abLinkLiquidation?: string | null
  requestTitle?: string | null
  requestStatus?: string | null
  datePaid?: string | null
  remarks?: string | null
}

type SupabaseDisbursementRow = {
  id: number
  date_processed: string | null
  request_date: string | null
  applicable_month: string | null
  operation_type_id: number | null
  particulars: string | null
  designation: string | null
  tin_number: string | null
  supplier_id: number | null
  expense_type_id: number | null
  source_document: string | null
  ref_no_document: string | null
  date_source_document: string | null
  vat_type: string | null
  amount_requested: number | null
  vat_amount: number | null
  net_amount: number | null
  ab_ref_no: string | null
  gj_disbursement: string | null
  gj_liquidation: string | null
  ab_link_request: string | null
  ab_link_liquidation: string | null
  request_title: string | null
  request_status: string | null
  date_paid: string | null
  remarks: string | null
}

type LookupEntry = {
  id: number
  label: string
}

const EMPTY_TEXT = '-'
const EMPTY_DATE = '-'

function toNullableTrimmed(value: string | null | undefined) {
  const trimmed = String(value ?? '').trim()
  return trimmed.length > 0 ? trimmed : null
}

function toNullableNumber(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function toDisplay(value: string | null | undefined, fallback = EMPTY_TEXT) {
  const normalized = String(value ?? '').trim()
  return normalized || fallback
}

function toDisplayDate(value: string | null | undefined) {
  const normalized = String(value ?? '').trim()
  return normalized || EMPTY_DATE
}

function normalizeStatus(value: string | null | undefined): RequestStatus {
  const normalized = String(value ?? '').trim()
  if (normalized === 'Processed' || normalized === 'Pending' || normalized === 'Paid' || normalized === 'For Liquidation') {
    return normalized
  }
  return 'Pending'
}

async function fetchLookupMap(
  table: 'operation_type' | 'suppliers' | 'expense_type',
  idColumn: string,
  labelColumn: string,
) {
  const { data, error } = await supabase.from(table).select('*')
  if (error) {
    throw new Error(error.message || `Failed to load ${table} lookup.`)
  }

  const map = new Map<number, string>()
  ;(data as unknown as Array<Record<string, unknown>> | null)?.forEach((row) => {
    const id = Number(row[idColumn])
    const label = String(row[labelColumn] ?? '').trim()
    if (Number.isFinite(id) && label) {
      map.set(id, label)
    }
  })
  return map
}

function mapDisbursementRow(
  row: SupabaseDisbursementRow,
  lookup: {
    operationTypes: Map<number, string>
    suppliers: Map<number, string>
    expenseTypes: Map<number, string>
  },
): DisbursementItem {
  const operationType = row.operation_type_id ? lookup.operationTypes.get(row.operation_type_id) ?? EMPTY_TEXT : EMPTY_TEXT
  const supplier = row.supplier_id ? lookup.suppliers.get(row.supplier_id) ?? EMPTY_TEXT : EMPTY_TEXT
  const typeOfExpense = row.expense_type_id ? lookup.expenseTypes.get(row.expense_type_id) ?? EMPTY_TEXT : EMPTY_TEXT

  return {
    key: String(row.id),
    id: row.id,
    dateProcessed: toDisplayDate(row.date_processed),
    requestDate: toDisplayDate(row.request_date),
    applicableMonth: toDisplayDate(row.applicable_month),
    particulars: toDisplay(row.particulars),
    operationType,
    operationTypeId: row.operation_type_id,
    designation: toDisplay(row.designation),
    typeOfExpense,
    expenseTypeId: row.expense_type_id,
    tinNumber: toDisplay(row.tin_number),
    supplier,
    supplierId: row.supplier_id,
    date: toDisplayDate(row.date_source_document),
    sourceDocument: toDisplay(row.source_document),
    referenceNo: toDisplay(row.ref_no_document),
    vatType: toDisplay(row.vat_type),
    amountRequested: row.amount_requested ?? 0,
    vatAmount: row.vat_amount ?? 0,
    netAmount: row.net_amount ?? 0,
    gjDisbursement: toDisplay(row.gj_disbursement),
    gjLiquidation: toDisplay(row.gj_liquidation),
    abLinkRequest: toDisplay(row.ab_link_request),
    abLinkLiquidation: toDisplay(row.ab_link_liquidation),
    requestTitle: toDisplay(row.request_title),
    requestStatus: normalizeStatus(row.request_status),
    datePaid: toDisplayDate(row.date_paid),
    referenceNumber: toDisplay(row.ab_ref_no),
    remarks: toDisplay(row.remarks),
  }
}

export async function fetchDisbursements() {
  const [{ data, error }, operationTypes, suppliers, expenseTypes] = await Promise.all([
    supabase
      .from(DISBURSEMENT_TABLE)
      .select(
        'id, date_processed, request_date, applicable_month, operation_type_id, particulars, designation, tin_number, supplier_id, expense_type_id, source_document, ref_no_document, date_source_document, vat_type, amount_requested, vat_amount, net_amount, ab_ref_no, gj_disbursement, gj_liquidation, ab_link_request, ab_link_liquidation, request_title, request_status, date_paid, remarks',
      )
      .order('id', { ascending: false }),
    fetchLookupMap('operation_type', 'id', 'operation_type'),
    fetchLookupMap('suppliers', 'id', 'supplier_name'),
    fetchLookupMap('expense_type', 'id', 'expense_type'),
  ])

  if (error) {
    throw new Error(error.message || 'Failed to load disbursements.')
  }

  const rows = (data ?? []) as SupabaseDisbursementRow[]
  return rows.map((row) =>
    mapDisbursementRow(row, {
      operationTypes,
      suppliers,
      expenseTypes,
    }),
  )
}

function buildUpsertPayload(input: DisbursementUpsertInput) {
  return {
    date_processed: input.dateProcessed ?? null,
    request_date: input.requestDate ?? null,
    applicable_month: input.applicableMonth ?? null,
    operation_type_id: toNullableNumber(input.operationTypeId),
    particulars: toNullableTrimmed(input.particulars),
    designation: toNullableTrimmed(input.designation),
    tin_number: toNullableTrimmed(input.tinNumber),
    supplier_id: toNullableNumber(input.supplierId),
    expense_type_id: toNullableNumber(input.expenseTypeId),
    source_document: toNullableTrimmed(input.sourceDocument),
    ref_no_document: toNullableTrimmed(input.sourceDocumentReferenceNo),
    date_source_document: input.sourceDocumentDate ?? null,
    vat_type: toNullableTrimmed(input.vatType),
    amount_requested: toNullableNumber(input.amountRequested),
    vat_amount: toNullableNumber(input.vatAmount),
    net_amount: toNullableNumber(input.netAmount),
    ab_ref_no: toNullableTrimmed(input.referenceNo),
    gj_disbursement: toNullableTrimmed(input.gjDisbursement),
    gj_liquidation: toNullableTrimmed(input.gjLiquidation),
    ab_link_request: toNullableTrimmed(input.abLinkRequest),
    ab_link_liquidation: toNullableTrimmed(input.abLinkLiquidation),
    request_title: toNullableTrimmed(input.requestTitle),
    request_status: toNullableTrimmed(input.requestStatus),
    date_paid: input.datePaid ?? null,
    remarks: toNullableTrimmed(input.remarks),
  }
}

export async function createDisbursement(input: DisbursementUpsertInput) {
  const payload = buildUpsertPayload(input)
  const { error } = await supabase.from(DISBURSEMENT_TABLE).insert(payload)
  if (error) {
    throw new Error(error.message || 'Failed to create disbursement.')
  }
}

export async function updateDisbursement(input: DisbursementUpsertInput & { id: number }) {
  const payload = buildUpsertPayload(input)
  const { error } = await supabase.from(DISBURSEMENT_TABLE).update(payload).eq('id', input.id)
  if (error) {
    throw new Error(error.message || 'Failed to update disbursement.')
  }
}

export async function fetchDisbursementFormLookups() {
  const [operationTypes, suppliers, expenseTypes] = await Promise.all([
    fetchLookupMap('operation_type', 'id', 'operation_type'),
    fetchLookupMap('suppliers', 'id', 'supplier_name'),
    fetchLookupMap('expense_type', 'id', 'expense_type'),
  ])

  const toOptions = (map: Map<number, string>): LookupEntry[] =>
    Array.from(map.entries())
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.label.localeCompare(b.label))

  return {
    operationTypes: toOptions(operationTypes),
    suppliers: toOptions(suppliers),
    expenseTypes: toOptions(expenseTypes),
  }
}
