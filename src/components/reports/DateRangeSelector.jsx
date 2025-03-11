import { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography,
  Menu,
  MenuItem,
  Popover
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { KeyboardArrowDown, FileDownload, FileUpload } from '@mui/icons-material';
import './DateRangeSelector.css';

const DateRangeSelector = ({ onDateRangeChange, onExport, onImport }) => {
  const [startDate, setStartDate] = useState(subDays(new Date(), 14));
  const [endDate, setEndDate] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState(null);
  const [displayText, setDisplayText] = useState(`${format(subDays(new Date(), 14), 'dd MMM yy')} - ${format(new Date(), 'dd MMM yy')}`);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateRangeSelect = (range) => {
    let newStartDate, newEndDate;
    
    switch (range) {
      case 'today':
        newStartDate = new Date();
        newEndDate = new Date();
        break;
      case 'yesterday':
        newStartDate = subDays(new Date(), 1);
        newEndDate = subDays(new Date(), 1);
        break;
      case 'last7days':
        newStartDate = subDays(new Date(), 6);
        newEndDate = new Date();
        break;
      case 'last14days':
        newStartDate = subDays(new Date(), 13);
        newEndDate = new Date();
        break;
      case 'last30days':
        newStartDate = subDays(new Date(), 29);
        newEndDate = new Date();
        break;
      case 'thisMonth': {
        newStartDate = startOfMonth(new Date());
        newEndDate = endOfMonth(new Date());
        break;
      }
      case 'lastMonth': {
        const lastMonth = subDays(startOfMonth(new Date()), 1);
        newStartDate = startOfMonth(lastMonth);
        newEndDate = endOfMonth(lastMonth);
        break;
      }
      case 'thisWeek':
        newStartDate = startOfWeek(new Date(), { weekStartsOn: 1 });
        newEndDate = endOfWeek(new Date(), { weekStartsOn: 1 });
        break;
      default:
        return;
    }
    
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    
    const formattedRange = `${format(newStartDate, 'dd MMM yy')} - ${format(newEndDate, 'dd MMM yy')}`;
    setDisplayText(formattedRange);
    onDateRangeChange(formattedRange, newStartDate, newEndDate);
    
    handleClose();
  };

  const handleCustomDateChange = (date, isStart) => {
    if (isStart) {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    
    const formattedRange = `${format(isStart ? date : startDate, 'dd MMM yy')} - ${format(isStart ? endDate : date, 'dd MMM yy')}`;
    setDisplayText(formattedRange);
    onDateRangeChange(formattedRange, isStart ? date : startDate, isStart ? endDate : date);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'date-range-menu' : undefined;

  return (
    <Box className="reports-date-range-selector">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          aria-describedby={id}
          variant="outlined"
          onClick={handleClick}
          endIcon={<KeyboardArrowDown />}
          sx={{ 
            color: '#333',
            borderColor: '#ccc',
            '&:hover': {
              borderColor: '#999'
            }
          }}
        >
          {displayText}
        </Button>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<FileDownload />}
            onClick={onExport}
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
            startIcon={<FileUpload />}
            onClick={onImport}
            sx={{ 
              bgcolor: '#4361ee',
              '&:hover': {
                bgcolor: '#3a56d4'
              }
            }}
          >
            Import
          </Button>
        </Box>
      </Box>
      
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'date-range-button',
        }}
      >
        <MenuItem onClick={() => handleDateRangeSelect('today')}>Today</MenuItem>
        <MenuItem onClick={() => handleDateRangeSelect('yesterday')}>Yesterday</MenuItem>
        <MenuItem onClick={() => handleDateRangeSelect('last7days')}>Last 7 days</MenuItem>
        <MenuItem onClick={() => handleDateRangeSelect('last14days')}>Last 14 days</MenuItem>
        <MenuItem onClick={() => handleDateRangeSelect('last30days')}>Last 30 days</MenuItem>
        <MenuItem onClick={() => handleDateRangeSelect('thisMonth')}>This month</MenuItem>
        <MenuItem onClick={() => handleDateRangeSelect('lastMonth')}>Last month</MenuItem>
        <MenuItem onClick={() => handleDateRangeSelect('thisWeek')}>This week</MenuItem>
        <MenuItem>
          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Custom Range</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(date) => handleCustomDateChange(date, true)}
                  renderInput={(params) => <div {...params} />}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(date) => handleCustomDateChange(date, false)}
                  renderInput={(params) => <div {...params} />}
                />
              </LocalizationProvider>
            </Box>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DateRangeSelector; 