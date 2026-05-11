import { supabase } from '../lib/supabase'

const OPERATION_TYPES_TABLE = 'operation_type'
const OPERATION_CODE_PREFIX = 'OPS-'

export type OperationStatus = 'Active' | 'Inactive'

export type OperationTypeItem = {
  key: string
  id: number
  code: string
  name: string
  description: string
  status: OperationStatus
}

type SupabaseOperationTypeRow = {
  id: number
  code: string | null
  operation_type: string | null
  description: string | null
  status: string | null
}

export type CreateOperationTypeInput = {
  name: string
  description?: string
  status: OperationStatus
}

export type UpdateOperationTypeInput = CreateOperationTypeInput & {
  id: number
}

function formatOperationCode(numberValue: number) {
  return `${OPERATION_CODE_PREFIX}${String(numberValue).padStart(3, '0')}`
}

function parseOperationCode(code: string | null | undefined) {
  if (!code) return 0
  const match = code.trim().toUpperCase().match(/^OPS-(\d+)$/)
  if (!match) return 0
  return Number(match[1]) || 0
}

function mapOperationTypeRow(row: SupabaseOperationTypeRow): OperationTypeItem {
  return {
    key: String(row.id),
    id: row.id,
    code: row.code ?? '-',
    name: row.operation_type ?? '-',
    description: row.description ?? '-',
    status: row.status === 'Active' ? 'Active' : 'Inactive',
  }
}

export async function fetchOperationTypes() {
  const { data, error } = await supabase
    .from(OPERATION_TYPES_TABLE)
    .select('id, code, operation_type, description, status')
    .order('id', { ascending: true })

  if (error) {
    throw new Error(error.message || 'Failed to load operation types.')
  }

  return (data as SupabaseOperationTypeRow[]).map(mapOperationTypeRow)
}

export async function getNextOperationTypeCode() {
  const { data, error } = await supabase.from(OPERATION_TYPES_TABLE).select('code')

  if (error) {
    throw new Error(error.message || 'Failed to generate operation type code.')
  }

  const maxCodeNumber = (data ?? []).reduce((maxValue, row) => {
    const numericPart = parseOperationCode((row as { code: string | null }).code)
    return Math.max(maxValue, numericPart)
  }, 0)

  return formatOperationCode(maxCodeNumber + 1)
}

export async function createOperationType(input: CreateOperationTypeInput) {
  const nextCode = await getNextOperationTypeCode()

  const payload = {
    code: nextCode,
    operation_type: input.name.trim(),
    description: input.description?.trim() || null,
    status: input.status,
  }

  const { error } = await supabase.from(OPERATION_TYPES_TABLE).insert(payload)
  if (error) {
    throw new Error(error.message || 'Failed to create operation type.')
  }
}

export async function updateOperationType(input: UpdateOperationTypeInput) {
  const payload = {
    operation_type: input.name.trim(),
    description: input.description?.trim() || null,
    status: input.status,
  }

  const { error } = await supabase.from(OPERATION_TYPES_TABLE).update(payload).eq('id', input.id)
  if (error) {
    throw new Error(error.message || 'Failed to update operation type.')
  }
}
