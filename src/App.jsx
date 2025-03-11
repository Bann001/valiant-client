import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './utils/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/dashboard/Dashboard';
import EmployeeListPage from './pages/employees/EmployeeListPage';
import EmployeeFormPage from './pages/employees/EmployeeFormPage';
import AttendancePage from './pages/attendance/AttendancePage';
import VesselListPage from './pages/vessels/VesselListPage';
import VesselFormPage from './pages/vessels/VesselFormPage';
import PayrollPage from './pages/payroll/PayrollPage';
import ReportsPage from './pages/reports/ReportsPage';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// App component that doesn't use the auth context directly
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/employees" 
        element={
          <ProtectedRoute>
            <EmployeeListPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/employees/add" 
        element={
          <ProtectedRoute>
            <EmployeeFormPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/employees/edit/:id" 
        element={
          <ProtectedRoute>
            <EmployeeFormPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/attendance" 
        element={
          <ProtectedRoute>
            <AttendancePage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/vessels" 
        element={
          <ProtectedRoute>
            <VesselListPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/vessels/add" 
        element={
          <ProtectedRoute>
            <VesselFormPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/vessels/edit/:id" 
        element={
          <ProtectedRoute>
            <VesselFormPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/payroll" 
        element={
          <ProtectedRoute>
            <PayrollPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        } 
      />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router basename="/valiant">
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
