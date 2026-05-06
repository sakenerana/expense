import { Navigate, Route, Routes } from 'react-router-dom'
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

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/new" element={<AddUser />} />
        <Route path="/users/edit/:id" element={<AddUser />} />
        <Route path="/supplier" element={<Supplier />} />
        <Route path="/supplier/new" element={<AddSupplier />} />
        <Route path="/supplier/edit/:id" element={<AddSupplier />} />
        <Route path="/operation-type" element={<OperationType />} />
        <Route path="/operation-type/new" element={<AddOperationType />} />
        <Route path="/operation-type/edit/:id" element={<AddOperationType />} />
        <Route path="/expense-type" element={<ExpenseType />} />
        <Route path="/expense-type/new" element={<AddExpenseType />} />
        <Route path="/expense-type/edit/:id" element={<AddExpenseType />} />
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
