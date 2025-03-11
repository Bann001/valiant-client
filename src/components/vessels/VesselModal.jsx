import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  Typography,
  Chip,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Divider
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { createVessel, updateVessel } from '../../utils/vesselService';
import { getEmployees } from '../../utils/employeeService';

const VESSEL_TYPES = ['Cargo', 'Container', 'Tanker', 'Bulk Carrier', 'Other'];

const VesselModal = ({ open, onClose, onSuccess, vessel = null }) => {
  const [formData, setFormData] = useState({
    vesselName: '',
    imo: '',
    deliveryDate: null,
    registrationDate: null,
    status: 'Active',
    capacity: '',
    type: '',
    flag: '',
    assignedEmployees: []
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEditMode = !!vessel;

  useEffect(() => {
    // Fetch employees
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };

    fetchEmployees();

    // If in edit mode, populate form with vessel data
    if (isEditMode && vessel) {
      setFormData({
        vesselName: vessel.vesselName || '',
        imo: vessel.imo || '',
        deliveryDate: vessel.deliveryDate ? new Date(vessel.deliveryDate) : null,
        registrationDate: vessel.registrationDate ? new Date(vessel.registrationDate) : null,
        status: vessel.status || 'Active',
        capacity: vessel.capacity || '',
        type: vessel.type || '',
        flag: vessel.flag || '',
        assignedEmployees: vessel.assignedEmployees || []
      });
    }
  }, [isEditMode, vessel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const handleEmployeeChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      assignedEmployees: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const vesselData = {
        ...formData,
        capacity: Number(formData.capacity),
        deliveryDate: formData.deliveryDate?.toISOString(),
        registrationDate: formData.registrationDate?.toISOString()
      };

      // If not in edit mode, generate a vessel ID
      if (!isEditMode) {
        vesselData.vesselId = `VSL-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      }

      console.log('Submitting vessel data:', vesselData);
      
      if (isEditMode) {
        await updateVessel(vessel._id, vesselData);
      } else {
        await createVessel(vesselData);
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving vessel:', err);
      setError(err.response?.data?.message || 'Error saving vessel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditMode ? 'Edit Vessel' : 'Add Vessel'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vessel Name"
                name="vesselName"
                value={formData.vesselName}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="IMO Number"
                name="imo"
                value={formData.imo}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Delivery Date"
                  value={formData.deliveryDate}
                  onChange={(date) => handleDateChange('deliveryDate', date)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth required />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Registration Date"
                  value={formData.registrationDate}
                  onChange={(date) => handleDateChange('registrationDate', date)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth required />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                {VESSEL_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Flag"
                name="flag"
                value={formData.flag}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
                <MenuItem value="Retired">Retired</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Assign Employees
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="assigned-employees-label">Assigned Employees</InputLabel>
                <Select
                  labelId="assigned-employees-label"
                  id="assigned-employees"
                  multiple
                  value={formData.assignedEmployees}
                  onChange={handleEmployeeChange}
                  input={<OutlinedInput label="Assigned Employees" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((employeeId) => {
                        const employee = employees.find(emp => emp._id === employeeId);
                        return (
                          <Chip 
                            key={employeeId} 
                            label={employee ? `${employee.firstName} ${employee.lastName}` : employeeId} 
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {employees.map((employee) => (
                    <MenuItem key={employee._id} value={employee._id}>
                      {`${employee.firstName} ${employee.lastName} - ${employee.position}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {error && (
            <Box sx={{ mt: 2, color: 'error.main' }}>
              {error}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VesselModal; 