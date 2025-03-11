import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Typography, 
  Paper,
  Divider
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import VesselEmployeeDialog from './VesselEmployeeDialog';
import './VesselForm.css';

const initialFormState = {
  vesselName: '',
  imo: '',
  deliveryDate: null,
  registrationDate: null,
  employees: []
};

const VesselForm = ({ vessel = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    if (vessel) {
      setFormData({
        ...vessel,
        deliveryDate: vessel.deliveryDate ? new Date(vessel.deliveryDate) : null,
        registrationDate: vessel.registrationDate ? new Date(vessel.registrationDate) : null,
        employees: vessel.employees || []
      });
    }
  }, [vessel]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const handleSaveAndAddAnother = (e) => {
    e.preventDefault();
    onSubmit(formData, true);
    setFormData(initialFormState);
  };
  
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const handleAddEmployee = (employee) => {
    setFormData({
      ...formData,
      employees: [...formData.employees, employee]
    });
    setDialogOpen(false);
  };
  
  return (
    <Paper elevation={0} className="vessel-form-container">
      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
        {vessel ? 'Edit Vessel' : 'Add Vessel'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Vessel Name"
              name="vesselName"
              value={formData.vesselName}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="IMO"
              name="imo"
              value={formData.imo}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Delivery Date"
                value={formData.deliveryDate}
                onChange={(date) => handleDateChange('deliveryDate', date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Registration Date"
                value={formData.registrationDate}
                onChange={(date) => handleDateChange('registrationDate', date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h3">
                Employees
              </Typography>
              <Button 
                variant="contained" 
                onClick={handleOpenDialog}
                sx={{ 
                  bgcolor: '#4361ee',
                  '&:hover': {
                    bgcolor: '#3a56d4'
                  }
                }}
              >
                + Add
              </Button>
            </Box>
            
            {formData.employees.length > 0 ? (
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  {formData.employees.map((employee, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          border: '1px solid #eee',
                          borderRadius: '8px'
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {employee.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {employee.position}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                No employees assigned to this vessel yet.
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ 
                bgcolor: '#4361ee',
                '&:hover': {
                  bgcolor: '#3a56d4'
                }
              }}
            >
              Save
            </Button>
            {!vessel && (
              <Button
                variant="contained"
                onClick={handleSaveAndAddAnother}
                sx={{ 
                  bgcolor: '#4361ee',
                  '&:hover': {
                    bgcolor: '#3a56d4'
                  }
                }}
              >
                Save & Add Another
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={onCancel}
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
          </Grid>
        </Grid>
      </Box>
      
      <VesselEmployeeDialog 
        open={dialogOpen}
        onClose={handleCloseDialog}
        onAdd={handleAddEmployee}
      />
    </Paper>
  );
};

export default VesselForm; 