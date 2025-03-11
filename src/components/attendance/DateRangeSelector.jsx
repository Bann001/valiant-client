import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import './DateRangeSelector.css';

const DateRangeSelector = ({ onDateRangeChange, onVesselChange }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [vessel, setVessel] = useState('');
  
  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date && endDate) {
      const formattedRange = `${format(date, 'dd MMM yy')} - ${format(endDate, 'dd MMM yy')}`;
      onDateRangeChange(formattedRange, date, endDate);
    }
  };
  
  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate && date) {
      const formattedRange = `${format(startDate, 'dd MMM yy')} - ${format(date, 'dd MMM yy')}`;
      onDateRangeChange(formattedRange, startDate, date);
    }
  };
  
  const handleVesselChange = (event) => {
    setVessel(event.target.value);
    onVesselChange(event.target.value);
  };
  
  const handleExport = () => {
    // Handle export functionality
    console.log('Exporting attendance data...');
  };
  
  const handleSave = () => {
    // Handle save functionality
    console.log('Saving attendance data...');
  };
  
  return (
    <Box className="date-range-selector">
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={handleStartDateChange}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
          
          <Typography variant="body1" sx={{ mx: 1 }}>-</Typography>
          
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={handleEndDateChange}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
        </LocalizationProvider>
        
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="vessel-select-label">Vessel Name</InputLabel>
          <Select
            labelId="vessel-select-label"
            id="vessel-select"
            value={vessel}
            label="Vessel Name"
            onChange={handleVesselChange}
          >
            <MenuItem value="">
              <em>All Vessels</em>
            </MenuItem>
            <MenuItem value="vessel1">Vessel 1</MenuItem>
            <MenuItem value="vessel2">Vessel 2</MenuItem>
            <MenuItem value="vessel3">Vessel 3</MenuItem>
          </Select>
        </FormControl>
        
        <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
          <Button 
            variant="outlined" 
            onClick={handleExport}
            sx={{ 
              color: '#4361ee', 
              borderColor: '#4361ee',
              '&:hover': {
                borderColor: '#3a56d4'
              }
            }}
          >
            Export
          </Button>
          
          <Button 
            variant="contained" 
            onClick={handleSave}
            sx={{ 
              bgcolor: '#4361ee',
              '&:hover': {
                bgcolor: '#3a56d4'
              }
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DateRangeSelector; 