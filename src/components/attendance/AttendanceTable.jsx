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
  Checkbox,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import './AttendanceTable.css';

const AttendanceTable = ({ attendanceData, dateRange, onEdit, vessels = [], selectedVessel, onVesselChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredData = attendanceData.filter(record => 
    record.employeeId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search by Employee ID..."
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
        
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Select Vessel</InputLabel>
          <Select
            value={selectedVessel}
            label="Select Vessel"
            onChange={(e) => onVesselChange(e.target.value)}
          >
            <MenuItem value="all">All Vessels</MenuItem>
            {vessels.map((vessel) => (
              <MenuItem key={vessel} value={vessel}>
                {vessel}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {dateRange && (
          <Typography variant="body2" color="textSecondary">
            Date Range: {dateRange}
          </Typography>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #eee' }}>
        <Table sx={{ minWidth: 650 }} aria-label="attendance table">
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Vessel</TableCell>
              <TableCell align="center">Day</TableCell>
              <TableCell align="center">Night</TableCell>
              <TableCell align="center">OT Day</TableCell>
              <TableCell align="center">OT Night</TableCell>
              <TableCell align="center">NP</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No attendance records found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((record) => (
                <TableRow key={record.employeeId}>
                  <TableCell>{record.employeeId}</TableCell>
                  <TableCell>{record.employeeName}</TableCell>
                  <TableCell>{record.position}</TableCell>
                  <TableCell>{record.vessel}</TableCell>
                  <TableCell align="center">
                    <Checkbox checked={record.day} disabled />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox checked={record.night} disabled />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox checked={record.otDay} disabled />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox checked={record.otNight} disabled />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox checked={record.np} disabled />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => onEdit(record)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendanceTable; 