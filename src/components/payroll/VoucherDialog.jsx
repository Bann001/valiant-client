import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  Box,
  TextField,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import './VoucherDialog.css';

const VoucherDialog = ({ open, onClose, onGenerate, employees, vessels }) => {
  const [formData, setFormData] = useState({
    startDate: new Date(),
    endDate: new Date(),
    vessel: '',
    employee: '',
    description: ''
  });
  
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
  
  const handleGenerate = () => {
    onGenerate(formData);
    onClose();
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="voucher-dialog"
    >
      <DialogTitle>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Generate Payroll Voucher
        </Typography>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(date) => handleDateChange('startDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={formData.endDate}
                  onChange={(date) => handleDateChange('endDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="vessel-select-label">Vessel</InputLabel>
                <Select
                  labelId="vessel-select-label"
                  id="vessel-select"
                  name="vessel"
                  value={formData.vessel}
                  label="Vessel"
                  onChange={handleChange}
                >
                  <MenuItem value="">All Vessels</MenuItem>
                  {vessels.map((vessel) => (
                    <MenuItem key={vessel.id} value={vessel.id}>
                      {vessel.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="employee-select-label">Employee</InputLabel>
                <Select
                  labelId="employee-select-label"
                  id="employee-select"
                  name="employee"
                  value={formData.employee}
                  label="Employee"
                  onChange={handleChange}
                >
                  <MenuItem value="">All Employees</MenuItem>
                  {employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose}
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
          onClick={handleGenerate}
          variant="contained"
          sx={{ 
            bgcolor: '#4361ee',
            '&:hover': {
              bgcolor: '#3a56d4'
            }
          }}
        >
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VoucherDialog; 