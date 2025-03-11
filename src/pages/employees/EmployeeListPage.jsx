import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert, Snackbar, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import EmployeeList from '../../components/employees/EmployeeList';
import Loading from '../../components/layout/Loading';
// Import services
import { getEmployees, deleteEmployee } from '../../utils/employeeService';
import './EmployeeListPage.css';

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      
      // Fetch employees from API
      const data = await getEmployees();
      setEmployees(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees. Please try again later.');
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    navigate('/employees/add');
  };

  const handleEdit = (employee) => {
    navigate(`/employees/edit/${employee._id}`);
  };

  const handleDelete = async (employeeId) => {
    try {
      // Delete employee from API
      await deleteEmployee(employeeId);
      
      // Update local state
      setEmployees(employees.filter(emp => emp._id !== employeeId));
      
      setNotification({
        open: true,
        message: 'Employee deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting employee:', error);
      setNotification({
        open: true,
        message: `Failed to delete employee: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Layout title="Employees">
      <Box className="employee-list-page">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddEmployee}
          >
            Add Employee
          </Button>
        </Box>
        
        {loading ? (
          <Loading message="Loading employees..." />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <EmployeeList 
            employees={employees} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
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

export default EmployeeListPage; 