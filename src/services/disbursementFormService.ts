import { supabase } from '../lib/supabase'

export async function fetchOperationTypeOptions() {
  const { data, error } = await supabase
    .from('operation_type')
    .select('operation_type, status')
    .eq('status', 'Active')
    .order('operation_type', { ascending: true })

  if (error) {
    throw new Error(error.message || 'Failed to load operation types.')
  }

  return (data ?? [])
    .map((row) => String((row as { operation_type: string | null }).operation_type ?? '').trim())
    .filter(Boolean)
    .map((value) => ({ label: value, value }))
}

export async function fetchSupplierOptions() {
  const { data, error } = await supabase
    .from('suppliers')
    .select('supplier_name, status')
    .eq('status', 'Active')
    .order('supplier_name', { ascending: true })

  if (error) {
    throw new Error(error.message || 'Failed to load suppliers.')
  }

  return (data ?? [])
    .map((row) => String((row as { supplier_name: string | null }).supplier_name ?? '').trim())
    .filter(Boolean)
    .map((value) => ({ label: value, value }))
}

export async function fetchExpenseTypeOptions() {
  const { data, error } = await supabase
    .from('expense_type')
    .select('expense_type, status')
    .eq('status', 'Active')
    .order('expense_type', { ascending: true })

  if (error) {
    throw new Error(error.message || 'Failed to load expense types.')
  }

  return (data ?? [])
    .map((row) => String((row as { expense_type: string | null }).expense_type ?? '').trim())
    .filter(Boolean)
    .map((value) => ({ label: value, value }))
}
