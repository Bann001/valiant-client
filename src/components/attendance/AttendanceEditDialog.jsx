import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  Grid,
  Divider,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import './AttendanceEditDialog.css';

const AttendanceEditDialog = ({ open, onClose, record, onSave }) => {
  const [formData, setFormData] = useState({
    day: false,
    night: false,
    otDay: false,
    otNight: false,
    np: false,
    status: 'Active'
  });
  
  const statusOptions = [
    { value: 'Active', label: 'Present' },
    { value: 'On Leave', label: 'On Leave' },
    { value: 'Terminated', label: 'Terminated' }
  ];

  useEffect(() => {
    if (record) {
      setFormData({
        day: record.day || false,
        night: record.night || false,
        otDay: record.otDay || false,
        otNight: record.otNight || false,
        np: record.np || false,
        status: record.status || 'Active'
      });
    }
  }, [record]);
  
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSave = () => {
    onSave({ ...record, ...formData });
    onClose();
  };
  
  if (!record) return null;
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="attendance-edit-dialog"
    >
      <DialogTitle>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Edit Attendance
        </Typography>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Employee Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Employee ID
              </Typography>
              <Typography variant="body1">
                {record.employeeId}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Employee Name
              </Typography>
              <Typography variant="body1">
                {record.employeeName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Position
              </Typography>
              <Typography variant="body1">
                {record.position}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleChange}
                  name="status"
                  label="Status"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#ccc'
                      },
                      '&:hover fieldset': {
                        borderColor: '#999'
                      }
                    }
                  }}
                >
                  {statusOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Attendance
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.day}
                    onChange={handleChange}
                    name="day"
                    sx={{ 
                      color: '#4361ee',
                      '&.Mui-checked': {
                        color: '#4361ee',
                      },
                    }}
                  />
                }
                label="Day Shift"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.night}
                    onChange={handleChange}
                    name="night"
                    sx={{ 
                      color: '#4361ee',
                      '&.Mui-checked': {
                        color: '#4361ee',
                      },
                    }}
                  />
                }
                label="Night Shift"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.otDay}
                    onChange={handleChange}
                    name="otDay"
                    sx={{ 
                      color: '#4361ee',
                      '&.Mui-checked': {
                        color: '#4361ee',
                      },
                    }}
                  />
                }
                label="OT Day"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.otNight}
                    onChange={handleChange}
                    name="otNight"
                    sx={{ 
                      color: '#4361ee',
                      '&.Mui-checked': {
                        color: '#4361ee',
                      },
                    }}
                  />
                }
                label="OT Night"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.np}
                    onChange={handleChange}
                    name="np"
                    sx={{ 
                      color: '#4361ee',
                      '&.Mui-checked': {
                        color: '#4361ee',
                      },
                    }}
                  />
                }
                label="NP (Not Present)"
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
          onClick={handleSave}
          variant="contained"
          sx={{ 
            bgcolor: '#4361ee',
            '&:hover': {
              bgcolor: '#3a56d4'
            }
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AttendanceEditDialog;