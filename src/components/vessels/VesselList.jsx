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
  IconButton
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './VesselList.css';

const VesselList = ({ vessels, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const filteredVessels = vessels.filter(vessel => 
    vessel.vesselName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vessel.vesselId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVessel = () => {
    navigate('/vessels/add');
  };

  return (
    <Box className="vessel-list-container">
      <Box className="vessel-list-header">
        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Manage Vessels
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleAddVessel}
              sx={{ 
                bgcolor: '#4361ee',
                '&:hover': {
                  bgcolor: '#3a56d4'
                }
              }}
            >
              + Add Vessel
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
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
              + Add
            </Button>
          </Box>
        </Box>
      </Box>
      
      <Box className="vessel-list-filters" sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" component="h3">
          Manage Vessels
        </Typography>
        
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
      
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #eee' }}>
        <Table sx={{ minWidth: 650 }} aria-label="vessel table">
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell>Vessel ID</TableCell>
              <TableCell>Vessel Name</TableCell>
              <TableCell>IMO</TableCell>
              <TableCell>Delivery Date</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVessels.length > 0 ? (
              filteredVessels.map((vessel) => (
                <TableRow
                  key={vessel.vesselId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {vessel.vesselId}
                  </TableCell>
                  <TableCell>{vessel.vesselName}</TableCell>
                  <TableCell>{vessel.imo}</TableCell>
                  <TableCell>{vessel.deliveryDate}</TableCell>
                  <TableCell>{vessel.registrationDate}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <IconButton 
                        aria-label="edit" 
                        size="small" 
                        onClick={() => onEdit(vessel)}
                        sx={{ color: '#4361ee' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        aria-label="delete" 
                        size="small" 
                        onClick={() => onDelete(vessel.vesselId)}
                        sx={{ color: '#e71d36' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No vessels found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default VesselList; 