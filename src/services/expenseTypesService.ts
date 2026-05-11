import { supabase } from '../lib/supabase'

const EXPENSE_TYPES_TABLE = 'expense_type'
const EXPENSE_CODE_PREFIX = 'EXP-'

export type ExpenseStatus = 'Active' | 'Inactive'

export type ExpenseTypeItem = {
  key: string
  id: number
  code: string
  name: string
  glAccount: string
  status: ExpenseStatus
}

type SupabaseExpenseTypeRow = {
  id: number
  code: string | null
  expense_type: string | null
  gl_account: string | null
  status: string | null
}

export type CreateExpenseTypeInput = {
  name: string
  glAccount?: string
  status: ExpenseStatus
}

export type UpdateExpenseTypeInput = CreateExpenseTypeInput & {
  id: number
}

function formatExpenseCode(numberValue: number) {
  return `${EXPENSE_CODE_PREFIX}${String(numberValue).padStart(3, '0')}`
}

function parseExpenseCode(code: string | null | undefined) {
  if (!code) return 0
  const match = code.trim().toUpperCase().match(/^EXP-(\d+)$/)
  if (!match) return 0
  return Number(match[1]) || 0
}

function mapExpenseTypeRow(row: SupabaseExpenseTypeRow): ExpenseTypeItem {
  return {
    key: String(row.id),
    id: row.id,
    code: row.code ?? '-',
    name: row.expense_type ?? '-',
    glAccount: row.gl_account ?? '-',
    status: row.status === 'Active' ? 'Active' : 'Inactive',
  }
}

export async function fetchExpenseTypes() {
  const { data, error } = await supabase
    .from(EXPENSE_TYPES_TABLE)
    .select('id, code, expense_type, gl_account, status')
    .order('id', { ascending: true })

  if (error) {
    throw new Error(error.message || 'Failed to load expense types.')
  }

  return (data as SupabaseExpenseTypeRow[]).map(mapExpenseTypeRow)
}

export async function getNextExpenseTypeCode() {
  const { data, error } = await supabase.from(EXPENSE_TYPES_TABLE).select('code')

  if (error) {
    throw new Error(error.message || 'Failed to generate expense type code.')
  }

  const maxCodeNumber = (data ?? []).reduce((maxValue, row) => {
    const numericPart = parseExpenseCode((row as { code: string | null }).code)
    return Math.max(maxValue, numericPart)
  }, 0)

  return formatExpenseCode(maxCodeNumber + 1)
}

export async function createExpenseType(input: CreateExpenseTypeInput) {
  const nextCode = await getNextExpenseTypeCode()

  const payload = {
    code: nextCode,
    expense_type: input.name.trim(),
    gl_account: input.glAccount?.trim() || null,
    status: input.status,
  }

  const { error } = await supabase.from(EXPENSE_TYPES_TABLE).insert(payload)
  if (error) {
    throw new Error(error.message || 'Failed to create expense type.')
  }
}

export async function updateExpenseType(input: UpdateExpenseTypeInput) {
  const payload = {
    expense_type: input.name.trim(),
    gl_account: input.glAccount?.trim() || null,
    status: input.status,
  }

  const { error } = await supabase.from(EXPENSE_TYPES_TABLE).update(payload).eq('id', input.id)
  if (error) {
    throw new Error(error.message || 'Failed to update expense type.')
  }
}
