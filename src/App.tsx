import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Disbursement from './pages/Disbursement'
import ExpenseType from './pages/ExpenseType'
import OperationType from './pages/OperationType'
import Reports from './pages/Reports'
import Supplier from './pages/Supplier'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/supplier" element={<Supplier />} />
        <Route path="/operation-type" element={<OperationType />} />
        <Route path="/expense-type" element={<ExpenseType />} />
        <Route path="/disbursement" element={<Disbursement />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default App
