import { supabase } from '../lib/supabase'

const SUPPLIERS_TABLE = 'suppliers'

export type SupplierStatus = 'Active' | 'Pending' | 'Inactive'

export type SupplierItem = {
  key: string
  id: number
  supplierCode: string
  supplierName: string
  contactPerson: string
  category: string
  email: string
  phone: string
  status: SupplierStatus
}

type SupabaseSupplierRow = {
  id: number
  code: string | null
  supplier_name: string | null
  contact_person: string | null
  category: string | null
  email: string | null
  phone: string | null
  status: string | null
}

export type CreateSupplierInput = {
  supplierName: string
  contactPerson?: string
  category?: string
  email?: string
  phone?: string
  status: SupplierStatus
}

export type UpdateSupplierInput = CreateSupplierInput & {
  id: number
}

const SUPPLIER_CODE_PREFIX = 'SUP-'

function formatSupplierCode(numberValue: number) {
  return `${SUPPLIER_CODE_PREFIX}${String(numberValue).padStart(3, '0')}`
}

function parseSupplierCode(code: string | null | undefined) {
  if (!code) return 0
  const match = code.trim().toUpperCase().match(/^SUP-(\d+)$/)
  if (!match) return 0
  return Number(match[1]) || 0
}

function mapSupplierRow(row: SupabaseSupplierRow): SupplierItem {
  const statusValue = row.status === 'Active' || row.status === 'Pending' ? row.status : 'Inactive'
  return {
    key: String(row.id),
    id: row.id,
    supplierCode: row.code ?? '-',
    supplierName: row.supplier_name ?? '-',
    contactPerson: row.contact_person ?? '-',
    category: row.category ?? '-',
    email: row.email ?? '-',
    phone: row.phone ?? '-',
    status: statusValue,
  }
}

export async function fetchSuppliers() {
  const { data, error } = await supabase
    .from(SUPPLIERS_TABLE)
    .select('id, code, supplier_name, contact_person, category, email, phone, status')
    .order('id', { ascending: true })

  if (error) {
    throw new Error(error.message || 'Failed to load suppliers.')
  }

  return (data as SupabaseSupplierRow[]).map(mapSupplierRow)
}

export async function getNextSupplierCode() {
  const { data, error } = await supabase.from(SUPPLIERS_TABLE).select('code')

  if (error) {
    throw new Error(error.message || 'Failed to generate supplier code.')
  }

  const maxCodeNumber = (data ?? []).reduce((maxValue, row) => {
    const numericPart = parseSupplierCode((row as { code: string | null }).code)
    return Math.max(maxValue, numericPart)
  }, 0)

  return formatSupplierCode(maxCodeNumber + 1)
}

export async function createSupplier(input: CreateSupplierInput) {
  const nextCode = await getNextSupplierCode()

  const payload = {
    code: nextCode,
    supplier_name: input.supplierName.trim(),
    contact_person: input.contactPerson?.trim() || null,
    category: input.category?.trim() || null,
    email: input.email?.trim().toLowerCase() || null,
    phone: input.phone?.trim() || null,
    status: input.status,
  }

  const { error } = await supabase.from(SUPPLIERS_TABLE).insert(payload)
  if (error) {
    throw new Error(error.message || 'Failed to create supplier.')
  }
}

export async function updateSupplier(input: UpdateSupplierInput) {
  const payload = {
    supplier_name: input.supplierName.trim(),
    contact_person: input.contactPerson?.trim() || null,
    category: input.category?.trim() || null,
    email: input.email?.trim().toLowerCase() || null,
    phone: input.phone?.trim() || null,
    status: input.status,
  }

  const { error } = await supabase.from(SUPPLIERS_TABLE).update(payload).eq('id', input.id)
  if (error) {
    throw new Error(error.message || 'Failed to update supplier.')
  }
}

export async function deleteSupplier(id: number) {
  const { error } = await supabase.from(SUPPLIERS_TABLE).delete().eq('id', id)
  if (error) {
    throw new Error(error.message || 'Failed to delete supplier.')
  }
}
