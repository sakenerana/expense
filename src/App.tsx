import { Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import MainLayout from './layout/MainLayout'
import AddDisbursement from './pages/AddDisbursement'
import AddExpenseType from './pages/AddExpenseType'
import AddOperationType from './pages/AddOperationType'
import AddSupplier from './pages/AddSupplier'
import AddUser from './pages/AddUser'
import Dashboard from './pages/Dashboard'
import Disbursement from './pages/Disbursement'
import ExpenseType from './pages/ExpenseType'
import ForgotPassword from './pages/ForgotPassword'
import Login from './pages/Login'
import OperationType from './pages/OperationType'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Supplier from './pages/Supplier'
import Users from './pages/Users'
import { supabase, supabaseSession } from './lib/supabase'

type ProtectedRouteProps = {
  children: ReactNode
  allowedRoles?: string[]
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isRoleResolved, setIsRoleResolved] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const [{ data: localData }, { data: sessionData }] = await Promise.all([
        supabase.auth.getSession(),
        supabaseSession.auth.getSession()
      ])

      const session = localData.session || sessionData.session
      setIsAuthenticated(Boolean(session))

      if (!session?.user?.id) {
        setUserRole(null)
        setIsRoleResolved(true)
        return
      }

      try {
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('user_uuid', session.user.id)
          .maybeSingle()

        setUserRole(data?.role ? String(data.role) : null)
      } finally {
        setIsRoleResolved(true)
      }
    }

    void checkAuth()
  }, [])

  if (isAuthenticated === null) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!isRoleResolved) {
      return null
    }

    const normalizedRole = (userRole ?? '').toLowerCase()
    const isAllowed = allowedRoles.some((role) => role.toLowerCase() === normalizedRole)

    if (!isAllowed) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        element={(
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        )}
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<ProtectedRoute allowedRoles={['Admin']}><Users /></ProtectedRoute>} />
        <Route path="/users/new" element={<ProtectedRoute allowedRoles={['Admin']}><AddUser /></ProtectedRoute>} />
        <Route path="/users/edit/:id" element={<ProtectedRoute allowedRoles={['Admin']}><AddUser /></ProtectedRoute>} />
        <Route path="/supplier" element={<ProtectedRoute allowedRoles={['Admin']}><Supplier /></ProtectedRoute>} />
        <Route path="/supplier/new" element={<ProtectedRoute allowedRoles={['Admin']}><AddSupplier /></ProtectedRoute>} />
        <Route path="/supplier/edit/:id" element={<ProtectedRoute allowedRoles={['Admin']}><AddSupplier /></ProtectedRoute>} />
        <Route path="/operation-type" element={<ProtectedRoute allowedRoles={['Admin']}><OperationType /></ProtectedRoute>} />
        <Route path="/operation-type/new" element={<ProtectedRoute allowedRoles={['Admin']}><AddOperationType /></ProtectedRoute>} />
        <Route path="/operation-type/edit/:id" element={<ProtectedRoute allowedRoles={['Admin']}><AddOperationType /></ProtectedRoute>} />
        <Route path="/expense-type" element={<ProtectedRoute allowedRoles={['Admin']}><ExpenseType /></ProtectedRoute>} />
        <Route path="/expense-type/new" element={<ProtectedRoute allowedRoles={['Admin']}><AddExpenseType /></ProtectedRoute>} />
        <Route path="/expense-type/edit/:id" element={<ProtectedRoute allowedRoles={['Admin']}><AddExpenseType /></ProtectedRoute>} />
        <Route path="/disbursement" element={<Disbursement />} />
        <Route path="/disbursement/new" element={<AddDisbursement />} />
        <Route path="/disbursement/edit/:id" element={<AddDisbursement />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
