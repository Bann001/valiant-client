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
  MenuItem,
  Chip
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import './AttendanceTable.css';

const AttendanceTable = ({ attendanceData, dateRange, onEdit, vessels = [], selectedVessel, onVesselChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('all');
  const attendanceStatuses = ['all', 'Present', 'On Leave', 'Terminated'];

  // Filter data based on search term and attendance status
  const filteredData = attendanceData.filter(record => {
    const matchesSearch = record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        record.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = attendanceStatus === 'all' ||
                         (attendanceStatus === 'Present' && record.status === 'Active') ||
                         (attendanceStatus === 'On Leave' && record.status === 'On Leave') ||
                         (attendanceStatus === 'Terminated' && record.status === 'Terminated');

    return matchesSearch && matchesStatus;
  });

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
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
          <InputLabel>Attendance Status</InputLabel>
          <Select
            value={attendanceStatus}
            label="Attendance Status"
            onChange={(e) => setAttendanceStatus(e.target.value)}
          >
            {attendanceStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
            Date: {dateRange}
          </Typography>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #eee' }}>
        <Table sx={{ minWidth: 800 }} aria-label="attendance table">
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Vessel</TableCell>
              <TableCell>Status</TableCell>
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
                <TableCell colSpan={11} align="center">
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
                  <TableCell>
                    <Chip 
                      label={record.status}
                      color={record.status === 'Active' ? 'success' : 
                             record.status === 'On Leave' ? 'warning' : 'error'}
                      size="small"
                    />
                  </TableCell>
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