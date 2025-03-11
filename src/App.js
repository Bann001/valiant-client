import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/dashboard/Dashboard';
import EmployeeListPage from './pages/employees/EmployeeListPage';
import EmployeeFormPage from './pages/employees/EmployeeFormPage';
import AttendancePage from './pages/attendance/AttendancePage';
import PayrollPage from './pages/payroll/PayrollPage';
import ReportsPage from './pages/reports/ReportsPage';
import VesselListPage from './pages/vessels/VesselListPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { isAuthenticated } from './utils/authService';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          isAuthenticated() ? <Navigate to="/dashboard" /> : <LoginPage />
        } />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeeListPage />} />
          <Route path="/employees/add" element={<EmployeeFormPage />} />
          <Route path="/employees/edit/:id" element={<EmployeeFormPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/payroll" element={<PayrollPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/vessels" element={<VesselListPage />} />
        </Route>

        {/* Redirect to login if not authenticated, otherwise to dashboard */}
        <Route path="*" element={
          isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App; 