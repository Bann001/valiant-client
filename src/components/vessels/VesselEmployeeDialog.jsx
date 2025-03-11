import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  Box,
  TextField,
  Autocomplete,
  Divider
} from '@mui/material';
import './VesselEmployeeDialog.css';

const VesselEmployeeDialog = ({ open, onClose, onAdd }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Fetch employees when dialog opens
    if (open) {
      fetchEmployees();
    }
  }, [open]);
  
  const fetchEmployees = async () => {
    setLoading(true);
    
    // For demo purposes, we'll use mock data
    // In a production environment, you would fetch from your API
    setTimeout(() => {
      const mockEmployees = [
        { id: '1', name: 'Emilia De Rothschild', position: 'Admin' },
        { id: '2', name: 'Aisha Garcia', position: 'Fighter' },
        { id: '3', name: 'Akio Morishimoto', position: 'Support' }
      ];
      
      setEmployees(mockEmployees);
      setLoading(false);
    }, 500);
  };
  
  const handleAdd = () => {
    if (selectedEmployee) {
      onAdd(selectedEmployee);
      setSelectedEmployee(null);
    }
  };
  
  const handleClose = () => {
    setSelectedEmployee(null);
    onClose();
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      className="vessel-employee-dialog"
    >
      <DialogTitle>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Add Vessel Employee
        </Typography>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <Autocomplete
            options={employees}
            getOptionLabel={(option) => option.name}
            value={selectedEmployee}
            onChange={(event, newValue) => {
              setSelectedEmployee(newValue);
            }}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Employee"
                variant="outlined"
                fullWidth
                required
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box>
                  <Typography variant="body1">{option.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.position}
                  </Typography>
                </Box>
              </Box>
            )}
          />
        </Box>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={handleClose}
          sx={{ 
            color: '#333', 
            borderColor: '#ccc',
            '&:hover': {
              borderColor: '#999'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleAdd}
          variant="contained"
          disabled={!selectedEmployee}
          sx={{ 
            bgcolor: '#4361ee',
            '&:hover': {
              bgcolor: '#3a56d4'
            }
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VesselEmployeeDialog; 