import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Alert,
  Snackbar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import Layout from '../../components/layout/Layout';
import VesselModal from '../../components/vessels/VesselModal';
import Loading from '../../components/layout/Loading';
import { getVessels, deleteVessel } from '../../utils/vesselService';
import { getEmployees } from '../../utils/employeeService';
import './VesselListPage.css';

const VesselListPage = () => {
  const [vessels, setVessels] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vesselToDelete, setVesselToDelete] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchVessels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVessels();
      console.log('Fetched vessels:', data);
      setVessels(data);
    } catch (err) {
      console.error('Error fetching vessels:', err);
      setError('Failed to fetch vessels');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  useEffect(() => {
    fetchVessels();
    fetchEmployees();
  }, []);

  const handleEdit = (vessel) => {
    setSelectedVessel(vessel);
    setModalOpen(true);
  };

  const handleDelete = (vessel) => {
    setVesselToDelete(vessel);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!vesselToDelete) return;
    
    try {
      await deleteVessel(vesselToDelete._id);
      setNotification({
        open: true,
        message: 'Vessel deleted successfully',
        severity: 'success'
      });
      fetchVessels();
    } catch (err) {
      console.error('Error deleting vessel:', err);
      setNotification({
        open: true,
        message: 'Error deleting vessel',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setVesselToDelete(null);
    }
  };

  const handleModalSuccess = () => {
    fetchVessels();
    setNotification({
      open: true,
      message: selectedVessel ? 'Vessel updated successfully' : 'Vessel created successfully',
      severity: 'success'
    });
    setSelectedVessel(null);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const getEmployeeNames = (employeeIds) => {
    if (!employeeIds || employeeIds.length === 0) return 'No employees assigned';
    
    return employeeIds.map(id => {
      const employee = employees.find(emp => emp._id === id);
      return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
    }).join(', ');
  };

  const filteredVessels = vessels.filter(vessel =>
    vessel.vesselName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vessel.vesselId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vessel.imo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Vessels">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Manage Vessels
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedVessel(null);
              setModalOpen(true);
            }}
          >
            Add Vessel
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search vessels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Loading message="Loading vessels..." />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vessel ID</TableCell>
                  <TableCell>Vessel Name</TableCell>
                  <TableCell>IMO</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Flag</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assigned Employees</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVessels.map((vessel) => (
                  <TableRow key={vessel._id}>
                    <TableCell>{vessel.vesselId}</TableCell>
                    <TableCell>{vessel.vesselName}</TableCell>
                    <TableCell>{vessel.imo}</TableCell>
                    <TableCell>{vessel.type}</TableCell>
                    <TableCell>{vessel.capacity}</TableCell>
                    <TableCell>{vessel.flag}</TableCell>
                    <TableCell>
                      <Chip 
                        label={vessel.status} 
                        color={
                          vessel.status === 'Active' ? 'success' : 
                          vessel.status === 'Maintenance' ? 'warning' : 
                          'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={getEmployeeNames(vessel.assignedEmployees)}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PeopleIcon fontSize="small" sx={{ mr: 1 }} />
                          {vessel.assignedEmployees?.length || 0}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(vessel)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(vessel)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredVessels.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No vessels found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <VesselModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedVessel(null);
          }}
          onSuccess={handleModalSuccess}
          vessel={selectedVessel}
        />

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the vessel "{vesselToDelete?.vesselName}"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default VesselListPage; 