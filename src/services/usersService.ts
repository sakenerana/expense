import { createClient } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
const USERS_TABLE = 'users'

export type UserItem = {
  key: string
  id: string
  numericId: number
  userUuid: string
  firstName: string
  middleName: string
  lastName: string
  name: string
  email: string
  role: string
  status: string
}

type SupabaseUserRow = {
  id: number
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  email: string | null
  role: string | null
  status: string | null
  user_uuid: string | null
}

export async function fetchUsers() {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .select('id, first_name, middle_name, last_name, email, role, status, user_uuid')
    .order('id', { ascending: true })

  if (error) {
    throw new Error(error.message || 'Failed to load users.')
  }

  return (data as SupabaseUserRow[]).map((row) => {
    const firstName = row.first_name?.trim() ?? ''
    const middleName = row.middle_name?.trim() ?? ''
    const lastName = row.last_name?.trim() ?? ''
    const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ').trim()
    const idValue = row.user_uuid ?? String(row.id)

    return {
      key: idValue,
      id: idValue,
      numericId: row.id,
      userUuid: row.user_uuid ?? '',
      firstName,
      middleName,
      lastName,
      name: fullName || '-',
      email: row.email ?? '-',
      role: row.role ?? '-',
      status: row.status ?? 'Inactive',
    } satisfies UserItem
  })
}

export async function deleteUser(user: Pick<UserItem, 'numericId' | 'userUuid'>) {
  const deleteQuery = supabase.from(USERS_TABLE).delete()
  const { error } = user.userUuid
    ? await deleteQuery.eq('user_uuid', user.userUuid)
    : await deleteQuery.eq('id', user.numericId)

  if (error) {
    throw new Error(error.message || 'Failed to delete user.')
  }
}

export type CreateUserInput = {
  firstName: string
  middleName?: string
  lastName: string
  email: string
  role: string
  status: string
  password: string
}

export async function createUser(input: CreateUserInput) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or anon key in .env')
  }

  // Stateless client so admin session is not replaced during sign up.
  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

  const { data: authData, error: authError } = await authClient.auth.signUp({
    email: input.email.trim(),
    password: input.password,
  })

  if (authError) {
    throw new Error(authError.message || 'Failed to create authentication user.')
  }

  const authUserId = authData.user?.id

  if (!authUserId) {
    throw new Error('Authentication user was not returned by Supabase.')
  }

  const payload = {
    first_name: input.firstName.trim(),
    middle_name: input.middleName?.trim() || null,
    last_name: input.lastName.trim(),
    email: input.email.trim(),
    role: input.role,
    status: input.status,
    user_uuid: authUserId,
  }

  const { error } = await supabase.from(USERS_TABLE).insert(payload)

  if (error) {
    throw new Error(
      `${error.message || 'Failed to create user profile row.'} Auth user may already exist and may need cleanup.`,
    )
  }
}

export type UpdateUserInput = {
  numericId: number
  userUuid?: string
  originalEmail?: string
  firstName: string
  middleName?: string
  lastName: string
  email: string
  role: string
  status: string
}

export async function updateUser(input: UpdateUserInput) {
  const normalizedNewEmail = input.email.trim().toLowerCase()
  const normalizedOriginalEmail = (input.originalEmail ?? '').trim().toLowerCase()

  if (input.userUuid && normalizedOriginalEmail && normalizedNewEmail !== normalizedOriginalEmail) {
    const { error } = await supabase.rpc('admin_update_user_email_and_profile', {
      p_user_uuid: input.userUuid,
      p_email: normalizedNewEmail,
      p_first_name: input.firstName.trim(),
      p_middle_name: input.middleName?.trim() || null,
      p_last_name: input.lastName.trim(),
      p_role: input.role,
      p_status: input.status,
    })

    if (error) {
      throw new Error(
        `${error.message || 'Failed to update auth email and profile.'} Make sure the RPC function is created in Supabase.`,
      )
    }

    return
  }

  const payload = {
    first_name: input.firstName.trim(),
    middle_name: input.middleName?.trim() || null,
    last_name: input.lastName.trim(),
    email: normalizedNewEmail,
    role: input.role,
    status: input.status,
  }

  const updateQuery = supabase.from(USERS_TABLE).update(payload)
  const { error } = input.userUuid
    ? await updateQuery.eq('user_uuid', input.userUuid)
    : await updateQuery.eq('id', input.numericId)

  if (error) {
    throw new Error(error.message || 'Failed to update user.')
  }
}
