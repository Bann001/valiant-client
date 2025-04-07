import { useState } from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TextField,
  InputAdornment,
  Button,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import './PayrollTable.css';

const PayrollTable = ({ payrollData, vessels, onGenerateVoucher, onVesselChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVessel, setSelectedVessel] = useState('');
  
  const handleVesselChange = (event) => {
    const vessel = event.target.value;
    setSelectedVessel(vessel);
    onVesselChange(vessel);
  };
  
  const filteredData = payrollData.filter(record => 
    (record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.position.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedVessel === '' || record.vessel === selectedVessel)
  );

  return (
    <Box className="payroll-table-container">
      <Box className="payroll-table-header">
        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Manage Payroll
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="vessel-select-label">Vessel</InputLabel>
            <Select
              labelId="vessel-select-label"
              id="vessel-select"
              value={selectedVessel}
              label="Vessel"
              onChange={handleVesselChange}
              sx={{ 
                bgcolor: '#4361ee',
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4361ee',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3a56d4',
                },
                '.MuiSvgIcon-root': {
                  color: 'white',
                }
              }}
            >
              <MenuItem value="">All Vessels</MenuItem>
              {vessels.map((vessel) => (
                <MenuItem key={vessel.id} value={vessel.id}>
                  {vessel.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<ReceiptIcon />}
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
              color="primary"
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
      </Box>
      
      <Box className="payroll-table-filters" sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search here"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
          
          <Button 
            variant="outlined" 
            startIcon={<FilterIcon />}
            sx={{ 
              color: '#4361ee', 
              borderColor: '#4361ee',
              '&:hover': {
                borderColor: '#3a56d4'
              }
            }}
          >
            Filter
          </Button>
        </Box>
        
        <Button 
          variant="contained" 
          startIcon={<ReceiptIcon />}
          onClick={onGenerateVoucher}
          sx={{ 
            bgcolor: '#4361ee',
            '&:hover': {
              bgcolor: '#3a56d4'
            }
          }}
        >
          Generate Voucher
        </Button>
      </Box>
      
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #eee' }}>
        <Table sx={{ minWidth: 650 }} aria-label="payroll table">
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>FR</TableCell>
              <TableCell>Regular 100%</TableCell>
              <TableCell>OT 120%</TableCell>
              <TableCell>NP 10%</TableCell>
              <TableCell>SUN 130%</TableCell>
              <TableCell>SUN OT 130%</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((record) => (
                <TableRow
                  key={record.employeeId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {record.employeeId}
                  </TableCell>
                  <TableCell>{record.employee_id}</TableCell>
                  <TableCell>{record.employeeName}</TableCell>
                  <TableCell>{record.position}</TableCell>
                  <TableCell>{`₱ ${record.rate.toFixed(2)}`}</TableCell>
                  <TableCell>{record.fr}</TableCell>
                  <TableCell>{record.regular}</TableCell>
                  <TableCell>{record.ot}</TableCell>
                  <TableCell>{record.np}</TableCell>
                  <TableCell>{record.sun}</TableCell>
                  <TableCell>{record.sunOt}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No payroll records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PayrollTable; 