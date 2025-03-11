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
  IconButton
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import './AttendanceTable.css';

const AttendanceTable = ({ attendanceData, dateRange, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredData = attendanceData.filter(record => 
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box className="attendance-table-container">
      <Box className="attendance-table-header" sx={{ mb: 3 }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
          Manage Attendance
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {dateRange}
            </Typography>
          </Box>
          
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
        </Box>
      </Box>
      
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #eee' }}>
        <Table sx={{ minWidth: 650 }} aria-label="attendance table">
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell align="center">Day</TableCell>
              <TableCell align="center">Night</TableCell>
              <TableCell align="center">OT Day</TableCell>
              <TableCell align="center">OT Night</TableCell>
              <TableCell align="center">NP</TableCell>
              <TableCell align="center">Action</TableCell>
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
                  <TableCell>{record.employeeName}</TableCell>
                  <TableCell>{record.position}</TableCell>
                  <TableCell align="center">
                    <Checkbox 
                      checked={record.day} 
                      disabled 
                      sx={{ 
                        color: '#4361ee',
                        '&.Mui-checked': {
                          color: '#4361ee',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox 
                      checked={record.night} 
                      disabled 
                      sx={{ 
                        color: '#4361ee',
                        '&.Mui-checked': {
                          color: '#4361ee',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox 
                      checked={record.otDay} 
                      disabled 
                      sx={{ 
                        color: '#4361ee',
                        '&.Mui-checked': {
                          color: '#4361ee',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox 
                      checked={record.otNight} 
                      disabled 
                      sx={{ 
                        color: '#4361ee',
                        '&.Mui-checked': {
                          color: '#4361ee',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox 
                      checked={record.np} 
                      disabled 
                      sx={{ 
                        color: '#4361ee',
                        '&.Mui-checked': {
                          color: '#4361ee',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      aria-label="edit" 
                      size="small" 
                      onClick={() => onEdit(record)}
                      sx={{ color: '#4361ee' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No attendance records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendanceTable; 