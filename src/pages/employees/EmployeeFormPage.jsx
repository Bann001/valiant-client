import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Alert, Snackbar } from '@mui/material';
import Layout from '../../components/layout/Layout';
import EmployeeForm from '../../components/employees/EmployeeForm';
import Loading from '../../components/layout/Loading';
// Import services
import { getEmployeeById, createEmployee, updateEmployee } from '../../utils/employeeService';
import './EmployeeFormPage.css';

const EmployeeFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (id) {
      fetchEmployee(id);
    }
  }, [id]);

  const fetchEmployee = async (employeeId) => {
    try {
      setLoading(true);
      
      // Fetch employee data from API
      const data = await getEmployeeById(employeeId);
      setEmployee(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching employee:', err);
      setError('Failed to fetch employee details. Please try again later.');
      setLoading(false);
    }
  };

  const handleSubmit = async (employeeData) => {
    try {
      setLoading(true);
      
      if (id) {
        // Update existing employee
        await updateEmployee(id, employeeData);
        
        setNotification({
          open: true,
          message: 'Employee updated successfully',
          severity: 'success'
        });
      } else {
        // Create new employee
        await createEmployee(employeeData);
        
        setNotification({
          open: true,
          message: 'Employee created successfully',
          severity: 'success'
        });
      }
      
      setLoading(false);
      // Redirect to employee list after successful submission
      navigate('/employees');
    } catch (err) {
      console.error('Error saving employee:', err);
      setNotification({
        open: true,
        message: `Failed to ${id ? 'update' : 'create'} employee: ${err.response?.data?.message || err.message}`,
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/employees');
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Layout title={id ? 'Edit Employee' : 'Add Employee'}>
      <Box className="employee-form-page">
        {loading && id ? (
          <Loading message="Loading employee details..." />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <EmployeeForm 
            employee={employee} 
            onSubmit={handleSubmit} 
            onCancel={handleCancel} 
          />
        )}
        
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default EmployeeFormPage; 